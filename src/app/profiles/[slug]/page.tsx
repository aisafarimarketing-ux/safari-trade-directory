import { profiles } from "../../../data/profiles";
import { companies } from "../../../data/companies";

type ProfilePageProps = {
  params: {
    slug: string;
  };
};

export default function ProfilePage({ params }: ProfilePageProps) {
  const profile = profiles.find((item) => item.slug === params.slug);

  if (!profile) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-white/[0.03] p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            SafariTrade
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Profile not found
          </h1>
          <p className="mt-4 max-w-2xl text-white/65">
            This trade profile does not exist yet or the link is no longer active.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/directory"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950"
            >
              Back to Directory
            </a>

            <a
              href="/"
              className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
            >
              Go Home
            </a>
          </div>
        </div>
      </main>
    );
  }

  const company = companies.find((item) => item.slug === profile.companySlug);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.10),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)]" />

        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">

          <div className="grid items-start gap-10 lg:grid-cols-[1.3fr_0.7fr]">

            <div>

              <div className="inline-flex items-center rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-100">
                {profile.type}
              </div>

              <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
                {profile.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/60">

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  {profile.location}
                </span>

                {company && (
                  <a
                    href={`/companies/${company.slug}`}
                    className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-emerald-100 hover:bg-emerald-300/15"
                  >
                    {company.name}
                  </a>
                )}

              </div>

              <p className="mt-8 max-w-3xl text-lg leading-8 text-white/70">
                {profile.description}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">

                <a
                  href="/directory"
                  className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950"
                >
                  Back to Directory
                </a>

                {company && (
                  <a
                    href={`/companies/${company.slug}`}
                    className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white"
                  >
                    View Company
                  </a>
                )}

                <a
                  href="/compare"
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white"
                >
                  Compare
                </a>

              </div>

              {/* QUICK INFO */}

              <div className="mt-12 grid gap-4 md:grid-cols-3">

                <FactCard label="Profile Type" value={profile.type} />

                <FactCard label="Location" value={profile.location} />

                <FactCard
                  label="Company"
                  value={company ? company.name : "Independent"}
                />

              </div>

            </div>

            {/* IMAGE BLOCK */}

            <div className="lg:pt-8">

              <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-white/[0.10] to-white/[0.03] p-5 shadow-2xl">

                <div className="aspect-[4/5] rounded-[24px] border border-white/10 bg-neutral-900/70" />

                <div className="mt-5 flex items-center justify-between">

                  <div>
                    <p className="text-sm text-white/45">
                      Hosted trade profile
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {profile.name}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">
                    Live
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* MATCH ATTRIBUTES */}

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          <div className="space-y-6">

            <DataBlock
              title="Ideal For"
              items={profile.matchAttributes.idealFor}
            />

            <DataBlock
              title="Experiences"
              items={profile.matchAttributes.experiences}
            />

            <DataBlock
              title="Style"
              items={profile.matchAttributes.styleTags}
            />

            <DataBlock
              title="Suitability"
              items={profile.matchAttributes.suitability}
            />

            <DataBlock
              title="Budget Bands"
              items={profile.matchAttributes.budgetBands}
            />

            <DataBlock
              title="Travel Months"
              items={profile.matchAttributes.travelMonths}
            />

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">

              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                Fit Notes
              </p>

              <p className="mt-5 text-base leading-8 text-white/70">
                {profile.matchAttributes.customFitNotes ||
                  "No additional notes yet."}
              </p>

            </div>

          </div>

          {/* SIDEBAR */}

          <aside className="space-y-6">

            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">

              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                Trade Actions
              </p>

              <div className="mt-5 flex flex-col gap-3">

                <a
                  href="/directory"
                  className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-neutral-950"
                >
                  Browse More Profiles
                </a>

                {company && (
                  <a
                    href={`/companies/${company.slug}`}
                    className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white"
                  >
                    Open Company Page
                  </a>
                )}

                <a
                  href="/workspace"
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Add to Workspace
                </a>

              </div>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}

function DataBlock({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-8">
      <p className="text-sm uppercase tracking-[0.18em] text-white/45">
        {title}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">

        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/75"
          >
            {item}
          </span>
        ))}

      </div>
    </div>
  );
}

function FactCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold">{value}</p>
    </div>
  );
}
