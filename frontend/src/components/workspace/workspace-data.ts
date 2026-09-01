export type MobileTab = "chat" | "calendar" | "members";
export type Vote = "ACCEPT" | "REJECT" | null;

export type Message = {
  id: string;
  sender: string;
  initials: string;
  body: string;
  time: string;
  tone: "sage" | "amber" | "blue";
};

export const members = [
  { name: "Maya", initials: "MP", role: "Admin", tone: "bg-[#285f47]" },
  { name: "Alex", initials: "AR", role: "Member", tone: "bg-[#a4653d]" },
  { name: "Priya", initials: "PS", role: "Member", tone: "bg-[#486b91]" },
];

export const initialMessages: Message[] = [
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

export const calendarEvents = [
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

export const toneClasses: Record<Message["tone"], string> = {
  sage: "bg-[#dceae2] text-[#24513d]",
  amber: "bg-[#f1dfd2] text-[#714326]",
  blue: "bg-[#dbe5ef] text-[#355372]",
};
