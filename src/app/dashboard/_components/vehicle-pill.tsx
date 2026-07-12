const TONES: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  ON_TRIP: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  IN_SHOP: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  RETIRED: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
}

const LABELS: Record<string, string> = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  IN_SHOP: 'In Shop',
  RETIRED: 'Retired',
}

export function VehiclePill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        TONES[status] ?? TONES.RETIRED
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  )
}
