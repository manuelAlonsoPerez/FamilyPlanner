import {
  CalendarDays,
  ChevronDown,
  History,
  Home,
  Plus,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { BrandMark } from "./brand-mark";

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[#dfe5df] bg-[#f8faf7] px-4 py-5 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2">
        <BrandMark />
        <div>
          <p className="text-sm font-semibold tracking-tight text-[#1d2a23]">
            Family Planner
          </p>
          <p className="text-xs text-[#768079]">Shared time, simplified</p>
        </div>
      </div>

      <nav aria-label="Primary navigation" className="mt-9 space-y-1">
        <a
          href="#workspace"
          className="flex items-center gap-3 rounded-xl bg-[#e3eee7] px-3 py-2.5 text-sm font-semibold text-[#285f47]"
        >
          <Home size={18} />
          Workspace
        </a>
        <a
          href="#calendar"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#667068] transition hover:bg-[#edf1ec] hover:text-[#26352c]"
        >
          <CalendarDays size={18} />
          Calendar
        </a>
        <a
          href="#history"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#667068] transition hover:bg-[#edf1ec] hover:text-[#26352c]"
        >
          <History size={18} />
          History
        </a>
      </nav>

      <div className="mt-8">
        <div className="flex items-center justify-between px-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a938d]">
            Your groups
          </p>
          <button
            type="button"
            aria-label="Create group"
            className="rounded-md p-1 text-[#6d786f] transition hover:bg-[#e8ede8]"
          >
            <Plus size={16} />
          </button>
        </div>
        <button
          type="button"
          className="mt-2 flex w-full items-center gap-3 rounded-xl border border-[#d9e2da] bg-white p-3 text-left"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-[#f1dfd2] text-xs font-bold text-[#714326]">
            MP
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-[#243229]">
              Morgan family
            </span>
            <span className="block text-xs text-[#778178]">3 members</span>
          </span>
          <ChevronDown size={16} className="text-[#7b857e]" />
        </button>
      </div>

      <div className="mt-auto rounded-2xl border border-[#dce5dd] bg-white p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#285f47]">
          <ShieldCheck size={15} />
          Human approval enabled
        </div>
        <p className="mt-1.5 text-xs leading-5 text-[#737d75]">
          Calendar changes wait for the required family votes.
        </p>
      </div>

      <button
        type="button"
        className="mt-4 flex items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-[#edf1ec]"
      >
        <span className="grid size-9 place-items-center rounded-full bg-[#285f47] text-xs font-bold text-white">
          MP
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-[#26352c]">
            Maya Patel
          </span>
          <span className="block text-xs text-[#7a847d]">Group admin</span>
        </span>
        <Settings size={17} className="text-[#7b857e]" />
      </button>
    </aside>
  );
}
