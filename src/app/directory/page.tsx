import { listings } from "../../data/listings";
import { companies } from "../../data/companies";
import { isPublicListing } from "../../lib/listing-visibility";

export default function DirectoryPage() {
  const publishedListings = listings.filter(isPublicListing);

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

            const propertyDetails = listing.propertyDetails;
            const socialLinks = listing.socialLinks;
            const hasLinks =
              !!propertyDetails?.website ||
              !!socialLinks?.facebookUrl ||
              !!socialLinks?.instagramUrl ||
              !!socialLinks?.tiktokUrl ||
              !!socialLinks?.youtubeUrl;

            return (
              <div
                key={listing.id}
                className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
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

                    {company ? (
                      <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs text-white/75 backdrop-blur">
                        {company.name}
                      </span>
                    ) : null}
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
                  {(listing.tradeProfileLabel || listing.tradeProfileSub) && (
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      {[listing.tradeProfileLabel, listing.tradeProfileSub]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}

                  <h2 className="text-2xl font-semibold">{listing.name}</h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/55">
                    <span>{listing.location}</span>

                    {typeof propertyDetails?.rating === "number" ? (
                      <>
                        <span className="text-white/25">•</span>
                        <span>
                          {propertyDetails.rating.toFixed(1)}
                          {typeof propertyDetails.reviewCount === "number"
                            ? ` (${propertyDetails.reviewCount})`
                            : ""}
                        </span>
                      </>
                    ) : null}
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/65">
                    {listing.description}
                  </p>

                  {propertyDetails?.vibe ? (
                    <p className="mt-4 line-clamp-2 text-sm leading-7 text-white/50">
                      {propertyDetails.vibe}
                    </p>
                  ) : null}

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

                  {hasLinks ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {propertyDetails?.website ? (
                        <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.08] px-3 py-1 text-[11px] text-emerald-100">
                          Website
                        </span>
                      ) : null}
                      {socialLinks?.instagramUrl ? (
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-white/70">
                          Instagram
                        </span>
                      ) : null}
                      {socialLinks?.facebookUrl ? (
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-white/70">
                          Facebook
                        </span>
                      ) : null}
                      {socialLinks?.tiktokUrl ? (
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-white/70">
                          TikTok
                        </span>
                      ) : null}
                      {socialLinks?.youtubeUrl ? (
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-white/70">
                          YouTube
                        </span>
                      ) : null}
                    </div>
                  ) : null}

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
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
