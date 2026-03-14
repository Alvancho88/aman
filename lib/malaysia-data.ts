// Malaysia states and areas data
export const malaysiaStates = [
  {
    name: "Johor",
    areas: ["Johor Bahru", "Muar", "Pasir Gudang", "Kota Tinggi", "Larkin"],
  },
  {
    name: "Kedah",
    areas: ["Alor Setar", "Sungai Petani", "Langkawi", "Kulim"],
  },
  {
    name: "Kelantan",
    areas: ["Kota Bharu", "Tanah Merah", "Pasir Mas", "Tumpat"],
  },
  {
    name: "Kuala Lumpur",
    areas: ["Cheras", "Batu Muda", "KLCC", "Petaling Jaya"],
  },
  {
    name: "Melaka",
    areas: ["Melaka", "Bukit Rambai"],
  },
  {
    name: "Negeri Sembilan",
    areas: ["Seremban", "Port Dickson", "Nilai"],
  },
  {
    name: "Pahang",
    areas: ["Kuantan", "Temerloh", "Balok Baru", "Indera Mahkota"],
  },
  {
    name: "Perak",
    areas: ["Ipoh", "Taiping", "Manjung", "Seri Manjung"],
  },
  {
    name: "Perlis",
    areas: ["Kangar"],
  },
  {
    name: "Penang",
    areas: ["George Town", "Seberang Jaya", "Perai", "USM"],
  },
  {
    name: "Sabah",
    areas: ["Kota Kinabalu", "Sandakan", "Tawau", "Keningau"],
  },
  {
    name: "Sarawak",
    areas: ["Kuching", "Miri", "Sibu", "Bintulu", "Samarahan", "Sarikei"],
  },
  {
    name: "Selangor",
    areas: ["Shah Alam", "Petaling Jaya", "Klang", "Banting", "Kuala Selangor"],
  },
  {
    name: "Terengganu",
    areas: ["Kuala Terengganu", "Kemaman", "Paka"],
  },
  {
    name: "Putrajaya",
    areas: ["Putrajaya"],
  },
  {
    name: "Labuan",
    areas: ["Labuan"],
  },
];

// Mock API data for different locations
export const mockApiData: Record<string, { api: number; lat: number; lng: number }> = {
  // Johor
  "Johor Bahru": { api: 67, lat: 1.4927, lng: 103.7414 },
  "Muar": { api: 54, lat: 2.0442, lng: 102.5689 },
  "Pasir Gudang": { api: 156, lat: 1.4724, lng: 103.8896 }, // Unhealthy (151-200)
  "Kota Tinggi": { api: 45, lat: 1.7381, lng: 103.8999 },
  "Larkin": { api: 72, lat: 1.4833, lng: 103.7333 },
  
  // Kedah
  "Alor Setar": { api: 52, lat: 6.1248, lng: 100.3678 },
  "Sungai Petani": { api: 58, lat: 5.647, lng: 100.4878 },
  "Langkawi": { api: 38, lat: 6.35, lng: 99.8 },
  "Kulim": { api: 61, lat: 5.3647, lng: 100.5617 },
  
  // Kelantan
  "Kota Bharu": { api: 57, lat: 6.1254, lng: 102.2381 },
  "Tanah Merah": { api: 60, lat: 5.8078, lng: 102.1498 },
  "Pasir Mas": { api: 48, lat: 6.0494, lng: 102.1389 },
  "Tumpat": { api: 43, lat: 6.1989, lng: 102.1647 },
  
  // Kuala Lumpur
  "Cheras": { api: 125, lat: 3.1073, lng: 101.7252 }, // Unhealthy for Sensitive Groups (101-150)
  "Batu Muda": { api: 78, lat: 3.2089, lng: 101.6833 },
  "KLCC": { api: 210, lat: 3.1579, lng: 101.7116 }, // Very Unhealthy (201-300)
  "Petaling Jaya": { api: 76, lat: 3.1073, lng: 101.6067 },
  
  // Melaka
  "Melaka": { api: 53, lat: 2.1896, lng: 102.2501 },
  "Bukit Rambai": { api: 49, lat: 2.2631, lng: 102.1739 },
  
  // Negeri Sembilan
  "Seremban": { api: 59, lat: 2.7297, lng: 101.9381 },
  "Port Dickson": { api: 47, lat: 2.5231, lng: 101.7961 },
  "Nilai": { api: 65, lat: 2.8182, lng: 101.7961 },
  
  // Pahang
  "Kuantan": { api: 43, lat: 3.8077, lng: 103.326 },
  "Temerloh": { api: 55, lat: 3.4504, lng: 102.4209 },
  "Balok Baru": { api: 41, lat: 3.9433, lng: 103.3833 },
  "Indera Mahkota": { api: 47, lat: 3.8167, lng: 103.2833 },
  
  // Perak
  "Ipoh": { api: 63, lat: 4.5975, lng: 101.0901 },
  "Taiping": { api: 51, lat: 4.8513, lng: 100.7451 },
  "Manjung": { api: 57, lat: 4.2, lng: 100.6333 },
  "Seri Manjung": { api: 54, lat: 4.2167, lng: 100.6667 },
  
  // Perlis
  "Kangar": { api: 46, lat: 6.4414, lng: 100.1986 },
  
  // Penang
  "George Town": { api: 68, lat: 5.4141, lng: 100.3288 },
  "Seberang Jaya": { api: 64, lat: 5.3961, lng: 100.4019 },
  "Perai": { api: 71, lat: 5.3833, lng: 100.3833 },
  "USM": { api: 62, lat: 5.3575, lng: 100.3019 },
  
  // Sabah
  "Kota Kinabalu": { api: 34, lat: 5.9804, lng: 116.0735 },
  "Sandakan": { api: 40, lat: 5.8402, lng: 118.1179 },
  "Tawau": { api: 36, lat: 4.2498, lng: 117.8871 },
  "Keningau": { api: 32, lat: 5.3378, lng: 116.1604 },
  
  // Sarawak
  "Kuching": { api: 51, lat: 1.5535, lng: 110.3593 },
  "Miri": { api: 39, lat: 4.3995, lng: 113.9914 },
  "Sibu": { api: 54, lat: 2.3, lng: 111.8167 },
  "Bintulu": { api: 45, lat: 3.1667, lng: 113.0333 },
  "Samarahan": { api: 48, lat: 1.4667, lng: 110.4667 },
  "Sarikei": { api: 42, lat: 2.1244, lng: 111.5183 },
  
  // Selangor
  "Shah Alam": { api: 119, lat: 3.0733, lng: 101.5185 }, // Unhealthy for Sensitive Groups (101-150)
  "Klang": { api: 320, lat: 3.0449, lng: 101.4456 }, // Hazardous (301-500)
  "Banting": { api: 56, lat: 2.8167, lng: 101.5 },
  "Kuala Selangor": { api: 49, lat: 3.35, lng: 101.25 },
  
  // Terengganu
  "Kuala Terengganu": { api: 53, lat: 5.3117, lng: 103.1324 },
  "Kemaman": { api: 48, lat: 4.2333, lng: 103.4167 },
  "Paka": { api: 65, lat: 4.6333, lng: 103.4333 },
  
  // Putrajaya & Labuan
  "Putrajaya": { api: 73, lat: 2.9264, lng: 101.6964 },
  "Labuan": { api: 35, lat: 5.2831, lng: 115.2308 },
};

// Get API category info
export function getApiCategory(api: number) {
  if (api <= 50) {
    return {
      level: "Good",
      color: "#00e400",
      bgColor: "bg-green-500",
      textColor: "text-green-700",
      range: "1-50",
      description: "Air quality is satisfactory, and air pollution poses little or no risk.",
    };
  } else if (api <= 100) {
    return {
      level: "Moderate",
      color: "#ffff00",
      bgColor: "bg-yellow-400",
      textColor: "text-yellow-700",
      range: "51-100",
      description: "Air quality is acceptable. However, there may be a risk for some people who are unusually sensitive to air pollution.",
    };
  } else if (api <= 150) {
    return {
      level: "Unhealthy for Sensitive Groups",
      color: "#ff7e00",
      bgColor: "bg-orange-500",
      textColor: "text-orange-700",
      range: "101-150",
      description: "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
    };
  } else if (api <= 200) {
    return {
      level: "Unhealthy",
      color: "#ff0000",
      bgColor: "bg-red-500",
      textColor: "text-red-700",
      range: "151-200",
      description: "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
    };
  } else if (api <= 300) {
    return {
      level: "Very Unhealthy",
      color: "#8f3f97",
      bgColor: "bg-purple-600",
      textColor: "text-purple-700",
      range: "201-300",
      description: "Health alert: The risk of health effects is increased for everyone.",
    };
  } else {
    return {
      level: "Hazardous",
      color: "#7e0023",
      bgColor: "bg-red-900",
      textColor: "text-red-900",
      range: "301-500",
      description: "Health warning of emergency conditions: everyone is more likely to be affected.",
    };
  }
}

// Health advice based on API level
export function getHealthAdvice(api: number): string[] {
  if (api <= 50) {
    return [
      "Air quality is good. Enjoy your outdoor activities!",
      "Perfect time for morning walks and exercises.",
      "No precautions needed.",
    ];
  } else if (api <= 100) {
    return [
      "Air quality is acceptable for most people.",
      "Sensitive individuals should consider reducing prolonged outdoor exertion.",
      "Stay hydrated during outdoor activities.",
    ];
  } else if (api <= 150) {
    return [
      "Elderly individuals should reduce outdoor physical activities.",
      "Consider staying indoors during peak pollution hours.",
      "If you must go out, limit your time outside.",
      "Keep windows and doors closed.",
    ];
  } else if (api <= 200) {
    return [
      "Avoid prolonged outdoor activities.",
      "Elderly individuals should stay indoors.",
      "Use air purifier if available.",
      "Wear N95 mask if going outdoors is necessary.",
      "Seek medical attention if experiencing breathing difficulties.",
    ];
  } else if (api <= 300) {
    return [
      "Stay indoors and avoid all outdoor activities.",
      "Keep all windows and doors closed.",
      "Use air purifier continuously.",
      "Elderly individuals should monitor their health closely.",
      "Seek immediate medical attention if feeling unwell.",
    ];
  } else {
    return [
      "EMERGENCY: Stay indoors at all times.",
      "Do not go outside under any circumstances.",
      "Seek medical help immediately if experiencing any symptoms.",
      "Ensure proper ventilation with air filtration.",
      "Contact emergency services if needed.",
    ];
  }
}

// Map markers data for Malaysia overview
export const mapMarkers = Object.entries(mockApiData).map(([name, data]) => ({
  name,
  api: data.api,
  lat: data.lat,
  lng: data.lng,
  category: getApiCategory(data.api),
}));

// Generate forecast API for next day (mock data)
export function getForecastApi(currentApi: number): number {
  // Simulate forecast variation (-15 to +20)
  const variation = Math.floor(Math.random() * 35) - 15;
  const forecast = Math.max(1, Math.min(500, currentApi + variation));
  return forecast;
}

// Health risk description for forecast (on hover)
export function getForecastHealthRisk(api: number): string {
  if (api <= 50) {
    return "Low health risk expected. Air quality will be satisfactory.";
  } else if (api <= 100) {
    return "Minor health concerns possible for sensitive individuals.";
  } else if (api <= 150) {
    return "May cause respiratory and cardiovascular health risks!";
  } else if (api <= 200) {
    return "Increased risk of respiratory symptoms and breathing difficulties.";
  } else if (api <= 300) {
    return "Serious health effects expected. Risk of respiratory illness increased.";
  } else {
    return "SEVERE health emergency! All individuals at high risk of serious health effects.";
  }
}

// Health guidance for forecast (on hover)
export function getForecastHealthGuidance(api: number): string {
  if (api <= 50) {
    return "Plan your outdoor activities freely tomorrow.";
  } else if (api <= 100) {
    return "Good day for activities, but sensitive groups should monitor conditions.";
  } else if (api <= 150) {
    return "Plan to limit outdoor activities. Consider staying indoors during peak hours.";
  } else if (api <= 200) {
    return "Avoid outdoor activities tomorrow. Keep medication ready if you have respiratory conditions.";
  } else if (api <= 300) {
    return "Stay indoors tomorrow. Prepare air purifier and N95 masks.";
  } else {
    return "Emergency preparation needed. Do not plan any outdoor activities.";
  }
}

// Monthly average API data for seasonal trends (mock data)
export const monthlyTrendsData = {
  "Johor Bahru": [
    { month: "Jan", api: 72 }, { month: "Feb", api: 68 }, { month: "Mar", api: 75 },
    { month: "Apr", api: 65 }, { month: "May", api: 58 }, { month: "Jun", api: 85 },
    { month: "Jul", api: 95 }, { month: "Aug", api: 110 }, { month: "Sep", api: 125 },
    { month: "Oct", api: 88 }, { month: "Nov", api: 70 }, { month: "Dec", api: 65 },
  ],
  "Shah Alam": [
    { month: "Jan", api: 85 }, { month: "Feb", api: 78 }, { month: "Mar", api: 82 },
    { month: "Apr", api: 75 }, { month: "May", api: 68 }, { month: "Jun", api: 95 },
    { month: "Jul", api: 108 }, { month: "Aug", api: 135 }, { month: "Sep", api: 145 },
    { month: "Oct", api: 98 }, { month: "Nov", api: 82 }, { month: "Dec", api: 78 },
  ],
  "Kuala Lumpur": [
    { month: "Jan", api: 80 }, { month: "Feb", api: 75 }, { month: "Mar", api: 78 },
    { month: "Apr", api: 70 }, { month: "May", api: 65 }, { month: "Jun", api: 88 },
    { month: "Jul", api: 102 }, { month: "Aug", api: 128 }, { month: "Sep", api: 138 },
    { month: "Oct", api: 92 }, { month: "Nov", api: 78 }, { month: "Dec", api: 72 },
  ],
  // Default for other areas
  default: [
    { month: "Jan", api: 55 }, { month: "Feb", api: 52 }, { month: "Mar", api: 58 },
    { month: "Apr", api: 50 }, { month: "May", api: 45 }, { month: "Jun", api: 65 },
    { month: "Jul", api: 78 }, { month: "Aug", api: 95 }, { month: "Sep", api: 105 },
    { month: "Oct", api: 72 }, { month: "Nov", api: 58 }, { month: "Dec", api: 52 },
  ],
};

export function getMonthlyTrends(area: string) {
  return monthlyTrendsData[area as keyof typeof monthlyTrendsData] || monthlyTrendsData.default;
}
