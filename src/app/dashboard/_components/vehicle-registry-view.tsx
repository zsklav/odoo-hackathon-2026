"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Search, Bell, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Vehicle, VehicleStatus } from "@/types/vehicle";
import { VEHICLE_STATUSES } from "@/types/vehicle";
import { ThemeToggle } from "@/components/theme-toggle";

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

export function VehicleRegistryView() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, startTransition] = useTransition();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [types, setTypes] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (regionFilter !== "all") params.set("region", regionFilter);

      const response = await fetch(`/api/vehicles?${params.toString()}`);
      if (cancelled) return;
      const data: Vehicle[] = response.ok ? await response.json() : [];
      if (cancelled) return;
      startTransition(() => {
        setVehicles(data);
      });
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [typeFilter, statusFilter, regionFilter]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const response = await fetch("/api/vehicles");
      if (cancelled) return;
      const all: Vehicle[] = response.ok ? await response.json() : [];
      if (cancelled) return;
      setTypes(Array.from(new Set(all.map((v) => v.type))).sort());
      setRegions(Array.from(new Set(all.map((v) => v.region))).sort());
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full text-slate-900 dark:text-slate-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search vehicles, types, regions..."
            className="w-full rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-slate-800/40 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div className="flex items-center gap-5">
          <div className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <ThemeToggle />
          </div>
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </button>
          <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ring-2 ring-slate-100 dark:ring-slate-800">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vehicle Registry</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your fleet's vehicles</p>
          </div>
          <Button className="gap-2" nativeButton={false} render={<Link href="/vehicles/new" />}>
            <Plus className="size-4" />
            Add Vehicle
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Select value={typeFilter} onValueChange={(value) => value && setTypeFilter(value)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(value) => value && setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {VEHICLE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABEL[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={regionFilter} onValueChange={(value) => value && setRegionFilter(value)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading vehicles…</p>
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card py-16 text-center shadow-sm">
            <p className="text-sm font-medium">No vehicles match these filters</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting the filters above, or add a new vehicle.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Registration</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Odometer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className="cursor-pointer">
                    <TableCell className="font-medium">
                      <Link href={`/vehicles/${vehicle.id}`} className="block">
                        {vehicle.registrationNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/vehicles/${vehicle.id}`} className="block">
                        {vehicle.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/vehicles/${vehicle.id}`} className="block">
                        {vehicle.type}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/vehicles/${vehicle.id}`} className="block">
                        {vehicle.region}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/vehicles/${vehicle.id}`} className="block">
                        <Badge className={STATUS_BADGE_CLASS[vehicle.status]}>
                          {STATUS_LABEL[vehicle.status]}
                        </Badge>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/vehicles/${vehicle.id}`} className="block">
                        {vehicle.odometer.toLocaleString()} km
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
