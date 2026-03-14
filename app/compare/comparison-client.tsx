"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRightLeft, BarChart3, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavigationBar } from "@/components/navigation-bar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { malaysiaStates, mockApiData, getApiCategory } from "@/lib/malaysia-data"
import { cn } from "@/lib/utils"

export default function ComparePage({ initialData }: { initialData: any[] }) {
  const router = useRouter()
  const [leftState, setLeftState] = useState("")
  const [leftArea, setLeftArea] = useState("")
  const [rightState, setRightState] = useState("")
  const [rightArea, setRightArea] = useState("")

  // Generate dynamic state list from database
  const uniqueStates = Array.from(new Set(initialData.map(d => d.state).filter(Boolean))).sort();

  const leftAreas = initialData
    .filter((s) => s.state === leftState)
    .map((s) => s.city)
    .filter(Boolean).sort();

  const rightAreas = initialData
    .filter((s) => s.state === rightState)
    .map((s) => s.city)
    .filter(Boolean).sort();

  // Look up the API value from the real data array
  const leftStation = initialData.find(s => s.city === leftArea);
  const rightStation = initialData.find(s => s.city === rightArea);

  const leftApi = leftStation?.api
  const rightApi = rightStation?.api

  const leftCategory = leftApi !== undefined ? getApiCategory(leftApi) : null
  const rightCategory = rightApi !== undefined ? getApiCategory(rightApi) : null

  const diff = leftApi !== undefined && rightApi !== undefined ? leftApi - rightApi : null

  const swapSides = () => {
    setLeftState(rightState)
    setLeftArea(rightArea)
    setRightState(leftState)
    setRightArea(leftArea)
  }

  // Persist last comparison in localStorage so it survives navigation
  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem("aman-compare-state")
    if (!stored) return
    try {
      const parsed = JSON.parse(stored) as {
        leftState?: string
        leftArea?: string
        rightState?: string
        rightArea?: string
      }
      if (parsed.leftState) setLeftState(parsed.leftState)
      if (parsed.leftArea) setLeftArea(parsed.leftArea)
      if (parsed.rightState) setRightState(parsed.rightState)
      if (parsed.rightArea) setRightArea(parsed.rightArea)
    } catch {
      // ignore bad data
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const payload = JSON.stringify({ leftState, leftArea, rightState, rightArea })
    window.localStorage.setItem("aman-compare-state", payload)
  }, [leftState, leftArea, rightState, rightArea])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
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
              <BarChart3 className="h-6 w-6 text-sky-500" />
              <h1 className="text-2xl font-bold text-sky-900">Compare</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NavigationBar />
            <Button
              type="button"
              variant="ghost"
              className="text-sky-700 hover:bg-sky-50"
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <Card className="shadow-lg border-sky-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl text-sky-900">Compare air quality between two locations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-start">
                {/* Left selector */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sky-700 font-semibold">
                    <MapPin className="h-5 w-5" />
                    Location A
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-base font-semibold text-sky-900 mb-2">State</label>
                      <Select
                        value={leftState}
                        onValueChange={(v) => {
                          setLeftState(v)
                          setLeftArea("")
                        }}
                      >
                        <SelectTrigger className="w-full h-14 text-base border-sky-200 focus:ring-sky-500">
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueStates.map((stateName) => (
                            <SelectItem key={stateName} value={stateName} className="text-base py-3">
                              {stateName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-sky-900 mb-2">Area</label>
                      <Select
                        value={leftArea}
                        onValueChange={setLeftArea}
                        disabled={!leftState}
                      >
                        <SelectTrigger className="w-full h-14 text-base border-sky-200 focus:ring-sky-500">
                          <SelectValue placeholder={leftState ? "Select an area" : "Select a state first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {leftAreas.map((area) => (
                            <SelectItem key={area} value={area} className="text-base py-3">
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Middle actions */}
                <div className="flex flex-row lg:flex-col items-center justify-center gap-3 pt-12">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex items-center gap-2 text-sky-900 hover:bg-transparent shadow-none"
                    onClick={swapSides}
                  >
                    <ArrowRightLeft className="h-5 w-5" />
                    Swap
                  </Button>
                </div>

                {/* Right selector */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sky-700 font-semibold">
                    <MapPin className="h-5 w-5" />
                    Location B
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-base font-semibold text-sky-900 mb-2">State</label>
                      <Select
                        value={rightState}
                        onValueChange={(v) => {
                          setRightState(v)
                          setRightArea("")
                        }}
                      >
                        <SelectTrigger className="w-full h-14 text-base border-sky-200 focus:ring-sky-500">
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueStates.map((stateName) => (
                            <SelectItem key={stateName} value={stateName} className="text-base py-3">
                              {stateName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-base font-semibold text-sky-900 mb-2">Area</label>
                      <Select
                        value={rightArea}
                        onValueChange={setRightArea}
                        disabled={!rightState}
                      >
                        <SelectTrigger className="w-full h-14 text-base border-sky-200 focus:ring-sky-500">
                          <SelectValue placeholder={rightState ? "Select an area" : "Select a state first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {rightAreas.map((area) => (
                            <SelectItem key={area} value={area} className="text-base py-3">
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-sky-100 shadow-sm">
                  <CardContent className="p-6">
                    {leftApi === undefined ? (
                      <p className="text-muted-foreground mt-2">Select a state and area to view API.</p>
                    ) : (
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xl font-semibold text-sky-900">
                            {leftArea}{leftState ? `, ${leftState}` : ""}
                          </p>
                          <p
                            className="mt-3 text-6xl font-extrabold px-4 py-2 rounded-xl inline-block shadow-md"
                            style={{
                              backgroundColor:
                                leftCategory?.level === "Moderate"
                                  ? "#ffff00"
                                  : leftCategory?.color ?? "#0ea5e9",
                              color: "#000000",
                            }}
                          >
                            {leftApi}
                          </p>
                          <p
                            className="text-lg font-semibold mt-2"
                            style={{
                              color: leftCategory?.level === "Moderate"
                                ? "#e6c200"
                                : leftCategory?.color ?? "#0ea5e9",
                            }}
                          >
                            {leftCategory?.level}
                          </p>
                        </div>
                        <div className="text-right">
                          <Link
                            className="inline-flex items-center gap-2 text-sky-800 font-semibold hover:underline"
                            href={`/location?state=${encodeURIComponent(leftState)}&area=${encodeURIComponent(leftArea)}`}
                          >
                            View details
                          </Link>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-sky-100 shadow-sm">
                  <CardContent className="p-6">
                    {rightApi === undefined ? (
                      <p className="text-muted-foreground mt-2">Select a state and area to view API.</p>
                    ) : (
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xl font-semibold text-sky-900">
                            {rightArea}{rightState ? `, ${rightState}` : ""}
                          </p>
                          <p
                            className="mt-3 text-6xl font-extrabold px-4 py-2 rounded-xl inline-block shadow-md"
                            style={{
                              backgroundColor:
                                rightCategory?.level === "Moderate"
                                  ? "#ffff00"
                                  : rightCategory?.color ?? "#0ea5e9",
                              color: "#000000",
                            }}
                          >
                            {rightApi}
                          </p>
                          <p
                            className="text-lg font-semibold mt-2"
                            style={{
                              color: rightCategory?.level === "Moderate"
                                ? "#e6c200"
                                : rightCategory?.color ?? "#0ea5e9",
                            }}
                          >
                            {rightCategory?.level}
                          </p>
                        </div>
                        <div className="text-right">
                          <Link
                            className="inline-flex items-center gap-2 text-sky-800 font-semibold hover:underline"
                            href={`/location?state=${encodeURIComponent(rightState)}&area=${encodeURIComponent(rightArea)}`}
                          >
                            View details
                          </Link>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="border-sky-100 shadow-sm">
                <CardContent className="p-6">
                  {diff === null ? (
                    <p className="text-muted-foreground text-center text-lg">
                      Choose both locations to compare.
                    </p>
                  ) : (
                    <div className="mt-2 text-center">
                      {diff === 0 ? (
                        <p className="text-xl font-semibold text-sky-900">
                          Both locations have the same API right now.
                        </p>
                      ) : (
                        <p className="text-2xl font-bold text-sky-900">
                          Location A is{" "}
                          <span
                            className={cn(
                              "px-1 rounded-md",
                              diff > 0 ? "bg-red-600 text-white" : "bg-emerald-600 text-white",
                            )}
                          >
                            {diff > 0 ? "more polluted" : "cleaner"}
                          </span>{" "}
                          than Location B.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
