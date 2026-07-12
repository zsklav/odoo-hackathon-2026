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
import { DRIVER_STATUSES, type DriverStatus } from "@/types/driver";

const STATUS_LABEL: Record<DriverStatus, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  OFF_DUTY: "Off Duty",
  SUSPENDED: "Suspended",
};

export default function NewDriverPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCategory, setLicenseCategory] = useState("");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [safetyScore, setSafetyScore] = useState("100");
  const [status, setStatus] = useState<DriverStatus>("AVAILABLE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function validate(): string | null {
    if (!name.trim()) return "Name is required.";
    if (!licenseNumber.trim()) return "License number is required.";
    if (!licenseCategory.trim()) return "License category is required.";
    if (!contactNumber.trim()) return "Contact number is required.";
    if (!licenseExpiryDate || Number.isNaN(Date.parse(licenseExpiryDate))) {
      return "A valid license expiry date is required.";
    }
    const score = Number(safetyScore);
    if (safetyScore && (!Number.isFinite(score) || score < 0 || score > 100)) {
      return "Safety score must be between 0 and 100.";
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
    const response = await fetch("/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        licenseNumber,
        licenseCategory,
        licenseExpiryDate,
        contactNumber,
        safetyScore: safetyScore ? Number(safetyScore) : undefined,
        status,
      }),
    });
    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push(`/drivers/${result.id}`);
  }

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
        <CardHeader>
          <CardTitle className="text-xl">Add Driver</CardTitle>
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
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Ravi Kumar"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="MH1220190001234"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseCategory">License Category</Label>
                <Input
                  id="licenseCategory"
                  value={licenseCategory}
                  onChange={(e) => setLicenseCategory(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="HMV"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
                <Input
                  id="licenseExpiryDate"
                  type="date"
                  value={licenseExpiryDate}
                  onChange={(e) => setLicenseExpiryDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="+91 98200 11111"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="safetyScore">Safety Score (0–100)</Label>
                <Input
                  id="safetyScore"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={safetyScore}
                  onChange={(e) => setSafetyScore(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => value && setStatus(value as DriverStatus)}
                >
                  <SelectTrigger id="status" className="w-full" disabled={isSubmitting}>
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
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  Creating driver…
                  <Loader2 className="size-4 animate-spin" />
                </>
              ) : (
                "Create Driver"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
