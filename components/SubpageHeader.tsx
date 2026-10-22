import Link from "next/link";
import { X } from "lucide-react";

type SubpageHeaderProps = {
  label: string;
  closeHref: string;
  closeLabel: string;
  className?: string;
};

export function SubpageHeader({ label, closeHref, closeLabel, className = "" }: SubpageHeaderProps) {
  return (
    <header className={`subpage-header ${className}`}>
      <span className="subpage-header-label">{label}</span>
      <Link className="subpage-close" href={closeHref} aria-label={`Close and return to ${closeLabel}`} title={`Return to ${closeLabel}`}>
        <X size={20} strokeWidth={1.7} aria-hidden="true" />
      </Link>
    </header>
  );
}
