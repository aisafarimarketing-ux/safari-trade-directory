import { headers } from "next/headers";

type ProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Downloadable = {
  id: string;
  title: string;
  type: "file" | "link";
  url: string;
  mime?: string;
  fileName?: string;
};

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
    mapLink?: string;
    website?: string;
    logoImage?: string;
    coverImage?: string;
    rating?: number | string;
    reviewCount?: number | string;
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    youtubeUrl?: string;
    roomTypeLabels?: {
      family?: string;
      double?: string;
      single?: string;
    };
    roomPhotos?: {
      family?: string[];
      double?: string[];
      single?: string[];
    };
    inclusions?: string[];
    exclusions?: string[];
    freeActivities?: string[];
    paidActivities?: string[];
    offersText?: string;
    terms?: string;
    downloadables?: Downloadable[];
    contactName?: string;
    contactTitle?: string;
    contactCompany?: string;
    contactEmail?: string;
    contactPhone?: string;
    contactWebsite?: string;
    leadHeadline?: string;
    leadSubcopy?: string;
    leadBullet1?: string;
    leadBullet2?: string;
    leadBullet3?: string;
    leadCta?: string;
    leadDisclaimer?: string;
    enquiryEmail?: string;
    enquiryWhatsApp?: string;
    enquirySubject?: string;
    taLogoUrl?: string;
    taLink?: string;
    taRating?: number | string;
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

async function getListingBySlug(slug: string): Promise<ApiListingRecord | null> {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  if (!host) return null;

  const res = await fetch(`${protocol}://${host}/api/admin/listings`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = await res.json();
  const listings = Array.isArray(json.listings) ? json.listings : [];

  return listings.find(
    (item: ApiListingRecord) =>
      item.slug === slug && item.status !== "archived",
  ) || null;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    return (
      <main className="min-h-screen bg-neutral-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-white/[0.03] p-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/40">
            SafariTrade
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Profile not found
          </h1>
          <p className="mt-4 max-w-2xl text-white/65">
            This trade profile does not exist yet or the link is no longer
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

  const data = listing.data || {};

  const location = listing.locationLabel || data.locationLabel || "Location not set";
  const vibe = listing.vibe || data.vibe || "";
  const website = listing.website || data.website || "";
  const rating = toNumber(data.rating);
  const reviewCount = toNumber(data.reviewCount);

  const socialLinks = {
    facebookUrl: data.facebookUrl || "",
    instagramUrl: data.instagramUrl || "",
    tiktokUrl: data.tiktokUrl || "",
    youtubeUrl: data.youtubeUrl || "",
  };

  const contactCard =
    data.contactName ||
    data.contactTitle ||
    data.contactCompany ||
    data.contactEmail ||
    data.contactPhone ||
    data.contactWebsite
      ? {
          contactName: data.contactName || "",
          contactTitle: data.contactTitle || "",
          contactCompany: data.contactCompany || "",
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          contactWebsite: data.contactWebsite || "",
        }
      : null;

  const leadCapture =
    data.leadHeadline ||
    data.leadSubcopy ||
    data.leadBullet1 ||
    data.leadBullet2 ||
    data.leadBullet3 ||
    data.leadCta ||
    data.leadDisclaimer ||
    data.enquiryEmail ||
    data.enquiryWhatsApp
      ? {
          headline: data.leadHeadline || "Trade Enquiries",
          subcopy: data.leadSubcopy || "",
          bullet1: data.leadBullet1 || "",
          bullet2: data.leadBullet2 || "",
          bullet3: data.leadBullet3 || "",
          cta: data.leadCta || "Send Enquiry",
          disclaimer: data.leadDisclaimer || "",
          enquiryEmail: data.enquiryEmail || "",
          enquiryWhatsApp: data.enquiryWhatsApp || "",
          enquirySubject: data.enquirySubject || "",
        }
      : null;

  const downloadables = Array.isArray(data.downloadables)
    ? data.downloadables
    : [];

  const roomPhotoGroups = [
    {
      key: "family",
      label: data.roomTypeLabels?.family || "Family setup",
      items: data.roomPhotos?.family || [],
    },
    {
      key: "double",
      label: data.roomTypeLabels?.double || "Double setup",
      items: data.roomPhotos?.double || [],
    },
    {
      key: "single",
      label: data.roomTypeLabels?.single || "Single setup",
      items: data.roomPhotos?.single || [],
    },
  ].filter((group) => group.items.length > 0);

  const taRating = toNumber(data.taRating ?? listing.tripadvisorRating);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.10),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)]" />

        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="inline-flex items-center rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-100">
                property
              </div>

              {(data.tradeProfileLabel || data.tradeProfileSub) && (
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                  {[data.tradeProfileLabel, data.tradeProfileSub]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}

              <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
                {listing.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/60">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  {location}
                </span>

                {typeof rating === "number" ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    Rating {rating.toFixed(1)}
                    {typeof reviewCount === "number"
                      ? ` · ${reviewCount} reviews`
                      : ""}
                  </span>
                ) : null}

                {listing.class ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    {listing.class}
                  </span>
                ) : null}
              </div>

              <p className="mt-8 max-w-3xl text-lg leading-8 text-white/70">
                {vibe || "Trade-ready safari property profile."}
              </p>

              {vibe ? (
                <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                    Property Vibe
                  </p>
                  <p className="mt-4 text-base leading-8 text-white/70">
                    {vibe}
                  </p>
                </div>
              ) : null}

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="/directory"
                  className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-950"
                >
                  Back to Directory
                </a>

                <a
                  href="/compare"
                  className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white"
                >
                  Compare
                </a>

                {data.mapLink ? (
                  <a
                    href={data.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white"
                  >
                    Open Map
                  </a>
                ) : null}
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                <FactCard label="Listing Type" value="property" />
                <FactCard label="Location" value={location} />
                <FactCard label="Status" value={listing.status} />
              </div>
            </div>

            <div className="lg:pt-8">
              <div className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-white/[0.10] to-white/[0.03] p-5 shadow-2xl">
                <div className="relative aspect-[4/5] rounded-[24px] border border-white/10 bg-neutral-900/70">
                  {data.coverImage ? (
                    <>
                      <img
                        src={data.coverImage}
                        alt={`${listing.name} cover`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/10 to-transparent" />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-300/15 via-white/5 to-emerald-300/10" />
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
                    </>
                  )}

                  <div className="absolute bottom-5 left-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black/35 shadow-lg backdrop-blur">
                    {data.logoImage ? (
                      <img
                        src={data.logoImage}
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

                <div className="mt-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/45">Hosted trade profile</p>
                    <p className="mt-1 text-lg font-semibold">{listing.name}</p>
                  </div>

                  <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100">
                    {listing.status}
                  </div>
                </div>
              </div>

              {(socialLinks.facebookUrl ||
                socialLinks.instagramUrl ||
                socialLinks.tiktokUrl ||
                socialLinks.youtubeUrl ||
                website) && (
                <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                    Links
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {website ? (
                      <a
                        href={website}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Website
                      </a>
                    ) : null}

                    {socialLinks.facebookUrl ? (
                      <a
                        href={socialLinks.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Facebook
                      </a>
                    ) : null}

                    {socialLinks.instagramUrl ? (
                      <a
                        href={socialLinks.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Instagram
                      </a>
                    ) : null}

                    {socialLinks.tiktokUrl ? (
                      <a
                        href={socialLinks.tiktokUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                      >
                        TikTok
                      </a>
                    ) : null}

                    {socialLinks.youtubeUrl ? (
                      <a
                        href={socialLinks.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white"
                      >
                        YouTube
                      </a>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {Array.isArray(data.inclusions) && data.inclusions.length ? (
              <DataBlock title="Inclusions" items={data.inclusions} />
            ) : null}

            {Array.isArray(data.exclusions) && data.exclusions.length ? (
              <DataBlock title="Exclusions" items={data.exclusions} />
            ) : null}

            {Array.isArray(data.freeActivities) && data.freeActivities.length ? (
              <DataBlock
                title="Included Activities"
                items={data.freeActivities}
              />
            ) : null}

            {Array.isArray(data.paidActivities) && data.paidActivities.length ? (
              <DataBlock title="Paid Activities" items={data.paidActivities} />
            ) : null}

            {roomPhotoGroups.length ? (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  Property Photos
                </p>

                <div className="mt-6 space-y-6">
                  {roomPhotoGroups.map((group) => (
                    <div key={group.key}>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
                        {group.label}
                      </h3>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {group.items.map((src, index) => (
                          <div
                            key={`${group.key}-${index}`}
                            className="overflow-hidden rounded-[24px] border border-white/10 bg-black/20"
                          >
                            <img
                              src={src}
                              alt={`${listing.name} ${group.label} ${index + 1}`}
                              className="aspect-[4/3] h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {data.offersText ? (
              <div className="rounded-[32px] border border-amber-300/15 bg-amber-300/[0.06] p-8">
                <p className="text-sm uppercase tracking-[0.2em] text-amber-100/70">
                  Offer
                </p>

                <p className="mt-5 text-base leading-8 text-white/80">
                  {data.offersText}
                </p>
              </div>
            ) : null}

            {data.terms ? (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  Terms
                </p>

                <p className="mt-5 text-base leading-8 text-white/70">
                  {data.terms}
                </p>
              </div>
            ) : null}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                Trade Actions
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <a
                  href="/directory"
                  className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-neutral-950"
                >
                  Browse More Profiles
                </a>

                <a
                  href="/workspace"
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Add to Workspace
                </a>
              </div>
            </div>

            {contactCard ? (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  Contact Card
                </p>

                <div className="mt-5 space-y-3">
                  <div>
                    <p className="text-lg font-semibold">{contactCard.contactName}</p>
                    <p className="text-sm text-white/55">
                      {contactCard.contactTitle}
                    </p>
                    <p className="text-sm text-white/55">
                      {contactCard.contactCompany}
                    </p>
                  </div>

                  {contactCard.contactEmail ? (
                    <a
                      href={`mailto:${contactCard.contactEmail}`}
                      className="block rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                    >
                      {contactCard.contactEmail}
                    </a>
                  ) : null}

                  {contactCard.contactPhone ? (
                    <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white">
                      {contactCard.contactPhone}
                    </div>
                  ) : null}

                  {contactCard.contactWebsite ? (
                    <a
                      href={contactCard.contactWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Open Website
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}

            {leadCapture ? (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  Trade Enquiries
                </p>

                <h3 className="mt-4 text-xl font-semibold">
                  {leadCapture.headline}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/65">
                  {leadCapture.subcopy}
                </p>

                <div className="mt-5 space-y-2">
                  [leadCapture.bullet1, leadCapture.bullet2, leadCapture.bullet3]
                    .filter(Boolean)
                    .map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75"
                      >
                        {item}
                      </div>
                    ))
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  {leadCapture.enquiryEmail ? (
                    <a
                      href={`mailto:${leadCapture.enquiryEmail}?subject=${encodeURIComponent(
                        leadCapture.enquirySubject || leadCapture.cta || "Trade Request",
                      )}`}
                      className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-neutral-950"
                    >
                      {leadCapture.cta || "Send Enquiry"}
                    </a>
                  ) : null}

                  {leadCapture.enquiryWhatsApp ? (
                    <a
                      href={`https://wa.me/${leadCapture.enquiryWhatsApp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white"
                    >
                      WhatsApp
                    </a>
                  ) : null}
                </div>

                {leadCapture.disclaimer ? (
                  <p className="mt-4 text-xs leading-6 text-white/45">
                    {leadCapture.disclaimer}
                  </p>
                ) : null}
              </div>
            ) : null}

            {downloadables.length ? (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  Downloads
                </p>

                <div className="mt-5 space-y-3">
                  {downloadables.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {(data.taLink || typeof taRating === "number") && (
              <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  Tripadvisor
                </p>

                <div className="mt-5 space-y-4">
                  {data.taLogoUrl ? (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white px-4 py-3">
                      <img
                        src={data.taLogoUrl}
                        alt="Tripadvisor"
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                  ) : null}

                  {typeof taRating === "number" ? (
                    <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white">
                      Rating {taRating.toFixed(1)}
                    </div>
                  ) : null}

                  {data.taLink ? (
                    <a
                      href={data.taLink}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Open Tripadvisor
                    </a>
                  ) : null}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

function DataBlock({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (!items.length) {
    return (
      <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-white/45">
          {title}
        </p>

        <p className="mt-5 text-sm text-white/60">No information yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-8">
      <p className="text-sm uppercase tracking-[0.18em] text-white/45">
        {title}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/75"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function FactCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold">{value}</p>
    </div>
  );
}
