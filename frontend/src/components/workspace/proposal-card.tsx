"use client";

import { Check, CircleAlert, Clock3, MapPin, Sparkles, X } from "lucide-react";

import type { Vote } from "./workspace-data";

type ProposalCardProps = {
  vote: Vote;
  onVote: (vote: Vote) => void;
};

export function ProposalCard({ vote, onVote }: ProposalCardProps) {
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
