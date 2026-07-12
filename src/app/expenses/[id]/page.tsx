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
import type { Expense, ExpenseType, ExpenseVehicle } from "@/types/expense";
import { EXPENSE_TYPES } from "@/types/expense";

const TYPE_BADGE_CLASS: Record<ExpenseType, string> = {
  TOLL: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  MAINTENANCE: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  OTHER: "bg-muted text-muted-foreground",
};

interface EditableFields {
  vehicleId: string;
  type: ExpenseType;
  cost: string;
  date: string;
}

function toFields(expense: Expense): EditableFields {
  return {
    vehicleId: expense.vehicleId,
    type: expense.type,
    cost: String(expense.cost),
    date: expense.date ? expense.date.slice(0, 10) : "",
  };
}

export default function ExpenseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [vehicles, setVehicles] = useState<ExpenseVehicle[]>([]);
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
      const [expenseResponse, vehiclesResponse] = await Promise.all([
        fetch(`/api/expenses/${params.id}`),
        fetch("/api/vehicles"),
      ]);

      if (cancelled) return;

      if (vehiclesResponse.ok) {
        setVehicles((await vehiclesResponse.json()) as ExpenseVehicle[]);
      }

      if (expenseResponse.status === 404) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      const data = (await expenseResponse.json()) as Expense;
      setExpense(data);
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
    if (!Object.values(EXPENSE_TYPES).includes(f.type)) return "Expense type is required.";
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
    const response = await fetch(`/api/expenses/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleId: fields.vehicleId,
        type: fields.type,
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

    setExpense(result);
    setFields(toFields(result));
    setIsEditing(false);
  }

  async function handleDelete() {
    setDeleteError(null);
    setIsDeleting(true);
    const response = await fetch(`/api/expenses/${params.id}`, { method: "DELETE" });
    setIsDeleting(false);

    if (!response.ok) {
      const result = await response.json();
      setDeleteError(result.error ?? "Could not delete expense.");
      return;
    }

    router.push("/expenses");
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2 px-4 py-16 text-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !expense || !fields) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2 px-4 py-16 text-center">
        <p className="text-sm font-medium">Expense not found</p>
        <Link href="/expenses" className="text-sm text-primary hover:underline">
          Back to Expenses
        </Link>
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
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl">Expense Entry</CardTitle>
            <p className="text-sm text-muted-foreground">
              {expense.vehicle?.registrationNumber ?? "Unknown vehicle"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Cancel edit"
                onClick={() => {
                  setFields(toFields(expense));
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
                aria-label="Edit expense"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="size-4" />
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="ghost" size="icon" aria-label="Delete expense" />}>
                <Trash2 className="size-4 text-destructive" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove the entry for {expense.vehicle?.registrationNumber ?? "this vehicle"}.
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
                {expense.vehicle?.registrationNumber ?? "—"} · {expense.vehicle?.name ?? "Unknown"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              {isEditing ? (
                <Select value={fields.type} onValueChange={(value) => value && setFields({ ...fields, type: value as ExpenseType })}>
                  <SelectTrigger id="type" className="w-full" disabled={isSaving}>
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
              ) : (
                <Badge className={TYPE_BADGE_CLASS[expense.type]}>{expense.type}</Badge>
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
                <p className="text-sm">{expense.cost.toLocaleString()}</p>
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
                  {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(expense.date))}
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
                "Save Expense"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}