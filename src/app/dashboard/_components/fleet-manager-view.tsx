import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { VehicleStatus, TripStatus, DriverStatus } from '@/generated/prisma/client'
import { StatCard } from './stat-card'
import { FilterBar } from './filter-bar'
import { VehiclePill } from './vehicle-pill'

const VALID_STATUS = new Set<string>(Object.values(VehicleStatus))

type Search = { type?: string; status?: string; region?: string }

export async function FleetManagerView({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const sp = await searchParams

  const vehicleWhere = {
    ...(sp.type ? { type: sp.type } : {}),
    ...(sp.status && VALID_STATUS.has(sp.status)
      ? { status: sp.status as VehicleStatus }
      : {}),
    ...(sp.region ? { region: sp.region } : {}),
  }

  let data:
    | {
        total: number
        active: number
        available: number
        inShop: number
        retired: number
        activeTrips: number
        pendingTrips: number
        driversOnDuty: number
        totalDrivers: number
        types: string[]
        regions: string[]
        vehicles: Awaited<ReturnType<typeof prisma.vehicle.findMany>>
      }
    | null = null
  let loadError: string | null = null

  try {
    const [
      total,
      active,
      available,
      inShop,
      retired,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      totalDrivers,
      typeRows,
      regionRows,
      vehicles,
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: VehicleStatus.ON_TRIP } }),
      prisma.vehicle.count({ where: { status: VehicleStatus.AVAILABLE } }),
      prisma.vehicle.count({ where: { status: VehicleStatus.IN_SHOP } }),
      prisma.vehicle.count({ where: { status: VehicleStatus.RETIRED } }),
      prisma.trip.count({ where: { status: TripStatus.DISPATCHED } }),
      prisma.trip.count({ where: { status: TripStatus.DRAFT } }),
      prisma.driver.count({
        where: {
          status: { in: [DriverStatus.AVAILABLE, DriverStatus.ON_TRIP] },
        },
      }),
      prisma.driver.count(),
      prisma.vehicle.findMany({
        distinct: ['type'],
        select: { type: true },
        orderBy: { type: 'asc' },
      }),
      prisma.vehicle.findMany({
        distinct: ['region'],
        select: { region: true },
        orderBy: { region: 'asc' },
      }),
      prisma.vehicle.findMany({
        where: vehicleWhere,
        orderBy: { registrationNumber: 'asc' },
      }),
    ])

    data = {
      total,
      active,
      available,
      inShop,
      retired,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      totalDrivers,
      types: typeRows.map((r) => r.type),
      regions: regionRows.map((r) => r.region),
      vehicles,
    }
  } catch (e) {
    console.error(e)
    loadError = 'Could not load fleet manager data.'
  }

  const operational = data ? data.total - data.retired : 0
  const utilization =
    data && operational > 0 ? Math.round((data.active / operational) * 100) : 0

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
          Fleet Manager Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Live fleet operations at a glance.
        </p>
      </div>

      {loadError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          {loadError}
        </div>
      ) : data ? (
        <>
          {/* KPI cards — global snapshot */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard icon="🚚" label="Active Vehicles" value={data.active} accent="blue" sub="on trip" />
            <StatCard icon="🚛" label="Available" value={data.available} accent="green" sub="ready to dispatch" />
            <StatCard icon="🔧" label="In Maintenance" value={data.inShop} accent="amber" sub="in shop" />
            <StatCard icon="🗺️" label="Active Trips" value={data.activeTrips} accent="blue" sub="dispatched" />
            <StatCard icon="📋" label="Pending Trips" value={data.pendingTrips} sub="draft" />
            <StatCard icon="🧑‍✈️" label="Drivers On Duty" value={data.driversOnDuty} accent="green" sub={`of ${data.totalDrivers} total`} />
          </div>

          {/* Fleet utilization bar */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Fleet Utilization
              </h2>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {utilization}%
              </span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${utilization}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {data.active} of {operational} operational vehicles on trip
              {data.retired > 0 && ` (${data.retired} retired excluded)`}.
            </p>
          </div>

          {/* Filterable fleet table */}
          <div className="mt-8">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Fleet{' '}
                <span className="text-sm font-normal text-gray-400">
                  ({data.vehicles.length})
                </span>
              </h2>
              <FilterBar types={data.types} regions={data.regions} />
            </div>

            {data.vehicles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 py-14 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                No vehicles match these filters.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-100 text-xs uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Reg. No</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Region</th>
                      <th className="px-4 py-3 font-medium">Capacity</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {data.vehicles.map((v) => (
                      <tr
                        key={v.id}
                        className="bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                          {v.registrationNumber}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{v.name}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{v.type}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{v.region}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                          {v.maxLoadCapacity.toLocaleString('en-IN')} kg
                        </td>
                        <td className="px-4 py-3">
                          <VehiclePill status={v.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </>
  )
}
