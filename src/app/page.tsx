import { profiles } from "../data/profiles";
import { companies } from "../data/companies";

export default function HomePage() {
  const featuredProfiles = profiles.slice(0, 3);
  const featuredCompanies = companies.slice(0, 2);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.12),transparent_25%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
              Safari Trade Directory
            </div>

            <h1 className="mt-6 max-w-5xl text-5xl font-semibold tracking-tight text-white md:text-7xl md:leading-[1.02]">
              The trade directory for safari camps, brands, and travel businesses.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70 md:text-xl">
              A premium hosted platform where camps, DMCs, tour operators, and
              travel agents can publish professional trade profiles, present
              umbrella brands, and be discovered by the right industry partners.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/directory"
                className="inline-flex items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:scale-[1.01] hover:bg-emerald-300"
              >
                Explore Directory
              </a>

              <a
                href="/admin"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Open Admin
              </a>
            </div>

            <div className="mt-12 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm text-white/50">Profile types</p>
                <p className="mt-2 text-2xl font-semibold">4+</p>
                <p className="mt-1 text-sm text-white/60">
                  Camps, DMCs, operators, agents
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm text-white/50">Directory model</p>
                <p className="mt-2 text-2xl font-semibold">Umbrella + listing</p>
                <p className="mt-1 text-sm text-white/60">
                  One company with many properties
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm text-white/50">Platform direction</p>
                <p className="mt-2 text-2xl font-semibold">Trade-first</p>
                <p className="mt-1 text-sm text-white/60">
                  Hosted profiles, discovery, leads
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Featured Profiles
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Built for premium safari trade presentation
            </h2>
          </div>

          <a
            href="/directory"
            className="hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 md:inline-flex"
          >
            View all profiles
          </a>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featuredProfiles.map((profile) => (
            <a
              key={profile.slug}
              href={`/profiles/${profile.slug}`}
              className="group rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
                  {profile.type}
                </span>
                <span className="text-white/30 transition group-hover:text-white/60">
                  →
                </span>
              </div>

              <div className="mt-8 h-40 rounded-[24px] border border-white/10 bg-gradient-to-br from-white/10 to-white/0" />

              <h3 className="mt-6 text-2xl font-semibold">{profile.name}</h3>
              <p className="mt-2 text-sm text-white/50">{profile.location}</p>
              <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/65">
                {profile.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-2 md:px-10">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Why this platform matters
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Not just listings. A real trade infrastructure layer.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65">
              This is being designed as the digital trade layer for safari
              hospitality and travel businesses. Profiles today. Discovery,
              relationships, search, queries, premium tools, and self-managed
              accounts next.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-neutral-900 p-6">
              <h3 className="text-lg font-semibold">Hosted trade profiles</h3>
              <p className="mt-2 text-sm leading-7 text-white/60">
                Companies present brand, positioning, contacts, and trade-ready
                information in a polished public format.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-neutral-900 p-6">
              <h3 className="text-lg font-semibold">Umbrella company model</h3>
              <p className="mt-2 text-sm leading-7 text-white/60">
                One brand can host multiple camps or listings under one
                company-level identity.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-neutral-900 p-6">
              <h3 className="text-lg font-semibold">Future monetization</h3>
              <p className="mt-2 text-sm leading-7 text-white/60">
                Free entry can grow into premium placement, richer data modules,
                advanced profile features, and paid account management.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Umbrella Brands
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Company pages can anchor multiple camps
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {featuredCompanies.map((company) => (
            <div
              key={company.slug}
              className="rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-white/45">
                    {company.type}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{company.name}</h3>
                  <p className="mt-2 text-sm text-white/50">{company.location}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
                  Company
                </div>
              </div>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/65">
                {company.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`/companies/${company.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  View Company Page
                </a>
                <a
                  href="/directory"
                  className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/5"
                >
                  Explore Listings
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-emerald-400/15 via-white/[0.04] to-white/[0.02] p-8 md:p-12">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-white/45">
              Next phase
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Ready for company pages, advanced directory UX, and self-managed trade accounts.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/65">
              The core architecture is now in place. The next layer is company
              pages, richer profile content, and a more complete discovery
              experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/directory"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
              >
                Browse directory
              </a>
              <a
                href="/admin"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Continue building
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
