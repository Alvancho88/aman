"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NavigationBar } from "@/components/navigation-bar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { malaysiaStates, mapMarkers, mockApiData, getApiCategory } from "@/lib/malaysia-data"

// Dynamic import for Leaflet map (client-side only)
const MalaysiaMap = dynamic(() => import("@/components/malaysia-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-sky-100 flex items-center justify-center">
      <div className="text-sky-600 text-lg">Loading map...</div>
    </div>
  ),
})

// Add this to match Drizzle result
interface APIData {
    id: number,
    state: string | null,
    city: string| null,
    api: number,
    forecastApi: number,
    updateTime: Date| null,
    latitude: number| null,
    longitude: number| null
}

export default function HomePage({ initialData }: { initialData: APIData[] }) {
  const router = useRouter()
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedArea, setSelectedArea] = useState<string>("")
  const [areas, setAreas] = useState<string[]>([])

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setSelectedArea("")
    const stateData = malaysiaStates.find((s) => s.name === state)
    setAreas(stateData?.areas || [])
  }

  const handleSearch = () => {
    if (selectedState && selectedArea) {
      router.push(`/location?state=${encodeURIComponent(selectedState)}&area=${encodeURIComponent(selectedArea)}`)
    }
  }

  // Get all unique states from your DB results
  const uniqueStates = Array.from(new Set(initialData.map(d => d.state).filter(Boolean))).sort();

  // Get areas based on what the user picked in the first dropdown
  const filteredAreas = initialData
    .filter((d) => d.state === selectedState)
    .map((d) => d.city)
    .filter(Boolean).sort() as string[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/">
              <div className="flex items-center gap-4 cursor-pointer">
                <div className="bg-white rounded-xl overflow-hidden w-14 h-14 flex items-center justify-center border border-sky-100 shadow-sm">
                  <Image
                    src="/aman-logo.png"
                    alt="AMAN logo"
                    width={56}
                    height={56}
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-sky-900">
                    AMAN
                  </h1>
                  <p className="text-sky-800 text-base md:text-lg font-medium">
                    Air Monitoring and Notification
                  </p>
                </div>
              </div>
            </Link>
            <div className="flex items-center">
              <NavigationBar />
            </div>
          </div>
        </div>
      </header>

      {/* Search Panel */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="bg-white shadow-lg border-sky-100">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-xl font-semibold text-sky-900 mb-4">
              Select Your Location
            </h2>
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
                        value={state!}
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
                    {filteredAreas.map((area) => (
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

              {/* Search Button */}
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  disabled={!selectedState || !selectedArea}
                  className="h-14 px-8 text-lg bg-sky-500 hover:bg-sky-600 text-white"
                >
                  <Search className="h-5 w-5 mr-2" />
                  View Air Quality
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <Card className="bg-white shadow-lg border-sky-100 overflow-hidden">
          <CardContent className="p-0">
            {/* Real Map Container using Leaflet */}
            <div className="h-[300px] sm:h-[400px] md:h-[600px]">
              <MalaysiaMap
                markers={initialData.map((data) => ({
                  name: data.city ?? "Unknown Station",
                  api: data.api,
                  lat: data.latitude ?? 4.21,
                  lng: data.longitude ?? 108.97,
                }))}
                center={[4.2105, 108.9758]}
                zoom={6}
                onMarkerClick={(marker) => {
                  // Find the state for this area
                  const realStation = initialData.find(d => d.city === marker.name);
                  if (realStation && realStation.state) {
                    router.push(`/location?state=${encodeURIComponent(realStation.state)}&area=${encodeURIComponent(marker.name)}`)
                  }
                }}
              />
            </div>

            {/* Legend */}
            <div className="p-4 bg-white border-t border-sky-100">
              <h3 className="text-lg font-semibold text-sky-900 mb-3">Air Quality Index Legend</h3>
              <div className="flex flex-wrap gap-2 md:gap-4">
                {[
                  { label: "Good", range: "1-50", color: "#00e400" },
                  { label: "Moderate", range: "51-100", color: "#ffff00" },
                  { label: "Unhealthy for Sensitive Groups", range: "101-150", color: "#ff7e00" },
                  { label: "Unhealthy", range: "151-200", color: "#ff0000" },
                  { label: "Very Unhealthy", range: "201-300", color: "#903f97" },
                  { label: "Hazardous", range: "301-500", color: "#7e0024" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex flex-wrap items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm ${
                      item.label === "Hazardous" || item.label === "Very Unhealthy"
                        ? "text-white"
                        : "text-black"
                    }`}
                    style={{ backgroundColor: item.color }}
                  >
                    <span>{item.label}</span>
                    <span className="opacity-80">({item.range})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-sky-900 text-white py-6">
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
