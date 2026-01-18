"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import ScheduledEmails from "@/components/ScheduledEmails";
import SentEmails from "@/components/SentEmails";
import ComposeEmail from "@/components/ComposeEmail";

export default function Dashboard() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<"scheduled" | "sent">("scheduled");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Email Scheduler</h1>
        <div className="flex items-center space-x-4">
          <img src={session?.user?.image || ""} alt="Avatar" className="w-8 h-8 rounded-full" />
          <span>{session?.user?.name}</span>
          <span>{session?.user?.email}</span>
          <button onClick={() => signOut()} className="text-red-500">Logout</button>
        </div>
      </header>
      <div className="p-4">
        <button
          onClick={() => setTab("scheduled")}
          className={`mr-4 px-4 py-2 ${tab === "scheduled" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Scheduled Emails
        </button>
        <button
          onClick={() => setTab("sent")}
          className={`px-4 py-2 ${tab === "sent" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Sent Emails
        </button>
        <ComposeEmail />
        {tab === "scheduled" ? <ScheduledEmails /> : <SentEmails />}
      </div>
    </div>
  );
}