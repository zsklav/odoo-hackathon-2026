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
import { DRIVER_STATUSES, type Driver, type DriverStatus } from "@/types/driver";

const STATUS_BADGE_CLASS: Record<DriverStatus, string> = {
  AVAILABLE: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  ON_TRIP: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  OFF_DUTY: "bg-muted text-muted-foreground",
  SUSPENDED: "bg-red-500/15 text-red-600 dark:text-red-400",
};

const STATUS_LABEL: Record<DriverStatus, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  OFF_DUTY: "Off Duty",
  SUSPENDED: "Suspended",
};

interface EditableFields {
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string;
  contactNumber: string;
  safetyScore: string;
  status: DriverStatus;
}

function toFields(driver: Driver): EditableFields {
  return {
    name: driver.name,
    licenseNumber: driver.licenseNumber,
    licenseCategory: driver.licenseCategory,
    licenseExpiryDate: driver.licenseExpiryDate.slice(0, 10),
    contactNumber: driver.contactNumber,
    safetyScore: String(driver.safetyScore),
    status: driver.status,
  };
}

export default function DriverDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [driver, setDriver] = useState<Driver | null>(null);
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
      const response = await fetch(`/api/drivers/${params.id}`);
      if (cancelled) return;
      if (response.status === 404) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }
      const data: Driver = await response.json();
      setDriver(data);
      setFields(toFields(data));
      setIsLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  function validate(f: EditableFields): string | null {
    if (!f.name.trim()) return "Name is required.";
    if (!f.licenseNumber.trim()) return "License number is required.";
    if (!f.licenseCategory.trim()) return "License category is required.";
    if (!f.contactNumber.trim()) return "Contact number is required.";
    if (!f.licenseExpiryDate || Number.isNaN(Date.parse(f.licenseExpiryDate))) {
      return "A valid license expiry date is required.";
    }
    const score = Number(f.safetyScore);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      return "Safety score must be between 0 and 100.";
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
    const response = await fetch(`/api/drivers/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fields.name,
        licenseNumber: fields.licenseNumber,
        licenseCategory: fields.licenseCategory,
        licenseExpiryDate: fields.licenseExpiryDate,
        contactNumber: fields.contactNumber,
        safetyScore: Number(fields.safetyScore),
        status: fields.status,
      }),
    });
    const result = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setDriver(result);
    setFields(toFields(result));
    setIsEditing(false);
  }

  async function handleStatusChange(status: DriverStatus) {
    setErrorMessage(null);
    const response = await fetch(`/api/drivers/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (!response.ok) {
      setErrorMessage(result.error ?? "Could not update status.");
      return;
    }
    setDriver(result);
    setFields(toFields(result));
  }

  async function handleDelete() {
    setDeleteError(null);
    setIsDeleting(true);
    const response = await fetch(`/api/drivers/${params.id}`, { method: "DELETE" });
    setIsDeleting(false);

    if (!response.ok) {
      const result = await response.json();
      setDeleteError(result.error ?? "Could not delete driver.");
      return;
    }

    router.push("/drivers");
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2 px-4 py-16 text-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !driver || !fields) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2 px-4 py-16 text-center">
        <p className="text-sm font-medium">Driver not found</p>
        <Link href="/dashboard?role=DRIVER&tab=driver-registry" className="text-sm text-primary hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const expired = new Date(driver.licenseExpiryDate).getTime() < Date.now();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard?role=DRIVER&tab=driver-registry"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl">{driver.name}</CardTitle>
            <Badge className={STATUS_BADGE_CLASS[driver.status]}>
              {STATUS_LABEL[driver.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Cancel edit"
                onClick={() => {
                  setFields(toFields(driver));
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
                aria-label="Edit driver"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="size-4" />
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="ghost" size="icon" aria-label="Delete driver" />}
              >
                <Trash2 className="size-4 text-destructive" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this driver?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove {driver.name} ({driver.licenseNumber}) from the
                    system. This cannot be undone.
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

          {expired && (
            <div className="flex items-start gap-2 rounded-lg border border-orange-500/50 bg-orange-500/10 p-3 text-sm text-orange-600 dark:text-orange-400">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>This driver&apos;s license has expired and cannot be assigned to trips.</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={driver.status}
              onValueChange={(value) => value && handleStatusChange(value as DriverStatus)}
            >
              <SelectTrigger id="status" className="w-full sm:w-56">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {DRIVER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <p className="text-sm">{driver.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              {isEditing ? (
                <Input
                  id="licenseNumber"
                  value={fields.licenseNumber}
                  onChange={(e) => setFields({ ...fields, licenseNumber: e.target.value })}
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">{driver.licenseNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseCategory">License Category</Label>
              {isEditing ? (
                <Input
                  id="licenseCategory"
                  value={fields.licenseCategory}
                  onChange={(e) => setFields({ ...fields, licenseCategory: e.target.value })}
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">{driver.licenseCategory}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
              {isEditing ? (
                <Input
                  id="licenseExpiryDate"
                  type="date"
                  value={fields.licenseExpiryDate}
                  onChange={(e) => setFields({ ...fields, licenseExpiryDate: e.target.value })}
                  disabled={isSaving}
                />
              ) : (
                <p className={`text-sm ${expired ? "font-medium text-red-600 dark:text-red-400" : ""}`}>
                  {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                  {expired && " · Expired"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              {isEditing ? (
                <Input
                  id="contactNumber"
                  value={fields.contactNumber}
                  onChange={(e) => setFields({ ...fields, contactNumber: e.target.value })}
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">{driver.contactNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="safetyScore">Safety Score (0–100)</Label>
              {isEditing ? (
                <Input
                  id="safetyScore"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={fields.safetyScore}
                  onChange={(e) => setFields({ ...fields, safetyScore: e.target.value })}
                  disabled={isSaving}
                />
              ) : (
                <p className="text-sm">{driver.safetyScore}</p>
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
