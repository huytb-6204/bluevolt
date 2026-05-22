import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service.js";
import { JwtAuthGuard } from "./jwt-auth.guard.js";
import { JwtStrategy } from "./jwt.strategy.js";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>("JWT_ACCESS_SECRET");
        if (!secret) {
          throw new Error("JWT_ACCESS_SECRET is not configured");
        }
        return {
          secret,
          signOptions: {
            expiresIn: config.get<string>(
              "JWT_ACCESS_EXPIRES_IN",
              "15m",
            ) as `${number}${"s" | "m" | "h" | "d"}`,
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule, PassportModule],
})
export class AuthModule {}
