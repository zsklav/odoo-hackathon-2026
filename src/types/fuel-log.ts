import type { VehicleStatus } from "./vehicle";

export interface FuelLogVehicle {
  id: string;
  registrationNumber: string;
  name: string;
  region: string;
  status: VehicleStatus;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  liters: number;
  cost: number;
  date: string;
  vehicle?: FuelLogVehicle;
}

export interface FuelLogInput {
  vehicleId: string;
  liters: number;
  cost: number;
  date?: string;
}