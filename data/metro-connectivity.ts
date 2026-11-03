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
    steps: ["Singasandra / Hosa Road", "Yellow Line"],
    description: "The nearest line to Jutaku. Ride north for the city or south for Electronic City and Bommasandra.",
    journey: [
      { title: "Start near Jutaku", detail: "Reach Singasandra Metro or Hosa Road Metro. Their straight-line distances from Jutaku are shown above." },
      { title: "Choose your direction", detail: "Board towards RV Road for Central Silk Board and city interchanges; board towards Bommasandra for Electronic City." },
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
    steps: ["Singasandra / Hosa Road", "Yellow Line", "RV Road · Green"],
    description: "Take the Yellow Line towards RV Road, then change to Green for north and south Bengaluru.",
    journey: [
      { title: "Yellow · toward RV Road", detail: "Board at Singasandra or Hosa Road and travel towards RV Road." },
      { title: "Green · change at RV Road", detail: "Travel north through Jayanagar and Majestic towards Madavara, or south through Banashankari towards Silk Institute." },
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
    steps: ["Yellow", "RV Road · Green", "Majestic · Purple"],
    description: "Change from Yellow to Green at RV Road, then from Green to Purple at Majestic.",
    journey: [
      { title: "Yellow · toward RV Road", detail: "From Singasandra, pass Kudlu Gate, Hongasandra, Bommanahalli, Central Silk Board, BTM Layout, Jayadeva Hospital and Ragigudda." },
      { title: "Green · change at RV Road", detail: "Ride towards Madavara through Jayanagar, South End Circle, Lalbagh, National College, KR Market and Chickpete to Majestic." },
      { title: "Purple · change at Majestic", detail: "Choose the Whitefield direction for MG Road, Indiranagar and east Bengaluru, or the Challaghatta direction for west Bengaluru." },
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
    steps: ["Yellow", "Jayadeva Hospital", "Pink"],
    description: "Jayadeva Hospital is the planned Yellow–Pink interchange. Pink Line journeys begin only after passenger service opens.",
    journey: [
      { title: "Yellow · toward RV Road", detail: "From Singasandra, pass Kudlu Gate, Hongasandra, Bommanahalli, Central Silk Board and BTM Layout to Jayadeva Hospital." },
      { title: "Pink · future transfer at Jayadeva", detail: "Once open, travel south towards Kalena Agrahara or north through MG Road towards Nagawara." },
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
    steps: ["Yellow", "Central Silk Board", "Blue"],
    description: "Central Silk Board is the planned transfer to the Blue Line along Outer Ring Road and onwards to the airport.",
    journey: [
      { title: "Yellow · toward RV Road", detail: "From Singasandra, pass Kudlu Gate, Hongasandra and Bommanahalli to Central Silk Board." },
      { title: "Blue · future transfer at Silk Board", detail: "The planned route runs via HSR Layout, Bellandur and KR Puram, then north via Hebbal to the airport." },
    ],
    stations: BLUE_STATIONS,
    stationsLabel: "30 planned stations · Silk Board to airport",
    highlights: ["Central Silk Board", "KR Puram", "Hebbal", "Airport Terminal"],
  },
] as const;
