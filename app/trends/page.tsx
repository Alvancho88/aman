import { getLatestAPI, getMonthlyTrends } from "@/lib/queries";
import TrendsClient from "./trends-client"; // Import from the same folder
import { Suspense } from "react";
import { Wind } from "lucide-react";

export default async function TrendsPage() {
  const data = await getLatestAPI();
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <div className="text-center">
          <Wind className="h-12 w-12 text-sky-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-sky-700">Loading trends data...</p>
        </div>
      </div>
    }>
      <TrendsClient initialData={data}/>
    </Suspense>
  )
}