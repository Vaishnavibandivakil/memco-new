import { Opening } from "@/components/sections/Opening";
import { Quote } from "@/components/sections/Quote";
import { Concept } from "@/components/sections/Concept";
import { Nearby } from "@/components/sections/Nearby";
import { JutakuExperience } from "@/components/sections/JutakuExperience";
import { Amenities } from "@/components/sections/Amenities";
import { SpaceToLive } from "@/components/sections/SpaceToLive";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Credentials } from "@/components/sections/Credentials";
import { Homes } from "@/components/sections/Homes";
import { ChooseHome } from "@/components/sections/ChooseHome";
import { Closing } from "@/components/sections/Closing";
import { Reveals } from "@/components/Reveals";

/* Order follows the reference reel: arrival → reasons → quote → concept/place (horizontal) → Living → amenities →
   interiors → ecosystem → credentials → contact. The home finder is a panel opened from any "view homes" button. */
export default function Home() {
  return (
    <>
    <main>
      <Opening />
      <Quote />
      <Concept />
      <Nearby />
      <JutakuExperience />
      <Amenities />
      <SpaceToLive />
      <Ecosystem />
      <Credentials />
      <ChooseHome />
      <Closing />
      <Reveals />
    </main>
    <Homes />
    </>
  );
}
