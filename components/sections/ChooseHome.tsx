import { Split } from "@/components/Split";
import { ChooseButtons } from "@/components/sections/ChooseButtons";

/* AIR 00:26: "CHOOSE ——— AN OFFICE" with the two entry buttons in the middle. Both open the homes panel. */
export function ChooseHome() {
  return (
    <section className="chs" data-tone="light">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="chs-deco" src="/images/gazebos.webp" alt="" loading="lazy" data-rise />
      <Split left="CHOOSE" right="A HOME" mid={<ChooseButtons />} />
    </section>
  );
}
