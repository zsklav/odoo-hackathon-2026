"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

type Vehicle = {
  id: string;
  registrationNumber: string;
};

export function LogMaintenanceButton({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const vehicleId = formData.get("vehicleId") as string;
    const description = formData.get("description") as string;
    const cost = parseFloat(formData.get("cost") as string);
    if (!vehicleId || !description || isNaN(cost)) {
      setError("Please fill out all fields correctly.");
      setIsSubmitting(false);
      return;
    }

    const response = await fetch("/api/maintenance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vehicleId, description, cost }) });
    const result = await response.json();
    if (response.ok) {
      setIsOpen(false);
      router.refresh();
    } else {
      setError(result.error || "An error occurred.");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md bg-[#f58f29] px-4 py-2 text-sm font-bold text-orange-950 transition-colors hover:bg-[#e07f20]"
      >
        <Plus className="h-4 w-4" />
        Log Maintenance
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-[#1e293b]">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
              Log Maintenance
            </h2>
            
            {error && (
              <div className="mb-4 rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Vehicle
                </label>
                <select
                  name="vehicleId"
                  required
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Select a vehicle...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Date
                </label>
                <input
                  type="date"
                  name="openedAt"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  placeholder="Describe the issue or service performed..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Estimated Cost ($)
                </label>
                <input
                  type="number"
                  name="cost"
                  step="0.01"
                  min="0"
                  required
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  placeholder="0.00"
                />
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-[#f58f29] px-4 py-2 text-sm font-bold text-orange-950 hover:bg-[#e07f20] disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
