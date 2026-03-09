"use client";

import { listings } from "../../../data/listings";

const sampleAccounts = [
  {
    id: "acct-nyumbani",
    name: "Nyumbani Collection",
    email: "trade@nyumbani.com",
    status: "active",
    plan: "free",
  },
  {
    id: "acct-hilala",
    name: "Hilala Camp",
    email: "hello@hilala.com",
    status: "paused",
    plan: "premium",
  },
  {
    id: "acct-savannah",
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
          and control payment-related visibility across the platform.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          <StatCard label="Accounts" value={String(sampleAccounts.length)} />
          <StatCard
            label="Active Listings"
            value={String(
              listings.filter((listing) => listing.accountStatus === "active")
                .length,
            )}
          />
          <StatCard
            label="Paused Listings"
            value={String(
              listings.filter((listing) => listing.accountStatus === "paused")
                .length,
            )}
          />
          <StatCard
            label="Flagged Listings"
            value={String(
              listings.filter((listing) => listing.accountStatus === "flagged")
                .length,
            )}
          />
        </div>

        <div className="mt-10 space-y-6">
          {sampleAccounts.map((account) => {
            const ownedListings = listings.filter(
              (listing) => listing.ownerAccountId === account.id,
            );

            return (
              <div
                key={account.id}
                className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{account.name}</h2>
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
                      Pause Account
                    </button>
                    <button
                      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                      type="button"
                    >
                      Restore Account
                    </button>
                    <button
                      className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.08] px-4 py-2 text-sm font-semibold text-amber-100"
                      type="button"
                    >
                      Review Account
                    </button>
                    <button
                      className="rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-2 text-sm font-semibold text-red-200"
                      type="button"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-sm uppercase tracking-[0.18em] text-white/40">
                    Owned Listings
                  </p>

                  {ownedListings.length === 0 ? (
                    <div className="mt-4 rounded-[24px] border border-white/10 bg-black/20 p-5 text-sm text-white/55">
                      No listings linked to this account yet.
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-4">
                      {ownedListings.map((listing) => (
                        <div
                          key={listing.id}
                          className="rounded-[24px] border border-white/10 bg-black/20 p-5"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-lg font-semibold">
                                  {listing.name}
                                </h3>
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-white/60">
                                  {listing.kind.replace("-", " ")}
                                </span>
                                <StatusPill status={listing.accountStatus} />
                              </div>

                              <p className="mt-2 text-sm text-white/60">
                                {listing.location}
                              </p>

                              <p className="mt-3 text-sm text-white/50">
                                Published: {listing.published ? "Yes" : "No"} ·
                                Featured: {listing.featured ? "Yes" : "No"}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <a
                                href={`/profiles/${listing.slug}`}
                                className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
                              >
                                View
                              </a>
                              <button
                                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                                type="button"
                              >
                                Pause Listing
                              </button>
                              <button
                                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                                type="button"
                              >
                                Restore Listing
                              </button>
                              <button
                                className="rounded-2xl border border-red-400/20 bg-red-400/[0.08] px-4 py-2 text-sm font-semibold text-red-200"
                                type="button"
                              >
                                Delete Listing
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {listing.matchAttributes.idealFor
                              .slice(0, 4)
                              .map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65"
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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

function StatusPill({
  status,
}: {
  status: "active" | "paused" | "flagged" | "deleted";
}) {
  const styles = {
    active:
      "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-100",
    paused: "border-white/15 bg-white/5 text-white/70",
    flagged: "border-amber-300/20 bg-amber-300/[0.08] text-amber-100",
    deleted: "border-red-400/20 bg-red-400/[0.08] text-red-200",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] ${styles[status]}`}
    >
      {status}
    </span>
  );
}
