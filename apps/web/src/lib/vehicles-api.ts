import { apiClient } from "@/lib/api-client";

export type VehicleType = "SCOOTER" | "MOTORBIKE" | "PREMIUM";
export type VehicleStatus = "AVAILABLE" | "MAINTENANCE" | "HIDDEN";

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  description: string | null;
  pricePerDay: number;
  rangeKm: number;
  maxSpeed: number;
  imageUrl: string | null;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
}

export const VEHICLE_TYPE_LABEL: Record<VehicleType, string> = {
  SCOOTER: "Xe ga điện",
  MOTORBIKE: "Xe máy điện",
  PREMIUM: "Cao cấp",
};

export async function listVehicles(type?: VehicleType): Promise<Vehicle[]> {
  const { data } = await apiClient.get<Vehicle[]>("/vehicles", {
    params: type ? { type } : undefined,
  });
  return data;
}

export async function getVehicle(id: string): Promise<Vehicle> {
  const { data } = await apiClient.get<Vehicle>(`/vehicles/${id}`);
  return data;
}

// ---- Admin ----

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

export async function listAllVehiclesAdmin(): Promise<Vehicle[]> {
  const { data } = await apiClient.get<Vehicle[]>("/vehicles/admin/all");
  return data;
}

export async function createVehicle(input: CreateVehicleInput): Promise<Vehicle> {
  const { data } = await apiClient.post<Vehicle>("/vehicles", input);
  return data;
}

export async function updateVehicle(
  id: string,
  input: UpdateVehicleInput,
): Promise<Vehicle> {
  const { data } = await apiClient.patch<Vehicle>(`/vehicles/${id}`, input);
  return data;
}

export async function deleteVehicle(id: string): Promise<void> {
  await apiClient.delete(`/vehicles/${id}`);
}
