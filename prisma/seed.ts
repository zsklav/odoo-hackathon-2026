// Seed demo fleet data so the Dashboard shows real numbers.
// Run:  npx tsx prisma/seed.ts
//
// Standalone Node script (not inside Next.js), so:
//  - loads .env itself (dotenv),
//  - builds its own adapter-backed PrismaClient using DIRECT_URL (:5432 session
//    pooler — reliable for writes),
//  - RELATIVE import to the generated client (tsx doesn't resolve the @/ alias).
//
// NOTE: Trips are NOT seeded — Trip.createdById references a Profile (= a real
// Supabase auth.users row), which only exists once someone signs up. Vehicle
// statuses are set directly so the dashboard KPIs (Active/Available/In-Shop/
// utilization) light up without trips.

import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import {
  PrismaClient,
  VehicleStatus,
  DriverStatus,
  MaintenanceStatus,
  ExpenseType,
} from '../src/generated/prisma/client'

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DIRECT_URL / DATABASE_URL not set in .env — cannot seed.')
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

const daysFromNow = (d: number) => new Date(Date.now() + d * 86_400_000)

async function main() {
  console.log('🌱 Seeding fleet data…')

  // Wipe fleet data for idempotency (leaves profiles / auth.users untouched).
  await prisma.expense.deleteMany()
  await prisma.fuelLog.deleteMany()
  await prisma.maintenanceLog.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.vehicle.deleteMany()

  // --- Vehicles: a spread of statuses so KPIs are non-zero ---
  const vehicles = await Promise.all([
    prisma.vehicle.create({ data: { registrationNumber: 'MH12AB1234', name: 'Tata Prima 01', type: 'Truck', maxLoadCapacity: 25000, odometer: 84210, acquisitionCost: 3500000, region: 'Mumbai', status: VehicleStatus.AVAILABLE } }),
    prisma.vehicle.create({ data: { registrationNumber: 'MH14CD5678', name: 'Ashok Leyland 02', type: 'Truck', maxLoadCapacity: 18000, odometer: 122540, acquisitionCost: 2800000, region: 'Pune', status: VehicleStatus.ON_TRIP } }),
    prisma.vehicle.create({ data: { registrationNumber: 'DL01EF9012', name: 'Mahindra Bolero Van', type: 'Van', maxLoadCapacity: 1500, odometer: 45300, acquisitionCost: 950000, region: 'Delhi', status: VehicleStatus.AVAILABLE } }),
    prisma.vehicle.create({ data: { registrationNumber: 'KA05GH3456', name: 'BharatBenz 03', type: 'Truck', maxLoadCapacity: 31000, odometer: 15980, acquisitionCost: 4200000, region: 'Bangalore', status: VehicleStatus.IN_SHOP } }),
    prisma.vehicle.create({ data: { registrationNumber: 'GJ01IJ7890', name: 'Tata Fuel Tanker', type: 'Tanker', maxLoadCapacity: 20000, odometer: 98120, acquisitionCost: 3900000, region: 'Ahmedabad', status: VehicleStatus.ON_TRIP } }),
    prisma.vehicle.create({ data: { registrationNumber: 'RJ14KL2345', name: 'Eicher Pro 2049', type: 'Truck', maxLoadCapacity: 16000, odometer: 210500, acquisitionCost: 2400000, region: 'Jaipur', status: VehicleStatus.RETIRED } }),
  ])
  const inShop = vehicles[3]

  // --- Drivers: varied statuses + one expired licence + one suspended ---
  await prisma.driver.createMany({
    data: [
      { name: 'Ravi Kumar', licenseNumber: 'MH1220190001234', licenseCategory: 'HMV', licenseExpiryDate: daysFromNow(400), contactNumber: '+91 98200 11111', safetyScore: 92, status: DriverStatus.AVAILABLE },
      { name: 'Priya Sharma', licenseNumber: 'DL0120200005678', licenseCategory: 'LMV', licenseExpiryDate: daysFromNow(220), contactNumber: '+91 98110 22222', safetyScore: 88, status: DriverStatus.ON_TRIP },
      { name: 'Amit Patel', licenseNumber: 'GJ0120180009012', licenseCategory: 'HMV', licenseExpiryDate: daysFromNow(-20), contactNumber: '+91 99250 33333', safetyScore: 74, status: DriverStatus.AVAILABLE }, // expired licence
      { name: 'Suresh Reddy', licenseNumber: 'KA0520210003456', licenseCategory: 'HMV', licenseExpiryDate: daysFromNow(600), contactNumber: '+91 99000 44444', safetyScore: 61, status: DriverStatus.SUSPENDED },
      { name: 'Vikram Singh', licenseNumber: 'RJ1420200007890', licenseCategory: 'HMV', licenseExpiryDate: daysFromNow(320), contactNumber: '+91 99280 55555', safetyScore: 85, status: DriverStatus.ON_TRIP },
    ],
  })

  // --- Maintenance (keeps the IN_SHOP vehicle consistent) ---
  await prisma.maintenanceLog.create({
    data: { vehicleId: inShop.id, description: 'Brake system overhaul + clutch replacement', cost: 68000, status: MaintenanceStatus.OPEN },
  })

  // --- Fuel logs ---
  await prisma.fuelLog.createMany({
    data: [
      { vehicleId: vehicles[0].id, liters: 52, cost: 4680 },
      { vehicleId: vehicles[1].id, liters: 60, cost: 5400 },
      { vehicleId: vehicles[4].id, liters: 75, cost: 6750 },
    ],
  })

  // --- Expenses (ExpenseType: TOLL / MAINTENANCE / OTHER) ---
  await prisma.expense.createMany({
    data: [
      { vehicleId: vehicles[1].id, type: ExpenseType.TOLL, cost: 1350 },
      { vehicleId: inShop.id, type: ExpenseType.MAINTENANCE, cost: 68000 },
      { vehicleId: vehicles[0].id, type: ExpenseType.OTHER, cost: 800 },
    ],
  })

  console.log('✅ Seed complete: 6 vehicles (2 on-trip · 2 available · 1 in-shop · 1 retired), 5 drivers, 1 maintenance, 3 fuel logs, 3 expenses.')
  console.log('   Dashboard → Fleet Utilization should read 40% (2 of 5 operational on trip).')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
