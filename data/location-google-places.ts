import { placeIdFromCid } from "@/data/metro-google-places";

// Each CID was checked against the named Google Maps listing. Keep these
// paired with the coordinates in location-directory.ts when editing places.
const PLACE_CIDS: Record<string, string> = {
  "Pralaksha Hospital": "0x3bae6ca8522dfe0d:0x957813760cfc438a",
  "Springleaf Hospital": "0x3bae6c840116aa25:0xa7aa6c6bf720d921",
  "Vimalalaya Hospital": "0x3bae6c5f6ecc59f9:0xd3e4ed225f96e5de",
  "Oxford College of Engineering": "0x3bae149559f2e353:0xacb3790271972f97",
  "Dayananda Sagar University City Campus": "0x3bae14b023dade9d:0x35272e55303bd711",
  "St. Francis School Hongasandra": "0x3bae14c8affe8dcb:0x74a7518b4f8df744",
  "Ekana Multi Specialty Hospitals": "0x3bae15f73fde8cdf:0x18e240978718975a",
  "National Public School HSR": "0x3bae14859a9e67ad:0x589d65b31dbdcaf7",
  "Manipal Clinics Begur": "0x3bae6b20e612cf99:0x2b7254194c1da275",
  "PES University Electronic City Campus": "0x3bae6cbccb22bec1:0x4bad30b7a7fd5e76",
  "Rainbow Children's Hospital Bannerghatta": "0x3bae15121443dd7d:0x44eeec70fc7c548a",
  "Sri Chaitanya Techno School Hulimavu": "0x3bae153266a81cff:0x86505486f4426ca0",
  "XIME Bengaluru": "0x3bae145dbf50a5d9:0x679be37c0524b9bf",
  "Apollo Hospitals Bannerghatta": "0x3bae152152c6edf7:0x838c2e0a91221a87",
  "Infosys Electronic City": "0x3bae135aeb7f340f:0x11406271cbac49c8",
  "Bosch Limited Singasandra": "0x3bae6caf3fb91849:0x377e89b3e068b8c5",
  "HSBC Electronic Data Processing": "0x3bae152458bb4adb:0x4cf08f3c7d7d63d4",
  "Cinepolis SJR Arekere": "0x3bae15e545a22061:0xcc87ac4c97d1953a",
  "Fortis Hospital Bannerghatta": "0x3bae15237055f411:0x7308c26631aa9e25",
  "Kalyani Magnum Infotech Park": "0x3bae1517961f6b5d:0xbb0b209eb8161d4d",
  "Vega City Mall": "0x3bae1500646d8bff:0xdb17a49ffd95b016",
  "Jayadeva Hospital": "0x3bae16773e7dc413:0x350240386002607b",
  "IIM Bengaluru": "0x3bae15224b5e7169:0x25bdb9da743f9bdd",
  "Gopalan Innovation Mall": "0x3bae150453e4ae4f:0x527f9f4f544b8248",
  "Shoppers Stop Bannerghatta": "0x3bae6acd5b827931:0x78039ecf8eea3041",
  "Forum South Bengaluru": "0x3bae151f1d485609:0x128233fc8d0b7aa4",
  "St. John's Medical College Hospital": "0x3bae145139112f4d:0xa1c3b929cc88f48e",
  "Christ University": "0x3bae15b277a93807:0x88518f37b39dabd0",
  "Royal Meenakshi Mall": "0x3bae152cc2008809:0x6f1c35681dbd4e5a",
  "Nexus Koramangala Mall": "0x3bae144d859731bb:0x7be523c4ee2a1b09",
  "Ibis Bengaluru Hosur Road": "0x3bae14bfe701bd63:0x90b37bc9353d1814",
};

export function googlePlaceId(name: string): string | null {
  const cid = PLACE_CIDS[name];
  return cid ? placeIdFromCid(cid) : null;
}
