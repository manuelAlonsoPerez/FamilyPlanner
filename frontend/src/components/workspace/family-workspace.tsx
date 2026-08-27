"use client";

import { CalendarDays, MessageCircle, Users } from "lucide-react";
import { useState } from "react";

import { CalendarPanel } from "./calendar-panel";
import { ChatPanel } from "./chat-panel";
import { MembersPanel } from "./members-panel";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import type { MobileTab } from "./workspace-data";

const workspaceTabs = [
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "members", label: "Members", icon: Users },
] as const;

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
          {workspaceTabs.map(({ id, label, icon: Icon }) => (
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

        <main id="main-content" className="min-h-0 flex-1 overflow-hidden p-0 lg:p-5">
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
