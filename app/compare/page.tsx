"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
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

export default function ComparePage() {
  const [leftState, setLeftState] = useState("")
  const [leftArea, setLeftArea] = useState("")
  const [rightState, setRightState] = useState("")
  const [rightArea, setRightArea] = useState("")

  const leftAreas = useMemo(() => {
    const stateData = malaysiaStates.find((s) => s.name === leftState)
    return stateData?.areas ?? []
  }, [leftState])

  const rightAreas = useMemo(() => {
    const stateData = malaysiaStates.find((s) => s.name === rightState)
    return stateData?.areas ?? []
  }, [rightState])

  const leftApi = leftArea ? mockApiData[leftArea]?.api : undefined
  const rightApi = rightArea ? mockApiData[rightArea]?.api : undefined

  const leftCategory = leftApi !== undefined ? getApiCategory(leftApi) : null
  const rightCategory = rightApi !== undefined ? getApiCategory(rightApi) : null

  const diff = leftApi !== undefined && rightApi !== undefined ? leftApi - rightApi : null

  const swapSides = () => {
    setLeftState(rightState)
    setLeftArea(rightArea)
    setRightState(leftState)
    setRightArea(leftArea)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          
          <Link href="/">
            <div className="flex items-center gap-4 cursor-pointer">
              <div className="bg-white rounded-xl overflow-hidden w-12 h-12 flex items-center justify-center border border-sky-100 shadow-sm">
                <Image
                  src="/icon.png"
                  alt="AMAN logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-sky-500" />
                <h1 className="text-2xl font-bold text-sky-900">Compare</h1>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <NavigationBar />
            <Button asChild variant="ghost" className="text-sky-700 hover:bg-sky-50">
              <Link href="/">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
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
                          {malaysiaStates.map((state) => (
                            <SelectItem key={state.name} value={state.name} className="text-base py-3">
                              {state.name}
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
                <div className="flex flex-row lg:flex-col items-center justify-center gap-3 pt-10">
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
                          {malaysiaStates.map((state) => (
                            <SelectItem key={state.name} value={state.name} className="text-base py-3">
                              {state.name}
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
                    <p className="text-sky-900 font-semibold text-lg">
                      {leftArea}{leftState ? `, ${leftState}` : ""}
                    </p>
                    {leftApi === undefined ? (
                      <p className="text-muted-foreground mt-2">Select a state and area to view API.</p>
                    ) : (
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-5xl font-extrabold mt-2" style={{ color: leftCategory?.color ?? "#0ea5e9" }}>
                            {leftApi}
                          </p>
                          <p className="text-lg font-semibold mt-1" style={{ color: leftCategory?.color ?? "#0ea5e9" }}>
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
                    <p className="text-sky-900 font-semibold text-lg">
                      {rightArea}{rightState ? `, ${rightState}` : ""}
                    </p>
                    {rightApi === undefined ? (
                      <p className="text-muted-foreground mt-2">Select a state and area to view API.</p>
                    ) : (
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-5xl font-extrabold mt-2" style={{ color: rightCategory?.color ?? "#0ea5e9" }}>
                            {rightApi}
                          </p>
                          <p className="text-lg font-semibold mt-1" style={{ color: rightCategory?.color ?? "#0ea5e9" }}>
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
                    <p className="text-muted-foreground mt-2">Choose both locations to compare.</p>
                  ) : (
                    <div className="mt-3">
                      <div className="mt-3 text-sky-900 font-semibold text-lg">
                        {diff === 0 ? (
                          `${leftArea} and ${rightArea} have the same API right now.`
                        ) : diff > 0 ? (
                          <>
                            {leftArea} has <span className="font-bold text-red-600">higher</span> pollution than {rightArea}.
                          </>
                        ) : (
                          <>
                            {leftArea} has <span className="font-bold text-emerald-600">lower</span> pollution than {rightArea}.
                          </>
                        )}
                      </div>
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

