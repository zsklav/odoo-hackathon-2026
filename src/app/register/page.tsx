"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Truck,
  User,
  UserPlus,
} from "lucide-react";
import { AuthBrandingPanel } from "@/components/auth/auth-branding-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const registrableRoles = [
  { label: "Fleet Manager", value: "FLEET_MANAGER" },
  { label: "Safety Officer", value: "SAFETY_OFFICER" },
  { label: "Financial Analyst", value: "FINANCIAL_ANALYST" },
];

const inputFocusClass =
  "transition-all duration-150 focus-visible:ring-4 focus-visible:ring-primary/20";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(registrableRoles[0].value);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submitGuardRef = useRef(false);

  function validate(): string | null {
    if (!fullName.trim()) return "Full name is required.";
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitGuardRef.current) return;
    setErrorMessage(null);

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    submitGuardRef.current = true;
    setIsSubmitting(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName, role }),
    });
    const result = await response.json();
    submitGuardRef.current = false;
    setIsSubmitting(false);

    if (!response.ok) {
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-1/4 size-80 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-96 rounded-full bg-slate-400/10 blur-3xl" />
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-[minmax(520px,1.1fr)_minmax(500px,.9fr)]">
        <div className="hidden lg:block">
          <AuthBrandingPanel />
        </div>

        <div className="relative h-32 overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,oklch(0.17_0.03_255)_0%,oklch(0.12_0.02_255)_55%,oklch(0.08_0.02_255)_100%)] lg:hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_0%,oklch(0.3_0.05_255)_0%,oklch(0.16_0.02_260)_70%)]" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
          <div className="relative flex h-full items-center justify-between gap-3 px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-white/10">
                <Truck className="size-4.5" />
              </div>
              <div>
                <p className="text-base font-semibold tracking-tight text-primary">TransitOps</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                  Fleet Operations Suite
                </p>
              </div>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
              Create account
            </div>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center px-4 py-10 sm:px-8 lg:px-12">

          <Card className="auth-glass-card w-full max-w-[470px] rounded-[28px] border-white/[.09] bg-[#111317]/85 shadow-[0_32px_100px_rgba(0,0,0,.42)] backdrop-blur-2xl animate-fade-in-up">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/15 bg-orange-400/[.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-200">
                  <UserPlus className="size-3.5 text-primary" />
                  Start Here
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-balance">
                    Create your TransitOps account
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Join the fleet operations workspace with a role-based profile and secure access.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/[.08] bg-white/[.025] p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Roles
                  </p>
                  <p className="mt-1 text-sm font-medium">RBAC by design</p>
                </div>
                <div className="rounded-2xl border border-white/[.08] bg-white/[.025] p-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Onboarding
                  </p>
                  <p className="mt-1 text-sm font-medium">Fast setup</p>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-start gap-2 rounded-2xl border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      id="name"
                      className={`h-12 rounded-xl border-white/[.1] bg-white/[.04] pl-9 text-white placeholder:text-white/30 ${inputFocusClass}`}
                      placeholder="Jordan Reed"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      id="email"
                      className={`h-12 rounded-xl border-white/[.1] bg-white/[.04] pl-9 text-white placeholder:text-white/30 ${inputFocusClass}`}
                      placeholder="you@transitops.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl border border-white/[.08] bg-white/[.025] p-4">
                  <Label htmlFor="role">Select Role</Label>
                  <Select value={role} onValueChange={(value) => value && setRole(value)}>
                    <SelectTrigger
                      id="role"
                      className={`h-11 w-full rounded-xl border-white/[.1] bg-white/[.04] ${inputFocusClass}`}
                      disabled={isSubmitting}
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {registrableRoles.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Drivers are registered by Fleet Managers directly.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className={`h-12 rounded-xl border-white/[.1] bg-white/[.04] px-9 text-white placeholder:text-white/30 ${inputFocusClass}`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-[#ff8a13] to-[#ff6700] font-semibold text-[#19110b] shadow-[0_14px_28px_rgba(255,105,0,.2)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(255,105,0,.28)]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      Creating account…
                      <Loader2 className="size-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Register
                      <UserPlus className="size-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                <span>Already registered?</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
