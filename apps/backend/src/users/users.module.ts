import { Module } from "@nestjs/common";
import { AuthAppModule } from "../auth/auth-app.module.js";
import { UsersController } from "./users.controller.js";

@Module({
  imports: [AuthAppModule],
  controllers: [UsersController],
})
export class UsersModule {}
