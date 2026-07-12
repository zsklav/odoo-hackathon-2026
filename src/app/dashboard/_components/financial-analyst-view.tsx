import Link from 'next/link'

export function FinancialAnalystView() {
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
          Financial Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Track expenses, fuel costs, and overall fleet ROI.
        </p>
      </div>
      
      <div className="rounded-xl border border-dashed border-gray-300 py-14 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Expense tracking and ROI charts coming soon...
      </div>
    </>
  )
}
