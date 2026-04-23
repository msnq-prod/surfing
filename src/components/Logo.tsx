import { Link } from "react-router-dom";

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <div className="flex flex-col">
        <span className="text-[24px] font-semibold uppercase tracking-[4px] leading-none text-primary">
          МЫС
        </span>
      </div>
    </Link>
  );
}
