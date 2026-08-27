import { Bell, Search } from "lucide-react";

import { BrandMark } from "./brand-mark";

export function TopBar() {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-[#e1e6e1] bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="lg:hidden">
          <BrandMark />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-lg font-semibold tracking-tight text-[#1d2a23]">
              Morgan family
            </h1>
            <span className="hidden rounded-full bg-[#e8f1eb] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#33694f] sm:inline">
              Admin
            </span>
          </div>
          <p className="text-xs text-[#7a847d]">
            Europe/Oslo · Wednesday, 26 August
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-[#dce5dd] px-3 py-1.5 text-xs font-medium text-[#4e6155] sm:flex">
          <span className="size-2 rounded-full bg-[#3a8b63]" />
          Google Calendar synced
        </div>
        <button
          type="button"
          aria-label="Search"
          className="grid size-9 place-items-center rounded-full text-[#647068] transition hover:bg-[#f0f3ef]"
        >
          <Search size={18} />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative grid size-9 place-items-center rounded-full text-[#647068] transition hover:bg-[#f0f3ef]"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#b65c43]" />
        </button>
      </div>
    </header>
  );
}
