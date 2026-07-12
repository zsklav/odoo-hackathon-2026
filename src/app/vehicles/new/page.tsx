"use client";

import { useState, type FormEvent } from "react";
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
import { VEHICLE_STATUSES, type VehicleStatus } from "@/types/vehicle";

const STATUS_LABEL: Record<VehicleStatus, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  IN_SHOP: "In Shop",
  RETIRED: "Retired",
};

export default function NewVehiclePage() {
  const router = useRouter();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [maxLoadCapacity, setMaxLoadCapacity] = useState("");
  const [acquisitionCost, setAcquisitionCost] = useState("");
  const [odometer, setOdometer] = useState("");
  const [status, setStatus] = useState<VehicleStatus>("AVAILABLE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function validate(): string | null {
    if (!registrationNumber.trim()) return "Registration number is required.";
    if (!name.trim()) return "Name is required.";
    if (!type.trim()) return "Type is required.";
    if (!region.trim()) return "Region is required.";
    const maxLoad = Number(maxLoadCapacity);
    if (!maxLoadCapacity || !Number.isFinite(maxLoad) || maxLoad <= 0) {
      return "Max load capacity must be a positive number.";
    }
    const cost = Number(acquisitionCost);
    if (!acquisitionCost || !Number.isFinite(cost) || cost <= 0) {
      return "Acquisition cost must be a positive number.";
    }
    if (odometer && (!Number.isFinite(Number(odometer)) || Number(odometer) < 0)) {
      return "Odometer must be a non-negative number.";
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
    const response = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationNumber,
        name,
        type,
        region,
        maxLoadCapacity: Number(maxLoadCapacity),
        acquisitionCost: Number(acquisitionCost),
        odometer: odometer ? Number(odometer) : undefined,
        status,
      }),
    });
    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push(`/vehicles/${result.id}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard?role=FLEET_MANAGER&tab=vehicle-registry"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add Vehicle</CardTitle>
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
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="KA-01-AB-1234"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Truck-82"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Heavy Duty"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="North"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxLoadCapacity">Max Load Capacity (kg)</Label>
                <Input
                  id="maxLoadCapacity"
                  type="number"
                  min="0"
                  step="any"
                  value={maxLoadCapacity}
                  onChange={(e) => setMaxLoadCapacity(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="5000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="acquisitionCost">Acquisition Cost</Label>
                <Input
                  id="acquisitionCost"
                  type="number"
                  min="0"
                  step="any"
                  value={acquisitionCost}
                  onChange={(e) => setAcquisitionCost(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="45000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="odometer">Odometer (km)</Label>
                <Input
                  id="odometer"
                  type="number"
                  min="0"
                  step="any"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => value && setStatus(value as VehicleStatus)}
                >
                  <SelectTrigger id="status" className="w-full" disabled={isSubmitting}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  Creating vehicle…
                  <Loader2 className="size-4 animate-spin" />
                </>
              ) : (
                "Create Vehicle"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
