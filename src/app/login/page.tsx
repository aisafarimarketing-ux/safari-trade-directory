"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    localStorage.setItem("trade_user_session", "active");
    localStorage.setItem("trade_user_email", email);

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-md rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-white/40">
          Trade User Login
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Access your account
        </h1>

        <p className="mt-4 text-white/65">
          Sign in to manage your trade profile, workspace, and listings.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
            required
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
