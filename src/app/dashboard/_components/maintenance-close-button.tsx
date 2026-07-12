"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function MaintenanceCloseButton({ id, closed }: { id: string; closed: boolean }) {
  const router = useRouter(); const [saving, setSaving] = useState(false);
  async function closeLog() { setSaving(true); const response = await fetch(`/api/maintenance/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "close" }) }); setSaving(false); if (response.ok) router.refresh(); }
  if (closed) return null;
  return <AlertDialog><AlertDialogTrigger render={<button className="text-slate-400 transition-colors hover:text-orange-500" aria-label="Close maintenance log" />}><Wrench className="h-4 w-4" /></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Close maintenance log?</AlertDialogTitle><AlertDialogDescription>This marks the repair complete and restores availability unless the vehicle is retired.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel><AlertDialogAction onClick={closeLog} disabled={saving}>{saving ? "Closing…" : "Close maintenance"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>;
}
