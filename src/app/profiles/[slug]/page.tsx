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
      <main className="min-h-screen bg-neutral-950 text-white px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-white/[0.03] p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            Safari Trade Directory
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Profile not found
          </h1>
          <p className="mt-4 max-w-2xl text-white/65">
            This trade profile does not exist yet, or the link is no longer
            active.
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
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.10),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="inline-flex items-center rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-100">
                {profile.type}
              </div>

              <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl md:leading-[1.02]">
                {profile.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/60">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  {profile.location}
                </span>

                {company ? (
                  <a
                    href={`/companies/${company.slug}`}
                    className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-emerald-100 transition hover:bg-emerald-300/15"
                  >
                    {company.name}
                  </a>
                ) : null}
              </div>

              <p className="mt-8 max-w-3xl text-lg leading-8 text-white/70 md:text-xl">
                {profile.description}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="/directory"
                  className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-white/90"
                >
                  Back to Directory
                </a>

                {company ? (
                  <a
                    href={`/companies/${company.slug}`}
                    className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    View Company
                  </a>
                ) : null}

                <a
                  href="/admin"
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Open Admin
                </a>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                  <p className="text-sm text-white/45">Profile type</p>
                  <p className="mt-2 text-2xl font-semibold">{profile.type}</p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                  <p className="text-sm text-white/45">Location</p>
                  <p className="mt-2 text-2xl font-semibold">{profile.location}</p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                  <p className="text-sm text-white/45">Company</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {company ? company.name : "Independent"}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:pt-8">
              <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-white/[0.10] to-white/[0.03] p-5 shadow-2xl">
                <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.18),transparent_35%),linear-gradient(to_bottom_right,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-4">
                  <div className="aspect-[4/5] rounded-[24px] border border-white/10 bg-neutral-900/70" />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/45">Hosted trade profile</p>
                    <p className="mt-1 text-lg font-semibold">{profile.name}</p>
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

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                Overview
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                A premium trade-facing listing
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/68">
                This page is the public-facing trade profile for {profile.name}.
                It is designed to become the destination where industry partners
                explore brand identity, location, company relationship, offers,
                downloads, and direct contact tools.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[30px] border border-emerald-300/15 bg-emerald-300/[0.08] p-8">
                <p className="text-sm uppercase tracking-[0.18em] text-emerald-100/70">
                  Trade Fit
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  Built for discovery
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  This profile structure supports hosted listings now and richer
                  trade intelligence later.
                </p>
              </div>

              <div className="rounded-[30px] border border-amber-300/15 bg-amber-300/[0.08] p-8">
                <p className="text-sm uppercase tracking-[0.18em] text-amber-100/70">
                  Brand Layer
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  Company-linked profile
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  This listing can sit under an umbrella company structure, so
                  one brand can present multiple properties.
                </p>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                What comes next
              </p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg font-semibold">Richer profile blocks</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    Offers, downloads, social links, rooming, activities,
                    contact exchange, and media can all be surfaced here.
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg font-semibold">Live trade interactions</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    Later this page can support enquiries, lookups, profile
                    discovery, and premium partner tools.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                Quick Facts
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Listing
                  </p>
                  <p className="mt-2 text-base font-semibold">{profile.name}</p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Type
                  </p>
                  <p className="mt-2 text-base font-semibold">{profile.type}</p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Location
                  </p>
                  <p className="mt-2 text-base font-semibold">{profile.location}</p>
                </div>

                {company ? (
                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                      Company
                    </p>
                    <p className="mt-2 text-base font-semibold">{company.name}</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-amber-300/[0.12] via-white/[0.04] to-white/[0.02] p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                Trade Actions
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <a
                  href="/directory"
                  className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-neutral-950"
                >
                  Browse More Profiles
                </a>

                {company ? (
                  <a
                    href={`/companies/${company.slug}`}
                    className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white"
                  >
                    Open Company Page
                  </a>
                ) : null}

                <a
                  href="/admin"
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Edit in Admin
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
