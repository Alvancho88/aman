"use client"

import React, { Suspense } from "react"
import Image from "next/image"
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

export default function LocationContent({ initialData, allData, searchState, searchArea }: { initialData: any, allData: any[], searchState?: String, searchArea?: String }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const state = searchState || initialData?.state || ""
  const area = searchArea || initialData?.area || ""
  
  // Get API data for selected area
  const apiData = initialData || { api: 50, lat: 3.1390, lng: 101.6869 }
  const category = getApiCategory(apiData.api)
  const healthAdvice = getHealthAdvice(apiData.api)
  const showWarning = apiData.api >= 100
  
  const forecastApiValue = apiData.forecastApi || 50;
  
  const forecastCategory = getApiCategory(forecastApiValue);
  const forecastHealthRisk = getForecastHealthRisk(forecastApiValue);
  const forecastHealthGuidance = getForecastHealthGuidance(forecastApiValue);

  const showForecastWarning = forecastApiValue >= 101

  // Get nearby markers for the zoomed map
  const nearbyMarkers = allData
    .filter(m => {
      const latDiff = Math.abs(m.latitude - apiData.latitude)
      const lngDiff = Math.abs(m.longitude - apiData.longitude)
      return latDiff < 2 && lngDiff < 2
    })
    .slice(0, 5)

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
            <div className="flex flex-wrap items-center gap-2">
              <Wind className="h-6 w-6 text-sky-500" />
              <h1 className="text-2xl font-bold text-sky-900">Air Quality Details</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
              <NavigationBar />
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (typeof window !== "undefined" && window.history.length > 1) {
                    router.back()
                  } else {
                    router.push("/")
                  }
                }}
                className="text-sky-700 hover:text-sky-900 hover:bg-sky-50"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-lg">Back</span>
              </Button>
            </div>
          </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Location Title */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 text-sky-600 mb-1">
            <MapPin className="h-5 w-5" />
            <span className="text-lg">{state}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-sky-900">
            {area} Air Quality
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Panel - API Information */}
          <div className="space-y-6">
            {/* API Value Card + summary */}
            <Card className="overflow-hidden shadow-lg border-0">
              <div
                className="p-4 md:p-6"
                style={{ backgroundColor: category.color }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black/70 text-lg mb-1">Current AQI</p>
                    <p className="text-5xl sm:text-6xl md:text-8xl font-bold text-black">
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
              <CardContent className="p-4 bg-white">
                <div className="space-y-3">

                  {/* Description first */}
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-lg text-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Updated row */}
                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Updated: {apiData.updateTime.toLocaleString("en-MY", { 
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                    <span className="mx-2">|</span>
                    <ThermometerSun className="h-4 w-4" />
                    <span>Temperature: {apiData.temperature}°C</span>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Next Day Forecast */}
            <Card className="shadow-lg border-sky-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-sky-900 flex flex-wrap items-center gap-2">
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
                            className="px-6 py-4 rounded-xl text-black font-bold text-3xl sm:text-4xl shadow-lg"
                            style={{ backgroundColor: forecastCategory.color }}
                          >
                            {forecastApiValue}
                          </div>
                          <div className="flex-1">
                            <p
                              className="text-2xl font-semibold"
                              style={{
                                color:
                                  forecastCategory.level === "Moderate"
                                    ? "#e6c400"
                                    : forecastCategory.color,
                              }}
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
                    <TooltipContent side="bottom" className="w-fit max-w-[600px] p-4 bg-white border shadow-xl">
                      <div className="space-y-3">

                        {showForecastWarning && (
                          <div>
                            <p className="font-semibold text-red-600 flex flex-wrap items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Health Risk Warning
                            </p>
                            <p className="text-foreground mt-1 whitespace-normal leading-relaxed">
                              {forecastHealthRisk}
                            </p>
                          </div>
                        )}

                        <div className={showForecastWarning ? "border-t pt-2" : ""}>
                          <p className="font-semibold text-sky-700 flex flex-wrap items-center gap-2">
                            <Heart className="h-4 w-4" />
                            Health Guidance
                          </p>
                          <p className="text-foreground mt-1 whitespace-normal leading-relaxed">
                            {forecastHealthGuidance}
                          </p>
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
                <CardTitle className="text-xl text-sky-900 flex flex-wrap items-center gap-2">
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
                        style={{
                          backgroundColor:
                            category.level === "Moderate"
                              ? "#e6c200"
                              : category.color,
                        }}
                      />
                      <span className="leading-relaxed">{advice}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* View Pollution Trends Link */}
            <Link 
              href={`/trends?state=${encodeURIComponent(state)}&area=${encodeURIComponent(area)}`}
              className="block"
            >
              <Card className="shadow-lg border-sky-100 hover:border-sky-300 hover:shadow-xl transition-all cursor-pointer">
                <CardContent className="p-4 md:p-6">
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
                  ].map((item) => {
                    const isDark =
                      item.level === "Hazardous" || item.level === "Very Unhealthy"

                    return (
                      <div
                        key={item.level}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          category.level === item.level ? "ring-2 ring-offset-2 ring-sky-500" : ""
                        } ${isDark ? "text-white" : "text-black"}`}
                        style={{ backgroundColor: item.color }}
                      >
                        <span className="font-medium">{item.level}</span>
                        <span className={isDark ? "text-white/80" : "text-black/80"}>
                          {item.range}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Zoomed Map */}
          <div className="lg:sticky lg:bottom-6 lg:self-end h-fit space-y-6">

          {/* Warning Alert - Only show when API >= 100 */}
            {showWarning && (
              <Card className="shadow-lg border-0 bg-gradient-to-r from-red-500 to-orange-500">
                <CardContent className="p-4 md:p-6">
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

            <Card className="shadow-lg border-sky-100 overflow-hidden">
              <CardHeader className="pb-3 bg-white">
                <CardTitle className="text-xl text-sky-900 flex flex-wrap items-center gap-2">
                  <MapPin className="h-5 w-5 text-sky-500" />
                  {area}, {state}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Real Zoomed Map using Leaflet */}
                <div className="h-[280px] sm:h-[380px] md:h-[500px]">
                  <MalaysiaMap
                    markers={allData.map(m => ({
                      name: m.city,
                      api: m.api,
                      lat: m.latitude,
                      lng: m.longitude,
                    }))}
                    center={[apiData.latitude, apiData.longitude]}
                    zoom={11}
                    highlightArea={area}
                    onMarkerClick={(marker) => {
                      router.push(`/location?area=${encodeURIComponent(marker.name)}`)
                    }}
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
