import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService, type Role } from "@repo/services";
import { PrismaService } from "../prisma/prisma.service.js";

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  username: true,
  firstName: true,
  lastName: true,
  imageUrl: true,
  role: true,
  createdAt: true,
} as const;

@Injectable()
export class AuthAppService {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async register(input: RegisterInput): Promise<AuthTokens> {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: input.email }, { username: input.username }] },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException("Email or username already in use");
    }

    const passwordHash = await this.auth.hashPassword(input.password);
    const role = this.resolveInitialRole(input.email);
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        passwordHash,
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
        role,
      },
    });

    return this.issueTokens(user.id, user.email, user.username, user.role);
  }

  async login(input: LoginInput): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const ok = await this.auth.verifyPassword(
      input.password,
      user.passwordHash,
    );
    if (!ok) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.issueTokens(user.id, user.email, user.username, user.role);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const payload = await this.auth.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedException("Invalid refresh token");
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException("User no longer exists");
    }
    return this.issueTokens(user.id, user.email, user.username, user.role);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: PUBLIC_USER_SELECT,
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return user;
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    // If username is changing, ensure it's not taken by someone else
    if (input.username) {
      const clash = await this.prisma.user.findFirst({
        where: { username: input.username, id: { not: userId } },
        select: { id: true },
      });
      if (clash) {
        throw new ConflictException("Username already in use");
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        username: input.username,
      },
      select: PUBLIC_USER_SELECT,
    });
    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: true }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const ok = await this.auth.verifyPassword(
      currentPassword,
      user.passwordHash,
    );
    if (!ok) {
      throw new BadRequestException("Current password is incorrect");
    }
    const passwordHash = await this.auth.hashPassword(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    return { success: true };
  }

  async setAvatar(userId: string, imageUrl: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { imageUrl },
      select: PUBLIC_USER_SELECT,
    });
    return user;
  }

  /** Admin: list all users (paginated). */
  async listUsers(skip = 0, take = 50) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        select: PUBLIC_USER_SELECT,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      this.prisma.user.count(),
    ]);
    return { users, total, skip, take };
  }

  /** Admin: change a user's role. */
  async setUserRole(userId: string, role: Role) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: PUBLIC_USER_SELECT,
    });
    return user;
  }

  private resolveInitialRole(email: string): Role {
    const raw = this.config.get<string>("SUPERADMIN_EMAILS") ?? "";
    const superadmins = raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    return superadmins.includes(email.toLowerCase()) ? "SUPERADMIN" : "USER";
  }

  private async issueTokens(
    userId: string,
    email: string,
    username: string,
    role: Role,
  ): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.auth.signAccessToken({ sub: userId, email, username, role }),
      this.auth.signRefreshToken({ sub: userId }),
    ]);
    return { accessToken, refreshToken };
  }
}
