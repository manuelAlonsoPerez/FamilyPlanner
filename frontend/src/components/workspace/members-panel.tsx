import { Plus, ShieldCheck } from "lucide-react";

import { members } from "./workspace-data";

export function MembersPanel() {
  return (
    <section aria-labelledby="members-heading" className="bg-white p-5 lg:hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="members-heading" className="font-semibold text-[#25332a]">
            Group members
          </h2>
          <p className="mt-1 text-xs text-[#7c867f]">
            Roles are enforced by the backend.
          </p>
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
