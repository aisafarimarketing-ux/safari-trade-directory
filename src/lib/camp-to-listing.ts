import { Listing } from "../data/listings";

type RoomKey = "family" | "double" | "single";
type NumDraft = number | "";

type DownloadableType = "file" | "link";
type Downloadable = {
  id: string;
  title: string;
  type: DownloadableType;
  url: string;
  mime?: string;
  fileName?: string;
};

export type Camp = {
  name: string;
  class: string;

  rooms: NumDraft;
  family: NumDraft;
  double: NumDraft;
  single: NumDraft;

  vibe: string;

  inclusions: string[];
  exclusions: string[];

  freeActivities: string[];
  paidActivities: string[];

  offersText: string;
  terms: string;

  tradeProfileLabel: string;
  tradeProfileSub: string;

  locationLabel: string;
  mapLink: string;

  rating: NumDraft;
  reviewCount: NumDraft;

  website: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;

  roomTypeLabels: Record<RoomKey, string>;
  roomPhotos: Record<RoomKey, string[]>;

  leadHeadline: string;
  leadSubcopy: string;
  leadBullet1: string;
  leadBullet2: string;
  leadBullet3: string;
  leadCta: string;
  leadDisclaimer: string;

  contactName: string;
  contactTitle: string;
  contactCompany: string;
  contactEmail: string;
  contactPhone: string;
  contactWebsite: string;

  enquiryEmail: string;
  enquiryWhatsApp: string;
  enquirySubject: string;

  logoImage: string;
  coverImage: string;

  downloadables: Downloadable[];

  taLogoUrl: string;
  taLink: string;
  taRating: NumDraft;
  taStyle: "dots" | "stars";
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function cleanText(value: string): string {
  return value.trim();
}

function unique(values: string[]): string[] {
  return Array.from(
    new Set(values.map((item) => item.trim()).filter(Boolean)),
  );
}

function inferDestinations(camp: Camp): string[] {
  const haystack = [camp.locationLabel, camp.name, camp.vibe]
    .join(" ")
    .toLowerCase();

  const knownDestinations = [
    "serengeti",
    "tarangire",
    "ngorongoro",
    "manyara",
    "arusha",
    "ruaha",
    "nyerere",
    "zanzibar",
    "masai mara",
    "amboseli",
    "laikipia",
    "okavango",
    "south luangwa",
  ];

  return knownDestinations.filter((destination) =>
    haystack.includes(destination),
  );
}

function inferKind(_camp: Camp): Listing["kind"] {
  return "camp";
}

function inferBudgetBands(camp: Camp): string[] {
  const source = `${camp.class} ${camp.vibe}`.toLowerCase();

  if (source.includes("luxury")) {
    return ["premium", "luxury"];
  }

  if (source.includes("mid")) {
    return ["upper-mid", "premium"];
  }

  return ["premium"];
}

function inferStyleTags(camp: Camp): string[] {
  const tags: string[] = [];
  const source = `${camp.class} ${camp.vibe}`.toLowerCase();

  if (source.includes("luxury")) tags.push("luxury");
  if (source.includes("tented")) tags.push("tented");
  if (source.includes("romantic")) tags.push("romantic");
  if (source.includes("family")) tags.push("family-friendly");
  if (source.includes("exclusive")) tags.push("exclusive");
  if (source.includes("authentic")) tags.push("authentic");
  if (source.includes("nature")) tags.push("nature-led");

  return unique(tags);
}

function inferIdealFor(camp: Camp): string[] {
  const tags: string[] = [];
  const source =
    `${camp.vibe} ${camp.leadHeadline} ${camp.leadSubcopy}`.toLowerCase();

  if (source.includes("honeymoon")) tags.push("honeymoon");
  if (source.includes("family")) tags.push("family-safari");
  if (source.includes("couple")) tags.push("couples");
  if (source.includes("luxury")) tags.push("luxury-couples");
  if (source.includes("photography")) tags.push("photographers");
  if (source.includes("first safari")) tags.push("first-safari");

  return unique(tags);
}

function inferSuitability(camp: Camp): string[] {
  return unique([
    ...inferIdealFor(camp),
    ...(camp.family ? ["family-safari"] : []),
    ...(camp.double ? ["couples"] : []),
  ]);
}

function buildDescription(camp: Camp): string {
  const parts = [
    cleanText(camp.vibe),
    cleanText(camp.offersText),
    cleanText(camp.leadSubcopy),
  ].filter(Boolean);

  return parts.join(" ");
}

function fallbackDescription(camp: Camp): string {
  const description = buildDescription(camp);

  if (description) return description;

  return `A hosted safari trade profile for ${camp.name}. Trade partners can view location, brand details, and contact information here.`;
}

export function campToListing(
  camp: Camp,
  options?: {
    id?: string;
    ownerAccountId?: string;
    companySlug?: string;
    published?: boolean;
    featured?: boolean;
    accountStatus?: Listing["accountStatus"];
    kind?: Listing["kind"];
  },
): Listing {
  const slug = slugify(camp.name);

  const idealFor = unique([
    ...inferIdealFor(camp),
    ...camp.freeActivities
      .map((item) => item.toLowerCase())
      .filter((item) =>
        ["photography", "birding", "walking-safari", "game-drive"].includes(
          item,
        ),
      ),
  ]);

  const experiences = unique(
    [...camp.freeActivities, ...camp.paidActivities]
      .map((item) => slugify(item))
      .filter(Boolean),
  );

  return {
    id: options?.id ?? `camp-${slug}`,
    ownerAccountId: options?.ownerAccountId ?? "acct-admin",
    slug,
    kind: options?.kind ?? inferKind(camp),
    companySlug: options?.companySlug,
    name: cleanText(camp.name),
    location: cleanText(camp.locationLabel) || cleanText(camp.name),
    description: fallbackDescription(camp),
    published: options?.published ?? false,
    featured: options?.featured ?? false,
    accountStatus: options?.accountStatus ?? "active",
    logoImage: camp.logoImage || "",
    coverImage: camp.coverImage || "",
    matchAttributes: {
      idealFor,
      customFitNotes: cleanText(camp.terms) || undefined,
      budgetBands: inferBudgetBands(camp),
      destinations: inferDestinations(camp),
      travelMonths: [],
      experiences,
      styleTags: inferStyleTags(camp),
      suitability: inferSuitability(camp),
    },
  };
}

export function campsToListings(
  camps: Camp[],
  options?: {
    ownerAccountId?: string;
    companySlug?: string;
    published?: boolean;
    featured?: boolean;
    accountStatus?: Listing["accountStatus"];
    kind?: Listing["kind"];
  },
): Listing[] {
  return camps.map((camp, index) =>
    campToListing(camp, {
      id: `camp-${slugify(camp.name || `listing-${index + 1}`)}`,
      ownerAccountId: options?.ownerAccountId,
      companySlug: options?.companySlug,
      published: options?.published,
      featured: options?.featured,
      accountStatus: options?.accountStatus,
      kind: options?.kind,
    }),
  );
}
