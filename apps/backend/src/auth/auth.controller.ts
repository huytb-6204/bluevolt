import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { randomUUID } from "crypto";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard, type AccessTokenPayload } from "@repo/services";
import { Request } from "express";
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
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

class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;
}

class ChangePasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}

// Minimal shape of a multer file (avoids needing @types/multer)
interface UploadedFileLike {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
}

const AVATAR_DIR = join(process.cwd(), "uploads", "avatars");

@Controller("auth")
export class AuthController {
  constructor(
    private readonly service: AuthAppService,
    private readonly config: ConfigService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  updateProfile(
    @Req() req: Request & { user: AccessTokenPayload },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.service.updateProfile(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("change-password")
  changePassword(
    @Req() req: Request & { user: AccessTokenPayload },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.service.changePassword(
      req.user.sub,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post("avatar")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: AVATAR_DIR,
        filename: (_req, file: UploadedFileLike, cb) => {
          const ext = extname(file.originalname) || ".jpg";
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file: UploadedFileLike, cb) => {
        if (!file.mimetype.startsWith("image/")) {
          cb(new BadRequestException("Only image files are allowed"), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async uploadAvatar(
    @Req() req: Request & { user: AccessTokenPayload },
    @UploadedFile() file: UploadedFileLike,
  ) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }
    const base =
      this.config.get<string>("BACKEND_PUBLIC_URL") ?? "http://localhost:3001";
    const url = `${base}/uploads/avatars/${file.filename}`;
    return this.service.setAvatar(req.user.sub, url);
  }
}
