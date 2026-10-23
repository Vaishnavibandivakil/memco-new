import Link from "next/link";
import { X } from "lucide-react";

type SubpageHeaderProps = {
  closeHref: string;
  closeLabel: string;
  className?: string;
};

export function SubpageHeader({ closeHref, closeLabel, className = "" }: SubpageHeaderProps) {
  return (
    <header className={`subpage-header ${className}`}>
      <Link className="subpage-close" href={closeHref} aria-label={`Close and return to ${closeLabel}`} title={`Return to ${closeLabel}`}>
        <X size={20} strokeWidth={1.7} aria-hidden="true" />
      </Link>
    </header>
  );
}
