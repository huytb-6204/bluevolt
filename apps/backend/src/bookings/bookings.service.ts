import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export interface CreateBookingInput {
  vehicleId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  note?: string;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Parse a YYYY-MM-DD string into a UTC midnight Date. */
function parseDateOnly(value: string): Date {
  const d = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) {
    throw new BadRequestException(`Invalid date: ${value}`);
  }
  return d;
}

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateBookingInput) {
    const start = parseDateOnly(input.startDate);
    const end = parseDateOnly(input.endDate);

    if (end < start) {
      throw new BadRequestException("Ngày trả phải sau hoặc bằng ngày nhận");
    }

    const today = parseDateOnly(new Date().toISOString().slice(0, 10));
    if (start < today) {
      throw new BadRequestException("Không thể đặt xe cho ngày trong quá khứ");
    }

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: input.vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException("Vehicle not found");
    }
    if (vehicle.status !== "AVAILABLE") {
      throw new ConflictException("Xe hiện không khả dụng để đặt");
    }

    // Overlap check against active/confirmed bookings
    const overlap = await this.prisma.booking.findFirst({
      where: {
        vehicleId: input.vehicleId,
        status: { in: ["CONFIRMED", "ACTIVE"] },
        startDate: { lte: end },
        endDate: { gte: start },
      },
      select: { id: true },
    });
    if (overlap) {
      throw new ConflictException(
        "Xe đã được đặt trong khoảng thời gian này. Vui lòng chọn ngày khác.",
      );
    }

    const days = Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;
    const totalPrice = days * vehicle.pricePerDay;

    return this.prisma.booking.create({
      data: {
        userId,
        vehicleId: input.vehicleId,
        startDate: start,
        endDate: end,
        days,
        totalPrice,
        note: input.note ?? null,
        status: "CONFIRMED", // mock payment — confirmed immediately
      },
      include: { vehicle: true },
    });
  }

  async listMine(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOneForUser(userId: string, id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { vehicle: true },
    });
    if (!booking || booking.userId !== userId) {
      throw new NotFoundException("Booking not found");
    }
    return booking;
  }

  async cancel(userId: string, id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking || booking.userId !== userId) {
      throw new NotFoundException("Booking not found");
    }
    if (booking.status === "CANCELLED") {
      throw new BadRequestException("Đơn đã được huỷ trước đó");
    }
    if (booking.status === "COMPLETED" || booking.status === "ACTIVE") {
      throw new ForbiddenException(
        "Không thể huỷ đơn đang sử dụng hoặc đã hoàn thành",
      );
    }
    return this.prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: { vehicle: true },
    });
  }

  // ---- Admin ----
  async listAll() {
    return this.prisma.booking.findMany({
      include: {
        vehicle: true,
        user: { select: { id: true, email: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async setStatus(id: string, status: BookingStatus) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException("Booking not found");
    }
    return this.prisma.booking.update({
      where: { id },
      data: { status },
      include: { vehicle: true },
    });
  }
}
