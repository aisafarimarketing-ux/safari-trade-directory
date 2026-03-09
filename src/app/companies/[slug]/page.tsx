import { companies } from "../../../data/companies";
import { listings } from "../../../data/listings";
import { isPublicListing } from "../../../lib/listing-visibility";

type CompanyPageProps = {
  params: {
    slug: string;
  };
};

export default function CompanyPage({ params }: CompanyPageProps) {
  const company = companies.find((item) => item.slug === params.slug);

  if (!company) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-white/[0.03] p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            Companies
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Company not found
          </h1>
          <p className="mt-4 text-white/65">
            This company page does not exist yet.
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

  const companyListings = listings.filter(
    (listing) =>
      listing.companySlug === company.slug && isPublicListing(listing),
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            {company.type}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            {company.name}
          </h1>
          <p className="mt-4 text-white/60">{company.location}</p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/65 md:text-lg">
            {company.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Company Portfolio
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Listings under this umbrella
            </h2>
          </div>
        </div>

        {companyListings.length === 0 ? (
          <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-white/60">
            No public listings are live for this company yet.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {companyListings.map((listing) => (
              <div
                key={listing.id}
                className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:bg-white/[0.05]"
              >
                <div className="relative aspect-[4/3] border-b border-white/10 bg-neutral-900">
                  {listing.coverImage ? (
                    <>
                      <img
                        src={listing.coverImage}
                        alt={`${listing.name} cover`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-300/15 via-white/5 to-emerald-300/10" />
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
                    </>
                  )}

                  <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-4">
                    <span className="rounded-full border border-amber-300/20 bg-black/35 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-100 backdrop-blur">
                      {listing.kind.replace("-", " ")}
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black/35 shadow-lg backdrop-blur">
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

                <div className="p-6">
                  <h3 className="text-2xl font-semibold">{listing.name}</h3>
                  <p className="mt-2 text-sm text-white/55">
                    {listing.location}
                  </p>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
