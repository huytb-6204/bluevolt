import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "@repo/services";
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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthAppService {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
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
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        passwordHash,
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
      },
    });

    return this.issueTokens(user.id, user.email, user.username);
  }

  async login(input: LoginInput): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const ok = await this.auth.verifyPassword(input.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.issueTokens(user.id, user.email, user.username);
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
    return this.issueTokens(user.id, user.email, user.username);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        imageUrl: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return user;
  }

  private async issueTokens(
    userId: string,
    email: string,
    username: string,
  ): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.auth.signAccessToken({ sub: userId, email, username }),
      this.auth.signRefreshToken({ sub: userId }),
    ]);
    return { accessToken, refreshToken };
  }
}
