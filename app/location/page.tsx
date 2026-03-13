"use client"

import React, { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { ArrowLeft, Wind, AlertTriangle, Heart, MapPin, Clock, ThermometerSun, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockApiData, getApiCategory, getHealthAdvice, mapMarkers, getForecastHealthRisk, getForecastHealthGuidance } from "@/lib/malaysia-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { NavigationBar } from "@/components/navigation-bar"

// Dynamic import for Leaflet map (client-side only)
const MalaysiaMap = dynamic(() => import("@/components/malaysia-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-sky-100 flex items-center justify-center">
      <div className="text-sky-600 text-lg">Loading map...</div>
    </div>
  ),
})

function LocationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [time, setTime] = useState("")
  
  useEffect(() => {
    const now = new Date().toLocaleString("en-MY", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
    setTime(now)
  }, [])

  const state = searchParams.get("state") || ""
  const area = searchParams.get("area") || ""
  
  // Get API data for selected area
  const apiData = mockApiData[area] || { api: 50, lat: 3.1390, lng: 101.6869 }
  const category = getApiCategory(apiData.api)
  const healthAdvice = getHealthAdvice(apiData.api)
  const showWarning = apiData.api >= 100
  
  // Forecast data for next day (using consistent seed based on area name)
  const forecastApi = React.useMemo(() => {
    // Generate a deterministic forecast based on area name
    const seed = area.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variation = ((seed % 35) - 15);
    return Math.max(1, Math.min(500, apiData.api + variation));
  }, [area, apiData.api]);
  
  const forecastCategory = getApiCategory(forecastApi);
  const forecastHealthRisk = getForecastHealthRisk(forecastApi);
  const forecastHealthGuidance = getForecastHealthGuidance(forecastApi);

  // Get nearby markers for the zoomed map
  const nearbyMarkers = mapMarkers
    .filter(m => {
      const latDiff = Math.abs(m.lat - apiData.lat)
      const lngDiff = Math.abs(m.lng - apiData.lng)
      return latDiff < 2 && lngDiff < 2
    })
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-sky-700 hover:text-sky-900 hover:bg-sky-50"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-lg">Back to Map</span>
              </Button>
              <div className="h-8 w-px bg-sky-200" />
              <div className="flex items-center gap-2">
                <Wind className="h-6 w-6 text-sky-500" />
                <span className="text-xl font-semibold text-sky-900">Air Quality Details</span>
              </div>
            </div>
            <NavigationBar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Location Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sky-600 mb-1">
            <MapPin className="h-5 w-5" />
            <span className="text-lg">{state}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-sky-900">
            {area} Air Quality
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - API Information */}
          <div className="space-y-6">
            {/* API Value Card */}
            <Card className="overflow-hidden shadow-lg border-0">
              <div
                className="p-4"
                style={{ backgroundColor: category.color }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black/70 text-lg mb-1">Current API</p>
                    <p className="text-7xl md:text-8xl font-bold text-black">
                      {apiData.api}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl md:text-3xl font-semibold text-black">
                      {category.level}
                    </p>
                    <p className="text-black/70 mt-2">
                      Range: {category.range}
                    </p>
                  </div>
                </div>
              </div>
              <CardContent className="px-6 pt-1 pb-3 bg-white space-y-1">
                <p className="text-lg text-foreground leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Updated: {time}</span>
                  <span className="mx-2">|</span>
                  <ThermometerSun className="h-4 w-4" />
                  <span>Temperature: 28°C</span>
                </div>
              </CardContent>
            </Card>

            {/* Next Day Forecast */}
            <Card className="shadow-lg border-sky-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-sky-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-sky-500" />
                  Next Day Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-pointer hover:opacity-90 transition-opacity">
                        <div className="flex items-center gap-4">
                          <div
                            className="px-6 py-4 rounded-xl text-black font-bold text-4xl shadow-lg"
                            style={{ backgroundColor: forecastCategory.color }}
                          >
                            {forecastApi}
                          </div>
                          <div className="flex-1">
                            <p
                              className="text-2xl font-semibold"
                              style={{ color: forecastCategory.color }}
                            >
                              {forecastCategory.level}
                            </p>
                            <p className="text-muted-foreground">
                              Tomorrow's Expected Air Quality
                            </p>
                            <p className="text-sm text-sky-600 mt-1">
                              Hover for health guidance
                            </p>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-sm p-4 bg-white border shadow-xl">
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-red-600 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Health Risk Warning
                          </p>
                          <p className="text-foreground mt-1">{forecastHealthRisk}</p>
                        </div>
                        <div className="border-t pt-2">
                          <p className="font-semibold text-sky-700 flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            Health Guidance
                          </p>
                          <p className="text-foreground mt-1">{forecastHealthGuidance}</p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>

            {/* Health Advice */}
            <Card className="shadow-lg border-sky-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-sky-900 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Health Advice for You
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {healthAdvice.map((advice, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-lg text-foreground"
                    >
                      <span
                        className="mt-2 w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="leading-relaxed">{advice}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Warning Alert - Only show when API >= 100 */}
            {showWarning && (
              <Card className="shadow-lg border-0 bg-gradient-to-r from-red-500 to-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <AlertTriangle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        ⚠️ Warning!!! Dangerous Polluted Air Outside!
                      </h3>
                      <p className="text-white/90 text-lg">
                        The air quality in your area is currently at an unhealthy level. 
                        Elderly individuals and those with respiratory conditions should 
                        avoid outdoor activities.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}            

            {/* View Pollution Trends Link */}
            <Link 
              href={`/trends?state=${encodeURIComponent(state)}&area=${encodeURIComponent(area)}`}
              className="block"
            >
              <Card className="shadow-lg border-sky-100 hover:border-sky-300 hover:shadow-xl transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-sky-100 p-3 rounded-full">
                        <TrendingUp className="h-6 w-6 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-sky-900">View Seasonal Trends</p>
                        <p className="text-muted-foreground">See monthly air quality patterns</p>
                      </div>
                    </div>
                    <ArrowLeft className="h-6 w-6 text-sky-400 rotate-180" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* API Level Guide */}
            <Card className="shadow-lg border-sky-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-sky-900">
                  Air Quality Index Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
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
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        category.level === item.level ? "ring-2 ring-offset-2 ring-sky-500" : ""
                      }`}
                      style={{ backgroundColor: item.color }}
                    >
                      <span className="font-medium text-black">{item.level}</span>
                      <span className="text-black/80">{item.range}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Zoomed Map */}
          <div className="lg:sticky lg:top-6 h-fit">
            <Card className="shadow-lg border-sky-100 overflow-hidden">
              <CardHeader className="pb-3 bg-white">
                <CardTitle className="text-xl text-sky-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-sky-500" />
                  {area}, {state}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Real Zoomed Map using Leaflet */}
                <div className="h-[400px] md:h-[500px]">
                  <MalaysiaMap
                    markers={[
                      { name: area, api: apiData.api, lat: apiData.lat, lng: apiData.lng },
                      ...nearbyMarkers.filter(m => m.name !== area).map(m => ({
                        name: m.name,
                        api: m.api,
                        lat: m.lat,
                        lng: m.lng,
                      }))
                    ]}
                    center={[apiData.lat, apiData.lng]}
                    zoom={11}
                    highlightArea={area}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-sky-900 text-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sky-200">
            Data source: AQICN Malaysia Air Quality Data | Designed for elderly residents
          </p>
          <p className="text-sky-300 mt-2 text-sm">
            © 2026 AMAN - FIT5120 TM02 Quintet
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function LocationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <div className="text-center">
          <Wind className="h-12 w-12 text-sky-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-sky-700">Loading air quality data...</p>
        </div>
      </div>
    }>
      <LocationContent />
    </Suspense>
  )
}
