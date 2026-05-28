import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { JwtAuthGuard, RolesGuard, Roles } from "@repo/services";
import {
  VehiclesService,
  type VehicleType,
} from "./vehicles.service.js";

const VEHICLE_TYPES = ["SCOOTER", "MOTORBIKE", "PREMIUM"] as const;
const VEHICLE_STATUSES = ["AVAILABLE", "MAINTENANCE", "HIDDEN"] as const;

class CreateVehicleDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsEnum(VEHICLE_TYPES)
  type?: VehicleType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  pricePerDay!: number;

  @IsInt()
  @Min(0)
  rangeKm!: number;

  @IsInt()
  @Min(0)
  maxSpeed!: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(VEHICLE_STATUSES)
  status?: "AVAILABLE" | "MAINTENANCE" | "HIDDEN";
}

class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEnum(VEHICLE_TYPES)
  type?: VehicleType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  pricePerDay?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  rangeKm?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxSpeed?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(VEHICLE_STATUSES)
  status?: "AVAILABLE" | "MAINTENANCE" | "HIDDEN";
}

@Controller("vehicles")
export class VehiclesController {
  constructor(private readonly service: VehiclesService) {}

  // ---- Public ----
  @Get()
  list(@Query("type") type?: VehicleType) {
    return this.service.list(type);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  // ---- Admin ----
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPERADMIN")
  @Get("admin/all")
  listAll() {
    return this.service.listAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPERADMIN")
  @Post()
  create(@Body() dto: CreateVehicleDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPERADMIN")
  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPERADMIN")
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
