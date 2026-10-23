import { Opening } from "@/components/sections/Opening";
import { Quote } from "@/components/sections/Quote";
import { Concept } from "@/components/sections/Concept";
import { Nearby } from "@/components/sections/Nearby";
import { JutakuExperience } from "@/components/sections/JutakuExperience";
import { Amenities } from "@/components/sections/Amenities";
import { SpaceToLive } from "@/components/sections/SpaceToLive";
import { Credentials } from "@/components/sections/Credentials";
import { Homes } from "@/components/sections/Homes";
import { ChooseHome } from "@/components/sections/ChooseHome";
import { Closing } from "@/components/sections/Closing";
import { Reveals } from "@/components/Reveals";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Chrome } from "@/components/Chrome";
import { LifestylePopup } from "@/components/LifestylePopup";
import { IntroLoader } from "@/components/IntroLoader";

/* Order follows the reference reel: arrival → reasons → quote → design/concept/place (horizontal) → Living → amenities →
   Jutaku booking → interiors → credentials → contact. The home finder is a panel opened from any "view homes" button. */
export default function Home() {
  return (
    <>
    <IntroLoader />
    <SmoothScroll />
    <main>
      <Opening />
      <Quote />
      <Concept />
      <Nearby />
      <Amenities />
      <JutakuExperience />
      <SpaceToLive />
      <Credentials />
      <ChooseHome />
      <Closing />
      <Reveals />
    </main>
    <Homes />
    <Chrome />
    <LifestylePopup />
    </>
  );
}
