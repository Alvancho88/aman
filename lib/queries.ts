import { db } from "@/db"; // adjust path to your db folder
import { realtimeApi, stations, historicalApi } from "@/db/schema";
import { desc, eq, sql, avg, min, max, and, gte, lte, asc, ilike } from "drizzle-orm";

export async function getLatestAPI() {
  const data = await db
    .select({
      id: realtimeApi.id,
      state: stations.state,
      city: stations.city,
      api: realtimeApi.api,
      forecastApi: realtimeApi.forecastApi,
      temperature: realtimeApi.temperature,
      updateTime: realtimeApi.updateTime,
      latitude: stations.latitude,
      longitude: stations.longitude
    })
    .from(realtimeApi)
    .leftJoin(stations, eq(realtimeApi.stationId, stations.stationId))
    .orderBy(desc(realtimeApi.id))
    .limit(63); // Adjust based on how many stations

  return data;
}

export async function getMonthlyTrends(area: string) {
  const data = await db
    .select({
      // Match these keys to what your TrendsClient is expecting
      monthIndex: historicalApi.month, 
      avgApi: historicalApi.monthlyAvgApi,
      state: stations.state,
      city: stations.city,
    })
    .from(historicalApi)
    .leftJoin(stations, eq(historicalApi.stationId, stations.stationId))
    .where(ilike(stations.city, `%${area}%`))
    .orderBy(asc(historicalApi.month)); // This ensures Jan (1) to Dec (12)

  return data;
}