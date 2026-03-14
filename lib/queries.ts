import { db } from "@/db"; // adjust path to your db folder
import { realtimeApi, stations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

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
    .limit(63); // Adjust based on how many stations you have

  return data;
}