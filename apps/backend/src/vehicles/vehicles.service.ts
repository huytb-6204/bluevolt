import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

export type VehicleType = "SCOOTER" | "MOTORBIKE" | "PREMIUM";
export type VehicleStatus = "AVAILABLE" | "MAINTENANCE" | "HIDDEN";

export interface CreateVehicleInput {
  name: string;
  type?: VehicleType;
  description?: string;
  pricePerDay: number;
  rangeKm: number;
  maxSpeed: number;
  imageUrl?: string;
  status?: VehicleStatus;
}

export type UpdateVehicleInput = Partial<CreateVehicleInput>;

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public listing — hides HIDDEN vehicles, optional type filter. */
  async list(type?: VehicleType) {
    return this.prisma.vehicle.findMany({
      where: {
        status: { not: "HIDDEN" },
        ...(type ? { type } : {}),
      },
      orderBy: { pricePerDay: "asc" },
    });
  }

  /** Admin listing — includes everything. */
  async listAll() {
    return this.prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException("Vehicle not found");
    }
    return vehicle;
  }

  async create(input: CreateVehicleInput) {
    return this.prisma.vehicle.create({ data: input });
  }

  async update(id: string, input: UpdateVehicleInput) {
    await this.findOne(id);
    return this.prisma.vehicle.update({ where: { id }, data: input });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.vehicle.delete({ where: { id } });
    return { success: true as const };
  }
}
