"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const required = ["registrationNumber", "name", "type", "maxLoadCapacity", "acquisitionCost", "region"];

function splitCsv(line: string) {
  return line.match(/("(?:[^"]|"")*"|[^,]*)(?:,|$)/g)?.map((cell) => cell.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"').trim()) ?? [];
}

export function VehicleCsvImport() {
  const inputRef = useRef<HTMLInputElement>(null); const router = useRouter();
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function upload(file: File) {
    setBusy(true); setMessage("");
    const lines = (await file.text()).split(/\r?\n/).filter(Boolean);
    const header = splitCsv(lines[0] ?? "");
    if (!required.every((field) => header.includes(field))) { setMessage("CSV needs: registrationNumber, name, type, maxLoadCapacity, acquisitionCost, region."); setBusy(false); return; }
    const records = lines.slice(1).map((line) => Object.fromEntries(header.map((key, index) => [key, splitCsv(line)[index] ?? ""])));
    const results = await Promise.all(records.map(async (record) => {
      const response = await fetch("/api/vehicles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...record, maxLoadCapacity: Number(record.maxLoadCapacity), acquisitionCost: Number(record.acquisitionCost), odometer: record.odometer ? Number(record.odometer) : 0, status: record.status || "AVAILABLE" }) });
      return response.ok;
    }));
    const created = results.filter(Boolean).length; setMessage(`${created} of ${records.length} vehicle records imported.`); setBusy(false); router.refresh();
  }
  return <div className="relative"><input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.currentTarget.value = ""; }} /><button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="flex items-center gap-2 rounded-md border border-orange-400/40 px-4 py-2 text-sm font-medium text-orange-500 transition hover:bg-orange-500/10 disabled:opacity-50"><Upload className="h-4 w-4" />{busy ? "Importing…" : "Import CSV"}</button>{message && <p className="absolute right-0 top-11 z-20 w-72 rounded-lg border border-white/10 bg-[#171a20] p-2 text-xs text-white shadow-xl">{message}</p>}</div>;
}
