import { Truck } from "lucide-react";

const coreEcosystem = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"];

export function AuthBrandingPanel() {
  return (
    <div className="flex flex-col justify-between gap-10 bg-sidebar px-8 py-10 text-sidebar-foreground lg:px-12 lg:py-14">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Truck className="size-5" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight text-primary">TransitOps</p>
            <p className="text-xs text-muted-foreground">Smart Transport Operations Platform</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Core Ecosystem
          </p>
          <ul className="space-y-2 text-sm">
            {coreEcosystem.map((role) => (
              <li key={role} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                {role}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <blockquote className="rounded-lg border border-border bg-card/50 p-4 text-sm italic text-muted-foreground">
        &ldquo;Unified intelligence for modern fleets. Monitor, manage, and optimize every route
        in real-time.&rdquo;
      </blockquote>
    </div>
  );
}
