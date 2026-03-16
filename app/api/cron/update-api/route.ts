import { db } from "@/db";
import { stations, realtimeApi } from "@/db/schema";
import { eq } from "drizzle-orm";
import { malaysia_station } from "@/db/station-data";
import { request } from "https";

export async function POST(request: Request) {
  const API_TOKEN = process.env.AQICN_TOKEN;
  const CRON_SECRET = process.env.CRON_SECRET;

  // Security Check
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!API_TOKEN) {
    return Response.json({ error: "AQICN_TOKEN is missing" }, { status: 500 });
  }

  const manualOverrides: Record<string, number> = {
    "Klang": 125,
    "Tangkak": 201,
  }

  try {
    for (const loc of malaysia_station) {
      const response = await fetch(`https://api.waqi.info/feed/@${loc.stationId}/?token=${API_TOKEN}`);
      const result = await response.json();

      if (result.status === "ok") {
        const data = result.data;

        // Update/insert station (update if exists, insert if new)
        const [station] = await db.insert(stations)
            .values({
                stationId: loc.stationId,
                state: loc.state,
                city: loc.city,
                latitude: data.city.geo[0],
                longitude: data.city.geo[1],
            })
          .onConflictDoUpdate({
            target: stations.stationId,
            set: { latitude: data.city.geo[0], longitude: data.city.geo[1] },
          })
          .returning();
        
        // Get Tomorrow's date in YYYY-MM-DD format
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toLocaleDateString('en-CA', {timeZone: 'Asia/Kuala_Lumpur'});;

        // Find tomorrow's PM2.5 average in the forecast array
        const pm25Forecast = data.forecast.daily.pm25 || [];
        const nextDayData = pm25Forecast.find((d: any) => d.day === tomorrowString);

        // Extract the average (avg)
        const forecastAvg = nextDayData ? nextDayData.avg : null;

        console.log(`Current: ${data.aqi}, Forecast for ${tomorrowString}: ${forecastAvg}`);

        const malaysianTime = new Date((data.time.s).replace(" ", "T") + "+08:00");

        const finalAqi = manualOverrides[loc.city] ?? data.aqi

        // Add new realtime reading
        await db.insert(realtimeApi).values({
          stationId: station.stationId,
          api: finalAqi,
          forecastApi: forecastAvg,
          temperature: data.iaqi.t.v,
          updateTime: malaysianTime
        });
        console.log(`Current: ${finalAqi}, Forecast for ${tomorrowString}: ${forecastAvg}`);
      }
    }

    return Response.json({ message: "Successfully updated cities" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}