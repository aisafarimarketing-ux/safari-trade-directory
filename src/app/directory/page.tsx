import { headers } from "next/headers";

type ApiListingRecord = {
  id: string;
  slug: string;
  name: string;
  companySlug: string | null;
  status: "draft" | "published" | "archived";
  locationLabel: string | null;
  class: string | null;
  vibe: string | null;
  website: string | null;
  mapLink: string | null;
  tripadvisorRating: number | null;
  data: {
    name?: string;
    class?: string;
    vibe?: string;
    tradeProfileLabel?: string;
    tradeProfileSub?: string;
    locationLabel?: string;
    logoImage?: string;
    coverImage?: string;
    website?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    youtubeUrl?: string;
    rating?: number | string;
    reviewCount?: number | string;
  };
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isPropertyListing(listing: ApiListingRecord): boolean {
  const slug = (listing.slug || "").trim().toLowerCase();

  if (listing.status !== "published") return false;
  if (!slug) return false;

  return true;
}

export default async function DirectoryPage() {
  let listings: ApiListingRecord[] = [];
  let loadError = false;

  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    if (!host) {
      throw new Error("Missing host header");
    }

    const res = await fetch(`${protocol}://${host}/api/admin/listings`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to load listings");
    }

    const json = await res.json();
    listings = Array.isArray(json.listings) ? json.listings : [];
  } catch {
    loadError = true;
  }

  const visibleListings = listings.filter(isPropertyListing);

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
        {loadError ? (
          <div className="rounded-[30px] border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-100">
            Failed to load listings from the API.
          </div>
        ) : null}

        {!loadError && visibleListings.length === 0 ? (
          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-8 text-white/65">
            No published property listings available yet.
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleListings.map((listing) => {
            const data = listing.data || {};
            const coverImage = data.coverImage || "";
            const logoImage = data.logoImage || "";
            const location =
              listing.locationLabel || data.locationLabel || "Location not set";
            const vibe = listing.vibe || data.vibe || "";
            const website = listing.website || data.website || "";
            const rating = toNumber(data.rating ?? listing.tripadvisorRating);
            const reviewCount = toNumber(data.reviewCount);
            const propertyClass = listing.class || data.class || "";
            const socialLinks = {
              facebookUrl: data.facebookUrl || "",
              instagramUrl: data.instagramUrl || "",
              tiktokUrl: data.tiktokUrl || "",
              youtubeUrl: data.youtubeUrl || "",
            };

            const hasLinks =
              !!website ||
              !!socialLinks.facebookUrl ||
              !!socialLinks.instagramUrl ||
              !!socialLinks.tiktokUrl ||
              !!socialLinks.youtubeUrl;

            return (
              <div
                key={listing.id}
                className="group overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="relative aspect-[4/3] border-b border-white/10 bg-neutral-900">
                  {coverImage ? (
                    <>
                      <img
                        src={coverImage}
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
                      Property
                    </span>

                    <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs text-white/75 backdrop-blur">
                      {listing.status}
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black/35 shadow-lg backdrop-blur">
                    {logoImage ? (
                      <img
                        src={logoImage}
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
                  {(data.tradeProfileLabel || data.tradeProfileSub) && (
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      {[data.tradeProfileLabel, data.tradeProfileSub]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}

                  <h2 className="text-2xl font-semibold">{listing.name}</h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/55">
                    <span>{location}</span>

                    {typeof rating === "number" ? (
                      <>
                        <span className="text-white/25">•</span>
                        <span>
                          {rating.toFixed(1)}
                          {typeof reviewCount === "number"
                            ? ` (${reviewCount})`
                            : ""}
                        </span>
                      </>
                    ) : null}
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/65">
                    {vibe || "Trade-ready safari property profile."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {propertyClass ? (
                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                        {propertyClass}
                      </span>
                    ) : null}

                    {website ? (
                      <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.08] px-3 py-1 text-xs text-emerald-100">
                        Website
                      </span>
                    ) : null}
                  </div>

                  {hasLinks ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {socialLinks.instagramUrl ? (
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-white/70">
                          Instagram
                        </span>
                      ) : null}
                      {socialLinks.facebookUrl ? (
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-white/70">
                          Facebook
                        </span>
                      ) : null}
                      {socialLinks.tiktokUrl ? (
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-white/70">
                          TikTok
                        </span>
                      ) : null}
                      {socialLinks.youtubeUrl ? (
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
