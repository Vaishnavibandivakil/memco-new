"use client";
import { openHomes } from "@/components/sections/Homes";

export function ChooseButtons() {
  return (
    <span className="chs-btns">
      <button type="button" className="pill lbl chs-btn is-dark" onClick={openHomes}>By type <span aria-hidden>+</span></button>
      <button type="button" className="pill lbl chs-btn" onClick={openHomes}>On the floor plan <span aria-hidden>+</span></button>
    </span>
  );
}
