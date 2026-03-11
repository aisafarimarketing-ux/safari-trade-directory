import { headers } from "next/headers";

type ProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ThemeState = {
  pageBg: string;
  blockBg: string;
  accent: string;
  highlight: string;
  borderColor: string;
};

type BlockColorState = {
  header: string;
  tripadvisor: string;
  tradeDetails: string;
  matrix: string;
  inclusions: string;
  exclusions: string;
  experiences: string;
  offers: string;
  terms: string;
  leadCapture: string;
  contactCard: string;
  downloadables: string;
};

type VisibleBlocksState = {
  header: boolean;
  tripadvisor: boolean;
  tradeDetails: boolean;
  matrix: boolean;
  inclusions: boolean;
  exclusions: boolean;
  experiences: boolean;
  offers: boolean;
  terms: boolean;
  leadCapture: boolean;
  contactCard: boolean;
  downloadables: boolean;
  hero: boolean;
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
  design?: {
    theme?: ThemeState | null;
    blockColors?: BlockColorState | null;
    visibleBlocks?: VisibleBlocksState | null;
  };
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

const DEFAULT_THEME: ThemeState = {
  pageBg: "#0A0A0A",
  blockBg: "#111111",
  accent: "#FFFFFF",
  highlight: "#D4AF37",
  borderColor: "rgba(255,255,255,0.10)",
};

const DEFAULT_BLOCK_COLORS: BlockColorState = {
  header: "#111111",
  tripadvisor: "#111111",
  tradeDetails: "#111111",
  matrix: "#111111",
  inclusions: "#111111",
  exclusions: "#111111",
  experiences: "#111111",
  offers: "#1A1408",
  terms: "#111111",
  leadCapture: "#111111",
  contactCard: "#111111",
  downloadables: "#111111",
};

const DEFAULT_VISIBLE_BLOCKS: VisibleBlocksState = {
  header: true,
  tripadvisor: true,
  tradeDetails: true,
  matrix: true,
  inclusions: true,
  exclusions: true,
  experiences: true,
  offers: true,
  terms: true,
  leadCapture: true,
  contactCard: true,
  downloadables: true,
  hero: true,
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

  return (
    listings.find(
      (item: ApiListingRecord) =>
        item.slug === slug && item.status !== "archived",
    ) || null
  );
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
  const theme = {
    ...DEFAULT_THEME,
    ...(listing.design?.theme || {}),
  };
  const blockColors = {
    ...DEFAULT_BLOCK_COLORS,
    ...(listing.design?.blockColors || {}),
  };
  const visibleBlocks = {
    ...DEFAULT_VISIBLE_BLOCKS,
    ...(listing.design?.visibleBlocks || {}),
  };

  const location =
    listing.locationLabel || data.locationLabel || "Location not set";
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

  const pageStyle: React.CSSProperties = {
    backgroundColor: theme.pageBg,
    color: theme.accent,
  };

  const blockStyle = (bg: string): React.CSSProperties => ({
    backgroundColor: bg || theme.blockBg,
    borderColor: theme.borderColor,
    color: theme.accent,
  });

  const chipStyle: React.CSSProperties = {
    borderColor: theme.borderColor,
    color: theme.accent,
    backgroundColor: theme.blockBg,
  };

  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: theme.highlight,
    color: "#ffffff",
  };

  const secondaryButtonStyle: React.CSSProperties = {
    borderColor: theme.borderColor,
    backgroundColor: theme.blockBg,
    color: theme.accent,
  };

  const subtleText = { color: theme.accent, opacity: 0.65 };
  const faintText = { color: theme.accent, opacity: 0.45 };

  return (
    <main className="min-h-screen" style={pageStyle}>
      {visibleBlocks.header && (
        <section
          className="relative overflow-hidden border-b"
          style={{
            borderColor: theme.borderColor,
            backgroundColor: blockColors.header || theme.blockBg,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle_at_top_left,rgba(245,158,11,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.10),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)",
            }}
          />

          <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
            <div className="grid items-start gap-10 lg:grid-cols-[1.3fr_0.7fr]">
              <div>
                <div
                  className="inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]"
                  style={{
                    borderColor: theme.highlight,
                    backgroundColor: `${theme.highlight}22`,
                    color: theme.accent,
                  }}
                >
                  property
                </div>

                {(data.tradeProfileLabel || data.tradeProfileSub) && (
                  <p
                    className="mt-6 text-xs font-semibold uppercase tracking-[0.24em]"
                    style={faintText}
                  >
                    {[data.tradeProfileLabel, data.tradeProfileSub]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}

                <h1
                  className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl"
                  style={{ color: theme.accent }}
                >
                  {listing.name}
                </h1>

                <div
                  className="mt-5 flex flex-wrap items-center gap-3 text-sm"
                  style={subtleText}
                >
                  <span
                    className="rounded-full border px-3 py-1.5"
                    style={chipStyle}
                  >
                    {location}
                  </span>

                  {typeof rating === "number" ? (
                    <span
                      className="rounded-full border px-3 py-1.5"
                      style={chipStyle}
                    >
                      Rating {rating.toFixed(1)}
                      {typeof reviewCount === "number"
                        ? ` · ${reviewCount} reviews`
                        : ""}
                    </span>
                  ) : null}

                  {listing.class ? (
                    <span
                      className="rounded-full border px-3 py-1.5"
                      style={chipStyle}
                    >
                      {listing.class}
                    </span>
                  ) : null}
                </div>

                <p
                  className="mt-8 max-w-3xl text-lg leading-8"
                  style={subtleText}
                >
                  {vibe || "Trade-ready safari property profile."}
                </p>

                {visibleBlocks.tradeDetails && vibe ? (
                  <div
                    className="mt-8 rounded-[28px] border p-6"
                    style={blockStyle(blockColors.tradeDetails)}
                  >
                    <p
                      className="text-sm uppercase tracking-[0.2em]"
                      style={faintText}
                    >
                      Property Vibe
                    </p>
                    <p className="mt-4 text-base leading-8" style={subtleText}>
                      {vibe}
                    </p>
                  </div>
                ) : null}

                <div className="mt-10 flex flex-wrap gap-4">
                  <a
                    href="/directory"
                    className="rounded-2xl px-6 py-3 text-sm font-semibold"
                    style={primaryButtonStyle}
                  >
                    Back to Directory
                  </a>

                  <a
                    href="/compare"
                    className="rounded-2xl border px-6 py-3 text-sm font-semibold"
                    style={secondaryButtonStyle}
                  >
                    Compare
                  </a>

                  {data.mapLink ? (
                    <a
                      href={data.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border px-6 py-3 text-sm font-semibold"
                      style={secondaryButtonStyle}
                    >
                      Open Map
                    </a>
                  ) : null}
                </div>

                <div className="mt-12 grid gap-4 md:grid-cols-3">
                  <FactCard
                    label="Listing Type"
                    value="property"
                    theme={theme}
                  />
                  <FactCard label="Location" value={location} theme={theme} />
                  <FactCard label="Status" value={listing.status} theme={theme} />
                </div>
              </div>

              <div className="lg:pt-8">
                <div
                  className="overflow-hidden rounded-[36px] border p-5 shadow-2xl"
                  style={blockStyle(blockColors.header)}
                >
                  <div
                    className="relative aspect-[4/5] rounded-[24px] border"
                    style={{
                      borderColor: theme.borderColor,
                      backgroundColor: theme.blockBg,
                    }}
                  >
                    {data.coverImage ? (
                      <>
                        <img
                          src={data.coverImage}
                          alt={`${listing.name} cover`}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-300/15 via-white/5 to-emerald-300/10" />
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
                      </>
                    )}

                    <div
                      className="absolute bottom-5 left-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border shadow-lg backdrop-blur"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: `${theme.blockBg}CC`,
                      }}
                    >
                      {data.logoImage ? (
                        <img
                          src={data.logoImage}
                          alt={`${listing.name} logo`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span
                          className="px-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em]"
                          style={subtleText}
                        >
                          {listing.name.slice(0, 2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm" style={faintText}>
                        Hosted trade profile
                      </p>
                      <p
                        className="mt-1 text-lg font-semibold"
                        style={{ color: theme.accent }}
                      >
                        {listing.name}
                      </p>
                    </div>

                    <div
                      className="rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{
                        borderColor: theme.highlight,
                        backgroundColor: `${theme.highlight}22`,
                        color: theme.accent,
                      }}
                    >
                      {listing.status}
                    </div>
                  </div>
                </div>

                {(socialLinks.facebookUrl ||
                  socialLinks.instagramUrl ||
                  socialLinks.tiktokUrl ||
                  socialLinks.youtubeUrl ||
                  website) && (
                  <div
                    className="mt-6 rounded-[28px] border p-6"
                    style={blockStyle(blockColors.tradeDetails)}
                  >
                    <p
                      className="text-sm uppercase tracking-[0.2em]"
                      style={faintText}
                    >
                      Links
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {website ? (
                        <a
                          href={website}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-2xl border px-4 py-2 text-sm font-semibold"
                          style={secondaryButtonStyle}
                        >
                          Website
                        </a>
                      ) : null}

                      {socialLinks.facebookUrl ? (
                        <a
                          href={socialLinks.facebookUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-2xl border px-4 py-2 text-sm font-semibold"
                          style={secondaryButtonStyle}
                        >
                          Facebook
                        </a>
                      ) : null}

                      {socialLinks.instagramUrl ? (
                        <a
                          href={socialLinks.instagramUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-2xl border px-4 py-2 text-sm font-semibold"
                          style={secondaryButtonStyle}
                        >
                          Instagram
                        </a>
                      ) : null}

                      {socialLinks.tiktokUrl ? (
                        <a
                          href={socialLinks.tiktokUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-2xl border px-4 py-2 text-sm font-semibold"
                          style={secondaryButtonStyle}
                        >
                          TikTok
                        </a>
                      ) : null}

                      {socialLinks.youtubeUrl ? (
                        <a
                          href={socialLinks.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-2xl border px-4 py-2 text-sm font-semibold"
                          style={secondaryButtonStyle}
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
      )}

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {visibleBlocks.inclusions &&
            Array.isArray(data.inclusions) &&
            data.inclusions.length ? (
              <DataBlock
                title="Inclusions"
                items={data.inclusions}
                theme={theme}
                bg={blockColors.inclusions}
              />
            ) : null}

            {visibleBlocks.exclusions &&
            Array.isArray(data.exclusions) &&
            data.exclusions.length ? (
              <DataBlock
                title="Exclusions"
                items={data.exclusions}
                theme={theme}
                bg={blockColors.exclusions}
              />
            ) : null}

            {visibleBlocks.experiences &&
            Array.isArray(data.freeActivities) &&
            data.freeActivities.length ? (
              <DataBlock
                title="Included Activities"
                items={data.freeActivities}
                theme={theme}
                bg={blockColors.experiences}
              />
            ) : null}

            {visibleBlocks.experiences &&
            Array.isArray(data.paidActivities) &&
            data.paidActivities.length ? (
              <DataBlock
                title="Paid Activities"
                items={data.paidActivities}
                theme={theme}
                bg={blockColors.experiences}
              />
            ) : null}

            {visibleBlocks.matrix && roomPhotoGroups.length ? (
              <div
                className="rounded-[32px] border p-8"
                style={blockStyle(blockColors.matrix)}
              >
                <p
                  className="text-sm uppercase tracking-[0.2em]"
                  style={faintText}
                >
                  Property Photos
                </p>

                <div className="mt-6 space-y-6">
                  {roomPhotoGroups.map((group) => (
                    <div key={group.key}>
                      <h3
                        className="text-sm font-semibold uppercase tracking-[0.18em]"
                        style={subtleText}
                      >
                        {group.label}
                      </h3>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {group.items.map((src, index) => (
                          <div
                            key={`${group.key}-${index}`}
                            className="overflow-hidden rounded-[24px] border"
                            style={{
                              borderColor: theme.borderColor,
                              backgroundColor: theme.blockBg,
                            }}
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

            {visibleBlocks.offers && data.offersText ? (
              <div
                className="rounded-[32px] border p-8"
                style={blockStyle(blockColors.offers)}
              >
                <p
                  className="text-sm uppercase tracking-[0.2em]"
                  style={faintText}
                >
                  Offer
                </p>

                <p className="mt-5 text-base leading-8" style={subtleText}>
                  {data.offersText}
                </p>
              </div>
            ) : null}

            {visibleBlocks.terms && data.terms ? (
              <div
                className="rounded-[32px] border p-8"
                style={blockStyle(blockColors.terms)}
              >
                <p
                  className="text-sm uppercase tracking-[0.2em]"
                  style={faintText}
                >
                  Terms
                </p>

                <p className="mt-5 text-base leading-8" style={subtleText}>
                  {data.terms}
                </p>
              </div>
            ) : null}
          </div>

          <aside className="space-y-6">
            <div
              className="rounded-[32px] border p-6"
              style={blockStyle(theme.blockBg)}
            >
              <p
                className="text-sm uppercase tracking-[0.2em]"
                style={faintText}
              >
                Trade Actions
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <a
                  href="/directory"
                  className="rounded-2xl px-5 py-3 text-center text-sm font-semibold"
                  style={primaryButtonStyle}
                >
                  Browse More Profiles
                </a>

                <a
                  href="/workspace"
                  className="rounded-2xl border px-5 py-3 text-center text-sm font-semibold"
                  style={secondaryButtonStyle}
                >
                  Add to Workspace
                </a>
              </div>
            </div>

            {visibleBlocks.contactCard && contactCard ? (
              <div
                className="rounded-[32px] border p-6"
                style={blockStyle(blockColors.contactCard)}
              >
                <p
                  className="text-sm uppercase tracking-[0.2em]"
                  style={faintText}
                >
                  Contact Card
                </p>

                <div className="mt-5 space-y-3">
                  <div>
                    <p
                      className="text-lg font-semibold"
                      style={{ color: theme.accent }}
                    >
                      {contactCard.contactName}
                    </p>
                    <p className="text-sm" style={subtleText}>
                      {contactCard.contactTitle}
                    </p>
                    <p className="text-sm" style={subtleText}>
                      {contactCard.contactCompany}
                    </p>
                  </div>

                  {contactCard.contactEmail ? (
                    <a
                      href={`mailto:${contactCard.contactEmail}`}
                      className="block rounded-2xl border px-4 py-3 text-sm font-semibold"
                      style={secondaryButtonStyle}
                    >
                      {contactCard.contactEmail}
                    </a>
                  ) : null}

                  {contactCard.contactPhone ? (
                    <div
                      className="rounded-2xl border px-4 py-3 text-sm font-semibold"
                      style={secondaryButtonStyle}
                    >
                      {contactCard.contactPhone}
                    </div>
                  ) : null}

                  {contactCard.contactWebsite ? (
                    <a
                      href={contactCard.contactWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border px-4 py-3 text-sm font-semibold"
                      style={secondaryButtonStyle}
                    >
                      Open Website
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}

            {visibleBlocks.leadCapture && leadCapture ? (
              <div
                className="rounded-[32px] border p-6"
                style={blockStyle(blockColors.leadCapture)}
              >
                <p
                  className="text-sm uppercase tracking-[0.2em]"
                  style={faintText}
                >
                  Trade Enquiries
                </p>

                <h3
                  className="mt-4 text-xl font-semibold"
                  style={{ color: theme.accent }}
                >
                  {leadCapture.headline}
                </h3>

                <p className="mt-3 text-sm leading-7" style={subtleText}>
                  {leadCapture.subcopy}
                </p>

                <div className="mt-5 space-y-2">
                  {[leadCapture.bullet1, leadCapture.bullet2, leadCapture.bullet3]
                    .filter(Boolean)
                    .map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border px-4 py-3 text-sm"
                        style={secondaryButtonStyle}
                      >
                        {item}
                      </div>
                    ))}
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  {leadCapture.enquiryEmail ? (
                    <a
                      href={`mailto:${leadCapture.enquiryEmail}?subject=${encodeURIComponent(
                        leadCapture.enquirySubject ||
                          leadCapture.cta ||
                          "Trade Request",
                      )}`}
                      className="rounded-2xl px-5 py-3 text-center text-sm font-semibold"
                      style={primaryButtonStyle}
                    >
                      {leadCapture.cta || "Send Enquiry"}
                    </a>
                  ) : null}

                  {leadCapture.enquiryWhatsApp ? (
                    <a
                      href={`https://wa.me/${leadCapture.enquiryWhatsApp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border px-5 py-3 text-center text-sm font-semibold"
                      style={secondaryButtonStyle}
                    >
                      WhatsApp
                    </a>
                  ) : null}
                </div>

                {leadCapture.disclaimer ? (
                  <p className="mt-4 text-xs leading-6" style={faintText}>
                    {leadCapture.disclaimer}
                  </p>
                ) : null}
              </div>
            ) : null}

            {visibleBlocks.downloadables && downloadables.length ? (
              <div
                className="rounded-[32px] border p-6"
                style={blockStyle(blockColors.downloadables)}
              >
                <p
                  className="text-sm uppercase tracking-[0.2em]"
                  style={faintText}
                >
                  Downloads
                </p>

                <div className="mt-5 space-y-3">
                  {downloadables.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border px-4 py-3 text-sm font-semibold"
                      style={secondaryButtonStyle}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            {visibleBlocks.tripadvisor &&
            (data.taLink || typeof taRating === "number") ? (
              <div
                className="rounded-[32px] border p-6"
                style={blockStyle(blockColors.tripadvisor)}
              >
                <p
                  className="text-sm uppercase tracking-[0.2em]"
                  style={faintText}
                >
                  Tripadvisor
                </p>

                <div className="mt-5 space-y-4">
                  {data.taLogoUrl ? (
                    <div
                      className="overflow-hidden rounded-2xl border px-4 py-3"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <img
                        src={data.taLogoUrl}
                        alt="Tripadvisor"
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                  ) : null}

                  {typeof taRating === "number" ? (
                    <div
                      className="rounded-2xl border px-4 py-3 text-sm font-semibold"
                      style={secondaryButtonStyle}
                    >
                      Rating {taRating.toFixed(1)}
                    </div>
                  ) : null}

                  {data.taLink ? (
                    <a
                      href={data.taLink}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border px-4 py-3 text-sm font-semibold"
                      style={secondaryButtonStyle}
                    >
                      Open Tripadvisor
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}

function DataBlock({
  title,
  items,
  theme,
  bg,
}: {
  title: string;
  items: string[];
  theme: ThemeState;
  bg: string;
}) {
  if (!items.length) {
    return (
      <div
        className="rounded-[30px] border p-8"
        style={{
          borderColor: theme.borderColor,
          backgroundColor: bg || theme.blockBg,
          color: theme.accent,
        }}
      >
        <p
          className="text-sm uppercase tracking-[0.18em]"
          style={{ color: theme.accent, opacity: 0.45 }}
        >
          {title}
        </p>

        <p
          className="mt-5 text-sm"
          style={{ color: theme.accent, opacity: 0.6 }}
        >
          No information yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-[30px] border p-8"
      style={{
        borderColor: theme.borderColor,
        backgroundColor: bg || theme.blockBg,
        color: theme.accent,
      }}
    >
      <p
        className="text-sm uppercase tracking-[0.18em]"
        style={{ color: theme.accent, opacity: 0.45 }}
      >
        {title}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border px-3 py-1.5 text-xs"
            style={{
              borderColor: theme.borderColor,
              backgroundColor: theme.blockBg,
              color: theme.accent,
              opacity: 0.9,
            }}
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
  theme,
}: {
  label: string;
  value: string;
  theme: ThemeState;
}) {
  return (
    <div
      className="rounded-[22px] border p-4"
      style={{
        borderColor: theme.borderColor,
        backgroundColor: theme.blockBg,
        color: theme.accent,
      }}
    >
      <p
        className="text-xs uppercase tracking-[0.18em]"
        style={{ color: theme.accent, opacity: 0.4 }}
      >
        {label}
      </p>
      <p className="mt-2 text-base font-semibold">{value}</p>
    </div>
  );
}
