"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Plus, ArrowRight, Search, Bell, Settings, HelpCircle } from "lucide-react";
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
import type { Trip, TripStatus } from "@/types/trip";
import { TRIP_STATUSES } from "@/types/trip";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardUserMenu } from "./dashboard-user-menu";
import { NotificationMenu } from "./notification-menu";

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

export function TripManagementView() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await fetch(`/api/trips?${params.toString()}`);
      if (cancelled) return;
      const data: Trip[] = response.ok ? await response.json() : [];
      if (cancelled) return;
      startTransition(() => {
        setTrips(data);
      });
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  return (
    <div className="w-full text-slate-900 dark:text-slate-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search trips, vehicles, or drivers..."
            className="w-full rounded-xl border border-slate-200 bg-white dark:border-slate-700/50 dark:bg-slate-800/40 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div className="flex items-center gap-5">
          <div className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <ThemeToggle />
          </div>
          <NotificationMenu />
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </button>
          <DashboardUserMenu />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Trip Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Plan, dispatch and track your trips</p>
          </div>
          <Button className="gap-2" nativeButton={false} render={<Link href="/trips/new" />}>
            <Plus className="size-4" />
            New Trip
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Select value={statusFilter} onValueChange={(value) => value && setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {TRIP_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABEL[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading trips…</p>
        ) : trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card py-16 text-center shadow-sm">
            <p className="text-sm font-medium">No trips match these filters</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting the filter above, or plan a new trip.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Cargo</TableHead>
                  <TableHead className="text-right">Distance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id} className="cursor-pointer">
                    <TableCell className="font-medium">
                      <Link href={`/trips/${trip.id}`} className="flex items-center gap-1.5">
                        {trip.source}
                        <ArrowRight className="size-3.5 text-muted-foreground" />
                        {trip.destination}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/trips/${trip.id}`} className="block">
                        {trip.vehicle?.registrationNumber ?? "—"}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/trips/${trip.id}`} className="block">
                        {trip.driver?.name ?? "—"}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/trips/${trip.id}`} className="block">
                        <Badge className={STATUS_BADGE_CLASS[trip.status]}>
                          {STATUS_LABEL[trip.status]}
                        </Badge>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/trips/${trip.id}`} className="block">
                        {trip.cargoWeight.toLocaleString()} kg
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/trips/${trip.id}`} className="block">
                        {trip.plannedDistance.toLocaleString()} km
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
