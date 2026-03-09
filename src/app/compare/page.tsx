"use client";

import { useSearchParams } from "next/navigation";
import { listings } from "../../data/listings";
import { companies } from "../../data/companies";
import { isPublicListing } from "../../lib/listing-visibility";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const items = searchParams.get("items");

  const defaultSlugs = ["nyumbani-serengeti", "nyumbani-tarangire"];

  const selectedSlugs = items
    ? items
        .split(",")
        .map((slug) => slug.trim())
        .filter(Boolean)
    : defaultSlugs;

  const selectedListings = listings.filter(
    (listing) =>
      isPublicListing(listing) && selectedSlugs.includes(listing.slug),
  );

  const getCompanyName = (companySlug?: string) => {
    if (!companySlug) return "Independent";
    return companies.find((c) => c.slug === companySlug)?.name || "Independent";
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            Safari Compare Mode
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Compare safari listings side by side
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/65 md:text-lg">
            A trade-first comparison view for agents and partners evaluating
            which listing fits a client brief best.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/match"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950"
            >
              Back to Match
            </a>
            <a
              href="/directory"
              className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
            >
              Explore Directory
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        {selectedListings.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-10">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              No comparison selected
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Choose at least two listings to compare
            </h2>
            <p className="mt-4 max-w-2xl text-white/65">
              Go back to Match Safari, select listings, and then open Compare
              Mode.
            </p>

            <div className="mt-8">
              <a
                href="/match"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950"
              >
                Go to Match
              </a>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[980px] rounded-[32px] border border-white/10 bg-white/[0.03] p-4 md:p-6">
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `240px repeat(${selectedListings.length}, minmax(0, 1fr))`,
                }}
              >
                <div />

                {selectedListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                      {listing.kind.replace("-", " ")}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold">
                      {listing.name}
                    </h2>
                    <p className="mt-2 text-sm text-white/55">
                      {listing.location}
                    </p>

                    <div className="mt-6 overflow-hidden rounded-[22px] border border-white/10 bg-black/20">
                      <div className="relative aspect-[4/3] bg-neutral-900">
                        {listing.coverImage ? (
                          <>
                            <img
                              src={listing.coverImage}
                              alt={`${listing.name} cover`}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/15 to-transparent" />
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-300/15 via-white/5 to-emerald-300/10" />
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
                          </>
                        )}

                        <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black/35 shadow-lg backdrop-blur">
                          {listing.logoImage ? (
                            <img
                              src={listing.logoImage}
                              alt={`${listing.name} logo`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="px-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                              {listing.name.slice(0, 2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={`/profiles/${listing.slug}`}
                        className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
                      >
                        View Profile
                      </a>
                      {listing.companySlug ? (
                        <a
                          href={`/companies/${listing.companySlug}`}
                          className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                        >
                          Company
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}

                <CompareLabel title="Company" />
                {selectedListings.map((listing) => (
                  <CompareValue key={`${listing.id}-company`}>
                    {getCompanyName(listing.companySlug)}
                  </CompareValue>
                ))}

                <CompareLabel title="Description" />
                {selectedListings.map((listing) => (
                  <CompareValue key={`${listing.id}-description`}>
                    {listing.description}
                  </CompareValue>
                ))}

                <CompareLabel title="Ideal for" />
                {selectedListings.map((listing) => (
                  <CompareTags
                    key={`${listing.id}-ideal`}
                    items={listing.matchAttributes.idealFor}
                  />
                ))}

                <CompareLabel title="Budget bands" />
                {selectedListings.map((listing) => (
                  <CompareTags
                    key={`${listing.id}-budget`}
                    items={listing.matchAttributes.budgetBands}
                  />
                ))}

                <CompareLabel title="Destinations" />
                {selectedListings.map((listing) => (
                  <CompareTags
                    key={`${listing.id}-destinations`}
                    items={listing.matchAttributes.destinations}
                  />
                ))}

                <CompareLabel title="Travel months" />
                {selectedListings.map((listing) => (
                  <CompareTags
                    key={`${listing.id}-months`}
                    items={listing.matchAttributes.travelMonths}
                  />
                ))}

                <CompareLabel title="Experiences" />
                {selectedListings.map((listing) => (
                  <CompareTags
                    key={`${listing.id}-experiences`}
                    items={listing.matchAttributes.experiences}
                  />
                ))}

                <CompareLabel title="Style tags" />
                {selectedListings.map((listing) => (
                  <CompareTags
                    key={`${listing.id}-style`}
                    items={listing.matchAttributes.styleTags}
                  />
                ))}

                <CompareLabel title="Suitability" />
                {selectedListings.map((listing) => (
                  <CompareTags
                    key={`${listing.id}-suitability`}
                    items={listing.matchAttributes.suitability}
                  />
                ))}

                <CompareLabel title="Fit notes" />
                {selectedListings.map((listing) => (
                  <CompareValue key={`${listing.id}-notes`}>
                    {listing.matchAttributes.customFitNotes || "—"}
                  </CompareValue>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function CompareLabel({ title }: { title: string }) {
  return (
    <div className="flex items-start">
      <div className="w-full rounded-[24px] border border-white/10 bg-black/20 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
          {title}
        </p>
      </div>
    </div>
  );
}

function CompareValue({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/75">
      {children}
    </div>
  );
}

function CompareTags({ items }: { items: string[] }) {
  if (!items.length) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-sm text-white/55">
        —
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-amber-300/15 bg-amber-300/[0.08] px-3 py-1.5 text-xs font-medium text-amber-100"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
