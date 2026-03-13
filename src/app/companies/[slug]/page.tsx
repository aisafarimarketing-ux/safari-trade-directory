type CompanyPageProps = {
  params: {
    slug: string;
  };
};

import { headers } from "next/headers";
import { companies } from "../../../data/companies";
import { listings } from "../../../data/listings";
import { isPublicListing } from "../../../lib/listing-visibility";
async function getApiListings() {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  if (!host) return [];

  try {
    const res = await fetch(`${protocol}://${host}/api/admin/listings`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const json = await res.json();
    return Array.isArray(json.listings) ? json.listings : [];
  } catch {
    return [];
  }
}
export default async function CompanyPage({ params }: CompanyPageProps) {
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

  const showcaseListings = companyListings.slice(0, 5);
  const leadListing = showcaseListings[0];
  const supportListings = showcaseListings.slice(1, 5);

  const leadImage = leadListing?.coverImage || "";
  const supportImages = supportListings.map((listing) => ({
    src: listing.coverImage || listing.logoImage || "",
    alt: listing.name,
    href: `/profiles/${listing.slug}`,
  }));

  while (supportImages.length < 4) {
    supportImages.push({
      src: "",
      alt: "Portfolio image",
      href: "#",
    });
  }

  const regions = Array.from(
    new Set(
      companyListings
        .map((listing) => listing.location)
        .filter(Boolean),
    ),
  ).slice(0, 3);

  const listingTypes = Array.from(
    new Set(
      companyListings
        .map((listing) => listing.kind?.replace("-", " "))
        .filter(Boolean),
    ),
  ).slice(0, 3);

  const bestForTags = Array.from(
    new Set(
      companyListings.flatMap((listing) =>
        listing.matchAttributes?.idealFor?.slice(0, 2) || [],
      ),
    ),
  ).slice(0, 4);

  const featuredListings = companyListings.slice(0, 6);

  const answerRows = [
    {
      q: "Who are they?",
      a: company.name,
    },
    {
      q: "What kind of portfolio?",
      a: listingTypes.length
        ? listingTypes.join(" · ")
        : company.type,
    },
    {
      q: "Where do they operate?",
      a: regions.length ? regions.join(" · ") : company.location,
    },
    {
      q: "How many properties?",
      a: `${companyListings.length} listing${companyListings.length === 1 ? "" : "s"}`,
    },
    {
      q: "Why should a TO care?",
      a:
        bestForTags.length > 0
          ? `Strong fit for ${bestForTags.join(", ")}`
          : "Trade-ready safari portfolio with quick qualification value",
    },
    {
      q: "How do I get facts fast?",
      a: "Open listings, view profiles, and contact the trade desk",
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-10 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-100">
                  {company.type}
                </span>

                {company.location ? (
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    {company.location}
                  </span>
                ) : null}
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                  {company.name}
                </h1>

                <p className="max-w-3xl text-base leading-8 text-white/72 md:text-lg">
                  {company.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <span
                    key={region}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white/78"
                  >
                    {region}
                  </span>
                ))}

                {listingTypes.map((type) => (
                  <span
                    key={type}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white/78"
                  >
                    {type}
                  </span>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <QuickFact
                  label="Portfolio"
                  value={`${companyListings.length} live`}
                />
                <QuickFact
                  label="Regions"
                  value={regions.length ? String(regions.length) : "—"}
                />
                <QuickFact
                  label="Trade Fit"
                  value={bestForTags.length ? "Strong" : "Ready"}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#portfolio"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950"
                >
                  View Properties
                </a>

                <a
                  href="#portfolio"
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
                >
                  Download Company Fact Sheet
                </a>

                <a
                  href="/directory"
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
                >
                  Browse Directory
                </a>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                  At a glance
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {answerRows.map((row) => (
                    <div
                      key={row.q}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                    >
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                        {row.q}
                      </p>
                      <p className="mt-2 text-sm font-medium text-white/82">
                        {row.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-[34px] border border-white/10 bg-[#d7dde4] p-3 text-neutral-950 shadow-2xl">
                <div className="grid gap-3 md:grid-cols-[92px_1fr] lg:grid-cols-[104px_1fr]">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                    {supportImages.map((image, index) => (
                      <a
                        key={`${image.alt}-${index}`}
                        href={image.href}
                        className="block overflow-hidden rounded-[10px] border border-black/10 bg-black/10"
                      >
                        {image.src ? (
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="aspect-square h-full w-full object-cover"
                          />
                        ) : (
                          <div className="aspect-square h-full w-full bg-black/10" />
                        )}
                      </a>
                    ))}
                  </div>

                  <div className="overflow-hidden rounded-[10px] border border-black/10 bg-black/10">
                    {leadImage ? (
                      <img
                        src={leadImage}
                        alt={leadListing?.name || company.name}
                        className="aspect-[4/4.6] h-full w-full object-cover"
                      />
                    ) : (
                      <div className="aspect-[4/4.6] h-full w-full bg-black/10" />
                    )}
                  </div>
                </div>

                <div className="px-1 pb-1 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-600">
                    Portfolio showcase
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {company.name}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-700 sm:text-base">
                    Premium trade-facing snapshot of the collection, optimized
                    for fast mobile browsing and quick qualification on the go.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-10 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Why this collection matters
            </p>
            <p className="mt-4 text-base leading-8 text-white/72">
              {company.name} is positioned as a trade-friendly collection that
              helps tour operators qualify product quickly, compare properties
              efficiently, and access property fact sheets and contacts without
              friction.
            </p>

            {bestForTags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {bestForTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/75"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Trade actions
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <a
                href="#portfolio"
                className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-neutral-950"
              >
                Open Portfolio
              </a>

              <a
                href="/directory"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Browse Directory
              </a>

              <a
                href="/workspace"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Add to Workspace
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="portfolio"
        className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 md:px-10 md:pb-16"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/40">
              Company Portfolio
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Featured properties
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60 md:text-base">
              Quick showcase of live listings under this company umbrella, built
              for fast mobile scanning and immediate trade qualification.
            </p>
          </div>
        </div>

        {featuredListings.length === 0 ? (
          <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 text-white/60">
            No public listings are live for this company yet.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredListings.map((listing) => {
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
                    {(listing.tradeProfileLabel || listing.tradeProfileSub) && (
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                        {[listing.tradeProfileLabel, listing.tradeProfileSub]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}

                    <h3 className="text-2xl font-semibold">{listing.name}</h3>

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
                      {listing.matchAttributes.idealFor
                        .slice(0, 3)
                        .map((tag) => (
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function QuickFact({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
