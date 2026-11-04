// Station order follows BMRCL's published network map and the Pink/Blue project plans.
// Planned station names and interchange arrangements may change before opening.
// https://english.bmrc.co.in/phase122A2Bmap/
// https://www.eib.org/attachments/registers/141776212.pdf
// https://data.opencity.in/dataset/e2bb661f-0593-4045-bd90-e0b905c4a96d/resource/51692a71-fbb9-4007-a3d0-df37af365304/download/phase-2a-dpr.pdf
// https://data.opencity.in/dataset/3a835903-fcc1-4148-bcb4-c53fc2fdb9c6/resource/1436bf47-c731-4841-b92a-ecc7bc798eb7/download/phase-2b-dpr-executive-summary.pdf

const YELLOW_STATIONS = [
  "RV Road", "Ragigudda", "Jayadeva Hospital", "BTM Layout", "Central Silk Board",
  "Bommanahalli", "Hongasandra", "Kudlu Gate", "Singasandra", "Hosa Road",
  "Beratena Agrahara", "Electronic City", "Infosys Foundation Konappana Agrahara",
  "Huskur Road", "Hebbagodi", "Bommasandra",
] as const;

const GREEN_STATIONS = [
  "Madavara", "Chikkabidarakallu", "Manjunathanagara", "Nagasandra", "Dasarahalli",
  "Jalahalli", "Peenya Industry", "Peenya", "Goraguntepalya", "Yeshwantpur",
  "Sandal Soap Factory", "Mahalakshmi", "Rajajinagar", "Mahakavi Kuvempu Road",
  "Srirampura", "Mantri Square Sampige Road", "Majestic", "Chickpete", "KR Market",
  "National College", "Lalbagh", "South End Circle", "Jayanagar", "RV Road",
  "Banashankari", "Jaya Prakash Nagar", "Yelachenahalli", "Konanakunte Cross",
  "Doddakallasandra", "Vajarahalli", "Thalaghattapura", "Silk Institute",
] as const;

const PURPLE_STATIONS = [
  "Whitefield (Kadugodi)", "Hopefarm Channasandra", "Kadugodi Tree Park", "Pattandur Agrahara",
  "Sri Sathya Sai Hospital", "Nallurhalli", "Kundalahalli", "Seetharampalya", "Hoodi",
  "Garudacharapalya", "Singayyanapalya", "Krishnarajapura", "Benniganahalli", "Baiyappanahalli",
  "Swami Vivekananda Road", "Indiranagar", "Halasuru", "Trinity", "MG Road", "Cubbon Park",
  "Vidhana Soudha", "Sir M. Visvesvaraya", "Majestic", "City Railway Station", "Magadi Road",
  "Hosahalli", "Vijayanagar", "Attiguppe", "Deepanjali Nagar", "Mysuru Road",
  "Nayandahalli", "Rajarajeshwari Nagar", "Jnanabharathi", "Pattanagere",
  "Kengeri Bus Terminal", "Kengeri", "Challaghatta",
] as const;

const PINK_STATIONS = [
  "Kalena Agrahara", "Hulimavu", "IIM Bengaluru", "JP Nagar 4th Phase", "Jayadeva Hospital",
  "Tavarekere", "Dairy Circle", "Lakkasandra", "Langford Town", "Rashtriya Military School",
  "MG Road", "Shivajinagar", "Cantonment Railway Station", "Pottery Town", "Tannery Road",
  "Venkateshpura", "Kadugondanahalli", "Nagawara",
] as const;

const BLUE_STATIONS = [
  "Central Silk Board", "HSR Layout", "Agara Lake", "Ibbalur", "Bellandur",
  "Kadubeesanahalli", "Kodibeesanahalli", "Marathahalli", "ISRO", "Doddanekundi",
  "DRDO Sports Complex", "Saraswathi Nagar", "KR Puram", "Kasturi Nagar (proposed)",
  "Channasandra", "Horamavu", "HRBR Layout", "Kalyan Nagar", "HBR Layout", "Nagawara",
  "Veerannapalya", "Kempapura", "Hebbal", "Kodigehalli", "Jakkur Cross", "Yelahanka",
  "Bagalur / PRR Cross", "Trumpet Junction", "KIA West", "Airport Terminal",
] as const;

export const METRO_CONNECTIONS = [
  {
    line: "Yellow",
    status: "In service",
    station: "Singasandra Metro",
    position: [77.64485, 12.88082] as const,
    steps: ["Yellow Line", "Singasandra / Hosa Road", "Jutaku"],
    description: "Take the Yellow Line to Singasandra or Hosa Road, then make the final trip to Jutaku on Manipal County Road.",
    journey: [
      { title: "Yellow · to the nearest stations", detail: "From north of Singasandra, board towards Bommasandra. From south of Hosa Road, board towards RV Road. Exit at Singasandra or Hosa Road." },
      { title: "Finish at Jutaku", detail: "Follow local directions from the station to MEMCO Skyline Jutaku on Manipal County Road." },
    ],
    stations: YELLOW_STATIONS,
    stationsLabel: "All 16 stations · RV Road to Bommasandra",
    highlights: ["RV Road", "Jayadeva Hospital", "Central Silk Board", "Singasandra", "Hosa Road"],
  },
  {
    line: "Green",
    status: "In service · one change",
    station: "RV Road interchange",
    position: [77.5802, 12.92158] as const,
    steps: ["Green Line", "RV Road · Yellow", "Singasandra / Hosa Road", "Jutaku"],
    description: "Ride the Green Line to RV Road, change to the Yellow Line towards Bommasandra, then exit near Jutaku.",
    journey: [
      { title: "Green · to RV Road", detail: "Travel to RV Road station on the Green Line." },
      { title: "Yellow · toward Bommasandra", detail: "Change at RV Road and ride to Singasandra or Hosa Road." },
      { title: "Finish at Jutaku", detail: "Follow local directions from the station to MEMCO Skyline Jutaku on Manipal County Road." },
    ],
    stations: GREEN_STATIONS,
    stationsLabel: "All 32 stations · Madavara to Silk Institute",
    highlights: ["Majestic", "RV Road"],
  },
  {
    line: "Purple",
    status: "In service · two changes",
    station: "Majestic interchange",
    position: [77.572836, 12.975692] as const,
    steps: ["Purple Line", "Majestic · Green", "RV Road · Yellow", "Singasandra / Hosa Road", "Jutaku"],
    description: "Take Purple to Majestic, Green to RV Road, then Yellow towards Bommasandra to reach Jutaku.",
    journey: [
      { title: "Purple · to Majestic", detail: "Ride the Purple Line to Majestic and change to the Green Line." },
      { title: "Green · toward Silk Institute", detail: "Ride south to RV Road and change to the Yellow Line." },
      { title: "Yellow · toward Bommasandra", detail: "Exit at Singasandra or Hosa Road, then follow local directions to Jutaku on Manipal County Road." },
    ],
    stations: PURPLE_STATIONS,
    stationsLabel: "All 37 stations · Whitefield to Challaghatta",
    highlights: ["MG Road", "Majestic"],
  },
  {
    line: "Pink",
    status: "Planned interchange",
    station: "Jayadeva Hospital interchange",
    position: [77.59993, 12.91693] as const,
    steps: ["Pink Line (planned)", "Jayadeva Hospital · Yellow", "Singasandra / Hosa Road", "Jutaku"],
    description: "Once the Pink Line opens, change at Jayadeva Hospital to the Yellow Line towards Bommasandra to reach Jutaku.",
    journey: [
      { title: "Pink · future journey to Jayadeva", detail: "Once passenger service opens, ride the Pink Line to Jayadeva Hospital." },
      { title: "Yellow · toward Bommasandra", detail: "Change to the Yellow Line and exit at Singasandra or Hosa Road." },
      { title: "Finish at Jutaku", detail: "Follow local directions from the station to MEMCO Skyline Jutaku on Manipal County Road." },
    ],
    stations: PINK_STATIONS,
    stationsLabel: "All 18 planned stations · Kalena Agrahara to Nagawara",
    highlights: ["Jayadeva Hospital", "MG Road"],
  },
  {
    line: "Blue",
    status: "Planned interchange",
    station: "Central Silk Board interchange",
    position: [77.62347, 12.9174] as const,
    steps: ["Blue Line (planned)", "Central Silk Board · Yellow", "Singasandra / Hosa Road", "Jutaku"],
    description: "Once the Blue Line opens, change at Central Silk Board to the Yellow Line towards Bommasandra to reach Jutaku.",
    journey: [
      { title: "Blue · future journey to Silk Board", detail: "Once passenger service opens, ride the Blue Line to Central Silk Board." },
      { title: "Yellow · toward Bommasandra", detail: "Change to the Yellow Line and exit at Singasandra or Hosa Road." },
      { title: "Finish at Jutaku", detail: "Follow local directions from the station to MEMCO Skyline Jutaku on Manipal County Road." },
    ],
    stations: BLUE_STATIONS,
    stationsLabel: "30 planned stations · Silk Board to airport",
    highlights: ["Central Silk Board", "KR Puram", "Hebbal", "Airport Terminal"],
  },
] as const;
