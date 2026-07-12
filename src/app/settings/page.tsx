"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BellRing, Check, Loader2, ShieldCheck, UserRound } from "lucide-react";

type Settings = {
  fullName: string;
  email: string;
  role: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(async (response) => {
      if (!response.ok) return;
      const data = await response.json();
      setSettings(data);
      setName(data.fullName);
    });
  }, []);

  async function save(updates: Partial<Settings>) {
    if (!settings) return;
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates) });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) { setMessage(data.error ?? "Unable to save settings."); return; }
    setSettings((current) => current ? { ...current, ...data } : current);
    setMessage("Changes saved");
  }

  if (!settings) return <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-white"><Loader2 className="size-5 animate-spin text-orange-400" /></div>;

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <Link href={`/dashboard?role=${settings.role}&tab=dashboard`} className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"><ArrowLeft className="size-4" />Back to dashboard</Link>
        <div className="mt-8"><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-orange-400">Workspace preferences</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Settings</h1><p className="mt-2 text-sm text-white/50">Manage your account and how TransitOps keeps you informed.</p></div>
        <div className="mt-8 space-y-4">
          <section className="rounded-2xl border border-white/[.08] bg-[#111317]/90 p-6 shadow-2xl shadow-black/20"><div className="flex items-center gap-3"><span className="rounded-xl bg-orange-500/10 p-2 text-orange-400"><UserRound className="size-5" /></span><div><h2 className="font-semibold">Profile</h2><p className="text-sm text-white/45">Your workspace identity.</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr]"><label className="text-sm text-white/65">Full name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/[.1] bg-white/[.04] px-3 text-white outline-none focus:border-orange-400" /></label><div className="text-sm text-white/65">Work email<div className="mt-2 flex h-11 items-center rounded-xl border border-white/[.08] bg-white/[.025] px-3 text-white/55">{settings.email}</div></div></div><div className="mt-4 flex items-center justify-between"><span className="text-xs uppercase tracking-[.14em] text-white/35">{settings.role.replaceAll("_", " ")}</span><button onClick={() => save({ fullName: name })} disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-semibold text-black disabled:opacity-60">{saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}Save profile</button></div></section>
          <section className="rounded-2xl border border-white/[.08] bg-[#111317]/90 p-6 shadow-2xl shadow-black/20"><div className="flex items-center gap-3"><span className="rounded-xl bg-blue-500/10 p-2 text-blue-400"><BellRing className="size-5" /></span><div><h2 className="font-semibold">Notifications</h2><p className="text-sm text-white/45">Get notified when colleagues add fleet activity.</p></div></div><div className="mt-5 divide-y divide-white/[.08]"><Preference label="In-app notifications" detail="Show shared fleet, driver, trip, fuel, and expense activity." checked={settings.inAppNotifications} onChange={(inAppNotifications) => save({ inAppNotifications })} /><Preference label="Email notifications" detail="Reserve email delivery for connected mail infrastructure." checked={settings.emailNotifications} onChange={(emailNotifications) => save({ emailNotifications })} /></div></section>
          <section className="rounded-2xl border border-white/[.08] bg-[#111317]/90 p-6"><div className="flex gap-3"><span className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400"><ShieldCheck className="size-5" /></span><div><h2 className="font-semibold">Role-based access</h2><p className="mt-1 text-sm leading-6 text-white/50">Your workspace role controls which operations and records you can access. Contact a Fleet Administrator for role changes.</p></div></div></section>
        </div>
        {message && <p className="mt-4 text-sm text-orange-300">{message}</p>}
      </div>
    </main>
  );
}

function Preference({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex cursor-pointer items-center justify-between gap-6 py-4"><span><span className="block text-sm font-medium">{label}</span><span className="mt-1 block text-xs leading-5 text-white/45">{detail}</span></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-orange-500" /></label>;
}
