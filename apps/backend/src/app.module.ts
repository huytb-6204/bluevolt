import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule, RedisModule } from "@repo/services";
import { AppConfigModule } from "./config/app-config.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { AuthAppModule } from "./auth/auth-app.module.js";

import { TRPCModule, TRPCPanelController } from "@repo/trpc";
import { PostHogModule } from "@repo/analytics";
import { WebsocketsModule } from "@repo/websockets/server";
import { HealthModule } from "./health/health.module.js";
import { UsersModule } from "./users/users.module.js";
import { VehiclesModule } from "./vehicles/vehicles.module.js";
import { BookingsModule } from "./bookings/bookings.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TRPCModule,
    PrismaModule,
    RedisModule,
    PostHogModule,
    AppConfigModule,
    AuthModule,
    AuthAppModule,
    WebsocketsModule,
    HealthModule,
    UsersModule,
    VehiclesModule,
    BookingsModule,
  ],
  controllers: [TRPCPanelController],
  providers: [],
})
export class AppModule {}
