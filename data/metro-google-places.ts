// Verified Google Maps station listings, 17 Nov 2026. Each CID belongs to the
// station itself, so directions do not snap to a nearby shop or neighbourhood.
const STATION_CIDS: Record<string, string> = {
  "RV Road": "0x3bae159e1e84291b:0x63b539c10b189747",
  Ragigudda: "0x3bae150b9bc04cdd:0x2234b2e16c4ef2e",
  "Jayadeva Hospital": "0x3bae150047eae72f:0xb73883e2cbe29c3b",
  "BTM Layout": "0x3bae14fdf973680b:0xc25c0a752d9c4573",
  "Central Silk Board": "0x3bae15004049b1c3:0x28ce4bc3d5893599",
  Bommanahalli: "0x3bae15977977e2c1:0x1d9c4d9e97b963bd",
  Hongasandra: "0x3bae14955c34c3cb:0x21410cb050ee84f8",
  "Kudlu Gate": "0x3bae15ffc612a921:0x9d7a246673cbe5fe",
  Singasandra: "0x3bae14ad1f79ef3d:0xc6d50de9c522efe8",
  "Hosa Road": "0x3bae6b005c4718bb:0x4a533887c41dbea6",
  "Beratena Agrahara": "0x3bae6ca6c7f50071:0xfe7e117d2cfa197f",
  "Electronic City": "0x3bae6dc63aac0077:0x6749f9f8f10ec9c",
  "Infosys Foundation Konappana Agrahara": "0x3bae6c8dfeacdaf1:0xa8554674e3710eea",
  "Huskur Road": "0x3bae6cf4dbb22d47:0xa3163584e2dfbd9c",
  Hebbagodi: "0x3bae6c5c12465fc7:0xf39c91bbf96af369",
  Bommasandra: "0x3bae6d48da8cd4eb:0x6ad8008ad1c5fdb8",
  Madavara: "0x3bae23911b15636f:0xec9052af9840c58c",
  Chikkabidarakallu: "0x3bae3cb4accfcceb:0x5aea47c1e09b2c43",
  Manjunathanagara: "0x3bae3dad0f7d8bbb:0x3e6e65cc36331396",
  Nagasandra: "0x3bae3ccc22b356ab:0xf9131e91dad71be6",
  Dasarahalli: "0x3bae3cd45e348165:0x77206fa5860994bb",
  Jalahalli: "0x3bae3d27aa4ece93:0xd44d9343b009e5e9",
  "Peenya Industry": "0x3bae3d236e7713b7:0xa70ed02a28cf01e5",
  Peenya: "0x3bae3d3e09d00b27:0x333fae83585f6134",
  Goraguntepalya: "0x3bae3d6b12bfffff:0xb1c4057a2a351073",
  Yeshwantpur: "0x3bae3d6f8c52c9ef:0xc5753f7004e9a524",
  "Sandal Soap Factory": "0x3bae3d7972a8331f:0x851e623f96b17184",
  Mahalakshmi: "0x3bae3d9d16e3cce9:0x269da29e8a7a8a5f",
  Rajajinagar: "0x3bae3d9ab808c579:0x63611c24817afc08",
  "Mahakavi Kuvempu Road": "0x3bae3d88ba9b789f:0x10788b873721dd3c",
  Srirampura: "0x3bae162774955163:0xa79894609cf092d2",
  "Mantri Square Sampige Road": "0x3bae1622f68c66cb:0x6af6850acc0d183d",
  Majestic: "0x3bae16056f420465:0xa95f996d1d0f8d92",
  Chickpete: "0x3bae160817e0bcfb:0x5e71d75983a0f47b",
  "KR Market": "0x3bae15e535c24c7d:0xf21755dc05616cdb",
  "National College": "0x3bae15ee1f20d3a5:0xfb222c793ee0ca2c",
  Lalbagh: "0x3bae15eb70e59e15:0xd76de165b4e08da4",
  "South End Circle": "0x3bae15941d77e651:0x925d0b175bd32661",
  Jayanagar: "0x3bae1599769734eb:0x171cab49aa92bdbd",
  Banashankari: "0x3bae1577551efa15:0x84723b5eb919a350",
  "Jaya Prakash Nagar": "0x3bae15657c8e000b:0x84a3ce06f708d790",
  Yelachenahalli: "0x3bae155daf21317b:0xea5de0fde21ca9f0",
  "Konanakunte Cross": "0x3bae155864e45c1b:0xcfbb64a55bbccb54",
  Doddakallasandra: "0x3bae3ffae776be55:0xa9e929d20e372d38",
  Vajarahalli: "0x3bae3ff681c66611:0x1f37a250447099e3",
  Thalaghattapura: "0x3bae40752830dd27:0x717e980de34012f9",
  "Silk Institute": "0x3bae406fce171edd:0x1a7e3658b969383b",
  "Whitefield (Kadugodi)": "0x3bae0e179722dc39:0x4d33accb962fa3fb",
  "Hopefarm Channasandra": "0x3bae0e1adf801931:0x13f5d77421289f0a",
  "Kadugodi Tree Park": "0x3bae0e02cb23fa4b:0x7c3668809f8bdc56",
  "Pattandur Agrahara": "0x3bae11e4f22de0d7:0x89e6775d51e87753",
  "Sri Sathya Sai Hospital": "0x3bae112df8e854c1:0xed3716711ebe076f",
  Nallurhalli: "0x3bae11f4fbf3d6c7:0x7b3172ac6fe24d35",
  Kundalahalli: "0x3bae118944026245:0x16ca85959b57dfc3",
  Seetharampalya: "0x3bae1185a87fb707:0x1367333b19856ab0",
  Hoodi: "0x3bae1190a45d270b:0xd954d97273eb752a",
  Garudacharapalya: "0x3bae116096bc7475:0xd3dfa75d43e59831",
  Singayyanapalya: "0x3bae110c91ea1001:0xa865526c0f7d9bf",
  Krishnarajapura: "0x3bae11160c2626eb:0x3eaaabf6b01c70f9",
  Benniganahalli: "0x3bae1160f6dfe1e9:0x1dc671638e1abedb",
  Baiyappanahalli: "0x3bae16b50fac0757:0x6a7bad410f4ff14d",
  "Swami Vivekananda Road": "0x3bae16b0d7e2ea3f:0xbe5fb757c583203a",
  Indiranagar: "0x3bae16a4fa5db665:0xd56794d16bb9b17b",
  Halasuru: "0x3bae16996a37dd49:0x29e4aa7047a7929a",
  Trinity: "0x3bae168370e795bd:0x36c478eeccc87d29",
  "MG Road": "0x3bae167da3bd0cbf:0xbf2c173d7ba874ff",
  "Cubbon Park": "0x3bae1665797f4675:0x45c6a24670828e7e",
  "Vidhana Soudha": "0x3bae166e480002fb:0x679716e11849bc68",
  "Sir M. Visvesvaraya": "0x3bae160cc5d81e99:0x6e762c27e3ea9b5b",
  "City Railway Station": "0x3bae16033da799cd:0x36b15a7de0c4884",
  "Magadi Road": "0x3bae3dfa10b1b1c9:0x1a9b04c44df55abd",
  Hosahalli: "0x3bae3de5c5219d4f:0x57f9df12c667fc94",
  Vijayanagar: "0x3bae3ddddccc3acb:0x4ea472db769a21aa",
  Attiguppe: "0x3bae3e75d1325e99:0x42b3cbc9174cc9cd",
  "Deepanjali Nagar": "0x3bae3e6d6fab82ed:0x7160e522ef36e75a",
  "Mysuru Road": "0x3bae3e68d03fc1c9:0x6417c4a69d955925",
  Nayandahalli: "0x3bae3e6784efc585:0xff2c16727216b2ca",
  "Rajarajeshwari Nagar": "0x3bae3e5f3fd6b67b:0x3049ed8c09c349ae",
  Jnanabharathi: "0x3bae3ef42471ce5b:0x71b536f789c9febe",
  Pattanagere: "0x3bae3ee6a2fbabbb:0x24ecd444bf00a4a3",
  "Kengeri Bus Terminal": "0x3bae3f20d23d8f1b:0x8c528e57de702e00",
  Kengeri: "0x3bae3f76af704dd5:0x3d5811eb61de463a",
  Challaghatta: "0x3bae395ac4c8ce1b:0x66d721a37f3a1abf",
};

const JUTAKU_CID = "0x3bae6b00256cd43d:0x159453b3f51b5e1b";

// Google Maps URLs accept Place IDs. These station listing CIDs encode the same
// feature and entity identifiers in the standard ChIJ Place ID byte format.
function placeIdFromCid(cid: string): string {
  const [feature, entity] = cid.split(":").map(BigInt);
  const bytes = new Uint8Array(20);
  bytes.set([0x0a, 0x12, 0x09]);
  const view = new DataView(bytes.buffer);
  view.setBigUint64(3, feature, true);
  bytes[11] = 0x11;
  view.setBigUint64(12, entity, true);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const JUTAKU_GOOGLE_PLACE_ID = placeIdFromCid(JUTAKU_CID);

export function googleMetroPlaceId(name: string): string | null {
  const cid = STATION_CIDS[name];
  return cid ? placeIdFromCid(cid) : null;
}
