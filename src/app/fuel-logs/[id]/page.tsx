"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import type { FuelLog, FuelLogVehicle } from "@/types/fuel-log";

interface EditableFields {
  vehicleId: string;
  liters: string;
  cost: string;
  date: string;
}

function toFields(fuelLog: FuelLog): EditableFields {
  return {
    vehicleId: fuelLog.vehicleId,
    liters: String(fuelLog.liters),
    cost: String(fuelLog.cost),
    date: fuelLog.date ? fuelLog.date.slice(0, 10) : "",
  };
}

export default function FuelLogDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [fuelLog, setFuelLog] = useState<FuelLog | null>(null);
  const [vehicles, setVehicles] = useState<FuelLogVehicle[]>([]);
  const [fields, setFields] = useState<EditableFields | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const [fuelLogResponse, vehiclesResponse] = await Promise.all([
        fetch(`/api/fuel-logs/${params.id}`),
        fetch("/api/vehicles"),
      ]);

      if (cancelled) return;

      if (vehiclesResponse.ok) {
        setVehicles((await vehiclesResponse.json()) as FuelLogVehicle[]);
      }

      if (fuelLogResponse.status === 404) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      const data = (await fuelLogResponse.json()) as FuelLog;
      setFuelLog(data);
      setFields(toFields(data));
      setIsLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  function validate(f: EditableFields): string | null {
    if (!f.vehicleId) return "A vehicle is required.";
    const litersValue = Number(f.liters);
    if (!f.liters || !Number.isFinite(litersValue) || litersValue <= 0) {
      return "Liters must be a positive number.";
    }
    const costValue = Number(f.cost);
    if (!f.cost || !Number.isFinite(costValue) || costValue <= 0) {
      return "Cost must be a positive number.";
    }
    if (f.date && Number.isNaN(new Date(f.date).getTime())) {
      return "Date must be valid.";
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
    const response = await fetch(`/api/fuel-logs/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleId: fields.vehicleId,
        liters: Number(fields.liters),
        cost: Number(fields.cost),
        date: fields.date || undefined,
      }),
    });
    const result = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setFuelLog(result);
    setFields(toFields(result));
    setIsEditing(false);
  }

  async function handleDelete() {
    setDeleteError(null);
    setIsDeleting(true);
    const response = await fetch(`/api/fuel-logs/${params.id}`, { method: "DELETE" });
    setIsDeleting(false);

    if (!response.ok) {
      const result = await response.json();
      setDeleteError(result.error ?? "Could not delete fuel log.");
      return;
    }

    router.push("/fuel-logs");
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2 px-4 py-16 text-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !fuelLog || !fields) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2 px-4 py-16 text-center">
        <p className="text-sm font-medium">Fuel log not found</p>
        <Link href="/fuel-logs" className="text-sm text-primary hover:underline">
          Back to Fuel Logs
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/fuel-logs"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Fuel Logs
      </Link>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl">Fuel Entry</CardTitle>
            <p className="text-sm text-muted-foreground">
              {fuelLog.vehicle?.registrationNumber ?? "Unknown vehicle"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Cancel edit"
                onClick={() => {
                  setFields(toFields(fuelLog));
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
                aria-label="Edit fuel log"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="size-4" />
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="ghost" size="icon" aria-label="Delete fuel log" />}>
                <Trash2 className="size-4 text-destructive" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this fuel log?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove the entry for {fuelLog.vehicle?.registrationNumber ?? "this vehicle"}.
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
                  <AlertDialogAction variant="destructive" disabled={isDeleting} onClick={handleDelete}>
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
            <Label htmlFor="vehicleId">Vehicle</Label>
            {isEditing ? (
              <Select
                value={fields.vehicleId}
                onValueChange={(value) => value && setFields({ ...fields, vehicleId: value })}
              >
                <SelectTrigger id="vehicleId" className="w-full" disabled={isSaving}>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNumber} · {vehicle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm">
                {fuelLog.vehicle?.registrationNumber ?? "—"} · {fuelLog.vehicle?.name ?? "Unknown"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="liters">Liters</Label>
              {isEditing ? (
                <Input
                  id="liters"
                  type="number"
                  min="0"
                  step="any"
                  value={fields.liters}
                  onChange={(e) => setFields({ ...fields, liters: e.target.value })}
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">{fuelLog.liters.toLocaleString()}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              {isEditing ? (
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="any"
                  value={fields.cost}
                  onChange={(e) => setFields({ ...fields, cost: e.target.value })}
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">{fuelLog.cost.toLocaleString()}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="date">Date</Label>
              {isEditing ? (
                <Input
                  id="date"
                  type="date"
                  value={fields.date}
                  onChange={(e) => setFields({ ...fields, date: e.target.value })}
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">
                  {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(fuelLog.date))}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <Button className="w-full gap-2" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  Saving changes…
                  <Loader2 className="size-4 animate-spin" />
                </>
              ) : (
                "Save Fuel Log"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}