import { listings } from "../../data/listings";
import { companies } from "../../data/companies";

export default function DirectoryPage() {
  const publishedListings = listings.filter((listing) => listing.published);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            SafariTrade
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Trade Directory
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/65 md:text-lg">
            Discover camps, tour operators, DMCs, and trade profiles across the
            safari industry.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {publishedListings.map((listing) => {
            const company = companies.find(
              (item) => item.slug === listing.companySlug,
            );

            return (
              <div
                key={listing.id}
                className="group rounded-[30px] border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-100">
                    {listing.kind.replace("-", " ")}
                  </span>

                  {company ? (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                      {company.name}
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 aspect-[4/3] rounded-[24px] border border-white/10 bg-gradient-to-br from-white/10 to-white/0" />

                <h2 className="mt-6 text-2xl font-semibold">{listing.name}</h2>
                <p className="mt-2 text-sm text-white/55">{listing.location}</p>

                <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/65">
                  {listing.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {listing.matchAttributes.idealFor.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`/profiles/${listing.slug}`}
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

                  {company ? (
                    <a
                      href={`/companies/${company.slug}`}
                      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Company
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
