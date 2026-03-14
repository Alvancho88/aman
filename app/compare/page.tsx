import { getLatestAPI } from "@/lib/queries";
import ComparisonClient from "./comparison-client"; // Import from the same folder


export default async function Page() {
  // Fetch real data from Neon/Drizzle
  const realData = await getLatestAPI();

  // Pass it to your UI component
  return <ComparisonClient initialData={realData} />;
}