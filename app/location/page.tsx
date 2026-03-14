import { getLatestAPI } from "@/lib/queries";
import LocationClient from "./location-client"; // Import from the same folder
import { Suspense } from "react";
import { Wind } from "lucide-react";


export default async function Page(props: {searchParams: Promise<{ state?: string; area?: string }>;}) {

  const searchParams = await props.searchParams;
  const { state, area } = searchParams;

  // Fetch real data from Neon/Drizzle
  const allData = await getLatestAPI();

  // Find the specific city matching the search parameter
  const selectedData = allData.find(
    (d) => d.city?.toLowerCase() === searchParams.area?.toLowerCase()
  );
  
  console.log("Selected :", searchParams)
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        <div className="text-center">
          <Wind className="h-12 w-12 text-sky-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-sky-700">Loading air quality data...</p>
        </div>
      </div>
    }>
      <LocationClient initialData={selectedData} allData={allData} searchState={state} searchArea={area}/>
    </Suspense>
  )
}