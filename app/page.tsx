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
import { About } from "@/components/sections/About";
import { Reveals } from "@/components/Reveals";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Chrome } from "@/components/Chrome";
import { LifestylePopup } from "@/components/LifestylePopup";
import { IntroLoader } from "@/components/IntroLoader";

/* The project and Experience Centre films lead the story; the home finder remains available throughout. */
export default function Home() {
  return (
    <>
    <IntroLoader />
    <SmoothScroll />
    <main>
      <Opening />
      <Quote />
      <JutakuExperience />
      <SpaceToLive />
      <Concept />
      <Nearby />
      <Amenities />
      <Credentials />
      <ChooseHome />
      <About />
      <Closing />
      <Reveals />
    </main>
    <Homes />
    <Chrome />
    <LifestylePopup />
    </>
  );
}
