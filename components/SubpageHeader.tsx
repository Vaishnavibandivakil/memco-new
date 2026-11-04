import { X } from "lucide-react";
import { ReturnLink } from "@/components/ReturnNavigation";

type SubpageHeaderProps = {
  closeHref: string;
  className?: string;
};

export function SubpageHeader({ closeHref, className = "" }: SubpageHeaderProps) {
  return (
    <header className={`subpage-header ${className}`}>
      <ReturnLink className="subpage-close" href={closeHref} aria-label="Close page" title="Close page">
        <X size={20} strokeWidth={1.7} aria-hidden="true" />
      </ReturnLink>
    </header>
  );
}
