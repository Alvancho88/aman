"use server"

import { getMonthlyTrends } from "@/lib/queries"

export async function fetchMonthlyTrends(area: string) {
  console.log("fetchMonthlyTrends called with:", area)
  const data = await getMonthlyTrends(area)
  console.log("result:", data)
  return data
}