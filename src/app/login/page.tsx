"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Lock, LogIn, Loader2, Mail } from "lucide-react";
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

      <div className="relative flex flex-col items-center justify-center gap-6 px-4 py-10 sm:px-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <Card className="w-full max-w-sm">
          <CardContent className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Sign in to your account</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter your credentials to continue to the dashboard.
              </p>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    id="email"
                    className="pl-8"
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
                    className="px-8"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role (RBAC)</Label>
                <Select value={role} onValueChange={(value) => value && setRole(value)}>
                  <SelectTrigger id="role" className="w-full" disabled={isSubmitting}>
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

              <div className="flex items-center gap-2">
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

              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
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

            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Access Mapping
              </p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center justify-between">
                  <span>Fleet Manager</span>
                  <span>Fleet, Maintenance</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Dispatcher</span>
                  <span>Dashboard, Trips</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Safety Officer</span>
                  <span>Drivers, Compliance</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Financial Analyst</span>
                  <span>Expenses, Analytics</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
