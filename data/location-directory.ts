import { SITE_COORDINATES } from "@/lib/data";

const LOCATION_DIRECTORY_POINTS = [
  { name: "Singasandra", category: "Metro", position: [77.64485, 12.88082] as const },
  { name: "Hosa Road", category: "Metro", position: [77.6524806, 12.8707806] as const },
  { name: "Pralaksha Hospital", category: "Healthcare", position: [77.66393985717232, 12.871021389993068] as const },
  { name: "Kudlu Gate", category: "Metro", position: [77.6418, 12.8924] as const },
  { name: "Springleaf Hospital", category: "Healthcare", position: [77.67140700013509, 12.87774340276273] as const },
  { name: "Vimalalaya Hospital", category: "Healthcare", position: [77.67750367432815, 12.872053651605189] as const },
  { name: "Oxford College of Engineering", category: "Education", position: [77.64871429439617, 12.89501834719073] as const },
  { name: "Dayananda Sagar University", category: "Education", position: [77.66963780011484, 12.875821912110874] as const },
  { name: "St. Francis School", category: "Education", position: [77.65216646993393, 12.889249551513036] as const },
  { name: "Ekana Multi Specialty Hospital", category: "Healthcare", position: [77.64336182692122, 12.871276908854627] as const },
  { name: "National Public School", category: "Education", position: [77.68602820707807, 12.88402231773768] as const },
  { name: "Hongasandra", category: "Metro", position: [77.65300965777664, 12.895465952997672] as const },
  { name: "Manipal Clinic", category: "Healthcare", position: [77.63523595142371, 12.864652309490513] as const },
  { name: "Bommanahalli", category: "Metro", position: [77.64782668058473, 12.904077736538795] as const },
  { name: "HSR Layout", category: "Areas", position: [77.66298215593662, 12.911692993764753] as const },
  { name: "PES University", category: "Education", position: [77.68616790744267, 12.856236444506083] as const },
  { name: "Rainbow Children Hospital", category: "Healthcare", position: [77.62393437931574, 12.900062912907996] as const },
  { name: "Sri Chaitanya Techno School", category: "Education", position: [77.61670284377723, 12.881529525891933] as const },
  { name: "St. Xavier's Institute of Management", category: "Education", position: [77.68786981897873, 12.865159940409317] as const },
  { name: "Hulimavu", category: "Metro", position: [77.61988592634476, 12.88547204108686] as const },
  { name: "Apollo Hospital", category: "Healthcare", position: [77.618730702018, 12.894292922117252] as const },
  { name: "Infosys", category: "IT Parks", position: [77.66450449564371, 12.85789561097206] as const },
  { name: "Bosch", category: "IT Parks", position: [77.6605949528747, 12.855518963719126] as const },
  { name: "HSBC", category: "IT Parks", position: [77.62289357849093, 12.887096098831353] as const },
  { name: "Cinepolis SJR Arekere", category: "Commercial", position: [77.61530286753714, 12.886940629750832] as const },
  { name: "Central Silk Board", category: "Metro", position: [77.64177517681296, 12.913991612643954] as const },
  { name: "Fortis Hospital", category: "Healthcare", position: [77.61830813839921, 12.89048845981224] as const },
  { name: "Kalyani Magnum Infotech Park", category: "IT Parks", position: [77.62053632010421, 12.899362800847761] as const },
  { name: "Vega City Mall", category: "Commercial", position: [77.62442244368567, 12.904582811568181] as const },
  { name: "Jayadeva Hospital", category: "Healthcare", position: [77.62046475113841, 12.915357172811326] as const },
  { name: "IIM Bengaluru", category: "Education", position: [77.62185719774531, 12.893481840880655] as const },
  { name: "Gopalan Innovation Mall", category: "Commercial", position: [77.61974932818093, 12.908398512018987] as const },
  { name: "Shoppers Stop", category: "Commercial", position: [77.62316764624236, 12.909301285722936] as const },
  { name: "Forum South Bengaluru", category: "Commercial", position: [77.59207886238316, 12.896724069908068] as const },
  { name: "Konnappana Agrahara", category: "Metro", position: [77.6852670073206, 12.850072281071121] as const },
  { name: "St. John's Medical College Hospital", category: "Healthcare", position: [77.6389927525937, 12.927928191774926] as const },
  { name: "Electronic City", category: "Metro", position: [77.67112, 12.84649] as const },
  { name: "Koramangala", category: "Areas", position: [77.64731499516013, 12.92336154410972] as const },
  { name: "Christ University", category: "Education", position: [77.62810941822882, 12.92876271867858] as const },
  { name: "Royal Meenakshi Mall", category: "Commercial", position: [77.61886284712122, 12.875882624533808] as const },
  { name: "Nexus Forum Mall", category: "Commercial", position: [77.63182067253945, 12.92537723963374] as const },
  { name: "Kalena Agrahara", category: "Metro", position: [77.61540962183602, 12.871215138298796] as const },
  { name: "Ibis Bengaluru", category: "Hotels", position: [77.67501244426506, 12.89630590687169] as const },
  { name: "Jayaprakash Nagar (JP Nagar)", category: "Metro", position: [77.5980413441668, 12.901388761396616] as const },
  { name: "Jaya Nagar", category: "Areas", position: [77.61091883483327, 12.92664799452708] as const },
  { name: "Yelachenahalli", category: "Metro", position: [77.5879269943594, 12.888167569283848] as const },
  { name: "Banashankari Metro", category: "Metro", position: [77.5468, 12.9255] as const },
  { name: "Banashankari", category: "Metro", position: [77.546, 12.925] as const },
] as const;

// Keep displayed distances consistent with the project's actual map pin.
// These are straight-line estimates; travel distances depend on the route.
function distanceFromSite([lng, lat]: readonly [number, number]) {
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const latitudeDelta = toRadians(lat - SITE_COORDINATES.lat);
  const longitudeDelta = toRadians(lng - SITE_COORDINATES.lng);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(toRadians(SITE_COORDINATES.lat)) * Math.cos(toRadians(lat))
    * Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

export const LOCATION_DIRECTORY = LOCATION_DIRECTORY_POINTS.map((place) => {
  const distanceKm = distanceFromSite(place.position);
  return {
    ...place,
    distanceKm,
    distance: distanceKm < 1
      ? `${Math.round(distanceKm * 10) * 100} m`
      : `${distanceKm.toFixed(1)} km`,
  };
}).sort((a, b) => a.distanceKm - b.distanceKm);

export const LOCATION_CATEGORIES = [
  "All",
  "Metro",
  "Healthcare",
  "Education",
  "IT Parks",
  "Commercial",
  "Areas",
  "Hotels",
] as const;

export type LocationCategory = (typeof LOCATION_CATEGORIES)[number];
