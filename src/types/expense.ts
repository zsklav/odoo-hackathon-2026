import type { VehicleStatus } from "./vehicle";

export type ExpenseType = "TOLL" | "MAINTENANCE" | "OTHER";

export const EXPENSE_TYPES: ExpenseType[] = ["TOLL", "MAINTENANCE", "OTHER"];

export interface ExpenseVehicle {
  id: string;
  registrationNumber: string;
  name: string;
  region: string;
  status: VehicleStatus;
}

export interface Expense {
  id: string;
  vehicleId: string;
  type: ExpenseType;
  cost: number;
  date: string;
  vehicle?: ExpenseVehicle;
}

export interface ExpenseInput {
  vehicleId: string;
  type: ExpenseType;
  cost: number;
  date?: string;
}