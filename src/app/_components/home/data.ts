import type { ComponentType, SVGProps } from "react";
import { Truck, Users, Route, LayoutDashboard, Wrench, Fuel } from "lucide-react";

export interface HomeModule {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href: string | null;
  tag: string;
}

export const MODULES: HomeModule[] = [
  {
    title: "Master Vehicle Registry",
    description: "Fleet master list with unique registration, live status and full lifecycle history.",
    icon: Truck,
    href: "/vehicles",
    tag: "Core Engine",
  },
  {
    title: "Driver Management",
    description: "Driver profiles, license validity tracking, safety scores and availability.",
    icon: Users,
    href: "/drivers",
    tag: "Compliance",
  },
  {
    title: "Trip Management",
    description: "Assign vehicle + driver with rule checks across the Draft → Dispatched → Completed lifecycle.",
    icon: Route,
    href: "/trips",
    tag: "Operations",
  },
  {
    title: "Command Dashboard",
    description: "Role-based views, live KPIs and fleet utilization at a single glance.",
    icon: LayoutDashboard,
    href: "/dashboard",
    tag: "Analytics",
  },
  {
    title: "Intelligent Maintenance",
    description: "Service logs with automatic 'In Shop' status, kept out of dispatch until resolved.",
    icon: Wrench,
    href: null,
    tag: "Soon",
  },
  {
    title: "Fuel & Expenses",
    description: "Fuel logs, tolls and automatic operational cost roll-up for every vehicle.",
    icon: Fuel,
    href: null,
    tag: "Soon",
  },
];

export const NAV_LINKS = [
  { label: "Features", href: "#capabilities" },
  { label: "Solutions", href: "#capabilities" },
  { label: "Pricing", href: "#capabilities" },
  { label: "Documentation", href: "#capabilities" },
];
