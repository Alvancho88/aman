"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Info, HeartPulse, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NavigationBar } from "@/components/navigation-bar"

export default function InformationPage() {
  const router = useRouter()
  const aqiTable = [
    { range: "1–50", label: "Good", impact: "Safe", color: "#00e400" },
    { range: "51–100", label: "Moderate", impact: "Acceptable", color: "#ffff00" },
    { range: "101–150", label: "Unhealthy for sensitive groups", impact: "Elderly / children affected", color: "#ff7e00" },
    { range: "151–200", label: "Unhealthy", impact: "Everyone affected", color: "#ff0000" },
    { range: "201–300", label: "Very Unhealthy", impact: "Serious health effects", color: "#8f3f97" },
    { range: "301–500", label: "Hazardous", impact: "Emergency conditions", color: "#7e0023" },
  ]

  const recommendations = [
    {
      title: "Good (1–50)",
      color: "#00e400",
      items: ["Enjoy outdoor activities as normal.", "Keep windows open for fresh air if comfortable."],
    },
    {
      title: "Moderate (51–100)",
      color: "#ffff00",
      items: ["Most people can continue normal activities.", "If you feel breathless, take breaks indoors."],
    },
    {
      title: "Unhealthy for sensitive groups (101–150)",
      color: "#ff7e00",
      items: [
        "Elderly and people with heart/lung disease should reduce outdoor activity.",
        "Wear a well-fitting mask if you must go outside.",
        "Use air purifier/close windows during peak pollution.",
      ],
    },
    {
      title: "Unhealthy (151–200)",
      color: "#ff0000",
      items: [
        "Avoid outdoor exercise; stay indoors if possible.",
        "Wear a mask when outside; limit time outdoors.",
        "Monitor symptoms (cough, chest tightness, dizziness).",
      ],
    },
    {
      title: "Very Unhealthy (201–300)",
      color: "#8f3f97",
      items: [
        "Stay indoors; keep windows closed.",
        "Use air purifier if available.",
        "Seek medical advice if you have breathing difficulties.",
      ],
    },
    {
      title: "Hazardous (301–500)",
      color: "#7e0023",
      items: [
        "Emergency conditions: avoid going outside.",
        "If you must go out, use the best available mask and keep it brief.",
        "Consider relocating to cleaner indoor air (community centers/clinics) if needed.",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white shadow-sm border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-4">
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
              <Info className="h-6 w-6 text-sky-500" />
              <h1 className="text-2xl font-bold text-sky-900">Information</h1>
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
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <HeartPulse className="h-7 w-7 text-sky-600" />
                <h2 className="text-2xl font-bold text-sky-900">AQI levels and health impact</h2>
              </div>
              <p className="text-sky-900">
                AMAN uses the Air Quality Index (AQI) to describe how clean or polluted the air is, and what it means for your health.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left">
                      <th className="py-3 px-4 border-b border-sky-100 text-sky-900 font-bold">AQI</th>
                      <th className="py-3 px-4 border-b border-sky-100 text-sky-900 font-bold">Air Quality</th>
                      <th className="py-3 px-4 border-b border-sky-100 text-sky-900 font-bold">Health Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aqiTable.map((row) => (
                      <tr key={row.range} className="align-top">
                        <td className="py-3 px-4 border-b border-sky-50 font-semibold">
                          <span className="inline-flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: row.color }} />
                            {row.range}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-b border-sky-50 font-semibold">{row.label}</td>
                        <td className="py-3 px-4 border-b border-sky-50">{row.impact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-sky-100">
            <CardContent className="p-8 space-y-5">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-7 w-7 text-sky-600" />
                <h2 className="text-2xl font-bold text-sky-900">What should I do at each level?</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.title}
                    className="rounded-xl border border-sky-100 bg-white shadow-sm overflow-hidden"
                  >
                    <div className="p-4 font-bold text-sky-900 flex items-center gap-3" style={{ backgroundColor: `${rec.color}22` }}>
                      <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: rec.color }} />
                      {rec.title}
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {rec.items.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <span className="mt-2 w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

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

