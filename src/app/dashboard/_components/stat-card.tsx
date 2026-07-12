import type { ReactNode } from 'react'

const ACCENTS: Record<string, string> = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  amber: 'text-amber-600 dark:text-amber-400',
  gray: 'text-gray-900 dark:text-white',
}

export function StatCard({
  icon,
  label,
  value,
  sub,
  accent = 'gray',
}: {
  icon: string
  label: string
  value: ReactNode
  sub?: ReactNode
  accent?: keyof typeof ACCENTS
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <p className={`mt-1 text-2xl font-bold ${ACCENTS[accent]}`}>{value}</p>
      {sub && (
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{sub}</p>
      )}
    </div>
  )
}
