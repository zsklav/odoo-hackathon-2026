"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMaintenanceLog(data: {
  vehicleId: string;
  description: string;
  cost: number;
}) {
  try {
    await prisma.maintenanceLog.create({
      data: {
        vehicleId: data.vehicleId,
        description: data.description,
        cost: data.cost,
        status: "OPEN",
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to log maintenance:", error);
    return { success: false, error: "Failed to create maintenance log." };
  }
}
