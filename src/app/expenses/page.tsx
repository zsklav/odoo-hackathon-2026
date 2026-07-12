"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Expense, ExpenseVehicle } from "@/types/expense";
import { EXPENSE_TYPES } from "@/types/expense";

const TYPE_BADGE_CLASS: Record<string, string> = {
  TOLL: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  MAINTENANCE: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  OTHER: "bg-muted text-muted-foreground",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicles, setVehicles] = useState<ExpenseVehicle[]>([]);
  const [vehicleFilter, setVehicleFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isLoading, startTransition] = useTransition();
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVehicles() {
      const response = await fetch("/api/vehicles");
      if (cancelled) return;
      if (!response.ok) {
        setLoadError("Could not load vehicle list.");
        return;
      }
      const data = (await response.json()) as ExpenseVehicle[];
      if (cancelled) return;
      setVehicles(data);
    }

    loadVehicles();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadExpenses() {
      setLoadError(null);
      const params = new URLSearchParams();
      if (vehicleFilter !== "all") params.set("vehicleId", vehicleFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);

      const response = await fetch(`/api/expenses?${params.toString()}`);
      if (cancelled) return;
      if (!response.ok) {
        setLoadError("Could not load expenses.");
        startTransition(() => setExpenses([]));
        return;
      }
      const data = (await response.json()) as Expense[];
      if (cancelled) return;
      startTransition(() => setExpenses(data));
    }

    loadExpenses();

    return () => {
      cancelled = true;
    };
  }, [vehicleFilter, typeFilter]);

  const totals = useMemo(() => {
    const cost = expenses.reduce((sum, entry) => sum + entry.cost, 0);
    return { count: expenses.length, cost };
  }, [expenses]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Track vehicle-linked costs such as tolls, maintenance, and other spend.
          </p>
        </div>
        <Button className="gap-2" nativeButton={false} render={<Link href="/expenses/new" />}>
          <Plus className="size-4" />
          Add Expense
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Select value={vehicleFilter} onValueChange={(value) => value && setVehicleFilter(value)}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Vehicle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vehicles</SelectItem>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.registrationNumber} · {vehicle.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(value) => value && setTypeFilter(value)}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {EXPENSE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Expense Entries
          </p>
          <p className="mt-2 text-2xl font-bold">{totals.count}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Cost
          </p>
          <p className="mt-2 text-2xl font-bold">{totals.cost.toLocaleString()}</p>
        </div>
      </div>

      {loadError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {loadError}
        </div>
      ) : isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading expenses…</p>
      ) : expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium">No expenses match these filters</p>
          <p className="text-sm text-muted-foreground">
            Add the first expense entry, or adjust the filters above.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <Link href={`/expenses/${expense.id}`} className="block">
                      {formatDate(expense.date)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/expenses/${expense.id}`} className="flex items-center gap-1.5">
                      {expense.vehicle?.registrationNumber ?? "—"}
                      <ArrowRight className="size-3.5 text-muted-foreground" />
                      {expense.vehicle?.name ?? "Unknown vehicle"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/expenses/${expense.id}`} className="block">
                      <Badge className={TYPE_BADGE_CLASS[expense.type]}>{expense.type}</Badge>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/expenses/${expense.id}`} className="block">
                      {expense.cost.toLocaleString()}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}