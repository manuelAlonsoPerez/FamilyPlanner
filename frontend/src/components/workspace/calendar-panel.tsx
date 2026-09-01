"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import listPlugin from "@fullcalendar/react/list";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import monarchThemePlugin from "@fullcalendar/react/themes/monarch";
import { MoreHorizontal, X } from "lucide-react";
import { useState } from "react";

import { calendarEvents, members } from "./workspace-data";

function MemberStack() {
  return (
    <div className="flex items-center">
      {members.map((member, index) => (
        <div
          key={member.name}
          title={`${member.name} · ${member.role}`}
          className={`grid size-8 place-items-center rounded-full border-2 border-white text-[10px] font-bold text-white ${member.tone} ${
            index > 0 ? "-ml-2" : ""
          }`}
        >
          {member.initials}
        </div>
      ))}
    </div>
  );
}

export function CalendarPanel() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  return (
    <section
      id="calendar"
      aria-labelledby="calendar-heading"
      className="flex min-h-0 flex-col bg-white"
    >
      <div className="flex items-center justify-between border-b border-[#e6eae6] px-4 py-3 sm:px-5">
        <div>
          <h2 id="calendar-heading" className="text-sm font-semibold text-[#25332a]">
            Group calendar
          </h2>
          <p className="mt-0.5 text-xs text-[#818a83]">
            Shared events and private busy blocks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <MemberStack />
          <button
            type="button"
            aria-label="More calendar options"
            className="grid size-8 place-items-center rounded-lg text-[#6d776f] transition hover:bg-[#f0f3ef]"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {selectedEvent ? (
        <div
          role="status"
          className="mx-4 mt-4 flex items-center justify-between rounded-xl border border-[#cfe0d5] bg-[#edf5f0] px-3 py-2 text-xs text-[#365c48] sm:mx-5"
        >
          <span>
            Selected <strong>{selectedEvent}</strong>. Calendar events are read-only in
            this preview.
          </span>
          <button
            type="button"
            onClick={() => setSelectedEvent(null)}
            aria-label="Dismiss selected event"
            className="rounded p-1 hover:bg-[#dcebe1]"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}

      <div className="family-calendar min-h-0 flex-1 overflow-auto px-3 py-4 sm:px-5">
        <FullCalendar
          plugins={[
            monarchThemePlugin,
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          initialDate="2026-08-26"
          events={calendarEvents}
          eventInteractive
          headingLevel={2}
          height="auto"
          dayMaxEvents={2}
          nowIndicator
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,listWeek",
          }}
          eventClick={(info) => setSelectedEvent(info.event.title)}
        />
      </div>
    </section>
  );
}
