"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  DollarSign,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Loader2,
  Mail,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { AuthBrandingPanel } from "@/components/auth/auth-branding-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roles = [
  { label: "Fleet Manager", value: "FLEET_MANAGER" },
  { label: "Driver", value: "DRIVER" },
  { label: "Safety Officer", value: "SAFETY_OFFICER" },
  { label: "Financial Analyst", value: "FINANCIAL_ANALYST" },
];

const accessMapping = [
  { label: "Fleet Manager", access: "Fleet, Maintenance", icon: Truck },
  { label: "Dispatcher", access: "Dashboard, Trips", icon: Route },
  { label: "Safety Officer", access: "Drivers, Compliance", icon: ShieldCheck },
  { label: "Financial Analyst", access: "Expenses, Analytics", icon: DollarSign },
];

const inputFocusClass =
  "transition-all duration-150 focus-visible:ring-4 focus-visible:ring-primary/20";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(roles[0].value);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function validate(): string | null {
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
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
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setIsSubmitting(false);

    if (!response.ok) {
      setErrorMessage("Invalid email or password.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <div className="hidden lg:block">
        <AuthBrandingPanel />
      </div>

      {/* Compact top banner replacing the full atmospheric panel below lg */}
      <div className="relative h-28 overflow-hidden bg-[oklch(0.16_0.02_260)] lg:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_0%,oklch(0.28_0.05_255)_0%,oklch(0.16_0.02_260)_70%)]" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
        <div className="relative flex h-full items-center gap-3 px-6">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Truck className="size-4.5" />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight text-primary">TransitOps</p>
            <p className="text-xs text-white/60">Smart Transport Operations Platform</p>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center gap-6 px-4 py-10 sm:px-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <Card className="w-full max-w-sm animate-fade-in-up">
          <CardContent className="space-y-7">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-balance">
                Sign in to your account
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Enter your credentials to continue to the dashboard.
              </p>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    id="email"
                    className={`h-10 pl-8 ${inputFocusClass}`}
                    placeholder="you@transitops.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`h-10 px-8 ${inputFocusClass}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-3.5">
                <div className="space-y-2">
                  <Label htmlFor="role">Role (RBAC)</Label>
                  <Select value={role} onValueChange={(value) => value && setRole(value)}>
                    <SelectTrigger
                      id="role"
                      className={`h-10 w-full bg-background ${inputFocusClass}`}
                      disabled={isSubmitting}
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 border-t border-border pt-3">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="remember-me" className="font-normal text-muted-foreground">
                    Remember me for 30 days
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="h-10 w-full gap-2 transition-all duration-150 hover:shadow-lg hover:shadow-primary/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    Signing in…
                    <Loader2 className="size-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Sign In
                    <LogIn className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register here
              </Link>
            </p>

            <div className="space-y-2.5 border-t border-border pt-5">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Access Mapping
              </p>
              <div className="grid grid-cols-2 gap-2">
                {accessMapping.map(({ label, access, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-2.5"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{label}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{access}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
