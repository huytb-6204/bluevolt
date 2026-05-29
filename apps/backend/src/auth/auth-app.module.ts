import { Module } from "@nestjs/common";
import { AuthModule, RedisModule } from "@repo/services";
import { PrismaModule } from "../prisma/prisma.module.js";
import { SmsModule } from "../sms/sms.module.js";
import { AuthAppService } from "./auth-app.service.js";
import { AuthController } from "./auth.controller.js";

@Module({
  imports: [AuthModule, PrismaModule, RedisModule, SmsModule],
  controllers: [AuthController],
  providers: [AuthAppService],
  exports: [AuthAppService],
})
export class AuthAppModule {}
