import Link from 'next/link'

export function SafetyOfficerView() {
  return (
    <>
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← TransitOps
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
          Safety Officer Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Monitor driver compliance and safety metrics.
        </p>
      </div>
      
      <div className="rounded-xl border border-dashed border-gray-300 py-14 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Driver compliance table coming soon...
      </div>
    </>
  )
}
