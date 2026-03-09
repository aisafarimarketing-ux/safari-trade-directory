"use client";

import { useSearchParams } from "next/navigation";
import { profiles } from "../../data/profiles";
import { companies } from "../../data/companies";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const items = searchParams.get("items");

  const selectedSlugs = items
    ? items.split(",").map((slug) => slug.trim()).filter(Boolean)
    : ["nyumbani-serengeti", "nyumbani-tarangire"];

  const selectedProfiles = profiles.filter((p) =>
    selectedSlugs.includes(p.slug),
  );

  const getCompanyName = (companySlug: string) => {
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
            Compare safari trade profiles side by side
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/65 md:text-lg">
            A trade-first comparison view for agents and partners evaluating
            which camp fits a client brief best.
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
        {selectedProfiles.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-10">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              No comparison selected
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Choose at least two camps to compare
            </h2>
            <p className="mt-4 max-w-2xl text-white/65">
              Go back to Match Safari, select camps, and then open Compare Mode.
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
                  gridTemplateColumns: `240px repeat(${selectedProfiles.length}, minmax(0, 1fr))`,
                }}
              >
                <div />

                {selectedProfiles.map((profile) => (
                  <div
                    key={profile.slug}
                    className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                      {profile.type}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold">{profile.name}</h2>
                    <p className="mt-2 text-sm text-white/55">{profile.location}</p>

                    <div className="mt-6 aspect-[4/3] rounded-[22px] border border-white/10 bg-black/20" />

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={`/profiles/${profile.slug}`}
                        className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
                      >
                        View Profile
                      </a>
                      <a
                        href={`/companies/${profile.companySlug}`}
                        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Company
                      </a>
                    </div>
                  </div>
                ))}

                <CompareLabel title="Company" />
                {selectedProfiles.map((profile) => (
                  <CompareValue key={`${profile.slug}-company`}>
                    {getCompanyName(profile.companySlug)}
                  </CompareValue>
                ))}

                <CompareLabel title="Description" />
                {selectedProfiles.map((profile) => (
                  <CompareValue key={`${profile.slug}-description`}>
                    {profile.description}
                  </CompareValue>
                ))}

                <CompareLabel title="Ideal for" />
                {selectedProfiles.map((profile) => (
                  <CompareTags
                    key={`${profile.slug}-ideal`}
                    items={profile.matchAttributes.idealFor}
                  />
                ))}

                <CompareLabel title="Budget bands" />
                {selectedProfiles.map((profile) => (
                  <CompareTags
                    key={`${profile.slug}-budget`}
                    items={profile.matchAttributes.budgetBands}
                  />
                ))}

                <CompareLabel title="Destinations" />
                {selectedProfiles.map((profile) => (
                  <CompareTags
                    key={`${profile.slug}-destinations`}
                    items={profile.matchAttributes.destinations}
                  />
                ))}

                <CompareLabel title="Travel months" />
                {selectedProfiles.map((profile) => (
                  <CompareTags
                    key={`${profile.slug}-months`}
                    items={profile.matchAttributes.travelMonths}
                  />
                ))}

                <CompareLabel title="Experiences" />
                {selectedProfiles.map((profile) => (
                  <CompareTags
                    key={`${profile.slug}-experiences`}
                    items={profile.matchAttributes.experiences}
                  />
                ))}

                <CompareLabel title="Style tags" />
                {selectedProfiles.map((profile) => (
                  <CompareTags
                    key={`${profile.slug}-style`}
                    items={profile.matchAttributes.styleTags}
                  />
                ))}

                <CompareLabel title="Suitability" />
                {selectedProfiles.map((profile) => (
                  <CompareTags
                    key={`${profile.slug}-suitability`}
                    items={profile.matchAttributes.suitability}
                  />
                ))}

                <CompareLabel title="Fit notes" />
                {selectedProfiles.map((profile) => (
                  <CompareValue key={`${profile.slug}-notes`}>
                    {profile.matchAttributes.customFitNotes || "—"}
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
