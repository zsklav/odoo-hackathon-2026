"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import { AuthBrandingPanel } from "@/components/auth/auth-branding-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/lib/supabase/client";
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

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(registrableRoles[0].value);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    setErrorMessage(null);
    setSuccessMessage(null);

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      return;
    }

    setSuccessMessage("Account created. Check your email to confirm, then sign in.");
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
              <h1 className="text-2xl font-bold">Create an account</h1>
              <p className="mt-1 text-sm text-muted-foreground">Join TransitOps today.</p>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-primary/50 bg-primary/10 p-3 text-sm text-primary">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                <p>{successMessage}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    id="name"
                    className="pl-8"
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
                <Label htmlFor="role">Select Role</Label>
                <Select value={role} onValueChange={(value) => value && setRole(value)}>
                  <SelectTrigger id="role" className="w-full" disabled={isSubmitting}>
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

              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
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
  );
}
