import { apiClient } from "@/lib/api-client";
import type { Vehicle } from "@/lib/vehicles-api";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  days: number;
  totalPrice: number;
  status: BookingStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  vehicle: Vehicle;
}

export interface CreateBookingInput {
  vehicleId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  note?: string;
}

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  ACTIVE: "Đang sử dụng",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã huỷ",
};

export const BOOKING_STATUS_COLOR: Record<BookingStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export async function createBooking(
  input: CreateBookingInput,
): Promise<Booking> {
  const { data } = await apiClient.post<Booking>("/bookings", input);
  return data;
}

export async function listMyBookings(): Promise<Booking[]> {
  const { data } = await apiClient.get<Booking[]>("/bookings/me");
  return data;
}

export async function cancelBooking(id: string): Promise<Booking> {
  const { data } = await apiClient.patch<Booking>(`/bookings/${id}/cancel`);
  return data;
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}
