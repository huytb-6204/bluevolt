import { Module } from "@nestjs/common";
import { AuthModule, RedisModule } from "@repo/services";
import { PrismaModule } from "../prisma/prisma.module.js";
import { AuthAppService } from "./auth-app.service.js";
import { AuthController } from "./auth.controller.js";

@Module({
  imports: [AuthModule, PrismaModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthAppService],
  exports: [AuthAppService],
})
export class AuthAppModule {}
