"use client";

import { MoreHorizontal, Send, Sparkles } from "lucide-react";
import { type FormEvent, useState } from "react";

import { ProposalCard } from "./proposal-card";
import {
  initialMessages,
  toneClasses,
  type Vote,
} from "./workspace-data";

export function ChatPanel() {
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
          <p className="mt-0.5 text-xs text-[#818a83]">
            3 members · AI assistant active
          </p>
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
