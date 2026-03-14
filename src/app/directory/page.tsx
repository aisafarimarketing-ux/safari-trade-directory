import { headers } from "next/headers";

type ListingStatus = "draft" | "published" | "archived";

type GalleryGroup = {
  label: string;
  images: string[];
};

type RateRow = {
  season: string;
  dates: string;
  rackPPPN: string;
};

type ApiListingRecord = {
  id: string;
  slug: string;
  name: string;
  companySlug: string | null;
  status: ListingStatus;
  location: string | null;
  class: string | null;
  vibe: string | null;
  website: string | null;
  mapLink: string | null;
  tripadvisorRating: number | null;
  design?: {
    preset?: "safari-dossier" | "modern-trade-deck" | "editorial-luxury";
    theme?: {
      pageBg?: string;
      blockBg?: string;
      accent?: string;
      highlight?: string;
      borderColor?: string;
    } | null;
  };
  data?: {
    overview?: string | null;
    snapshot?: {
      rooms?: string | null;
      location?: string | null;
      bestFor?: string | null;
      setting?: string | null;
      style?: string | null;
      access?: string | null;
    };
    gallery?: GalleryGroup[];
    rates?: {
      currency?: string | null;
      notes?: string[];
      rows?: RateRow[];
    };
    experiences?: {
      included?: string[];
      paid?: string[];
    };
    policies?: {
      childPolicy?: string | null;
      honeymoonPolicy?: string | null;
      cancellation?: string | null;
      importantNotes?: string[];
      tradeNotes?: string[];
    };
    downloads?: Array<{
      label: string;
      url: string;
      type?: string | null;
    }>;
    contacts?: {
      reservations?: Array<{
        name?: string | null;
        role?: string | null;
        email?: string | null;
        phone?: string | null;
        whatsapp?: string | null;
      }>;
      sales?: Array<{
        name?: string | null;
        role?: string | null;
        email?: string | null;
        phone?: string | null;
        whatsapp?: string | null;
      }>;
      marketing?: Array<{
        name?: string | null;
        role?: string | null;
        email?: string | null;
        phone?: string | null;
        whatsapp?: string | null;
      }>;
    };
    offers?: string[];
    sustainability?: string | null;

    // backward-compatible legacy fields
    class?: string;
    vibe?: string;
    tradeProfileLabel?: string;
    tradeProfileSub?: string;
    locationLabel?: string;
    logoImage?: string;
    coverImage?: string;
    heroImage?: string;
    website?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    youtubeUrl?: string;
    rating?: number | string;
    reviewCount?: number | string;
    quickTags?: string[];
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

function toText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getPrimaryImage(listing: ApiListingRecord): string {
  const data = listing.data;

  if (toText(data?.coverImage)) return toText(data?.coverImage);
  if (toText(data?.heroImage)) return toText(data?.heroImage);

  const gallery = data?.gallery;
  if (Array.isArray(gallery)) {
    for (const group of gallery) {
      if (!group || !Array.isArray(group.images)) continue;
      for (const image of group.images) {
        if (typeof image === "string" && image.trim()) {
          return image.trim();
        }
      }
    }
  }

  return "";
}

function getQuickTags(listing: ApiListingRecord): string[] {
  const legacyTags = listing.data?.quickTags;

  if (Array.isArray(legacyTags)) {
    const cleaned = legacyTags
      .filter((tag) => typeof tag === "string")
      .map((tag) => tag.trim())
      .filter(Boolean);

    return Array.from(new Set(cleaned)).slice(0, 4);
  }

  const fallbackValues = [
    listing.class,
    listing.vibe,
    listing.data?.snapshot?.bestFor,
  ];

  const cleaned = fallbackValues
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => (typeof value === "string" ? value.trim() : ""));

  return Array.from(new Set(cleaned)).slice(0, 4);
}

function getLowestRackRate(listing: ApiListingRecord): string {
  const rows = listing.data?.rates?.rows;

  if (!Array.isArray(rows) || rows.length === 0) return "";

  const values = rows
    .map((row) => {
      if (!row || typeof row.rackPPPN !== "string") return null;
      const numeric = Number(row.rackPPPN.replace(/[^0-9.]/g, ""));
      return Number.isFinite(numeric) ? numeric : null;
    })
    .filter((value) => value !== null) as number[];

  if (values.length === 0) return "";

  return `$${Math.min(...values)}`;
}

function isPropertyListing(listing: ApiListingRecord): boolean {
  if (listing.status !== "published") return false;
  if (!toText(listing.slug)) return false;
  return true;
}

export default async function DirectoryPage() {
  let listings: ApiListingRecord[] = [];
  let loadError = false;

  try {
    const headerStore = headers();
    const host = headerStore.get("host");
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
    listings = Array.isArray(json.listings)
      ? (json.listings as ApiListingRecord[])
      : [];
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
            Discover safari properties through fast, mobile-friendly trade
            dossiers built for tour operators and travel advisors.
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
            const data = listing.data ?? {};
            const coverImage = getPrimaryImage(listing);
            const logoImage = toText(data.logoImage);
            const location =
              listing.location ||
              data.snapshot?.location ||
              data.locationLabel ||
              "Location not set";

            const vibe =
              listing.vibe || data.vibe || data.overview || "Trade-ready safari property profile.";

            const website = listing.website || data.website || "";
            const rating = toNumber(data.rating ?? listing.tripadvisorRating);
            const reviewCount = toNumber(data.reviewCount);
            const propertyClass = listing.class || data.class || "";
            const rooms = toText(data.snapshot?.rooms);
            const bestFor = toText(data.snapshot?.bestFor);
            const access = toText(data.snapshot?.access);
            const rackFrom = getLowestRackRate(listing);
            const quickTags = getQuickTags(listing);

            const socialLinks = {
              facebookUrl: toText(data.facebookUrl),
              instagramUrl: toText(data.instagramUrl),
              tiktokUrl: toText(data.tiktokUrl),
              youtubeUrl: toText(data.youtubeUrl),
            };

            const hasLinks =
              Boolean(website) ||
              Boolean(socialLinks.facebookUrl) ||
              Boolean(socialLinks.instagramUrl) ||
              Boolean(socialLinks.tiktokUrl) ||
              Boolean(socialLinks.youtubeUrl);

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

                    {listing.design?.preset ? (
                      <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs text-white/75 backdrop-blur">
                        {listing.design.preset}
                      </span>
                    ) : null}
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
                    {vibe}
                  </p>

                  {quickTags.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {quickTags.map((tag) => (
                        <span
                          key={`${listing.id}-${tag}`}
                          className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {(rooms || bestFor || access || rackFrom) && (
                    <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-white/75">
                      {rooms ? (
                        <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                          <span className="block text-[10px] uppercase tracking-[0.18em] text-white/40">
                            Rooms
                          </span>
                          <span className="mt-1 block">{rooms}</span>
                        </div>
                      ) : null}

                      {bestFor ? (
                        <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                          <span className="block text-[10px] uppercase tracking-[0.18em] text-white/40">
                            Best For
                          </span>
                          <span className="mt-1 block">{bestFor}</span>
                        </div>
                      ) : null}

                      {access ? (
                        <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                          <span className="block text-[10px] uppercase tracking-[0.18em] text-white/40">
                            Access
                          </span>
                          <span className="mt-1 block">{access}</span>
                        </div>
                      ) : null}

                      {rackFrom ? (
                        <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                          <span className="block text-[10px] uppercase tracking-[0.18em] text-white/40">
                            Rack From
                          </span>
                          <span className="mt-1 block">{rackFrom} PPPN</span>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {hasLinks ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {website ? (
                        <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.08] px-3 py-1 text-xs text-emerald-100">
                          Website
                        </span>
                      ) : null}
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
                      Add to Compare
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
