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
import type { Driver, DriverStatus } from "@/types/driver";
import { DRIVER_STATUSES } from "@/types/driver";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardUserMenu } from "./dashboard-user-menu";

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

function isExpired(date: string) {
  return new Date(date).getTime() < Date.now();
}

export function DriverRegistryView() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (categoryFilter !== "all") params.set("licenseCategory", categoryFilter);

      const response = await fetch(`/api/drivers?${params.toString()}`);
      if (cancelled) return;
      const data: Driver[] = response.ok ? await response.json() : [];
      if (cancelled) return;
      startTransition(() => {
        setDrivers(data);
      });
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [statusFilter, categoryFilter]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const response = await fetch("/api/drivers");
      if (cancelled) return;
      const all: Driver[] = response.ok ? await response.json() : [];
      if (cancelled) return;
      setCategories(Array.from(new Set(all.map((d) => d.licenseCategory))).sort());
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
            placeholder="Search drivers, licenses, or status..."
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
          <DashboardUserMenu />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Driver Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your drivers and their compliance</p>
          </div>
          <Button className="gap-2" nativeButton={false} render={<Link href="/drivers/new" />}>
            <Plus className="size-4" />
            Add Driver
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Select value={statusFilter} onValueChange={(value) => value && setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-44 bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {DRIVER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABEL[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={(value) => value && setCategoryFilter(value)}>
            <SelectTrigger className="w-full sm:w-44 bg-card">
              <SelectValue placeholder="License Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading drivers…</p>
        ) : drivers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card py-16 text-center shadow-sm">
            <p className="text-sm font-medium">No drivers match these filters</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting the filters above, or add a new driver.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>License No.</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Safety Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => {
                  const expired = isExpired(driver.licenseExpiryDate);
                  return (
                    <TableRow key={driver.id} className="cursor-pointer">
                      <TableCell className="font-medium">
                        <Link href={`/drivers/${driver.id}`} className="block">
                          {driver.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/drivers/${driver.id}`} className="block">
                          {driver.licenseNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/drivers/${driver.id}`} className="block">
                          {driver.licenseCategory}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/drivers/${driver.id}`} className="block">
                          <span className={expired ? "font-medium text-red-600 dark:text-red-400" : ""}>
                            {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                            {expired && " · Expired"}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/drivers/${driver.id}`} className="block">
                          <Badge className={STATUS_BADGE_CLASS[driver.status]}>
                            {STATUS_LABEL[driver.status]}
                          </Badge>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/drivers/${driver.id}`} className="block">
                          {driver.safetyScore}
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
    </div>
  );
}
