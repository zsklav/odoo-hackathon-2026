"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BellRing, Building2, Loader2, Settings, ShieldCheck, UserRound } from "lucide-react";

type Profile = {
  fullName: string;
  email: string;
  role: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/settings").then(async (response) => {
      if (response.ok) setProfile(await response.json());
    });
  }, []);

  if (!profile) return <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-orange-400"><Loader2 className="size-5 animate-spin" /></div>;

  const roleName = profile.role.split("_").map((word) => word[0] + word.slice(1).toLowerCase()).join(" ");
  const initials = profile.fullName.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase();

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <Link href={`/dashboard?role=${profile.role}&tab=dashboard`} className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"><ArrowLeft className="size-4" />Back to dashboard</Link>
        <div className="mt-8 overflow-hidden rounded-[28px] border border-white/[.08] bg-[#111317] shadow-2xl shadow-black/30">
          <div className="h-32 bg-[radial-gradient(circle_at_75%_20%,rgba(255,122,0,.45),transparent_30%),linear-gradient(125deg,#1e293b,#111317_65%)]" />
          <div className="relative px-6 pb-7 sm:px-8"><div className="absolute -top-12 flex size-24 items-center justify-center rounded-[28px] border-4 border-[#111317] bg-gradient-to-br from-orange-300 to-orange-600 text-2xl font-bold text-[#24130a] shadow-xl">{initials}</div><div className="pt-16"><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-orange-400">TransitOps workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{profile.fullName}</h1><p className="mt-1 text-sm text-white/50">{profile.email}</p></div><div className="mt-7 grid gap-3 sm:grid-cols-3"><Info icon={ShieldCheck} label="Workspace role" value={roleName} /><Info icon={BellRing} label="In-app alerts" value={profile.inAppNotifications ? "Enabled" : "Muted"} /><Info icon={Building2} label="Organization" value="TransitOps" /></div></div>
        </div>
        <div className="mt-4 flex flex-col justify-between gap-4 rounded-2xl border border-white/[.08] bg-[#111317]/90 p-5 sm:flex-row sm:items-center"><div><p className="font-medium">Manage your workspace</p><p className="mt-1 text-sm text-white/45">Update your name and notification preferences.</p></div><Link href="/settings" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white/[.06] px-4 text-sm font-medium text-white transition hover:bg-white/[.1]"><Settings className="size-4" />Open settings</Link></div>
      </div>
    </main>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return <div className="rounded-2xl border border-white/[.08] bg-white/[.035] p-4"><Icon className="size-4 text-orange-400" /><p className="mt-5 text-[10px] font-semibold uppercase tracking-[.14em] text-white/40">{label}</p><p className="mt-1 text-sm font-medium text-white">{value}</p></div>;
}
