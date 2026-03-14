import { headers } from "next/headers";

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
    theme?: Partial<ThemeState> | null;
  } | null;
  data?: Record<string, unknown> | null;
};

type DownloadItem = {
  label: string;
  url: string;
  type?: string | null;
};

type ContactItem = {
  name?: string | null;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
};

type GalleryImage = {
  src: string;
  label: string;
};

type SimpleStyle = Record<string, string | number | undefined>;

const DEFAULT_THEME: ThemeState = {
  pageBg: "#0A0A0A",
  blockBg: "#111111",
  accent: "#FFFFFF",
  highlight: "#D4AF37",
  borderColor: "rgba(255,255,255,0.10)",
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

function getDownloadItems(value: unknown): DownloadItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const row = getRecord(item);
      const label = getString(row.label || row.title);
      const url = getString(row.url);

      if (!label || !url) return null;

      return {
        label,
        url,
        type: getString(row.type) || null,
      };
    })
    .filter((item): item is DownloadItem => item !== null);
}

function getContactList(value: unknown): ContactItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const row = getRecord(item);
      return {
        name: getString(row.name) || null,
        role: getString(row.role) || null,
        email: getString(row.email) || null,
        phone: getString(row.phone) || null,
        whatsapp: getString(row.whatsapp) || null,
      };
    })
    .filter((item) => {
      return Boolean(
        item.name || item.role || item.email || item.phone || item.whatsapp,
      );
    });
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

function getTheme(listing: ApiListingRecord): ThemeState {
  const theme = getRecord(listing.design?.theme);

  return {
    pageBg: getString(theme.pageBg) || DEFAULT_THEME.pageBg,
    blockBg: getString(theme.blockBg) || DEFAULT_THEME.blockBg,
    accent: getString(theme.accent) || DEFAULT_THEME.accent,
    highlight: getString(theme.highlight) || DEFAULT_THEME.highlight,
    borderColor: getString(theme.borderColor) || DEFAULT_THEME.borderColor,
  };
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

function getDownloads(listing: ApiListingRecord): DownloadItem[] {
  const data = getData(listing);
  return getDownloadItems(data.downloads || data.downloadables);
}

function getContacts(listing: ApiListingRecord) {
  const data = getData(listing);
  const contacts = getRecord(data.contacts);

  const reservations = getContactList(contacts.reservations);
  const sales = getContactList(contacts.sales);
  const marketing = getContactList(contacts.marketing);

  const legacyContact =
    getString(data.contactName) ||
    getString(data.contactTitle) ||
    getString(data.contactEmail) ||
    getString(data.contactPhone) ||
    getString(data.contactWebsite);

  if (reservations.length || sales.length || marketing.length) {
    return { reservations, sales, marketing };
  }

  if (legacyContact) {
    return {
      reservations: [],
      sales: [
        {
          name: getString(data.contactName) || null,
          role: getString(data.contactTitle) || null,
          email: getString(data.contactEmail) || null,
          phone: getString(data.contactPhone) || null,
          whatsapp: null,
        },
      ],
      marketing: [],
    };
  }

  return {
    reservations: [],
    sales: [],
    marketing: [],
  };
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

function getHeroImage(listing: ApiListingRecord): string {
  const data = getData(listing);

  const coverImage = getString(data.coverImage);
  if (coverImage) return coverImage;

  const heroImage = getString(data.heroImage);
  if (heroImage) return heroImage;

  const gallery = getGalleryImages(listing);
  if (gallery.length > 0) return gallery[0].src;

  return "";
}

function getGalleryImages(listing: ApiListingRecord): GalleryImage[] {
  const data = getData(listing);
  const gallery = data.gallery;

  if (Array.isArray(gallery)) {
    const images: GalleryImage[] = [];

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
      key: "family",
      label: getString(roomTypeLabels.family) || "Family setup",
      items: roomPhotos.family,
    },
    {
      key: "double",
      label: getString(roomTypeLabels.double) || "Double setup",
      items: roomPhotos.double,
    },
    {
      key: "single",
      label: getString(roomTypeLabels.single) || "Single setup",
      items: roomPhotos.single,
    },
  ];

  const fallbackImages: GalleryImage[] = [];

  for (const group of groups) {
    if (!Array.isArray(group.items)) continue;

    group.items.forEach((item, index) => {
      const src = getString(item);
      if (src) {
        fallbackImages.push({
          src,
          label: `${group.label} ${index + 1}`,
        });
      }
    });
  }

  return fallbackImages;
}

function getQuickSnapshot(listing: ApiListingRecord) {
  const data = getData(listing);
  const snapshot = getSnapshot(listing);

  const rooms =
    getString(snapshot.rooms) ||
    (getNumber(data.rooms) !== null ? String(getNumber(data.rooms)) : "");

  const bestFor = getString(snapshot.bestFor) || getClassLabel(listing);
  const style = getString(snapshot.style) || getVibe(listing);
  const access = getString(snapshot.access);
  const setting = getString(snapshot.setting);

  return {
    rooms,
    bestFor,
    style,
    access,
    setting,
  };
}

function getRateRows(listing: ApiListingRecord) {
  const rates = getRates(listing);
  const rows = rates.rows;

  if (Array.isArray(rows)) {
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

  return [];
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

function getPoliciesList(listing: ApiListingRecord): Array<{ label: string; value: string }> {
  const policies = getPolicies(listing);
  const data = getData(listing);

  const childPolicy = getString(policies.childPolicy);
  const honeymoonPolicy = getString(policies.honeymoonPolicy);
  const cancellation = getString(policies.cancellation);
  const importantNotes = getStringArray(policies.importantNotes);
  const tradeNotes = getStringArray(policies.tradeNotes);
  const legacyTerms = getString(data.terms);

  const rows: Array<{ label: string; value: string }> = [];

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

function getTradeContacts(listing: ApiListingRecord) {
  const contacts = getContacts(listing);

  return [
    {
      title: "Reservations",
      items: contacts.reservations,
    },
    {
      title: "Sales",
      items: contacts.sales,
    },
    {
      title: "Marketing",
      items: contacts.marketing,
    },
  ].filter((group) => group.items.length > 0);
}

function getTradeActions(listing: ApiListingRecord) {
  const data = getData(listing);

  const enquiryEmail = getString(data.enquiryEmail);
  const enquiryWhatsApp = getString(data.enquiryWhatsApp);
  const enquirySubject =
    getString(data.enquirySubject) || "Trade Request";

  return {
    enquiryEmail,
    enquiryWhatsApp,
    enquirySubject,
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

function panelStyle(theme: ThemeState): SimpleStyle {
  return {
    backgroundColor: theme.blockBg,
    borderColor: theme.borderColor,
    color: theme.accent,
  };
}

function softStyle(theme: ThemeState): SimpleStyle {
  return {
    borderColor: theme.borderColor,
    backgroundColor: theme.blockBg,
    color: theme.accent,
  };
}

function primaryButtonStyle(theme: ThemeState): SimpleStyle {
  return {
    backgroundColor: theme.highlight,
    color: "#ffffff",
  };
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
  const data = getData(listing);
  const location = getLocation(listing);
  const propertyClass = getClassLabel(listing);
  const vibe = getVibe(listing);
  const website = getWebsite(listing);
  const logoImage = getLogoImage(listing);
  const heroImage = getHeroImage(listing);
  const galleryImages = getGalleryImages(listing);
  const snapshot = getQuickSnapshot(listing);
  const rateRows = getRateRows(listing);
  const rateNotes = getRateNotes(listing);
  const includedExperiences = getIncludedExperiences(listing);
  const paidExperiences = getPaidExperiences(listing);
  const policies = getPoliciesList(listing);
  const downloads = getDownloads(listing);
  const contactGroups = getTradeContacts(listing);
  const tradeActions = getTradeActions(listing);
  const tripadvisor = getTripadvisorData(listing);

  const pageStyle: SimpleStyle = {
    backgroundColor: theme.pageBg,
    color: theme.accent,
  };

  const tags = [
    location,
    propertyClass,
    snapshot.bestFor,
    snapshot.style,
  ].filter(Boolean);

  return (
    <main className="min-h-screen" style={pageStyle}>
      <section className="border-b" style={{ borderColor: theme.borderColor }}>
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
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

                {listing.design?.preset ? (
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: theme.accent, opacity: 0.5 }}
                  >
                    {listing.design.preset}
                  </span>
                ) : null}
              </div>

              <div className="flex items-start gap-4">
                {logoImage ? (
                  <div
                    className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[22px] border"
                    style={softStyle(theme)}
                  >
                    <img
                      src={logoImage}
                      alt={`${listing.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <div className="min-w-0">
                  <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                    {listing.name}
                  </h1>
                  <p
                    className="mt-3 max-w-3xl text-base leading-8 md:text-lg"
                    style={{ color: theme.accent, opacity: 0.75 }}
                  >
                    {vibe}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Pill key={tag} text={tag} theme={theme} />
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <QuickFact
                  label="Rooms"
                  value={snapshot.rooms || "—"}
                  theme={theme}
                />
                <QuickFact
                  label="Best For"
                  value={snapshot.bestFor || "—"}
                  theme={theme}
                />
                <QuickFact
                  label="Setting"
                  value={snapshot.setting || "—"}
                  theme={theme}
                />
                <QuickFact
                  label="Access"
                  value={snapshot.access || "—"}
                  theme={theme}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {downloads.length > 0 ? (
                  <a
                    href={downloads[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl px-5 py-3 text-sm font-semibold"
                    style={primaryButtonStyle(theme)}
                  >
                    Request Trade Pack
                  </a>
                ) : null}

                {tradeActions.enquiryEmail ? (
                  <a
                    href={`mailto:${tradeActions.enquiryEmail}?subject=${encodeURIComponent(
                      tradeActions.enquirySubject,
                    )}`}
                    className="rounded-2xl border px-5 py-3 text-sm font-semibold"
                    style={softStyle(theme)}
                  >
                    Request Quote
                  </a>
                ) : null}

                {tradeActions.enquiryWhatsApp ? (
                  <a
                    href={`https://wa.me/${tradeActions.enquiryWhatsApp.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border px-5 py-3 text-sm font-semibold"
                    style={softStyle(theme)}
                  >
                    WhatsApp
                  </a>
                ) : null}
              </div>
            </div>

            <div className="space-y-5">
              <div
                className="overflow-hidden rounded-[34px] border"
                style={panelStyle(theme)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
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
                      style={softStyle(theme)}
                    >
                      Website
                    </a>
                  ) : null}

                  {listing.mapLink ? (
                    <a
                      href={listing.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border px-4 py-3 text-sm font-semibold"
                      style={softStyle(theme)}
                    >
                      Open Map
                    </a>
                  ) : null}
                </div>
              </div>

              <SectionCard title="Quick Trade Snapshot" theme={theme}>
                <div className="space-y-3">
                  <SummaryRow label="Location" value={location} theme={theme} />
                  <SummaryRow label="Best for" value={snapshot.bestFor || "—"} theme={theme} />
                  <SummaryRow label="Style" value={snapshot.style || "—"} theme={theme} />
                  <SummaryRow label="Access" value={snapshot.access || "—"} theme={theme} />
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            {galleryImages.length > 0 ? (
              <SectionCard title="Gallery" theme={theme}>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {galleryImages.slice(0, 6).map((image) => (
                    <div
                      key={`${image.src}-${image.label}`}
                      className="overflow-hidden rounded-[22px] border"
                      style={softStyle(theme)}
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

            {rateRows.length > 0 ? (
              <SectionCard title="Rates" theme={theme}>
                <div className="overflow-hidden rounded-[22px] border" style={softStyle(theme)}>
                  <div className="grid grid-cols-3 border-b px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em]" style={{ borderColor: theme.borderColor, opacity: 0.6 }}>
                    <span>Season</span>
                    <span>Dates</span>
                    <span>Rack PPPN</span>
                  </div>

                  {rateRows.map((row, index) => (
                    <div
                      key={`${row.season}-${row.dates}-${index}`}
                      className="grid grid-cols-3 px-4 py-3 text-sm"
                      style={{
                        borderTop: index === 0 ? "none" : `1px solid ${theme.borderColor}`,
                      }}
                    >
                      <span>{row.season || "—"}</span>
                      <span>{row.dates || "—"}</span>
                      <span>{row.rackPPPN || "—"}</span>
                    </div>
                  })}
                </div>

                {rateNotes.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {rateNotes.map((note) => (
                      <Pill key={note} text={note} theme={theme} />
                    ))}
                  </div>
                ) : null}
              </SectionCard>
            ) : null}

            {(includedExperiences.length > 0 || paidExperiences.length > 0) ? (
              <SectionCard title="Experiences" theme={theme}>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.18em]"
                      style={{ color: theme.accent, opacity: 0.5 }}
                    >
                      Included
                    </p>
                    <div className="mt-3">
                      <TagList items={includedExperiences} theme={theme} />
                    </div>
                  </div>

                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.18em]"
                      style={{ color: theme.accent, opacity: 0.5 }}
                    >
                      Paid
                    </p>
                    <div className="mt-3">
                      <TagList items={paidExperiences} theme={theme} />
                    </div>
                  </div>
                </div>
              </SectionCard>
            ) : null}

            {policies.length > 0 ? (
              <SectionCard title="Policies" theme={theme}>
                <div className="space-y-3">
                  {policies.map((row, index) => (
                    <div
                      key={`${row.label}-${index}`}
                      className="rounded-2xl border px-4 py-3"
                      style={softStyle(theme)}
                    >
                      <p
                        className="text-[11px] uppercase tracking-[0.18em]"
                        style={{ color: theme.accent, opacity: 0.45 }}
                      >
                        {row.label}
                      </p>
                      <p className="mt-2 text-sm leading-7">{row.value}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            ) : null}
          </div>

          <aside className="space-y-6">
            {downloads.length > 0 ? (
              <SectionCard title="Downloads" theme={theme}>
                <div className="space-y-3">
                  {downloads.map((item, index) => (
                    <a
                      key={`${item.label}-${index}`}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border px-4 py-3 text-sm font-semibold"
                      style={softStyle(theme)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </SectionCard>
            ) : null}

            {contactGroups.length > 0 ? (
              <SectionCard title="Contact" theme={theme}>
                <div className="space-y-6">
                  {contactGroups.map((group) => (
                    <div key={group.title}>
                      <p
                        className="text-[11px] uppercase tracking-[0.18em]"
                        style={{ color: theme.accent, opacity: 0.45 }}
                      >
                        {group.title}
                      </p>

                      <div className="mt-3 space-y-3">
                        {group.items.map((item, index) => (
                          <div
                            key={`${group.title}-${index}`}
                            className="rounded-2xl border px-4 py-3"
                            style={softStyle(theme)}
                          >
                            {item.name ? (
                              <p className="text-sm font-semibold">{item.name}</p>
                            ) : null}
                            {item.role ? (
                              <p className="mt-1 text-sm" style={{ opacity: 0.75 }}>
                                {item.role}
                              </p>
                            ) : null}
                            {item.email ? (
                              <a
                                href={`mailto:${item.email}`}
                                className="mt-3 block text-sm underline"
                              >
                                {item.email}
                              </a>
                            ) : null}
                            {item.phone ? (
                              <p className="mt-2 text-sm">{item.phone}</p>
                            ) : null}
                            {item.whatsapp ? (
                              <a
                                href={`https://wa.me/${item.whatsapp.replace(/[^\d]/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 block text-sm underline"
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
              </SectionCard>
            ) : null}

            {(tripadvisor.rating !== null || tripadvisor.link) ? (
              <SectionCard title="Tripadvisor" theme={theme}>
                {tripadvisor.logoUrl ? (
                  <div
                    className="overflow-hidden rounded-2xl border px-4 py-3"
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
                    className="mt-3 rounded-2xl border px-4 py-3 text-sm font-semibold"
                    style={softStyle(theme)}
                  >
                    Rating {tripadvisor.rating.toFixed(1)}
                  </div>
                ) : null}

                {tripadvisor.link ? (
                  <a
                    href={tripadvisor.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block rounded-2xl border px-4 py-3 text-sm font-semibold"
                    style={softStyle(theme)}
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
  theme,
}: {
  text: string;
  theme: ThemeState;
}) {
  return (
    <span
      className="rounded-full border px-3 py-1.5 text-sm"
      style={{
        borderColor: theme.borderColor,
        backgroundColor: theme.blockBg,
        color: theme.accent,
      }}
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
  children,
}: {
  title: string;
  theme: ThemeState;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[30px] border p-6 md:p-8"
      style={{
        borderColor: theme.borderColor,
        backgroundColor: theme.blockBg,
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
  if (items.length === 0) {
    return <span style={{ color: theme.accent, opacity: 0.55 }}>None listed</span>;
  }

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
