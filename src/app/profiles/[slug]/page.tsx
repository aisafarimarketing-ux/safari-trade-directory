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
    theme?: Record<string, unknown> | null;
  } | null;
  data?: Record<string, unknown> | null;
};

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

function getGalleryImages(listing: ApiListingRecord): Array<{ src: string; label: string }> {
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
    style: getString(snapshot.style) || getVibe(listing),
    access: getString(snapshot.access),
  };
}

function getRateRows(listing: ApiListingRecord): Array<{
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

  const tags = [location, propertyClass, snapshot.bestFor, snapshot.style].filter(Boolean);

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: theme.pageBg, color: theme.accent }}
    >
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
                    style={{ opacity: 0.5 }}
                  >
                    {listing.design.preset}
                  </span>
                ) : null}
              </div>

              <div className="flex items-start gap-4">
                {logoImage ? (
                  <div
                    className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[22px] border"
                    style={{
                      borderColor: theme.borderColor,
                      backgroundColor: theme.blockBg,
                    }}
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
                  <p className="mt-3 max-w-3xl text-base leading-8 md:text-lg" style={{ opacity: 0.75 }}>
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
                <QuickFact label="Rooms" value={snapshot.rooms || "—"} theme={theme} />
                <QuickFact label="Best For" value={snapshot.bestFor || "—"} theme={theme} />
                <QuickFact label="Setting" value={snapshot.setting || "—"} theme={theme} />
                <QuickFact label="Access" value={snapshot.access || "—"} theme={theme} />
              </div>

              <div className="flex flex-wrap gap-3">
                {downloads.length > 0 ? (
                  <a
                    href={downloads[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl px-5 py-3 text-sm font-semibold"
                    style={{ backgroundColor: theme.highlight, color: "#ffffff" }}
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
                    style={{
                      borderColor: theme.borderColor,
                      backgroundColor: theme.blockBg,
                      color: theme.accent,
                    }}
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
                    style={{
                      borderColor: theme.borderColor,
                      backgroundColor: theme.blockBg,
                      color: theme.accent,
                    }}
                  >
                    WhatsApp
                  </a>
                ) : null}
              </div>
            </div>

            <div className="space-y-5">
              <div
                className="overflow-hidden rounded-[34px] border"
                style={{
                  borderColor: theme.borderColor,
                  backgroundColor: theme.blockBg,
                }}
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
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.blockBg,
                        color: theme.accent,
                      }}
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
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.blockBg,
                        color: theme.accent,
                      }}
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

            {rateRows.length > 0 ? (
              <SectionCard title="Rates" theme={theme}>
                <div
                  className="overflow-hidden rounded-[22px] border"
                  style={{
                    borderColor: theme.borderColor,
                    backgroundColor: theme.blockBg,
                  }}
                >
                  <div
                    className="grid grid-cols-3 border-b px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ borderColor: theme.borderColor, opacity: 0.6 }}
                  >
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
                  ))}
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
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ opacity: 0.5 }}>
                      Included
                    </p>
                    <div className="mt-3">
                      <TagList items={includedExperiences} theme={theme} />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ opacity: 0.5 }}>
                      Paid
                    </p>
                    <div className="mt-3">
                      <TagList items={paidExperiences} theme={theme} />
                    </div>
                  </div>
                </div>
              </SectionCard>
            ) : null}

            {policyRows.length > 0 ? (
              <SectionCard title="Policies" theme={theme}>
                <div className="space-y-3">
                  {policyRows.map((row, index) => (
                    <div
                      key={`${row.label}-${index}`}
                      className="rounded-2xl border px-4 py-3"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.blockBg,
                        color: theme.accent,
                      }}
                    >
                      <p className="text-[11px] uppercase tracking-[0.18em]" style={{ opacity: 0.45 }}>
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
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.blockBg,
                        color: theme.accent,
                      }}
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
                      <p className="text-[11px] uppercase tracking-[0.18em]" style={{ opacity: 0.45 }}>
                        {group.title}
                      </p>

                      <div className="mt-3 space-y-3">
                        {group.items.map((item, index) => (
                          <div
                            key={`${group.title}-${index}`}
                            className="rounded-2xl border px-4 py-3"
                            style={{
                              borderColor: theme.borderColor,
                              backgroundColor: theme.blockBg,
                              color: theme.accent,
                            }}
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
                              <a href={`mailto:${item.email}`} className="mt-3 block text-sm underline">
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
                    style={{
                      borderColor: theme.borderColor,
                      backgroundColor: theme.blockBg,
                      color: theme.accent,
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
                    className="mt-3 block rounded-2xl border px-4 py-3 text-sm font-semibold"
                    style={{
                      borderColor: theme.borderColor,
                      backgroundColor: theme.blockBg,
                      color: theme.accent,
                    }}
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

function Pill(props: { text: string; theme: ThemeState }) {
  return (
    <span
      className="rounded-full border px-3 py-1.5 text-sm"
      style={{
        borderColor: props.theme.borderColor,
        backgroundColor: props.theme.blockBg,
        color: props.theme.accent,
      }}
    >
      {props.text}
    </span>
  );
}

function QuickFact(props: { label: string; value: string; theme: ThemeState }) {
  return (
    <div
      className="rounded-[24px] border p-4"
      style={{
        borderColor: props.theme.borderColor,
        backgroundColor: props.theme.blockBg,
        color: props.theme.accent,
      }}
    >
      <p className="text-[11px] uppercase tracking-[0.18em]" style={{ opacity: 0.45 }}>
        {props.label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{props.value}</p>
    </div>
  );
}

function SectionCard(props: {
  title: string;
  theme: ThemeState;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[30px] border p-6 md:p-8"
      style={{
        borderColor: props.theme.borderColor,
        backgroundColor: props.theme.blockBg,
        color: props.theme.accent,
      }}
    >
      <p className="text-sm uppercase tracking-[0.2em]" style={{ opacity: 0.45 }}>
        {props.title}
      </p>
      <div className="mt-5">{props.children}</div>
    </div>
  );
}

function SummaryRow(props: {
  label: string;
  value: string;
  theme: ThemeState;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-2xl border px-4 py-3"
      style={{
        borderColor: props.theme.borderColor,
        backgroundColor: props.theme.blockBg,
        color: props.theme.accent,
      }}
    >
      <span style={{ opacity: 0.5 }}>{props.label}</span>
      <span className="text-right font-semibold">{props.value}</span>
    </div>
  );
}

function TagList(props: { items: string[]; theme: ThemeState }) {
  if (props.items.length === 0) {
    return <span style={{ opacity: 0.55 }}>None listed</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {props.items.map((item) => (
        <span
          key={item}
          className="rounded-full border px-3 py-1.5 text-xs"
          style={{
            borderColor: props.theme.borderColor,
            backgroundColor: props.theme.blockBg,
            color: props.theme.accent,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
