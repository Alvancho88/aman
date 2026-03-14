import { getLatestAPI } from "@/lib/queries";
import HomePageClient from "./home-client"; // Import from the same folder

export default async function Page() {
  // Fetch real data from Neon/Drizzle
  const realData = await getLatestAPI();

  // Pass it to your UI component
  return <HomePageClient initialData={realData} />;
}