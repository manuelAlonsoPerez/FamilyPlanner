"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import listPlugin from "@fullcalendar/react/list";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import monarchThemePlugin from "@fullcalendar/react/themes/monarch";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  History,
  Home,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";

type MobileTab = "chat" | "calendar" | "members";
type Vote = "ACCEPT" | "REJECT" | null;

type Message = {
  id: string;
  sender: string;
  initials: string;
  body: string;
  time: string;
  tone: "sage" | "amber" | "blue";
};

const members = [
  { name: "Maya", initials: "MP", role: "Admin", tone: "bg-[#285f47]" },
  { name: "Alex", initials: "AR", role: "Member", tone: "bg-[#a4653d]" },
  { name: "Priya", initials: "PS", role: "Member", tone: "bg-[#486b91]" },
];

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "Alex",
    initials: "AR",
    body: "Could we move Friday's family dinner to 8? I have practice until 7.",
    time: "14:08",
    tone: "amber",
  },
  {
    id: "2",
    sender: "Priya",
    initials: "PS",
    body: "8 works for me. The restaurant is still okay, right?",
    time: "14:10",
    tone: "blue",
  },
];

const calendarEvents = [
  {
    id: "evt-1",
    title: "Family dinner",
    start: "2026-08-28T19:00:00",
    end: "2026-08-28T20:30:00",
    backgroundColor: "#2f6b4f",
    borderColor: "#2f6b4f",
  },
  {
    id: "evt-2",
    title: "School pickup",
    start: "2026-08-27T15:30:00",
    end: "2026-08-27T16:00:00",
    backgroundColor: "#486b91",
    borderColor: "#486b91",
  },
  {
    id: "evt-3",
    title: "Busy",
    start: "2026-08-28T20:00:00",
    end: "2026-08-28T21:00:00",
    backgroundColor: "#8b8f8a",
    borderColor: "#8b8f8a",
  },
  {
    id: "evt-4",
    title: "Football practice",
    start: "2026-08-28T17:30:00",
    end: "2026-08-28T19:00:00",
    backgroundColor: "#a4653d",
    borderColor: "#a4653d",
  },
];

const toneClasses: Record<Message["tone"], string> = {
  sage: "bg-[#dceae2] text-[#24513d]",
  amber: "bg-[#f1dfd2] text-[#714326]",
  blue: "bg-[#dbe5ef] text-[#355372]",
};

function BrandMark() {
  return (
    <div
      aria-hidden="true"
      className="grid size-10 place-items-center rounded-xl bg-[#285f47] text-white"
    >
      <CalendarDays size={20} strokeWidth={2.2} />
    </div>
  );
}

function Sidebar() {
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
          <span className="block text-sm font-semibold text-[#26352c]">Maya Patel</span>
          <span className="block text-xs text-[#7a847d]">Group admin</span>
        </span>
        <Settings size={17} className="text-[#7b857e]" />
      </button>
    </aside>
  );
}

function TopBar() {
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
          <p className="text-xs text-[#7a847d]">Europe/Oslo · Wednesday, 26 August</p>
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

function CalendarPanel() {
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

function ProposalCard({ vote, onVote }: { vote: Vote; onVote: (vote: Vote) => void }) {
  return (
    <article
      aria-labelledby="proposal-title"
      className="overflow-hidden rounded-2xl border border-[#cfdcd3] bg-white"
    >
      <div className="flex items-center justify-between border-b border-[#e1e8e3] bg-[#f4f8f5] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-[#dbeadf] text-[#285f47]">
            <Sparkles size={15} />
          </span>
          <div>
            <p className="text-xs font-semibold text-[#28513e]">Calendar proposal</p>
            <p className="text-[11px] text-[#7b857e]">Update · awaiting approval</p>
          </div>
        </div>
        <span className="rounded-full bg-[#fff0d9] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8a5a21]">
          Pending
        </span>
      </div>

      <div className="p-4">
        <h3 id="proposal-title" className="text-sm font-semibold text-[#233129]">
          Move family dinner to 8:00 PM
        </h3>
        <p className="mt-1 text-xs leading-5 text-[#707a72]">
          Alex asked to move Friday&apos;s dinner. There is a private busy block from
          8–9 PM, so the family should confirm.
        </p>

        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs">
          <dt className="text-[#8a928c]">When</dt>
          <dd className="font-medium text-[#344139]">Friday, 28 August</dd>
          <dt className="text-[#8a928c]">Before</dt>
          <dd className="text-[#6f7771] line-through">7:00–8:30 PM</dd>
          <dt className="text-[#8a928c]">After</dt>
          <dd className="font-semibold text-[#285f47]">8:00–9:30 PM</dd>
          <dt className="text-[#8a928c]">Place</dt>
          <dd className="flex items-center gap-1.5 font-medium text-[#344139]">
            <MapPin size={13} />
            Løkka Bistro
          </dd>
        </dl>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#fff7e9] p-3 text-xs leading-5 text-[#755323]">
          <CircleAlert size={15} className="mt-0.5 shrink-0" />
          <p>Possible conflict: the administrator has a private busy event at 8 PM.</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[#4f5c53]">1 of 3 approvals</p>
            <div className="mt-1 flex gap-1" aria-label="One of three approvals received">
              <span className="h-1.5 w-8 rounded-full bg-[#3f8060]" />
              <span className="h-1.5 w-8 rounded-full bg-[#dfe5df]" />
              <span className="h-1.5 w-8 rounded-full bg-[#dfe5df]" />
            </div>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-[#7d867f]">
            <Clock3 size={13} />
            Expires in 22h
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onVote("REJECT")}
            aria-pressed={vote === "REJECT"}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
              vote === "REJECT"
                ? "border-[#a64c3c] bg-[#fff1ee] text-[#8a3f33]"
                : "border-[#d9dfda] text-[#5d6860] hover:bg-[#f5f7f5]"
            }`}
          >
            <X size={15} />
            Reject
          </button>
          <button
            type="button"
            onClick={() => onVote("ACCEPT")}
            aria-pressed={vote === "ACCEPT"}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-white transition ${
              vote === "ACCEPT"
                ? "bg-[#1f503a]"
                : "bg-[#2f6b4f] hover:bg-[#285c44]"
            }`}
          >
            <Check size={15} />
            Accept
          </button>
        </div>

        {vote ? (
          <p role="status" className="mt-3 text-center text-[11px] text-[#68736b]">
            Preview choice: {vote === "ACCEPT" ? "accept" : "reject"}. Backend voting
            is not connected yet.
          </p>
        ) : null}
      </div>
    </article>
  );
}

function ChatPanel() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [vote, setVote] = useState<Vote>(null);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        sender: "Maya",
        initials: "MP",
        body,
        time: new Intl.DateTimeFormat("en", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
        tone: "sage",
      },
    ]);
    setDraft("");
  }

  return (
    <section
      aria-labelledby="chat-heading"
      className="flex min-h-0 flex-col border-l border-[#e1e6e1] bg-[#fbfcfa]"
    >
      <div className="flex items-center justify-between border-b border-[#e6eae6] bg-white px-4 py-3">
        <div>
          <h2 id="chat-heading" className="text-sm font-semibold text-[#25332a]">
            Family chat
          </h2>
          <p className="mt-0.5 text-xs text-[#818a83]">3 members · AI assistant active</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            aria-label="Assistant online"
            className="size-2 rounded-full bg-[#3a8b63]"
          />
          <button
            type="button"
            aria-label="Chat options"
            className="grid size-8 place-items-center rounded-lg text-[#6d776f] transition hover:bg-[#f0f3ef]"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      <div
        aria-live="polite"
        className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5"
      >
        <div className="text-center">
          <span className="rounded-full bg-[#edf1ec] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#79837b]">
            Today
          </span>
        </div>

        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-2.5">
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-bold ${toneClasses[message.tone]}`}
            >
              {message.initials}
            </span>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="text-xs font-semibold text-[#35423a]">{message.sender}</p>
                <time className="text-[10px] text-[#9aa19c]">{message.time}</time>
              </div>
              <p className="mt-1 rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm leading-6 text-[#3b4840] ring-1 ring-[#e3e8e3]">
                {message.body}
              </p>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#dbeadf] text-[#285f47]">
            <Sparkles size={15} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <p className="text-xs font-semibold text-[#28513e]">Family Planner AI</p>
              <time className="text-[10px] text-[#9aa19c]">14:11</time>
            </div>
            <p className="mt-1 text-xs leading-5 text-[#6c776f]">
              I found Friday&apos;s dinner and a possible conflict. Here is a proposal
              for everyone to review.
            </p>
            <div className="mt-3">
              <ProposalCard vote={vote} onVote={setVote} />
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={sendMessage} className="border-t border-[#e3e8e3] bg-white p-3">
        <label htmlFor="message" className="sr-only">
          Message the Morgan family
        </label>
        <div className="flex items-end gap-2 rounded-2xl border border-[#d7dfd9] bg-[#fafcf9] p-2 focus-within:border-[#70a187] focus-within:ring-2 focus-within:ring-[#dcebe2]">
          <textarea
            id="message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={1}
            maxLength={600}
            placeholder="Message your family…"
            className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-[#344139] outline-none placeholder:text-[#9aa29c]"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send message"
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#2f6b4f] text-white transition hover:bg-[#285c44] disabled:cursor-not-allowed disabled:bg-[#b9c8be]"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="mt-2 px-1 text-[10px] text-[#929a94]">
          Preview mode · messages stay in this browser session
        </p>
      </form>
    </section>
  );
}

function MembersPanel() {
  return (
    <section aria-labelledby="members-heading" className="bg-white p-5 lg:hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="members-heading" className="font-semibold text-[#25332a]">
            Group members
          </h2>
          <p className="mt-1 text-xs text-[#7c867f]">Roles are enforced by the backend.</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-[#2f6b4f] px-3 py-2 text-xs font-semibold text-white"
        >
          <Plus size={15} />
          Invite
        </button>
      </div>
      <div className="mt-5 space-y-2">
        {members.map((member) => (
          <div
            key={member.name}
            className="flex items-center gap-3 rounded-xl border border-[#e0e6e1] p-3"
          >
            <span
              className={`grid size-10 place-items-center rounded-full text-xs font-bold text-white ${member.tone}`}
            >
              {member.initials}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#2d3a32]">{member.name}</p>
              <p className="text-xs text-[#7f8881]">{member.role}</p>
            </div>
            {member.role === "Admin" ? (
              <ShieldCheck size={17} className="text-[#3b7658]" />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function FamilyWorkspace() {
  const [activeTab, setActiveTab] = useState<MobileTab>("chat");

  return (
    <div id="workspace" className="flex min-h-screen bg-[#f2f5f1]">
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-50 -translate-y-20 rounded-lg bg-[#1f503a] px-3 py-2 text-sm font-semibold text-white transition focus:translate-y-0"
      >
        Skip to workspace
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <nav
          aria-label="Workspace views"
          className="grid grid-cols-3 border-b border-[#dfe5df] bg-white lg:hidden"
        >
          {(
            [
              ["chat", "Chat", MessageCircle],
              ["calendar", "Calendar", CalendarDays],
              ["members", "Members", Users],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              aria-pressed={activeTab === id}
              className={`flex items-center justify-center gap-2 border-b-2 px-2 py-3 text-xs font-semibold ${
                activeTab === id
                  ? "border-[#2f6b4f] text-[#285f47]"
                  : "border-transparent text-[#778078]"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <main
          id="main-content"
          className="min-h-0 flex-1 overflow-hidden p-0 lg:p-5"
        >
          <div className="mx-auto h-full max-w-[1500px] overflow-hidden bg-white lg:rounded-2xl lg:border lg:border-[#dce3dd]">
            <div className="grid h-full min-h-[calc(100vh-72px)] grid-cols-1 lg:min-h-[calc(100vh-114px)] lg:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
              <div className={activeTab === "calendar" ? "block" : "hidden lg:block"}>
                <CalendarPanel />
              </div>
              <div className={activeTab === "chat" ? "block" : "hidden lg:block"}>
                <ChatPanel />
              </div>
              <div className={activeTab === "members" ? "block" : "hidden"}>
                <MembersPanel />
              </div>
            </div>
          </div>
        </main>

        <div className="sr-only" id="history">
          History will be implemented after backend contracts are available.
        </div>
      </div>
    </div>
  );
}
