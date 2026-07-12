"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
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

export default function VehiclesPage() {
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicle Registry</h1>
          <p className="text-sm text-muted-foreground">Manage your fleet&apos;s vehicles</p>
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
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium">No vehicles match these filters</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting the filters above, or add a new vehicle.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border">
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
  );
}
