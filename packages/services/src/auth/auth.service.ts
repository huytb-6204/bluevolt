import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  username: string;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenVersion?: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  signAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: this.config.get<string>(
        "JWT_ACCESS_EXPIRES_IN",
        "15m",
      ) as `${number}${"s" | "m" | "h" | "d"}`,
    });
  }

  signRefreshToken(payload: RefreshTokenPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.refreshSecret,
      expiresIn: this.config.get<string>(
        "JWT_REFRESH_EXPIRES_IN",
        "7d",
      ) as `${number}${"s" | "m" | "h" | "d"}`,
    });
  }

  async verifyAccessToken(
    token: string,
  ): Promise<AccessTokenPayload | null> {
    try {
      return await this.jwt.verifyAsync<AccessTokenPayload>(token);
    } catch {
      return null;
    }
  }

  async verifyRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload | null> {
    try {
      return await this.jwt.verifyAsync<RefreshTokenPayload>(token, {
        secret: this.refreshSecret,
      });
    } catch {
      return null;
    }
  }

  private get refreshSecret(): string {
    const secret = this.config.get<string>("JWT_REFRESH_SECRET");
    if (!secret) {
      throw new Error("JWT_REFRESH_SECRET is not configured");
    }
    return secret;
  }
}
