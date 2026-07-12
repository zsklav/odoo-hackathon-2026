"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ExpenseVehicle, ExpenseType } from "@/types/expense";
import { EXPENSE_TYPES } from "@/types/expense";

export default function NewExpensePage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<ExpenseVehicle[]>([]);
  const [vehicleId, setVehicleId] = useState("");
  const [type, setType] = useState<ExpenseType>("TOLL");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVehicles() {
      const response = await fetch("/api/vehicles");
      if (cancelled) return;
      if (!response.ok) {
        setErrorMessage("Could not load vehicles.");
        return;
      }
      const data = (await response.json()) as ExpenseVehicle[];
      if (cancelled) return;
      setVehicles(data);
      if (!vehicleId && data[0]) {
        setVehicleId(data[0].id);
      }
    }

    loadVehicles();

    return () => {
      cancelled = true;
    };
  }, [vehicleId]);

  function validate(): string | null {
    if (!vehicleId) return "A vehicle is required.";
    if (!Object.values(EXPENSE_TYPES).includes(type)) return "Expense type is required.";
    const costValue = Number(cost);
    if (!cost || !Number.isFinite(costValue) || costValue <= 0) {
      return "Cost must be a positive number.";
    }
    if (date && Number.isNaN(new Date(date).getTime())) {
      return "Date must be valid.";
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
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleId,
        type,
        cost: Number(cost),
        date: date || undefined,
      }),
    });
    const result = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push(`/expenses/${result.id}`);
  }

  if (vehicles.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/expenses"
          className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Expenses
        </Link>

        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium">Create a vehicle first</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Expenses need a vehicle to exist before they can be recorded.
          </p>
          <Button className="mt-4" nativeButton={false} render={<Link href="/vehicles" />}>
            View Vehicles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/expenses"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Expenses
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle</Label>
              <Select value={vehicleId} onValueChange={(value) => value && setVehicleId(value)}>
                <SelectTrigger id="vehicleId" className="w-full" disabled={isSubmitting}>
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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={(value) => value && setType(value as ExpenseType)}>
                  <SelectTrigger id="type" className="w-full" disabled={isSubmitting}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_TYPES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="any"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="4500"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  Saving expense…
                  <Loader2 className="size-4 animate-spin" />
                </>
              ) : (
                "Create Expense"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}