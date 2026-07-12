"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, Pencil, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { VEHICLE_STATUSES, type Vehicle, type VehicleStatus } from "@/types/vehicle";

const STATUS_BADGE_CLASS: Record<VehicleStatus, string> = {
  AVAILABLE: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  ON_TRIP: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  IN_SHOP: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  RETIRED: "bg-muted text-muted-foreground",
};

const STATUS_LABEL: Record<VehicleStatus, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  IN_SHOP: "In Shop",
  RETIRED: "Retired",
};

interface EditableFields {
  registrationNumber: string;
  name: string;
  type: string;
  region: string;
  maxLoadCapacity: string;
  acquisitionCost: string;
  odometer: string;
  status: VehicleStatus;
}

function toFields(vehicle: Vehicle): EditableFields {
  return {
    registrationNumber: vehicle.registrationNumber,
    name: vehicle.name,
    type: vehicle.type,
    region: vehicle.region,
    maxLoadCapacity: String(vehicle.maxLoadCapacity),
    acquisitionCost: String(vehicle.acquisitionCost),
    odometer: String(vehicle.odometer),
    status: vehicle.status,
  };
}

export default function VehicleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState<EditableFields | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      const response = await fetch(`/api/vehicles/${params.id}`);
      if (cancelled) return;
      if (response.status === 404) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }
      const data: Vehicle = await response.json();
      setVehicle(data);
      setFields(toFields(data));
      setIsLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  function validate(f: EditableFields): string | null {
    if (!f.registrationNumber.trim()) return "Registration number is required.";
    if (!f.name.trim()) return "Name is required.";
    if (!f.type.trim()) return "Type is required.";
    if (!f.region.trim()) return "Region is required.";
    const maxLoad = Number(f.maxLoadCapacity);
    if (!f.maxLoadCapacity || !Number.isFinite(maxLoad) || maxLoad <= 0) {
      return "Max load capacity must be a positive number.";
    }
    const cost = Number(f.acquisitionCost);
    if (!f.acquisitionCost || !Number.isFinite(cost) || cost <= 0) {
      return "Acquisition cost must be a positive number.";
    }
    if (!Number.isFinite(Number(f.odometer)) || Number(f.odometer) < 0) {
      return "Odometer must be a non-negative number.";
    }
    return null;
  }

  async function handleSave() {
    if (!fields) return;
    setErrorMessage(null);

    const validationError = validate(fields);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSaving(true);
    const response = await fetch(`/api/vehicles/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationNumber: fields.registrationNumber,
        name: fields.name,
        type: fields.type,
        region: fields.region,
        maxLoadCapacity: Number(fields.maxLoadCapacity),
        acquisitionCost: Number(fields.acquisitionCost),
        odometer: Number(fields.odometer),
        status: fields.status,
      }),
    });
    const result = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setVehicle(result);
    setFields(toFields(result));
    setIsEditing(false);
  }

  async function handleStatusChange(status: VehicleStatus) {
    setErrorMessage(null);
    const response = await fetch(`/api/vehicles/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (!response.ok) {
      setErrorMessage(result.error ?? "Could not update status.");
      return;
    }
    setVehicle(result);
    setFields(toFields(result));
  }

  async function handleDelete() {
    setDeleteError(null);
    setIsDeleting(true);
    const response = await fetch(`/api/vehicles/${params.id}`, { method: "DELETE" });
    setIsDeleting(false);

    if (!response.ok) {
      const result = await response.json();
      setDeleteError(result.error ?? "Could not delete vehicle.");
      return;
    }

    router.push("/vehicles");
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2 px-4 py-16 text-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !vehicle || !fields) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2 px-4 py-16 text-center">
        <p className="text-sm font-medium">Vehicle not found</p>
        <Link href="/vehicles" className="text-sm text-primary hover:underline">
          Back to Vehicle Registry
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/vehicles"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Vehicle Registry
      </Link>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl">{vehicle.name}</CardTitle>
            <Badge className={STATUS_BADGE_CLASS[vehicle.status]}>
              {STATUS_LABEL[vehicle.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Cancel edit"
                onClick={() => {
                  setFields(toFields(vehicle));
                  setErrorMessage(null);
                  setIsEditing(false);
                }}
              >
                <X className="size-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit vehicle"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="size-4" />
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="Delete vehicle" />
                }
              >
                <Trash2 className="size-4 text-destructive" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this vehicle?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove {vehicle.registrationNumber} from the
                    registry. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {deleteError && (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <p>{deleteError}</p>
                  </div>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={handleDelete}
                  >
                    {isDeleting ? "Deleting…" : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={vehicle.status}
              onValueChange={(value) => value && handleStatusChange(value as VehicleStatus)}
            >
              <SelectTrigger id="status" className="w-full sm:w-56">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              {isEditing ? (
                <Input
                  id="registrationNumber"
                  value={fields.registrationNumber}
                  onChange={(e) =>
                    setFields({ ...fields, registrationNumber: e.target.value })
                  }
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">{vehicle.registrationNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={fields.name}
                  onChange={(e) => setFields({ ...fields, name: e.target.value })}
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">{vehicle.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              {isEditing ? (
                <Input
                  id="type"
                  value={fields.type}
                  onChange={(e) => setFields({ ...fields, type: e.target.value })}
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">{vehicle.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              {isEditing ? (
                <Input
                  id="region"
                  value={fields.region}
                  onChange={(e) => setFields({ ...fields, region: e.target.value })}
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">{vehicle.region}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoadCapacity">Max Load Capacity (kg)</Label>
              {isEditing ? (
                <Input
                  id="maxLoadCapacity"
                  type="number"
                  min="0"
                  step="any"
                  value={fields.maxLoadCapacity}
                  onChange={(e) =>
                    setFields({ ...fields, maxLoadCapacity: e.target.value })
                  }
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">{vehicle.maxLoadCapacity.toLocaleString()} kg</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="acquisitionCost">Acquisition Cost</Label>
              {isEditing ? (
                <Input
                  id="acquisitionCost"
                  type="number"
                  min="0"
                  step="any"
                  value={fields.acquisitionCost}
                  onChange={(e) =>
                    setFields({ ...fields, acquisitionCost: e.target.value })
                  }
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">{vehicle.acquisitionCost.toLocaleString()}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="odometer">Odometer (km)</Label>
              {isEditing ? (
                <Input
                  id="odometer"
                  type="number"
                  min="0"
                  step="any"
                  value={fields.odometer}
                  onChange={(e) => setFields({ ...fields, odometer: e.target.value })}
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">{vehicle.odometer.toLocaleString()} km</p>
              )}
            </div>
          </div>

          {isEditing && (
            <Button className="w-full gap-2" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  Saving…
                  <Loader2 className="size-4 animate-spin" />
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
