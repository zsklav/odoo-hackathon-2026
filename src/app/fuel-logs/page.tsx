"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FuelLog, FuelLogVehicle } from "@/types/fuel-log";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export default function FuelLogsPage() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [vehicles, setVehicles] = useState<FuelLogVehicle[]>([]);
  const [vehicleFilter, setVehicleFilter] = useState<string>("all");
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
      const data = (await response.json()) as FuelLogVehicle[];
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

    async function loadFuelLogs() {
      setLoadError(null);
      const params = new URLSearchParams();
      if (vehicleFilter !== "all") params.set("vehicleId", vehicleFilter);

      const response = await fetch(`/api/fuel-logs?${params.toString()}`);
      if (cancelled) return;
      if (!response.ok) {
        setLoadError("Could not load fuel logs.");
        startTransition(() => setFuelLogs([]));
        return;
      }
      const data = (await response.json()) as FuelLog[];
      if (cancelled) return;
      startTransition(() => setFuelLogs(data));
    }

    loadFuelLogs();

    return () => {
      cancelled = true;
    };
  }, [vehicleFilter]);

  const totals = useMemo(() => {
    const liters = fuelLogs.reduce((sum, entry) => sum + entry.liters, 0);
    const cost = fuelLogs.reduce((sum, entry) => sum + entry.cost, 0);
    return { count: fuelLogs.length, liters, cost };
  }, [fuelLogs]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fuel Logs</h1>
          <p className="text-sm text-muted-foreground">
            Record fuel fills against a vehicle and keep the ledger audit-ready.
          </p>
        </div>
        <Button className="gap-2" nativeButton={false} render={<Link href="/fuel-logs/new" />}>
          <Plus className="size-4" />
          Add Fuel Log
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
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Log Entries
          </p>
          <p className="mt-2 text-2xl font-bold">{totals.count}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Liters
          </p>
          <p className="mt-2 text-2xl font-bold">{totals.liters.toLocaleString()}</p>
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
        <p className="py-10 text-center text-sm text-muted-foreground">Loading fuel logs…</p>
      ) : fuelLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium">No fuel logs match these filters</p>
          <p className="text-sm text-muted-foreground">
            Add the first fuel entry, or choose another vehicle filter.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead className="text-right">Liters</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Cost / Liter</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fuelLogs.map((fuelLog) => {
                const costPerLiter = fuelLog.liters > 0 ? fuelLog.cost / fuelLog.liters : 0;

                return (
                  <TableRow key={fuelLog.id} className="cursor-pointer">
                    <TableCell className="font-medium">
                      <Link href={`/fuel-logs/${fuelLog.id}`} className="block">
                        {formatDate(fuelLog.date)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/fuel-logs/${fuelLog.id}`} className="flex items-center gap-1.5">
                        {fuelLog.vehicle?.registrationNumber ?? "—"}
                        <ArrowRight className="size-3.5 text-muted-foreground" />
                        {fuelLog.vehicle?.name ?? "Unknown vehicle"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/fuel-logs/${fuelLog.id}`} className="block">
                        {fuelLog.liters.toLocaleString()}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/fuel-logs/${fuelLog.id}`} className="block">
                        {fuelLog.cost.toLocaleString()}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/fuel-logs/${fuelLog.id}`} className="block">
                        {costPerLiter.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}