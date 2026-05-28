import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";
import { Request } from "express";
import {
  JwtAuthGuard,
  RolesGuard,
  Roles,
  type AccessTokenPayload,
} from "@repo/services";
import {
  BookingsService,
  type BookingStatus,
} from "./bookings.service.js";

const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
] as const;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

class CreateBookingDto {
  @IsString()
  vehicleId!: string;

  @IsString()
  @Matches(DATE_RE, { message: "startDate must be YYYY-MM-DD" })
  startDate!: string;

  @IsString()
  @Matches(DATE_RE, { message: "endDate must be YYYY-MM-DD" })
  endDate!: string;

  @IsOptional()
  @IsString()
  note?: string;
}

class UpdateStatusDto {
  @IsEnum(BOOKING_STATUSES)
  status!: BookingStatus;
}

@Controller("bookings")
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: Request & { user: AccessTokenPayload },
    @Body() dto: CreateBookingDto,
  ) {
    return this.service.create(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  listMine(@Req() req: Request & { user: AccessTokenPayload }) {
    return this.service.listMine(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(
    @Req() req: Request & { user: AccessTokenPayload },
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.service.findOneForUser(req.user.sub, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/cancel")
  cancel(
    @Req() req: Request & { user: AccessTokenPayload },
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.service.cancel(req.user.sub, id);
  }

  // ---- Admin ----
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPERADMIN")
  @Get()
  listAll() {
    return this.service.listAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPERADMIN")
  @Patch(":id/status")
  setStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.service.setStatus(id, dto.status);
  }
}
