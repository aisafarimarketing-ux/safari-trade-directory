"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("trade_user_email") || "";
    setEmail(savedEmail);
  }, []);

  function handleLogout() {
    localStorage.removeItem("trade_user_session");
    localStorage.removeItem("trade_user_email");
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.2em] text-white/40">
          Trade Dashboard
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Welcome back
        </h1>

        <p className="mt-4 text-white/65">
          {email ? `Signed in as ${email}` : "Signed in trade user"}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <a
            href="/workspace"
            className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
          >
            <h2 className="text-xl font-semibold">Workspace</h2>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Build safari projects and itineraries.
            </p>
          </a>

          <a
            href="/directory"
            className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
          >
            <h2 className="text-xl font-semibold">My Listings</h2>
            <p className="mt-3 text-sm leading-7 text-white/60">
              View your public-facing trade listings.
            </p>
          </a>

          <a
            href="/admin"
            className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
          >
            <h2 className="text-xl font-semibold">Edit Profile</h2>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Update profile content, images, and trade details.
            </p>
          </a>
        </div>

        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
            type="button"
          >
            Log Out
          </button>
        </div>
      </div>
    </main>
  );
}
