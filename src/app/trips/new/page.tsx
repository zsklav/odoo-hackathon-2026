"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Vehicle } from "@/types/vehicle";
import type { Driver } from "@/types/driver";

export default function NewTripPage() {
  const router = useRouter();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [cargoWeight, setCargoWeight] = useState("");
  const [plannedDistance, setPlannedDistance] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const [vRes, dRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/drivers"),
      ]);
      if (cancelled) return;
      const v: Vehicle[] = vRes.ok ? await vRes.json() : [];
      const d: Driver[] = dRes.ok ? await dRes.json() : [];
      if (cancelled) return;
      setVehicles(v);
      setDrivers(d);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedVehicle = vehicles.find((v) => v.id === vehicleId);

  function validate(): string | null {
    if (!source.trim()) return "Source is required.";
    if (!destination.trim()) return "Destination is required.";
    if (!vehicleId) return "Please select a vehicle.";
    if (!driverId) return "Please select a driver.";
    const cargo = Number(cargoWeight);
    if (!cargoWeight || !Number.isFinite(cargo) || cargo <= 0) {
      return "Cargo weight must be a positive number.";
    }
    const distance = Number(plannedDistance);
    if (!plannedDistance || !Number.isFinite(distance) || distance <= 0) {
      return "Planned distance must be a positive number.";
    }
    if (selectedVehicle && cargo > selectedVehicle.maxLoadCapacity) {
      return `Cargo weight (${cargo}) exceeds the vehicle's capacity (${selectedVehicle.maxLoadCapacity}).`;
    }
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    const response = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source,
        destination,
        vehicleId,
        driverId,
        cargoWeight: Number(cargoWeight),
        plannedDistance: Number(plannedDistance),
      }),
    });
    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push(`/trips/${result.id}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/trips"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Trip Management
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">New Trip</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Mumbai"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Pune"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <Select value={vehicleId} onValueChange={(value) => value && setVehicleId(value)}>
                  <SelectTrigger id="vehicle" className="w-full" disabled={isSubmitting}>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.registrationNumber} · {v.name} ({v.maxLoadCapacity.toLocaleString()} kg)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver">Driver</Label>
                <Select value={driverId} onValueChange={(value) => value && setDriverId(value)}>
                  <SelectTrigger id="driver" className="w-full" disabled={isSubmitting}>
                    <SelectValue placeholder="Select a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} · {d.licenseNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargoWeight">Cargo Weight (kg)</Label>
                <Input
                  id="cargoWeight"
                  type="number"
                  min="0"
                  step="any"
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="5000"
                />
                {selectedVehicle && (
                  <p className="text-xs text-muted-foreground">
                    Vehicle capacity: {selectedVehicle.maxLoadCapacity.toLocaleString()} kg
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="plannedDistance">Planned Distance (km)</Label>
                <Input
                  id="plannedDistance"
                  type="number"
                  min="0"
                  step="any"
                  value={plannedDistance}
                  onChange={(e) => setPlannedDistance(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="150"
                />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  Creating trip…
                  <Loader2 className="size-4 animate-spin" />
                </>
              ) : (
                "Create Trip (Draft)"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
