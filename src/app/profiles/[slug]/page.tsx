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
    rooms?: number | string;
    family?: number | string;
    double?: number | string;
    single?: number | string;
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
  const rooms = toNumber(data.rooms);
  const family = toNumber(data.family);
  const doubleRooms = toNumber(data.double);
  const singleRooms = toNumber(data.single);
  const taRating = toNumber(data.taRating ?? listing.tripadvisorRating);

  const socialLinks = {
    facebookUrl: data.facebookUrl || "",
    instagramUrl: data.instagramUrl || "",
    tiktokUrl: data.tiktokUrl || "",
    youtubeUrl: data.youtubeUrl || "",
  };

  const downloadables = Array.isArray(data.downloadables)
    ? data.downloadables
    : [];

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
          cta: data.leadCta || "Request Trade Pack",
          disclaimer: data.leadDisclaimer || "",
          enquiryEmail: data.enquiryEmail || "",
          enquiryWhatsApp: data.enquiryWhatsApp || "",
          enquirySubject: data.enquirySubject || "",
        }
      : null;

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

  const galleryImages = roomPhotoGroups.flatMap((group) =>
    group.items.map((src, index) => ({
      src,
      label: `${group.label} ${index + 1}`,
    })),
  );

  const topInclusions = Array.isArray(data.inclusions)
    ? data.inclusions.slice(0, 4)
    : [];
  const topIncludedActivities = Array.isArray(data.freeActivities)
    ? data.freeActivities.slice(0, 4)
    : [];
  const topPaidActivities = Array.isArray(data.paidActivities)
    ? data.paidActivities.slice(0, 4)
    : [];

  const pageStyle: React.CSSProperties = {
    backgroundColor: theme.pageBg,
    color: theme.accent,
  };

  const panelStyle = (bg: string): React.CSSProperties => ({
    backgroundColor: bg || theme.blockBg,
    borderColor: theme.borderColor,
    color: theme.accent,
  });

  const pillStyle: React.CSSProperties = {
    borderColor: theme.borderColor,
    backgroundColor: theme.blockBg,
    color: theme.accent,
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

  const titleStyle: React.CSSProperties = {
    color: theme.accent,
    opacity: 0.48,
  };

  const bodyStyle: React.CSSProperties = {
    color: theme.accent,
    opacity: 0.75,
  };

  const heroImage = data.coverImage || galleryImages[0]?.src || "";

  return (
    <main className="min-h-screen" style={pageStyle}>
      {visibleBlocks.hero && (
        <section
          className="border-b"
          style={{
            borderColor: theme.borderColor,
            backgroundColor: blockColors.header || theme.blockBg,
          }}
        >
          <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em]"
                    style={{
                      borderColor: theme.highlight,
                      backgroundColor: `${theme.highlight}22`,
                      color: theme.accent,
                    }}
                  >
                    Property
                  </span>

                  {(data.tradeProfileLabel || data.tradeProfileSub) && (
                    <span
                      className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                      style={titleStyle}
                    >
                      {[data.tradeProfileLabel, data.tradeProfileSub]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-4">
                  {data.logoImage ? (
                    <div
                      className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[22px] border"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.blockBg,
                      }}
                    >
                      <img
                        src={data.logoImage}
                        alt={`${listing.name} logo`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="min-w-0">
                    <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                      {listing.name}
                    </h1>
                    <p className="mt-3 max-w-3xl text-base leading-8 md:text-lg" style={bodyStyle}>
                      {vibe || "Trade-ready safari property profile."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Pill text={location} style={pillStyle} />
                  {listing.class ? <Pill text={listing.class} style={pillStyle} /> : null}
                  {typeof rating === "number" ? (
                    <Pill
                      text={`Rating ${rating.toFixed(1)}${typeof reviewCount === "number" ? ` · ${reviewCount}` : ""}`}
                      style={pillStyle}
                    />
                  ) : null}
                  {rooms !== null ? (
                    <Pill text={`Rooms ${rooms}`} style={pillStyle} />
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <QuickFact
                    label="Rooms"
                    value={rooms !== null ? String(rooms) : "—"}
                    theme={theme}
                  />
                  <QuickFact
                    label="Family"
                    value={family !== null ? String(family) : "—"}
                    theme={theme}
                  />
                  <QuickFact
                    label="Double"
                    value={doubleRooms !== null ? String(doubleRooms) : "—"}
                    theme={theme}
                  />
                  <QuickFact
                    label="Single"
                    value={singleRooms !== null ? String(singleRooms) : "—"}
                    theme={theme}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  {downloadables.length ? (
                    <a
                      href={downloadables[0].url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl px-5 py-3 text-sm font-semibold"
                      style={primaryButtonStyle}
                    >
                      Download Trade Pack
                    </a>
                  ) : null}

                  {leadCapture?.enquiryEmail ? (
                    <a
                      href={`mailto:${leadCapture.enquiryEmail}?subject=${encodeURIComponent(
                        leadCapture.enquirySubject ||
                          leadCapture.cta ||
                          "Trade Request",
                      )}`}
                      className="rounded-2xl border px-5 py-3 text-sm font-semibold"
                      style={secondaryButtonStyle}
                    >
                      Request Rates
                    </a>
                  ) : null}

                  {leadCapture?.enquiryWhatsApp ? (
                    <a
                      href={`https://wa.me/${leadCapture.enquiryWhatsApp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border px-5 py-3 text-sm font-semibold"
                      style={secondaryButtonStyle}
                    >
                      WhatsApp
                    </a>
                  ) : null}
                </div>

                {(topInclusions.length > 0 ||
                  topIncludedActivities.length > 0 ||
                  topPaidActivities.length > 0) && (
                  <div
                    className="rounded-[30px] border p-6"
                    style={panelStyle(blockColors.tradeDetails)}
                  >
                    <div className="grid gap-5 lg:grid-cols-3">
                      <SnapshotList
                        title="Key Inclusions"
                        items={topInclusions}
                        theme={theme}
                      />
                      <SnapshotList
                        title="Included Experiences"
                        items={topIncludedActivities}
                        theme={theme}
                      />
                      <SnapshotList
                        title="Paid Experiences"
                        items={topPaidActivities}
                        theme={theme}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div
                  className="overflow-hidden rounded-[34px] border"
                  style={panelStyle(blockColors.header)}
                >
                  <div
                    className="relative aspect-[4/3] overflow-hidden"
                    style={{ backgroundColor: theme.blockBg }}
                  >
                    {heroImage ? (
                      <img
                        src={heroImage}
                        alt={`${listing.name} hero`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.08))]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>

                  <div className="grid gap-3 p-5 sm:grid-cols-2">
                    {website ? (
                      <a
                        href={website}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border px-4 py-3 text-sm font-semibold"
                        style={secondaryButtonStyle}
                      >
                        Website
                      </a>
                    ) : null}
                    {data.mapLink ? (
                      <a
                        href={data.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border px-4 py-3 text-sm font-semibold"
                        style={secondaryButtonStyle}
                      >
                        Open Map
                      </a>
                    ) : null}
                    {socialLinks.instagramUrl ? (
                      <a
                        href={socialLinks.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border px-4 py-3 text-sm font-semibold"
                        style={secondaryButtonStyle}
                      >
                        Instagram
                      </a>
                    ) : null}
                    {socialLinks.facebookUrl ? (
                      <a
                        href={socialLinks.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border px-4 py-3 text-sm font-semibold"
                        style={secondaryButtonStyle}
                      >
                        Facebook
                      </a>
                    ) : null}
                  </div>
                </div>

                <div
                  className="rounded-[30px] border p-6"
                  style={panelStyle(blockColors.leadCapture)}
                >
                  <p className="text-sm uppercase tracking-[0.2em]" style={titleStyle}>
                    First Look Summary
                  </p>
                  <div className="mt-4 space-y-3">
                    <SummaryRow
                      label="Status"
                      value={listing.status}
                      theme={theme}
                    />
                    <SummaryRow
                      label="Best for"
                      value={listing.class || "Luxury safari trade"}
                      theme={theme}
                    />
                    <SummaryRow
                      label="Location"
                      value={location}
                      theme={theme}
                    />
                    <SummaryRow
                      label="Commercial"
                      value={data.offersText ? "Offer available" : "Standard terms"}
                      theme={theme}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            {visibleBlocks.matrix && galleryImages.length > 0 ? (
              <SectionCard
                title="Gallery"
                theme={theme}
                bg={blockColors.matrix}
              >
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {galleryImages.slice(0, 6).map((image) => (
                    <div
                      key={`${image.src}-${image.label}`}
                      className="overflow-hidden rounded-[22px] border"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.blockBg,
                      }}
                    >
                      <img
                        src={image.src}
                        alt={image.label}
                        className="aspect-[4/3] h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </SectionCard>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2">
              {visibleBlocks.inclusions && Array.isArray(data.inclusions) && data.inclusions.length ? (
                <SectionCard
                  title="Inclusions"
                  theme={theme}
                  bg={blockColors.inclusions}
                >
                  <TagList items={data.inclusions} theme={theme} />
                </SectionCard>
              ) : null}

              {visibleBlocks.exclusions && Array.isArray(data.exclusions) && data.exclusions.length ? (
                <SectionCard
                  title="Exclusions"
                  theme={theme}
                  bg={blockColors.exclusions}
                >
                  <TagList items={data.exclusions} theme={theme} />
                </SectionCard>
              ) : null}
            </div>

            {visibleBlocks.experiences &&
            ((Array.isArray(data.freeActivities) && data.freeActivities.length) ||
              (Array.isArray(data.paidActivities) && data.paidActivities.length)) ? (
              <SectionCard
                title="Experiences"
                theme={theme}
                bg={blockColors.experiences}
              >
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={titleStyle}>
                      Included
                    </p>
                    <div className="mt-3">
                      <TagList items={data.freeActivities || []} theme={theme} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={titleStyle}>
                      Paid
                    </p>
                    <div className="mt-3">
                      <TagList items={data.paidActivities || []} theme={theme} />
                    </div>
                  </div>
                </div>
              </SectionCard>
            ) : null}

            {(visibleBlocks.offers && data.offersText) ||
            (visibleBlocks.terms && data.terms) ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {visibleBlocks.offers && data.offersText ? (
                  <SectionCard
                    title="Offer"
                    theme={theme}
                    bg={blockColors.offers}
                  >
                    <p className="text-base leading-8" style={bodyStyle}>
                      {data.offersText}
                    </p>
                  </SectionCard>
                ) : null}

                {visibleBlocks.terms && data.terms ? (
                  <SectionCard
                    title="Terms"
                    theme={theme}
                    bg={blockColors.terms}
                  >
                    <p className="text-base leading-8" style={bodyStyle}>
                      {data.terms}
                    </p>
                  </SectionCard>
                ) : null}
              </div>
            ) : null}
          </div>

          <aside className="space-y-6">
            {visibleBlocks.leadCapture && leadCapture ? (
              <SectionCard
                title="Trade Enquiries"
                theme={theme}
                bg={blockColors.leadCapture}
              >
                <h3 className="text-2xl font-semibold">{leadCapture.headline}</h3>
                {leadCapture.subcopy ? (
                  <p className="mt-3 text-sm leading-7" style={bodyStyle}>
                    {leadCapture.subcopy}
                  </p>
                ) : null}

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
                      {leadCapture.cta || "Request Trade Pack"}
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
                  <p className="mt-4 text-xs leading-6" style={titleStyle}>
                    {leadCapture.disclaimer}
                  </p>
                ) : null}
              </SectionCard>
            ) : null}

            {visibleBlocks.downloadables && downloadables.length ? (
              <SectionCard
                title="Fact Sheets & Downloads"
                theme={theme}
                bg={blockColors.downloadables}
              >
                <div className="space-y-3">
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
              </SectionCard>
            ) : null}

            {visibleBlocks.contactCard && contactCard ? (
              <SectionCard
                title="Contact"
                theme={theme}
                bg={blockColors.contactCard}
              >
                <div>
                  <p className="text-xl font-semibold">{contactCard.contactName}</p>
                  {contactCard.contactTitle ? (
                    <p className="mt-1 text-sm" style={bodyStyle}>
                      {contactCard.contactTitle}
                    </p>
                  ) : null}
                  {contactCard.contactCompany ? (
                    <p className="text-sm" style={bodyStyle}>
                      {contactCard.contactCompany}
                    </p>
                  ) : null}
                </div>

                <div className="mt-5 space-y-3">
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
              </SectionCard>
            ) : null}

            {visibleBlocks.tripadvisor &&
            (data.taLink || typeof taRating === "number") ? (
              <SectionCard
                title="Tripadvisor"
                theme={theme}
                bg={blockColors.tripadvisor}
              >
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
                    className="mt-3 rounded-2xl border px-4 py-3 text-sm font-semibold"
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
                    className="mt-3 block rounded-2xl border px-4 py-3 text-sm font-semibold"
                    style={secondaryButtonStyle}
                  >
                    Open Tripadvisor
                  </a>
                ) : null}
              </SectionCard>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}

function Pill({
  text,
  style,
}: {
  text: string;
  style: React.CSSProperties;
}) {
  return (
    <span
      className="rounded-full border px-3 py-1.5 text-sm"
      style={style}
    >
      {text}
    </span>
  );
}

function QuickFact({
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
      className="rounded-[24px] border p-4"
      style={{
        borderColor: theme.borderColor,
        backgroundColor: theme.blockBg,
        color: theme.accent,
      }}
    >
      <p
        className="text-[11px] uppercase tracking-[0.18em]"
        style={{ color: theme.accent, opacity: 0.45 }}
      >
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  theme,
  bg,
  children,
}: {
  title: string;
  theme: ThemeState;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[30px] border p-6 md:p-8"
      style={{
        borderColor: theme.borderColor,
        backgroundColor: bg || theme.blockBg,
        color: theme.accent,
      }}
    >
      <p
        className="text-sm uppercase tracking-[0.2em]"
        style={{ color: theme.accent, opacity: 0.45 }}
      >
        {title}
      </p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function SnapshotList({
  title,
  items,
  theme,
}: {
  title: string;
  items: string[];
  theme: ThemeState;
}) {
  return (
    <div>
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: theme.accent, opacity: 0.45 }}
      >
        {title}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <span
              key={item}
              className="rounded-full border px-3 py-1.5 text-xs"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.blockBg,
                color: theme.accent,
              }}
            >
              {item}
            </span>
          ))
        ) : (
          <span style={{ color: theme.accent, opacity: 0.55 }}>
            None listed
          </span>
        )}
      </div>
    </div>
  );
}

function SummaryRow({
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
      className="flex items-center justify-between gap-4 rounded-2xl border px-4 py-3"
      style={{
        borderColor: theme.borderColor,
        backgroundColor: theme.blockBg,
        color: theme.accent,
      }}
    >
      <span style={{ opacity: 0.5 }}>{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}

function TagList({
  items,
  theme,
}: {
  items: string[];
  theme: ThemeState;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border px-3 py-1.5 text-xs"
          style={{
            borderColor: theme.borderColor,
            backgroundColor: theme.blockBg,
            color: theme.accent,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
