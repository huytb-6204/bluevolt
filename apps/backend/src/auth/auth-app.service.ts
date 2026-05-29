import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService, type Role, RedisService } from "@repo/services";
import { PrismaService } from "../prisma/prisma.service.js";
import { randomInt } from "crypto";

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

const OTP_TTL = 10 * 60; // 10 phút
const OTP_PREFIX = "pwd_reset_otp:";
const VERIFIED_PREFIX = "pwd_reset_verified:";

@Injectable()
export class AuthAppService {
  private readonly logger = new Logger(AuthAppService.name);

  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly redis: RedisService,
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

  /** Bước 1: Gửi OTP về email */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    // Luôn trả về success để tránh leak email tồn tại hay không
    if (!user) {
      return { message: "Nếu email tồn tại, mã OTP đã được gửi." };
    }

    const otp = String(randomInt(100000, 999999));
    await this.redis.set(`${OTP_PREFIX}${email}`, otp, OTP_TTL);

    // TODO: Thay bằng email provider thật (Resend, Nodemailer, SendGrid...)
    // await this.emailService.send({ to: email, subject: "Mã xác nhận", text: `Mã OTP: ${otp}` })
    this.logger.log(`[DEV] OTP cho ${email}: ${otp}`);

    return { message: "Nếu email tồn tại, mã OTP đã được gửi." };
  }

  /** Bước 2: Xác minh OTP */
  async verifyResetCode(
    email: string,
    otp: string,
  ): Promise<{ resetToken: string }> {
    const stored = await this.redis.get(`${OTP_PREFIX}${email}`);
    if (!stored || stored !== otp) {
      throw new BadRequestException("Mã OTP không hợp lệ hoặc đã hết hạn.");
    }

    // Xoá OTP đã dùng, tạo reset token (UUID) với TTL 15 phút
    await this.redis.del(`${OTP_PREFIX}${email}`);
    const resetToken = crypto.randomUUID();
    await this.redis.set(
      `${VERIFIED_PREFIX}${resetToken}`,
      email,
      15 * 60,
    );

    return { resetToken };
  }

  /** Bước 3: Đặt mật khẩu mới */
  async resetPassword(
    resetToken: string,
    newPassword: string,
  ): Promise<{ success: true }> {
    const email = await this.redis.get(`${VERIFIED_PREFIX}${resetToken}`);
    if (!email) {
      throw new BadRequestException("Token không hợp lệ hoặc đã hết hạn.");
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException("Người dùng không tồn tại.");

    const passwordHash = await this.auth.hashPassword(newPassword);
    await this.prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    await this.redis.del(`${VERIFIED_PREFIX}${resetToken}`);
    return { success: true };
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
