import { timestamptz } from "drizzle-orm/gel-core";
import { pgTable, serial, text, integer, timestamp, doublePrecision, varchar, decimal, date } from "drizzle-orm/pg-core";

// Table 1: Station Details (Static Info)
export const stations = pgTable("stations", {
  stationId: integer("station_id").primaryKey(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
});

// Table 2: Realtime API Data (Logged Info)
export const realtimeApi = pgTable("realtime_api", {
  id: serial("id").primaryKey(),
  stationId: integer("station_id").references(() => stations.stationId),
  api: integer("api").notNull(),
  forecastApi: integer("forecast_api").notNull(),
  temperature: decimal("temperature"),
  updateTime: timestamp("updateTime"),
});

// Table 3: Historical API Data (Static Info)
export const historicalApi = pgTable("historical_api", {
  id: serial("id").primaryKey(),
  stationId: integer("station_id").references(() => stations.stationId),
  month: integer("month").notNull(), // Store month as integer (1-12)
  monthlyAvgApi: integer("monthly_avg_api").notNull(),
});