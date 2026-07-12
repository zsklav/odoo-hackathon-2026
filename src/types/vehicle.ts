export type VehicleStatus = "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";

export const VEHICLE_STATUSES: VehicleStatus[] = [
  "AVAILABLE",
  "ON_TRIP",
  "IN_SHOP",
  "RETIRED",
];

export interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
  region: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleInput {
  registrationNumber: string;
  name: string;
  type: string;
  maxLoadCapacity: number;
  odometer?: number;
  acquisitionCost: number;
  status?: VehicleStatus;
  region: string;
}
