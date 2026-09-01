import { CalendarDays } from "lucide-react";

export function BrandMark() {
  return (
    <div
      aria-hidden="true"
      className="grid size-10 place-items-center rounded-xl bg-[#285f47] text-white"
    >
      <CalendarDays size={20} strokeWidth={2.2} />
    </div>
  );
}
