"use client"

import React, { Suspense, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Wind, TrendingUp, MapPin, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { malaysiaStates, getMonthlyTrends, getApiCategory } from "@/lib/malaysia-data"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts"
import { NavigationBar } from "@/components/navigation-bar"

export default function TrendsContent({ initialData }: { initialData: any[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const initialState = searchParams.get("state") || ""
  const initialArea = searchParams.get("area") || ""
  
  const [selectedState, setSelectedState] = useState(initialState)
  const [selectedArea, setSelectedArea] = useState(initialArea)

    const uniqueStates = React.useMemo(() => {
    return Array.from(new Set(initialData.map(d => d.state).filter(Boolean))).sort();
  }, [initialData]);

  const areas = React.useMemo(() => {
    if (!selectedState) return [];
    return Array.from(new Set(
      initialData
        .filter((d) => d.state?.trim().toLowerCase() === selectedState.trim().toLowerCase())
        .map((d) => d.city)
        .filter(Boolean)
    )).sort() as string[];
  }, [selectedState, initialData]);

  // Restore last selected trend location (only if URL has no location)
  useEffect(() => {
    if (typeof window === "undefined") return

    // If the page was opened with a specific location (from Location page),
    // do NOT override it with localStorage memory
    if (initialState && initialArea) return

    const stored = window.localStorage.getItem("aman-trend-state")
    if (!stored) return

    try {
      const parsed = JSON.parse(stored)

      if (parsed.state) setSelectedState(parsed.state)
      if (parsed.area) setSelectedArea(parsed.area)

    } catch {
      // ignore
    }
  }, [initialState, initialArea])

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setSelectedArea("")
  }

  // Save trend selection
  useEffect(() => {
    if (typeof window === "undefined") return

    const payload = JSON.stringify({
      state: selectedState,
      area: selectedArea,
    })

    window.localStorage.setItem("aman-trend-state", payload)
  }, [selectedState, selectedArea])

  const trendsData = selectedArea ? getMonthlyTrends(selectedArea) : null

  // Add color category to each data point
  const enrichedData = trendsData?.map(item => ({
    ...item,
    color: getApiCategory(item.api).color,
    category: getApiCategory(item.api).level,
  }))

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      const api = payload[0].value
      const category = getApiCategory(api)
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-sky-100">
          <p className="font-semibold text-sky-900">{label}</p>
          <div className="flex items-center gap-2 mt-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <p className="text-lg font-bold" style={{ color: category.color }}>
              API: {api}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{category.level}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="bg-white rounded-xl overflow-hidden w-14 h-14 flex items-center justify-center border border-sky-100 shadow-sm cursor-pointer">
                <Image
                  src="/aman-logo.png"
                  alt="AMAN home"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-sky-500" />
              <h1 className="text-2xl font-bold text-sky-900">Pollution Trends</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NavigationBar />
            <Button
              type="button"
              variant="ghost"
              className="text-sky-700 hover:text-sky-900 hover:bg-sky-50"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back()
                } else {
                  router.push("/")
                }
              }}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-lg">Back</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-sky-900">
            Seasonal Pollution Trends
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            View monthly average air quality patterns for your selected location
          </p>
        </div>

        {/* Location Selector */}
        <Card className="bg-white shadow-lg border-sky-100 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* State Dropdown */}
              <div className="flex-1">
                <label className="block text-lg font-medium text-sky-800 mb-2">
                  State
                </label>
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger className="w-full h-14 text-lg border-sky-200 focus:ring-sky-500">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueStates.map((state) => (
                      <SelectItem
                        key={state}
                        value={state}
                        className="text-lg py-3"
                      >
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Area Dropdown */}
              <div className="flex-1">
                <label className="block text-lg font-medium text-sky-800 mb-2">
                  Area
                </label>
                <Select
                  value={selectedArea}
                  onValueChange={setSelectedArea}
                  disabled={!selectedState}
                >
                  <SelectTrigger className="w-full h-14 text-lg border-sky-200 focus:ring-sky-500">
                    <SelectValue placeholder={selectedState ? "Select an area" : "Select a state first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem
                        key={area}
                        value={area}
                        className="text-lg py-3"
                      >
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trends Chart */}
        {selectedArea && enrichedData ? (
          <div className="space-y-6">
            {/* Location Header */}
            <div className="flex items-center gap-2 text-sky-600">
              <MapPin className="h-5 w-5" />
              <span className="text-lg font-medium">{selectedArea}, {selectedState}</span>
            </div>

            {/* Line Chart */}
            <Card className="shadow-lg border-sky-100">
              <CardHeader>
                <CardTitle className="text-xl text-sky-900">
                  Monthly Average Air Quality Index (API)
                </CardTitle>
                <CardDescription>
                  Historical monthly averages showing seasonal pollution patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={enrichedData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: "#0c4a6e", fontSize: 14 }}
                        axisLine={{ stroke: "#0ea5e9" }}
                      />
                      <YAxis 
                        tick={{ fill: "#0c4a6e", fontSize: 14 }}
                        axisLine={{ stroke: "#0ea5e9" }}
                        domain={[0, 200]}
                        label={{ 
                          value: "API Value", 
                          angle: -90, 
                          position: "insideLeft",
                          fill: "#0c4a6e"
                        }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      
                      {/* Reference lines for API levels */}
                      <ReferenceLine y={50} stroke="#00e400" strokeDasharray="5 5" label={{ value: "Good (50)", fill: "#00e400", fontSize: 12 }} />
                      <ReferenceLine y={100} stroke="#ffff00" strokeDasharray="5 5" label={{ value: "Moderate (100)", fill: "#d4a800", fontSize: 12 }} />
                      <ReferenceLine y={150} stroke="#ff7e00" strokeDasharray="5 5" label={{ value: "Unhealthy Sensitive (150)", fill: "#ff7e00", fontSize: 12 }} />
                      
                      <Line
                        type="monotone"
                        dataKey="api"
                        name="Monthly Average API"
                        stroke="#0ea5e9"
                        strokeWidth={3}
                        dot={{ fill: "#0ea5e9", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: "#0369a1" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Seasonal Analysis */}
            <Card className="shadow-lg border-sky-100">
              <CardHeader>
                <CardTitle className="text-xl text-sky-900 flex items-center gap-2">
                  <Info className="h-5 w-5 text-sky-500" />
                  Seasonal Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-sky-50 rounded-lg">
                    <p className="font-semibold text-sky-900">Best Air Quality Period</p>
                    <p className="text-lg text-sky-700">
                      {enrichedData.reduce((min, curr) => curr.api < min.api ? curr : min).month}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Lowest average API during this month
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="font-semibold text-orange-900">Worst Air Quality Period</p>
                    <p className="text-lg text-orange-700">
                      {enrichedData.reduce((max, curr) => curr.api > max.api ? curr : max).month}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Highest average API during this month
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg md:col-span-2">
                    <p className="font-semibold text-amber-900">Haze Season Alert</p>
                    <p className="text-amber-700">
                      Typically August to October shows higher pollution levels due to regional haze season. 
                      Plan outdoor activities accordingly and monitor daily forecasts during these months.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Level Legend */}
            <Card className="shadow-lg border-sky-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-sky-900">
                  Air Quality Index Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {[
                    { level: "Good", range: "1-50", color: "#00e400" },
                    { level: "Moderate", range: "51-100", color: "#ffff00" },
                    { level: "Unhealthy for Sensitive Groups", range: "101-150", color: "#ff7e00" },
                    { level: "Unhealthy", range: "151-200", color: "#ff0000" },
                    { level: "Very Unhealthy", range: "201-300", color: "#8f3f97" },
                    { level: "Hazardous", range: "301-500", color: "#7e0023" },
                  ].map((item) => (
                    <div
                      key={item.level}
                      className="flex flex-col items-center p-3 rounded-lg text-black text-center"
                      style={{ backgroundColor: item.color }}
                    >
                      <span className="font-medium text-sm">{item.level}</span>
                      <span className="text-xs opacity-70">{item.range}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="shadow-lg border-sky-100">
            <CardContent className="p-12 text-center">
              <TrendingUp className="h-16 w-16 text-sky-300 mx-auto mb-4" />
              <p className="text-xl text-sky-700 font-medium">
                Select a state and area to view pollution trends
              </p>
              <p className="text-muted-foreground mt-2">
                The chart will display monthly average air quality patterns
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-sky-900 text-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sky-200">
            Data source: AQICN Malaysia Air Quality Data | Designed for elderly residents
          </p>
          <p className="text-sky-300 mt-2 text-sm">
            2026 Malaysia Air Quality Monitor - FIT5120 TM02 Quintet
          </p>
        </div>
      </footer>
    </div>
  )
}
