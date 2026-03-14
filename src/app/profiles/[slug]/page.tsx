import { headers } from "next/headers";
import type { ReactNode } from "react";

type ProfilePageProps = {
  params: {
    slug: string;
  };
};

type ThemeState = {
  pageBg: string;
  blockBg: string;
  accent: string;
  highlight: string;
  borderColor: string;
};

type ApiListingRecord = {
  id: string;
  slug: string;
  name: string;
  companySlug: string | null;
  status: "draft" | "published" | "archived";
  location: string | null;
  class: string | null;
  vibe: string | null;
  website: string | null;
  mapLink: string | null;
  tripadvisorRating: number | null;
  design?: {
    preset?: string;
    theme?: Record<string, unknown> | null;
  } | null;
  data?: Record<string, unknown> | null;
};

const DEFAULT_THEME: ThemeState = {
  pageBg: "#f3eee5",
  blockBg: "#fbf7f1",
  accent: "#4d3a24",
  highlight: "#8e7650",
  borderColor: "rgba(109, 86, 55, 0.16)",
};

function getRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string")
    .map((item) => String(item).trim())
    .filter(Boolean);
}

function getTheme(listing: ApiListingRecord): ThemeState {
  const raw = getRecord(listing.design?.theme);

  return {
    pageBg: getString(raw.pageBg) || DEFAULT_THEME.pageBg,
    blockBg: getString(raw.blockBg) || DEFAULT_THEME.blockBg,
    accent: getString(raw.accent) || DEFAULT_THEME.accent,
    highlight: getString(raw.highlight) || DEFAULT_THEME.highlight,
    borderColor: getString(raw.borderColor) || DEFAULT_THEME.borderColor,
  };
}

function isValidPropertyProfile(item: ApiListingRecord, slug: string): boolean {
  const listingSlug = getString(item.slug).toLowerCase();
  const companySlug = getString(item.companySlug).toLowerCase();
  const listingName = getString(item.name).toLowerCase();

  if (item.status !== "published") return false;
  if (!listingSlug) return false;
  if (listingSlug !== slug.toLowerCase()) return false;
  if (companySlug && listingSlug === companySlug) return false;
  if (companySlug && listingName === companySlug.replace(/-/g, " ")) return false;

  return true;
}

async function getListingBySlug(slug: string): Promise<ApiListingRecord | null> {
  const headerStore = headers();
  const host = headerStore.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  if (!host) return null;

  try {
    const response = await fetch(`${protocol}://${host}/api/admin/listings`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const json = await response.json();
    const root = getRecord(json);
    const listings = root.listings;

    if (!Array.isArray(listings)) return null;

    const match = (listings as ApiListingRecord[]).find((item) =>
      isValidPropertyProfile(item, slug),
    );

    return match || null;
  } catch {
    return null;
  }
}

function getData(listing: ApiListingRecord): Record<string, unknown> {
  return getRecord(listing.data);
}

function getSnapshot(listing: ApiListingRecord): Record<string, unknown> {
  const data = getData(listing);
  return getRecord(data.snapshot);
}

function getRates(listing: ApiListingRecord): Record<string, unknown> {
  const data = getData(listing);
  return getRecord(data.rates);
}

function getExperiences(listing: ApiListingRecord): Record<string, unknown> {
  const data = getData(listing);
  return getRecord(data.experiences);
}

function getPolicies(listing: ApiListingRecord): Record<string, unknown> {
  const data = getData(listing);
  return getRecord(data.policies);
}

function getContacts(listing: ApiListingRecord): Record<string, unknown> {
  const data = getData(listing);
  return getRecord(data.contacts);
}

function getLocation(listing: ApiListingRecord): string {
  const data = getData(listing);
  const snapshot = getSnapshot(listing);

  return (
    listing.location ||
    getString(snapshot.location) ||
    getString(data.locationLabel) ||
    "Location not set"
  );
}

function getClassLabel(listing: ApiListingRecord): string {
  const data = getData(listing);
  return listing.class || getString(data.class) || "Property";
}

function getOverview(listing: ApiListingRecord): string {
  const data = getData(listing);
  return getString(data.overview) || "";
}

function getVibe(listing: ApiListingRecord): string {
  const data = getData(listing);
  return (
    listing.vibe ||
    getString(data.vibe) ||
    getString(data.overview) ||
    "Trade-ready safari property profile."
  );
}

function getWebsite(listing: ApiListingRecord): string {
  const data = getData(listing);
  return listing.website || getString(data.website);
}

function getLogoImage(listing: ApiListingRecord): string {
  const data = getData(listing);
  return getString(data.logoImage);
}

function getTradeProfileLabel(listing: ApiListingRecord): string {
  const data = getData(listing);
  return getString(data.tradeProfileLabel);
}

function getTradeProfileSub(listing: ApiListingRecord): string {
  const data = getData(listing);
  return getString(data.tradeProfileSub);
}

function getQuickTags(listing: ApiListingRecord): string[] {
  const data = getData(listing);
  return getStringArray(data.quickTags);
}

function getGalleryImages(
  listing: ApiListingRecord,
): Array<{ src: string; label: string }> {
  const data = getData(listing);
  const gallery = data.gallery;

  if (Array.isArray(gallery)) {
    const images: Array<{ src: string; label: string }> = [];

    for (const group of gallery) {
      const groupRecord = getRecord(group);
      const label = getString(groupRecord.label) || "Gallery";
      const items = groupRecord.images;

      if (!Array.isArray(items)) continue;

      items.forEach((item, index) => {
        const src = getString(item);
        if (src) {
          images.push({
            src,
            label: `${label} ${index + 1}`,
          });
        }
      });
    }

    if (images.length > 0) return images;
  }

  const roomPhotos = getRecord(data.roomPhotos);
  const roomTypeLabels = getRecord(data.roomTypeLabels);

  const groups = [
    {
      label: getString(roomTypeLabels.family) || "Family setup",
      items: roomPhotos.family,
    },
    {
      label: getString(roomTypeLabels.double) || "Double setup",
      items: roomPhotos.double,
    },
    {
      label: getString(roomTypeLabels.single) || "Single setup",
      items: roomPhotos.single,
    },
  ];

  const images: Array<{ src: string; label: string }> = [];

  for (const group of groups) {
    if (!Array.isArray(group.items)) continue;

    group.items.forEach((item, index) => {
      const src = getString(item);
      if (src) {
        images.push({
          src,
          label: `${group.label} ${index + 1}`,
        });
      }
    });
  }

  return images;
}

function getHeroImage(listing: ApiListingRecord): string {
  const data = getData(listing);

  const cover = getString(data.coverImage);
  if (cover) return cover;

  const hero = getString(data.heroImage);
  if (hero) return hero;

  const images = getGalleryImages(listing);
  if (images.length > 0) return images[0].src;

  return "";
}

function getQuickSnapshot(listing: ApiListingRecord) {
  const data = getData(listing);
  const snapshot = getSnapshot(listing);

  const roomsValue = getString(snapshot.rooms);
  const legacyRooms = getNumber(data.rooms);

  return {
    rooms: roomsValue || (legacyRooms !== null ? String(legacyRooms) : ""),
    bestFor: getString(snapshot.bestFor) || getClassLabel(listing),
    setting: getString(snapshot.setting),
    style: getString(snapshot.style),
    access: getString(snapshot.access),
  };
}

function getRateRows(
  listing: ApiListingRecord,
): Array<{
  season: string;
  dates: string;
  rackPPPN: string;
}> {
  const rates = getRates(listing);
  const rows = rates.rows;

  if (!Array.isArray(rows)) return [];

  return rows
    .map((item) => {
      const row = getRecord(item);
      return {
        season: getString(row.season),
        dates: getString(row.dates),
        rackPPPN: getString(row.rackPPPN || row.rackRate),
      };
    })
    .filter((row) => row.season || row.dates || row.rackPPPN);
}

function getRateNotes(listing: ApiListingRecord): string[] {
  const rates = getRates(listing);
  const notes = getStringArray(rates.notes);

  if (notes.length > 0) return notes;

  return ["Rates per person sharing", "Full board", "Park fees excluded"];
}

function getIncludedExperiences(listing: ApiListingRecord): string[] {
  const experiences = getExperiences(listing);
  const included = getStringArray(experiences.included);
  if (included.length > 0) return included;

  const data = getData(listing);
  return getStringArray(data.freeActivities);
}

function getPaidExperiences(listing: ApiListingRecord): string[] {
  const experiences = getExperiences(listing);
  const paid = getStringArray(experiences.paid);
  if (paid.length > 0) return paid;

  const data = getData(listing);
  return getStringArray(data.paidActivities);
}

function getPolicyRows(listing: ApiListingRecord): Array<{ label: string; value: string }> {
  const policies = getPolicies(listing);
  const data = getData(listing);

  const rows: Array<{ label: string; value: string }> = [];

  const childPolicy = getString(policies.childPolicy);
  const honeymoonPolicy = getString(policies.honeymoonPolicy);
  const cancellation = getString(policies.cancellation);
  const importantNotes = getStringArray(policies.importantNotes);
  const tradeNotes = getStringArray(policies.tradeNotes);
  const legacyTerms = getString(data.terms);

  if (childPolicy) rows.push({ label: "Child policy", value: childPolicy });
  if (honeymoonPolicy) rows.push({ label: "Honeymoon policy", value: honeymoonPolicy });
  if (cancellation) rows.push({ label: "Cancellation", value: cancellation });

  importantNotes.forEach((item) => {
    rows.push({ label: "Important note", value: item });
  });

  tradeNotes.forEach((item) => {
    rows.push({ label: "Trade note", value: item });
  });

  if (legacyTerms && rows.length === 0) {
    rows.push({ label: "Terms", value: legacyTerms });
  }

  return rows;
}

function getDownloads(listing: ApiListingRecord): Array<{ label: string; url: string }> {
  const data = getData(listing);
  const source = data.downloads || data.downloadables;

  if (!Array.isArray(source)) return [];

  return source
    .map((item) => {
      const row = getRecord(item);
      const label = getString(row.label || row.title);
      const url = getString(row.url);

      if (!label || !url) return null;

      return { label, url };
    })
    .filter((item): item is { label: string; url: string } => item !== null);
}

function getContactGroups(listing: ApiListingRecord): Array<{
  title: string;
  items: Array<{
    name: string;
    role: string;
    email: string;
    phone: string;
    whatsapp: string;
  }>;
}> {
  const contacts = getContacts(listing);

  const normalizeList = (value: unknown) => {
    if (!Array.isArray(value)) return [];

    return value
      .map((item) => {
        const row = getRecord(item);
        return {
          name: getString(row.name),
          role: getString(row.role),
          email: getString(row.email),
          phone: getString(row.phone),
          whatsapp: getString(row.whatsapp),
        };
      })
      .filter((item) => {
        return Boolean(
          item.name || item.role || item.email || item.phone || item.whatsapp,
        );
      });
  };

  const reservations = normalizeList(contacts.reservations);
  const sales = normalizeList(contacts.sales);
  const marketing = normalizeList(contacts.marketing);

  const groups = [
    { title: "Reservations", items: reservations },
    { title: "Sales", items: sales },
    { title: "Marketing", items: marketing },
  ].filter((group) => group.items.length > 0);

  if (groups.length > 0) return groups;

  const data = getData(listing);
  const legacyName = getString(data.contactName);
  const legacyRole = getString(data.contactTitle);
  const legacyEmail = getString(data.contactEmail);
  const legacyPhone = getString(data.contactPhone);

  if (legacyName || legacyRole || legacyEmail || legacyPhone) {
    return [
      {
        title: "Sales",
        items: [
          {
            name: legacyName,
            role: legacyRole,
            email: legacyEmail,
            phone: legacyPhone,
            whatsapp: "",
          },
        ],
      },
    ];
  }

  return [];
}

function getTradeActions(listing: ApiListingRecord) {
  const data = getData(listing);

  return {
    enquiryEmail: getString(data.enquiryEmail),
    enquiryWhatsApp: getString(data.enquiryWhatsApp),
    enquirySubject: getString(data.enquirySubject) || "Trade Request",
  };
}

function getTripadvisorData(listing: ApiListingRecord) {
  const data = getData(listing);

  return {
    rating: getNumber(data.taRating) ?? listing.tripadvisorRating,
    link: getString(data.taLink),
    logoUrl: getString(data.taLogoUrl),
  };
}

function getSupplementTags(listing: ApiListingRecord): string[] {
  const paid = getPaidExperiences(listing);
  return paid.slice(0, 4);
}

function getOverviewCopy(listing: ApiListingRecord): string {
  const overview = getOverview(listing);
  if (overview) return overview;

  const vibe = getVibe(listing);
  if (vibe) return vibe;

  return "A trade-facing safari dossier built for quick qualification, faster quoting, and elegant client-ready sharing.";
}

function getBestFacts(listing: ApiListingRecord) {
  const snapshot = getQuickSnapshot(listing);
  const location = getLocation(listing);

  return [
    {
      label: "Rooms",
      value: snapshot.rooms || "—",
      sub: snapshot.rooms ? "Luxury tents" : "Inventory pending",
    },
    {
      label: "Location",
      value: location || "—",
      sub: "Safari region",
    },
    {
      label: "Best For",
      value: snapshot.bestFor || "—",
      sub: "Ideal fit",
    },
    {
      label: "Setting",
      value: snapshot.setting || "—",
      sub: "Landscape",
    },
    {
      label: "Style",
      value: snapshot.style || getClassLabel(listing),
      sub: "Property style",
    },
    {
      label: "Access",
      value: snapshot.access || "—",
      sub: "Arrival",
    },
  ];
}

function formatWhatsappLink(value: string): string {
  return `https://wa.me/${value.replace(/[^\d]/g, "")}`;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const slug = params.slug;
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
            This trade profile does not exist yet or the link is no longer active.
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

  const theme = getTheme(listing);
  const location = getLocation(listing);
  const propertyClass = getClassLabel(listing);
  const vibe = getVibe(listing);
  const overviewCopy = getOverviewCopy(listing);
  const website = getWebsite(listing);
  const logoImage = getLogoImage(listing);
  const heroImage = getHeroImage(listing);
  const snapshot = getQuickSnapshot(listing);
  const galleryImages = getGalleryImages(listing);
  const rateRows = getRateRows(listing);
  const rateNotes = getRateNotes(listing);
  const includedExperiences = getIncludedExperiences(listing);
  const paidExperiences = getPaidExperiences(listing);
  const policyRows = getPolicyRows(listing);
  const downloads = getDownloads(listing);
  const contactGroups = getContactGroups(listing);
  const tradeActions = getTradeActions(listing);
  const tripadvisor = getTripadvisorData(listing);
  const quickTags = getQuickTags(listing);
  const label = getTradeProfileLabel(listing);
  const subLabel = getTradeProfileSub(listing);
  const bestFacts = getBestFacts(listing);
  const supplements = getSupplementTags(listing);

  const headerTags = [label, location, propertyClass].filter(Boolean);

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: theme.pageBg, color: theme.accent }}
    >
      <div className="mx-auto max-w-[1220px] px-4 py-6 md:px-6 md:py-8">
        <div
          className="overflow-hidden rounded-[34px] border shadow-[0_12px_40px_rgba(61,44,22,0.08)]"
          style={{
            borderColor: theme.borderColor,
            backgroundColor: theme.blockBg,
            color: theme.accent,
          }}
        >
          <section className="relative">
            <div className="border-b px-6 py-5 md:px-10" style={{ borderColor: theme.borderColor }}>
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                {logoImage ? (
                  <div className="h-14 w-20 overflow-hidden rounded-2xl">
                    <img
                      src={logoImage}
                      alt={`${listing.name} logo`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div
                    className="text-[14px] font-semibold uppercase tracking-[0.34em]"
                    style={{ color: theme.accent, opacity: 0.8 }}
                  >
                    {listing.companySlug?.replace(/-/g, " ") || "SafariTrade"}
                  </div>
                )}

                <div>
                  <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                    {listing.name}
                  </h1>
                  <p className="mt-3 text-sm md:text-lg" style={{ opacity: 0.72 }}>
                    {headerTags.join(" · ")}
                  </p>
                  {subLabel ? (
                    <p className="mt-2 text-xs uppercase tracking-[0.18em]" style={{ opacity: 0.52 }}>
                      {subLabel}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="relative">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={`${listing.name} hero`}
                  className="aspect-[16/8.2] w-full object-cover"
                />
              ) : (
                <div className="aspect-[16/8.2] w-full bg-[linear-gradient(135deg,#ddc9aa,#b2966d)]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(46,31,16,0.45)] via-[rgba(46,31,16,0.08)] to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
                <div className="mx-auto max-w-[950px] text-center text-white">
                  <p className="text-3xl font-semibold drop-shadow-sm md:text-6xl">
                    {listing.name}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm md:text-xl">
                    {[label || "SafariTrade", location, propertyClass]
                      .filter(Boolean)
                      .map((item) => (
                        <span key={item} className="drop-shadow-sm">
                          {item}
                        </span>
                      ))}
                  </div>

                  {tripadvisor.rating !== null ? (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-[0.18em] md:text-base">
                      <span>{"★".repeat(Math.max(1, Math.min(5, Math.round(tripadvisor.rating))))}</span>
                      <span>Top trade-rated safari profile</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {downloads.length > 0 ? (
              <div
                className="border-y px-5 py-3 text-center text-sm font-medium md:px-8 md:text-xl"
                style={{
                  borderColor: theme.borderColor,
                  backgroundColor: `${theme.highlight}22`,
                  color: theme.accent,
                }}
              >
                {downloads[0].label}
              </div>
            ) : null}

            {galleryImages.length > 0 ? (
              <div className="px-5 py-4 md:px-8 md:py-5">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {galleryImages.slice(0, 4).map((image) => (
                    <div
                      key={`${image.src}-${image.label}`}
                      className="overflow-hidden rounded-[16px] border"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.pageBg,
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
              </div>
            ) : null}

            <div className="px-5 pb-5 md:px-8 md:pb-7">
              <div
                className="overflow-hidden rounded-[24px] border"
                style={{
                  borderColor: theme.borderColor,
                  backgroundColor: "rgba(255,255,255,0.45)",
                }}
              >
                <div className="grid grid-cols-2 md:grid-cols-6">
                  {bestFacts.map((fact, index) => (
                    <div
                      key={`${fact.label}-${index}`}
                      className="border-b px-4 py-4 text-center md:border-b-0 md:border-r md:px-3 md:py-3"
                      style={{
                        borderColor: theme.borderColor,
                      }}
                    >
                      <div className="text-[11px] uppercase tracking-[0.18em]" style={{ opacity: 0.56 }}>
                        {fact.label}
                      </div>
                      <div className="mt-2 text-lg font-semibold md:text-2xl">{fact.value}</div>
                      <div className="mt-1 text-xs md:text-sm" style={{ opacity: 0.7 }}>
                        {fact.sub}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="px-5 pb-4 md:px-8">
            <div className="grid gap-5 md:grid-cols-[1fr_390px]">
              <div className="pt-2">
                <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  {listing.name}
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 md:text-xl" style={{ opacity: 0.78 }}>
                  {overviewCopy}
                </p>
                {quickTags.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {quickTags.map((tag) => (
                      <SoftTag key={tag} text={tag} theme={theme} />
                    ))}
                  </div>
                ) : null}
              </div>

              <div
                className="rounded-[24px] border p-4"
                style={{
                  borderColor: theme.borderColor,
                  backgroundColor: "rgba(255,255,255,0.42)",
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {downloads.length > 0 ? (
                    <PrimaryAction href={downloads[0].url} theme={theme}>
                      Request Trade Pack
                    </PrimaryAction>
                  ) : (
                    <PrimaryButton theme={theme}>Request Trade Pack</PrimaryButton>
                  )}

                  {tradeActions.enquiryEmail ? (
                    <PrimaryAction
                      href={`mailto:${tradeActions.enquiryEmail}?subject=${encodeURIComponent(
                        tradeActions.enquirySubject,
                      )}`}
                      theme={theme}
                    >
                      Check Availability
                    </PrimaryAction>
                  ) : (
                    <PrimaryButton theme={theme}>Check Availability</PrimaryButton>
                  )}

                  {tradeActions.enquiryEmail ? (
                    <SecondaryAction
                      href={`mailto:${tradeActions.enquiryEmail}?subject=${encodeURIComponent(
                        tradeActions.enquirySubject,
                      )}`}
                      theme={theme}
                    >
                      Request Quote
                    </SecondaryAction>
                  ) : (
                    <SecondaryButton theme={theme}>Request Quote</SecondaryButton>
                  )}

                  <SecondaryButton theme={theme}>Share with Client</SecondaryButton>
                </div>
              </div>
            </div>
          </section>

          <div className="px-5 pb-2 pt-4 md:px-8">
            <DossierTabs theme={theme} />
          </div>

          <section className="px-5 pb-8 md:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              <div className="space-y-8">
                {rateRows.length > 0 ? (
                  <DossierCard title="PUBLIC RACK RATES" accent="2026" theme={theme}>
                    <div
                      className="overflow-hidden rounded-[18px] border"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: "rgba(255,255,255,0.45)",
                      }}
                    >
                      <div
                        className="grid grid-cols-3 border-b px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] md:grid-cols-[1.2fr_1.5fr_1fr]"
                        style={{ borderColor: theme.borderColor, opacity: 0.65 }}
                      >
                        <span>Season</span>
                        <span>Dates</span>
                        <span>Rack PPPN</span>
                      </div>

                      {rateRows.map((row, index) => (
                        <div
                          key={`${row.season}-${row.dates}-${index}`}
                          className="grid grid-cols-3 px-4 py-3 text-sm md:grid-cols-[1.2fr_1.5fr_1fr] md:text-lg"
                          style={{
                            borderTop:
                              index === 0 ? "none" : `1px solid ${theme.borderColor}`,
                          }}
                        >
                          <span className="font-medium">{row.season || "—"}</span>
                          <span>{row.dates || "—"}</span>
                          <span>{row.rackPPPN || "—"}</span>
                        </div>
                      ))}
                    </div>

                    {rateNotes.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {rateNotes.map((note) => (
                          <SoftTag key={note} text={note} theme={theme} />
                        ))}
                      </div>
                    ) : null}

                    {supplements.length > 0 ? (
                      <div className="mt-5 border-t pt-4" style={{ borderColor: theme.borderColor }}>
                        <div className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ opacity: 0.55 }}>
                          Supplements
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {supplements.map((item) => (
                            <SoftTag key={item} text={item} theme={theme} />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </DossierCard>
                ) : null}

                {(includedExperiences.length > 0 || paidExperiences.length > 0) ? (
                  <DossierCard title="EXPERIENCES" theme={theme}>
                    <div className="grid gap-5 md:grid-cols-2">
                      <ExperienceCard title="Included" items={includedExperiences} theme={theme} />
                      <ExperienceCard title="Paid" items={paidExperiences} theme={theme} />
                    </div>
                  </DossierCard>
                ) : null}

                {policyRows.length > 0 ? (
                  <DossierCard title="POLICIES" theme={theme}>
                    <div className="grid gap-3">
                      {policyRows.map((row, index) => (
                        <div
                          key={`${row.label}-${index}`}
                          className="rounded-[18px] border px-4 py-4"
                          style={{
                            borderColor: theme.borderColor,
                            backgroundColor: "rgba(255,255,255,0.45)",
                          }}
                        >
                          <div className="text-[11px] uppercase tracking-[0.18em]" style={{ opacity: 0.52 }}>
                            {row.label}
                          </div>
                          <div className="mt-2 whitespace-pre-line text-sm leading-7 md:text-base">
                            {row.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DossierCard>
                ) : null}
              </div>

              <aside className="space-y-6">
                {downloads.length > 0 ? (
                  <DossierCard title="DOWNLOADS" theme={theme}>
                    <div className="space-y-3">
                      {downloads.map((item, index) => (
                        <a
                          key={`${item.label}-${index}`}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-[18px] border px-4 py-3 text-sm font-medium md:text-base"
                          style={{
                            borderColor: theme.borderColor,
                            backgroundColor: "rgba(255,255,255,0.45)",
                            color: theme.accent,
                          }}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </DossierCard>
                ) : null}

                {contactGroups.length > 0 ? (
                  <DossierCard title="CONTACT" theme={theme}>
                    <div className="space-y-6">
                      {contactGroups.map((group) => (
                        <div key={group.title}>
                          <div className="text-[11px] uppercase tracking-[0.18em]" style={{ opacity: 0.52 }}>
                            {group.title}
                          </div>

                          <div className="mt-3 space-y-3">
                            {group.items.map((item, index) => (
                              <div
                                key={`${group.title}-${index}`}
                                className="rounded-[18px] border px-4 py-4"
                                style={{
                                  borderColor: theme.borderColor,
                                  backgroundColor: "rgba(255,255,255,0.45)",
                                }}
                              >
                                {item.name ? (
                                  <div className="text-base font-semibold md:text-lg">{item.name}</div>
                                ) : null}
                                {item.role ? (
                                  <div className="mt-1 text-sm md:text-base" style={{ opacity: 0.74 }}>
                                    {item.role}
                                  </div>
                                ) : null}
                                {item.email ? (
                                  <a
                                    href={`mailto:${item.email}`}
                                    className="mt-3 block text-sm underline md:text-base"
                                  >
                                    {item.email}
                                  </a>
                                ) : null}
                                {item.phone ? (
                                  <div className="mt-2 text-sm md:text-base">{item.phone}</div>
                                ) : null}
                                {item.whatsapp ? (
                                  <a
                                    href={formatWhatsappLink(item.whatsapp)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 block text-sm underline md:text-base"
                                  >
                                    WhatsApp
                                  </a>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </DossierCard>
                ) : null}

                {(tripadvisor.rating !== null || tripadvisor.link) ? (
                  <DossierCard title="TRIPADVISOR" theme={theme}>
                    {tripadvisor.logoUrl ? (
                      <div
                        className="overflow-hidden rounded-[18px] border px-4 py-3"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <img
                          src={tripadvisor.logoUrl}
                          alt="Tripadvisor"
                          className="h-8 w-auto object-contain"
                        />
                      </div>
                    ) : null}

                    {tripadvisor.rating !== null ? (
                      <div
                        className="mt-3 rounded-[18px] border px-4 py-3 text-sm font-medium md:text-base"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: "rgba(255,255,255,0.45)",
                        }}
                      >
                        Rating {tripadvisor.rating.toFixed(1)}
                      </div>
                    ) : null}

                    {tripadvisor.link ? (
                      <a
                        href={tripadvisor.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 block rounded-[18px] border px-4 py-3 text-sm font-medium md:text-base"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: "rgba(255,255,255,0.45)",
                          color: theme.accent,
                        }}
                      >
                        Open Tripadvisor
                      </a>
                    ) : null}
                  </DossierCard>
                ) : null}
              </aside>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function DossierTabs(props: { theme: ThemeState }) {
  const tabs = [
    "Overview",
    "Rates",
    "Experiences",
    "Policies",
    "Downloads",
    "Contact",
  ];

  return (
    <>
      <div className="hidden md:flex md:flex-wrap md:gap-2">
        {tabs.map((tab, index) => (
          <div
            key={tab}
            className="rounded-t-[14px] border px-5 py-3 text-sm font-medium"
            style={{
              borderColor: props.theme.borderColor,
              backgroundColor:
                index === 0 ? `${props.theme.highlight}22` : "rgba(255,255,255,0.38)",
              color: props.theme.accent,
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 md:hidden">
        {tabs.map((tab, index) => (
          <div
            key={tab}
            className="rounded-full border px-4 py-2 text-xs font-medium"
            style={{
              borderColor: props.theme.borderColor,
              backgroundColor:
                index === 0 ? `${props.theme.highlight}22` : "rgba(255,255,255,0.38)",
              color: props.theme.accent,
            }}
          >
            {tab}
          </div>
        ))}
      </div>
    </>
  );
}

function DossierCard(props: {
  title: string;
  accent?: string;
  theme: ThemeState;
  children: ReactNode;
}) {
  return (
    <section
      className="rounded-[28px] border p-5 md:p-7"
      style={{
        borderColor: props.theme.borderColor,
        backgroundColor: "rgba(255,255,255,0.32)",
        color: props.theme.accent,
      }}
    >
      <div className="flex items-end gap-3">
        <h3 className="text-xl font-semibold tracking-[0.08em] md:text-3xl">
          {props.title}
        </h3>
        {props.accent ? (
          <span
            className="pb-1 text-lg font-medium tracking-[0.18em] md:text-2xl"
            style={{ color: props.theme.highlight }}
          >
            {props.accent}
          </span>
        ) : null}
      </div>
      <div className="mt-5">{props.children}</div>
    </section>
  );
}

function ExperienceCard(props: {
  title: string;
  items: string[];
  theme: ThemeState;
}) {
  return (
    <div
      className="rounded-[20px] border p-4"
      style={{
        borderColor: props.theme.borderColor,
        backgroundColor: "rgba(255,255,255,0.45)",
      }}
    >
      <div className="text-[11px] uppercase tracking-[0.18em]" style={{ opacity: 0.54 }}>
        {props.title}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {props.items.length > 0 ? (
          props.items.map((item) => <SoftTag key={item} text={item} theme={props.theme} />)
        ) : (
          <span style={{ opacity: 0.55 }}>None listed</span>
        )}
      </div>
    </div>
  );
}

function SoftTag(props: { text: string; theme: ThemeState }) {
  return (
    <span
      className="rounded-full border px-3 py-1.5 text-xs md:text-sm"
      style={{
        borderColor: props.theme.borderColor,
        backgroundColor: "rgba(255,255,255,0.48)",
        color: props.theme.accent,
      }}
    >
      {props.text}
    </span>
  );
}

function PrimaryAction(props: {
  href: string;
  theme: ThemeState;
  children: ReactNode;
}) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      className="block rounded-[16px] px-4 py-3 text-center text-sm font-medium md:text-base"
      style={{
        backgroundColor: `${props.theme.highlight}cc`,
        color: "#fffdf8",
      }}
    >
      {props.children}
    </a>
  );
}

function SecondaryAction(props: {
  href: string;
  theme: ThemeState;
  children: ReactNode;
}) {
  return (
    <a
      href={props.href}
      className="block rounded-[16px] border px-4 py-3 text-center text-sm font-medium md:text-base"
      style={{
        borderColor: props.theme.borderColor,
        backgroundColor: "rgba(255,255,255,0.45)",
        color: props.theme.accent,
      }}
    >
      {props.children}
    </a>
  );
}

function PrimaryButton(props: { theme: ThemeState; children: ReactNode }) {
  return (
    <div
      className="rounded-[16px] px-4 py-3 text-center text-sm font-medium md:text-base"
      style={{
        backgroundColor: `${props.theme.highlight}cc`,
        color: "#fffdf8",
      }}
    >
      {props.children}
    </div>
  );
}

function SecondaryButton(props: { theme: ThemeState; children: ReactNode }) {
  return (
    <div
      className="rounded-[16px] border px-4 py-3 text-center text-sm font-medium md:text-base"
      style={{
        borderColor: props.theme.borderColor,
        backgroundColor: "rgba(255,255,255,0.45)",
        color: props.theme.accent,
      }}
    >
      {props.children}
    </div>
  );
}
