import { headers } from "next/headers";

type ListingStatus = "draft" | "published" | "archived";

type ApiListingRecord = {
  id: string;
  slug: string;
  name: string;
  companySlug: string | null;
  status: ListingStatus | string | null;
  location: string | null;
  class: string | null;
  vibe: string | null;
  website: string | null;
  mapLink: string | null;
  tripadvisorRating: number | null;
  design?: {
    preset?: string;
  } | null;
  data?: Record<string, unknown> | null;
};

function toText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string")
    .map((item) => String(item).trim())
    .filter(Boolean);
}

function getPrimaryImage(listing: ApiListingRecord): string {
  const data = getRecord(listing.data);

  const coverImage = toText(data.coverImage);
  if (coverImage) return coverImage;

  const heroImage = toText(data.heroImage);
  if (heroImage) return heroImage;

  const images = getStringArray(data.images);
  if (images.length > 0) return images[0];

  const gallery = data.gallery;
  if (Array.isArray(gallery)) {
    for (const group of gallery) {
      const groupRecord = getRecord(group);
      const groupImages = groupRecord.images;

      if (Array.isArray(groupImages)) {
        for (const image of groupImages) {
          const value = toText(image);
          if (value) return value;
        }
      }
    }
  }

  return "";
}

function getQuickTags(listing: ApiListingRecord): string[] {
  const data = getRecord(listing.data);
  const quickTags = getStringArray(data.quickTags);

  if (quickTags.length > 0) {
    return Array.from(new Set(quickTags)).slice(0, 4);
  }

  const snapshot = getRecord(data.snapshot);
  const fallback = [
    listing.class,
    listing.vibe,
    toText(snapshot.bestFor),
    toText(snapshot.class),
    toText(snapshot.vibe),
  ]
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => String(value).trim());

  return Array.from(new Set(fallback)).slice(0, 4);
}

function getLowestRackRate(listing: ApiListingRecord): string {
  const data = getRecord(listing.data);
  const rates = getRecord(data.rates);
  const rows = rates.rows;

  if (!Array.isArray(rows)) return "";

  const values: number[] = [];

  for (const row of rows) {
    const rowRecord = getRecord(row);
    const raw =
      toText(rowRecord.rackPPPN) ||
      toText(rowRecord.rack) ||
      toText(rowRecord.rate) ||
      toText(rowRecord.price);

    if (!raw) continue;

    const numeric = Number(raw.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(numeric)) {
      values.push(numeric);
    }
  }

  if (values.length === 0) return "";

  return `$${Math.min(...values)}`;
}

function normalizeListingsResponse(json: unknown): ApiListingRecord[] {
  if (Array.isArray(json)) {
    return json as ApiListingRecord[];
  }

  const root = getRecord(json);

  if (Array.isArray(root.listings)) {
    return root.listings as ApiListingRecord[];
  }

  if (Array.isArray(root.data)) {
    return root.data as ApiListingRecord[];
  }

  return [];
}

function isPropertyListing(listing: ApiListingRecord): boolean {
  const slug = toText(listing.slug);
  if (!slug) return false;

  const status = toText(listing.status).toLowerCase();

  if (status === "archived") return false;

  return true;
}

export default async function DirectoryPage() {
  let listings: ApiListingRecord[] = [];
  let loadError = false;

  try {
    const headerStore = headers();
    const host = headerStore.get("host");
    const forwardedProto = headerStore.get("x-forwarded-proto");
    const protocol =
      forwardedProto || (process.env.NODE_ENV === "development" ? "http" : "https");

    if (!host) {
      throw new Error("Missing host header");
    }

    const response = await fetch(`${protocol}://${host}/api/admin/listings`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load listings");
    }

    const json = await response.json();
    listings = normalizeListingsResponse(json);
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
            No property listings available yet.
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleListings.map((listing) => {
            const data = getRecord(listing.data);
            const snapshot = getRecord(data.snapshot);

            const coverImage = getPrimaryImage(listing);
            const logoImage = toText(data.logoImage);
            const location =
              listing.location ||
              toText(snapshot.location) ||
              toText(data.locationLabel) ||
              toText(data.location) ||
              "Location not set";

            const vibe =
              listing.vibe ||
              toText(data.vibe) ||
              toText(data.overview) ||
              "Trade-ready safari property profile.";

            const website = listing.website || toText(data.website);
            const rating = toNumber(
              data.rating !== undefined ? data.rating : listing.tripadvisorRating,
            );
            const reviewCount = toNumber(data.reviewCount);
            const propertyClass =
              listing.class || toText(data.class) || toText(snapshot.class);
            const rooms =
              toText(snapshot.rooms) ||
              toText(data.rooms) ||
              toText(data.roomCount);
            const bestFor = toText(snapshot.bestFor) || toText(data.bestFor);
            const access = toText(snapshot.access) || toText(data.access);
            const rackFrom = getLowestRackRate(listing);
            const quickTags = getQuickTags(listing);

            const instagramUrl = toText(data.instagramUrl);
            const facebookUrl = toText(data.facebookUrl);
            const tiktokUrl = toText(data.tiktokUrl);
            const youtubeUrl = toText(data.youtubeUrl);

            const hasLinks =
              Boolean(website) ||
              Boolean(instagramUrl) ||
              Boolean(facebookUrl) ||
              Boolean(tiktokUrl) ||
              Boolean(youtubeUrl);

            const tradeProfileLabel = toText(data.tradeProfileLabel);
            const tradeProfileSub = toText(data.tradeProfileSub);

            const statusLabel = toText(listing.status).toLowerCase();

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

                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {listing.design?.preset ? (
                        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs text-white/75 backdrop-blur">
                          {listing.design.preset}
                        </span>
                      ) : null}

                      {statusLabel ? (
                        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs uppercase text-white/75 backdrop-blur">
                          {statusLabel}
                        </span>
                      ) : null}
                    </div>
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
                  {tradeProfileLabel || tradeProfileSub ? (
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      {[tradeProfileLabel, tradeProfileSub].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}

                  <h2 className="text-2xl font-semibold">{listing.name}</h2>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/55">
                    <span>{location}</span>

                    {propertyClass ? (
                      <>
                        <span className="text-white/25">•</span>
                        <span>{propertyClass}</span>
                      </>
                    ) : null}

                    {typeof rating === "number" ? (
                      <>
                        <span className="text-white/25">•</span>
                        <span>
                          {rating.toFixed(1)}
                          {typeof reviewCount === "number" ? ` (${reviewCount})` : ""}
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

                  {rooms || bestFor || access || rackFrom ? (
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
                      {instagramUrl ? (
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-white/70">
                          Instagram
                        </span>
                      ) : null}
                      {facebookUrl ? (
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-white/70">
                          Facebook
                        </span>
                      ) : null}
                      {tiktokUrl ? (
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-white/70">
                          TikTok
                        </span>
                      ) : null}
                      {youtubeUrl ? (
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
