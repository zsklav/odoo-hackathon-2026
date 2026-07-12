"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { Trip, TripStatus } from "@/types/trip";

const STATUS_BADGE_CLASS: Record<TripStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  DISPATCHED: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  COMPLETED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  CANCELLED: "bg-red-500/15 text-red-600 dark:text-red-400",
};

const STATUS_LABEL: Record<TripStatus, string> = {
  DRAFT: "Draft",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

export default function TripDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actualOdometer, setActualOdometer] = useState("");
  const [fuelConsumed, setFuelConsumed] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      const response = await fetch(`/api/trips/${params.id}`);
      if (cancelled) return;
      if (response.status === 404) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }
      const data: Trip = await response.json();
      setTrip(data);
      setIsLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function patchStatus(status: TripStatus, extra?: Record<string, unknown>) {
    setErrorMessage(null);
    setIsBusy(true);
    const response = await fetch(`/api/trips/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...extra }),
    });
    const result = await response.json();
    setIsBusy(false);
    if (!response.ok) {
      setErrorMessage(result.error ?? "Could not update the trip.");
      return;
    }
    setTrip(result);
  }

  async function handleComplete() {
    const extra: Record<string, unknown> = {};
    if (actualOdometer) {
      const v = Number(actualOdometer);
      if (!Number.isFinite(v) || v < 0) {
        setErrorMessage("Actual odometer must be a non-negative number.");
        return;
      }
      extra.actualOdometer = v;
    }
    if (fuelConsumed) {
      const v = Number(fuelConsumed);
      if (!Number.isFinite(v) || v < 0) {
        setErrorMessage("Fuel consumed must be a non-negative number.");
        return;
      }
      extra.fuelConsumed = v;
    }
    await patchStatus("COMPLETED", extra);
  }

  async function handleDelete() {
    setDeleteError(null);
    setIsDeleting(true);
    const response = await fetch(`/api/trips/${params.id}`, { method: "DELETE" });
    setIsDeleting(false);
    if (!response.ok) {
      const result = await response.json();
      setDeleteError(result.error ?? "Could not delete trip.");
      return;
    }
    router.push("/trips");
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2 px-4 py-16 text-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !trip) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2 px-4 py-16 text-center">
        <p className="text-sm font-medium">Trip not found</p>
        <Link href="/trips" className="text-sm text-primary hover:underline">
          Back to Trip Management
        </Link>
      </div>
    );
  }

  const isDraft = trip.status === "DRAFT";
  const isDispatched = trip.status === "DISPATCHED";
  const isTerminal = trip.status === "COMPLETED" || trip.status === "CANCELLED";

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
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <CardTitle className="flex items-center gap-1.5 text-xl">
              {trip.source}
              <ArrowRight className="size-4 text-muted-foreground" />
              {trip.destination}
            </CardTitle>
            <Badge className={STATUS_BADGE_CLASS[trip.status]}>{STATUS_LABEL[trip.status]}</Badge>
          </div>

          {!isDispatched && (
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="ghost" size="icon" aria-label="Delete trip" />}
              >
                <Trash2 className="size-4 text-destructive" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove the trip {trip.source} → {trip.destination}. This
                    cannot be undone.
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
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field
              label="Vehicle"
              value={
                trip.vehicle
                  ? `${trip.vehicle.registrationNumber} · ${trip.vehicle.name}`
                  : "—"
              }
            />
            <Field label="Driver" value={trip.driver ? trip.driver.name : "—"} />
            <Field
              label="Vehicle Capacity"
              value={trip.vehicle ? `${trip.vehicle.maxLoadCapacity.toLocaleString()} kg` : "—"}
            />
            <Field label="Cargo Weight" value={`${trip.cargoWeight.toLocaleString()} kg`} />
            <Field label="Planned Distance" value={`${trip.plannedDistance.toLocaleString()} km`} />
            <Field
              label="Actual Odometer"
              value={trip.actualOdometer != null ? `${trip.actualOdometer.toLocaleString()} km` : "—"}
            />
            <Field
              label="Fuel Consumed"
              value={trip.fuelConsumed != null ? `${trip.fuelConsumed.toLocaleString()} L` : "—"}
            />
            <Field label="Created" value={new Date(trip.createdAt).toLocaleString()} />
          </div>

          {/* --- Lifecycle actions, driven by the trip's current status --- */}
          {isDraft && (
            <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row">
              <Button className="gap-2" disabled={isBusy} onClick={() => patchStatus("DISPATCHED")}>
                <Send className="size-4" />
                Dispatch Trip
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                disabled={isBusy}
                onClick={() => patchStatus("CANCELLED")}
              >
                <XCircle className="size-4" />
                Cancel Trip
              </Button>
            </div>
          )}

          {isDispatched && (
            <div className="flex flex-col gap-4 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                This trip is live — the vehicle and driver are marked <strong>On Trip</strong>.
                Record the trip results and complete it, or cancel to release them.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="actualOdometer">Actual Odometer (km)</Label>
                  <Input
                    id="actualOdometer"
                    type="number"
                    min="0"
                    step="any"
                    value={actualOdometer}
                    onChange={(e) => setActualOdometer(e.target.value)}
                    disabled={isBusy}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelConsumed">Fuel Consumed (L)</Label>
                  <Input
                    id="fuelConsumed"
                    type="number"
                    min="0"
                    step="any"
                    value={fuelConsumed}
                    onChange={(e) => setFuelConsumed(e.target.value)}
                    disabled={isBusy}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="gap-2" disabled={isBusy} onClick={handleComplete}>
                  <CheckCircle2 className="size-4" />
                  Complete Trip
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={isBusy}
                  onClick={() => patchStatus("CANCELLED")}
                >
                  <XCircle className="size-4" />
                  Cancel Trip
                </Button>
              </div>
            </div>
          )}

          {isTerminal && (
            <div className="border-t border-border pt-4 text-sm text-muted-foreground">
              This trip is {STATUS_LABEL[trip.status].toLowerCase()} and can no longer be changed.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
