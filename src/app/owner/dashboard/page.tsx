"use client";

const sampleAccounts = [
  {
    id: "1",
    name: "Nyumbani Collection",
    email: "trade@nyumbani.com",
    status: "active",
    plan: "free",
  },
  {
    id: "2",
    name: "Hilala Camp",
    email: "hello@hilala.com",
    status: "paused",
    plan: "premium",
  },
  {
    id: "3",
    name: "Savannah Trails",
    email: "ops@savannahtrails.com",
    status: "flagged",
    plan: "free",
  },
];

export default function OwnerDashboardPage() {
  function handleLogout() {
    localStorage.removeItem("owner_session");
    localStorage.removeItem("owner_email");
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.2em] text-white/40">
          Owner Dashboard
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Platform Control
        </h1>

        <p className="mt-4 max-w-3xl text-white/65">
          Manage accounts, review policy issues, pause listings, restore access,
          and control payment-related account status.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          <StatCard label="Accounts" value="3" />
          <StatCard label="Active" value="1" />
          <StatCard label="Paused" value="1" />
          <StatCard label="Flagged" value="1" />
        </div>

        <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-2xl font-semibold">Account Controls</h2>

          <div className="mt-6 space-y-4">
            {sampleAccounts.map((account) => (
              <div
                key={account.id}
                className="rounded-[24px] border border-white/10 bg-black/20 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{account.name}</h3>
                    <p className="mt-2 text-sm text-white/60">{account.email}</p>
                    <p className="mt-2 text-sm text-white/50">
                      Status: {account.status} · Plan: {account.plan}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                      type="button"
                    >
                      Pause
                    </button>
                    <button
                      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                      type="button"
                    >
                      Restore
                    </button>
                    <button
                      className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.08] px-4 py-2 text-sm font-semibold text-amber-100"
                      type="button"
                    >
                      Review
                    </button>
                    <button
                      className="rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-2 text-sm font-semibold text-red-200"
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm text-white/45">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
