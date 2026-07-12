export type TripStatus = "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";

export const TRIP_STATUSES: TripStatus[] = [
  "DRAFT",
  "DISPATCHED",
  "COMPLETED",
  "CANCELLED",
];

/**
 * Allowed status transitions for a trip's lifecycle.
 * DRAFT can be dispatched or cancelled; a DISPATCHED trip can be completed or
 * cancelled; COMPLETED and CANCELLED are terminal.
 */
export const TRIP_TRANSITIONS: Record<TripStatus, TripStatus[]> = {
  DRAFT: ["DISPATCHED", "CANCELLED"],
  DISPATCHED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export interface TripVehicleSummary {
  id: string;
  registrationNumber: string;
  name: string;
  maxLoadCapacity: number;
  status: string;
}

export interface TripDriverSummary {
  id: string;
  name: string;
  licenseNumber: string;
  status: string;
}

export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
  plannedDistance: number;
  actualOdometer: number | null;
  fuelConsumed: number | null;
  status: TripStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  vehicle?: TripVehicleSummary;
  driver?: TripDriverSummary;
}

export interface TripInput {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
  plannedDistance: number;
}
