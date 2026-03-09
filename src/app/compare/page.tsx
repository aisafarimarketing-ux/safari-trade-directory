export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.10),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-100">
              Safari Trade Platform
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl md:leading-[1.02]">
              Plan better safaris.
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/70 md:text-xl">
              Discover camps, compare properties, and build safari itineraries
              in minutes — built for safari professionals.
            </p>

            {/* Planner Bar */}
            <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur">
              <div className="grid gap-3 md:grid-cols-5">
                <select className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none">
                  <option>Destination</option>
                  <option>Serengeti</option>
                  <option>Tarangire</option>
                  <option>Ngorongoro</option>
                </select>

                <select className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none">
                  <option>Travel Month</option>
                  <option>June</option>
                  <option>July</option>
                  <option>August</option>
                  <option>September</option>
                </select>

                <select className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none">
                  <option>Client Type</option>
                  <option>Honeymoon</option>
                  <option>Family</option>
                  <option>Photographic</option>
                  <option>Luxury Couples</option>
                </select>

                <select className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none">
                  <option>Budget</option>
                  <option>Upper Mid</option>
                  <option>Premium</option>
                  <option>Luxury</option>
                </select>

                <a
                  href="/match"
                  className="inline-flex items-center justify-center rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300"
                >
                  Match Safari
                </a>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/directory"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore Directory
              </a>
              <a
                href="/compare"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Compare Camps
              </a>
              <a
                href="/admin"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Open Admin
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Camps */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Featured Camps
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Trade-ready safari properties
            </h2>
          </div>
          <a
            href="/directory"
            className="hidden rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white md:inline-flex"
          >
            View all profiles
          </a>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Nyumbani Serengeti",
              location: "Serengeti National Park",
              slug: "nyumbani-serengeti",
            },
            {
              name: "Nyumbani Tarangire",
              location: "Tarangire National Park",
              slug: "nyumbani-tarangire",
            },
            {
              name: "Nyumbani Ngorongoro",
              location: "Ngorongoro Highlands",
              slug: "nyumbani-ngorongoro",
            },
          ].map((camp) => (
            <div
              key={camp.name}
              className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:bg-white/[0.05]"
            >
              <div className="aspect-[4/3] rounded-[24px] border border-white/10 bg-gradient-to-br from-white/10 to-white/0" />

              <h3 className="mt-6 text-2xl font-semibold">{camp.name}</h3>
              <p className="mt-2 text-sm text-white/55">{camp.location}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`/profiles/${camp.slug}`}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
                >
                  View Profile
                </a>
                <a
                  href="/compare"
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                >
                  Compare
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trade Tools */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Built for Safari Professionals
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              More than a directory
            </h2>
            <p className="mt-5 text-base leading-8 text-white/65">
              A planning platform for discovering camps, comparing properties,
              and building better safari decisions faster.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              {
                title: "Match Camps",
                text: "Find the best camps for a client brief instantly.",
              },
              {
                title: "Compare Camps",
                text: "See safari properties side by side to make faster decisions.",
              },
              {
                title: "Build Safaris",
                text: "Turn discoveries into structured safari plans and itineraries.",
              },
              {
                title: "Share Proposals",
                text: "Create polished safari options to send to clients and partners.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[28px] border border-white/10 bg-neutral-900 p-6"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <p className="text-sm uppercase tracking-[0.2em] text-white/40">
          Collections
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Umbrella brands and camp portfolios
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[30px] border border-white/10 bg-gradient-to-br from-amber-300/[0.10] to-white/[0.03] p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-white/45">
              Camp Brand
            </p>
            <h3 className="mt-3 text-2xl font-semibold">Nyumbani Collection</h3>
            <p className="mt-4 text-sm leading-7 text-white/65">
              One umbrella company can present multiple safari camps under one
              trade-facing identity.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Nyumbani Serengeti", "Nyumbani Tarangire", "Nyumbani Ngorongoro"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>

            <a
              href="/companies/nyumbani-collection"
              className="mt-8 inline-flex rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
            >
              View Company
            </a>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-white/45">
              What this unlocks
            </p>
            <div className="mt-5 space-y-4">
              {[
                "One brand can host multiple camps",
                "Agents can compare camps under one umbrella",
                "Trade profiles become easier to manage and discover",
                "Future matching and itinerary tools become more powerful",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-white/10 bg-black/20 p-4 text-sm text-white/70"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-emerald-300/[0.12] via-white/[0.04] to-white/[0.02] p-8 text-center md:p-12">
          <p className="text-sm uppercase tracking-[0.2em] text-white/45">
            Start Planning
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            The workspace for safari professionals
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/65">
            Match camps, compare properties, and move toward full safari planning
            from one platform.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/match"
              className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950"
            >
              Match Camps
            </a>
            <a
              href="/directory"
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white"
            >
              Explore Directory
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
