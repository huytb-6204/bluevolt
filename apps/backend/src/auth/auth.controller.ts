import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard, type AccessTokenPayload } from "@repo/services";
import { Request } from "express";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { AuthAppService } from "./auth-app.service.js";

class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  username!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

class RefreshDto {
  @IsString()
  refreshToken!: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly service: AuthAppService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Post("refresh")
  refresh(@Body() dto: RefreshDto) {
    return this.service.refresh(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() req: Request & { user: AccessTokenPayload }) {
    return this.service.me(req.user.sub);
  }
}
