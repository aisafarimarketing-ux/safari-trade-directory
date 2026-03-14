import { NextResponse } from "next/server";

type ListingStatus = "draft" | "published" | "archived";

type ThemeState = {
  pageBg?: string;
  blockBg?: string;
  accent?: string;
  highlight?: string;
  borderColor?: string;
};

type ListingDesignPreset =
  | "safari-dossier"
  | "modern-trade-deck"
  | "editorial-luxury";

type ListingDesign = {
  preset: ListingDesignPreset;
  theme: ThemeState | null;
};

type GalleryGroup = {
  label: string;
  images: string[];
};

type RateRow = {
  season: string;
  dates: string;
  rackPPPN: string;
};

type ExperienceGroup = {
  included: string[];
  paid: string[];
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

type ListingData = {
  overview?: string | null;
  snapshot: {
    rooms?: string | null;
    location?: string | null;
    bestFor?: string | null;
    setting?: string | null;
    style?: string | null;
    access?: string | null;
  };
  gallery: GalleryGroup[];
  rates: {
    currency?: string | null;
    notes: string[];
    rows: RateRow[];
  };
  experiences: ExperienceGroup;
  policies: {
    childPolicy?: string | null;
    honeymoonPolicy?: string | null;
    cancellation?: string | null;
    importantNotes: string[];
    tradeNotes: string[];
  };
  downloads: DownloadItem[];
  contacts: {
    reservations: ContactItem[];
    sales: ContactItem[];
    marketing: ContactItem[];
  };
  offers: string[];
  sustainability?: string | null;
};

type ListingRecord = {
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
  data: ListingData;
  design: ListingDesign;
  createdAt: string;
  updatedAt: string;
};

const memoryStore = globalThis as typeof globalThis & {
  __adminListingsStore?: Map<string, ListingRecord>;
};

if (!memoryStore.__adminListingsStore) {
  memoryStore.__adminListingsStore = new Map<string, ListingRecord>();
}

const listingsStore = memoryStore.__adminListingsStore;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function asTrimmedString(value: unknown): string | null {
  return isString(value) && value.trim() ? value.trim() : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toNumberOrNull(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function extractListingInput(body: Record<string, unknown>) {
  if (isObject(body.camp)) {
    return body.camp;
  }

  if (
    Array.isArray(body.portfolio) &&
    typeof body.selectedCampIndex === "number" &&
    body.portfolio[body.selectedCampIndex] &&
    isObject(body.portfolio[body.selectedCampIndex])
  ) {
    return body.portfolio[body.selectedCampIndex] as Record<string, unknown>;
  }

  return body;
}

function normalizeDesign(
  body: Record<string, unknown>,
  existing?: ListingRecord,
): ListingDesign {
  const presetValue = asTrimmedString(body.preset) ?? asTrimmedString(body.designPreset);

  const preset: ListingDesignPreset =
    presetValue === "modern-trade-deck" ||
    presetValue === "editorial-luxury" ||
    presetValue === "safari-dossier"
      ? presetValue
      : existing?.design.preset ?? "safari-dossier";

  const theme = isObject(body.theme)
    ? (body.theme as ThemeState)
    : existing?.design.theme ?? null;

  return {
    preset,
    theme,
  };
}

function normalizeGallery(raw: unknown): GalleryGroup[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (!isObject(item)) return null;

      const label = asTrimmedString(item.label) ?? "Gallery";
      const images = Array.isArray(item.images)
        ? item.images
            .filter((img): img is string => typeof img === "string")
            .map((img) => img.trim())
            .filter(Boolean)
        : [];

      return { label, images };
    })
    .filter((item): item is GalleryGroup => Boolean(item));
}

function normalizeRates(raw: unknown): ListingData["rates"] {
  if (!isObject(raw)) {
    return {
      currency: null,
      notes: [],
      rows: [],
    };
  }

  const rows = Array.isArray(raw.rows)
    ? raw.rows
        .map((row) => {
          if (!isObject(row)) return null;

          return {
            season: asTrimmedString(row.season) ?? "",
            dates: asTrimmedString(row.dates) ?? "",
            rackPPPN:
              asTrimmedString(row.rackPPPN) ??
              asTrimmedString(row.rackRate) ??
              "",
          };
        })
        .filter(
          (row): row is RateRow =>
            Boolean(row) && Boolean(row.season || row.dates || row.rackPPPN),
        )
    : [];

  return {
    currency: asTrimmedString(raw.currency),
    notes: asStringArray(raw.notes),
    rows,
  };
}

function normalizeExperiences(raw: unknown): ExperienceGroup {
  if (!isObject(raw)) {
    return { included: [], paid: [] };
  }

  return {
    included: asStringArray(raw.included),
    paid: asStringArray(raw.paid),
  };
}

function normalizePolicies(raw: unknown): ListingData["policies"] {
  if (!isObject(raw)) {
    return {
      childPolicy: null,
      honeymoonPolicy: null,
      cancellation: null,
      importantNotes: [],
      tradeNotes: [],
    };
  }

  return {
    childPolicy: asTrimmedString(raw.childPolicy),
    honeymoonPolicy: asTrimmedString(raw.honeymoonPolicy),
    cancellation: asTrimmedString(raw.cancellation),
    importantNotes: asStringArray(raw.importantNotes),
    tradeNotes: asStringArray(raw.tradeNotes),
  };
}

function normalizeDownloads(raw: unknown): DownloadItem[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (!isObject(item)) return null;

      const label = asTrimmedString(item.label);
      const url = asTrimmedString(item.url);

      if (!label || !url) return null;

      return {
        label,
        url,
        type: asTrimmedString(item.type),
      };
    })
    .filter((item): item is DownloadItem => Boolean(item));
}

function normalizeContactList(raw: unknown): ContactItem[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (!isObject(item)) return null;

      return {
        name: asTrimmedString(item.name),
        role: asTrimmedString(item.role),
        email: asTrimmedString(item.email),
        phone: asTrimmedString(item.phone),
        whatsapp: asTrimmedString(item.whatsapp),
      };
    })
    .filter((item): item is ContactItem => Boolean(item));
}

function normalizeContacts(raw: unknown): ListingData["contacts"] {
  if (!isObject(raw)) {
    return {
      reservations: [],
      sales: [],
      marketing: [],
    };
  }

  return {
    reservations: normalizeContactList(raw.reservations),
    sales: normalizeContactList(raw.sales),
    marketing: normalizeContactList(raw.marketing),
  };
}

function normalizeData(
  input: Record<string, unknown>,
  existing?: ListingRecord,
): ListingData {
  const rawData = isObject(input.data) ? input.data : {};
  const previous = existing?.data;

  const snapshotSource = isObject(rawData.snapshot) ? rawData.snapshot : {};

  return {
    overview:
      asTrimmedString(rawData.overview) ??
      previous?.overview ??
      null,

    snapshot: {
      rooms:
        asTrimmedString(snapshotSource.rooms) ??
        asTrimmedString(input.rooms) ??
        previous?.snapshot.rooms ??
        null,
      location:
        asTrimmedString(snapshotSource.location) ??
        asTrimmedString(input.location) ??
        asTrimmedString(input.locationLabel) ??
        previous?.snapshot.location ??
        null,
      bestFor:
        asTrimmedString(snapshotSource.bestFor) ??
        previous?.snapshot.bestFor ??
        null,
      setting:
        asTrimmedString(snapshotSource.setting) ??
        previous?.snapshot.setting ??
        null,
      style:
        asTrimmedString(snapshotSource.style) ??
        previous?.snapshot.style ??
        null,
      access:
        asTrimmedString(snapshotSource.access) ??
        previous?.snapshot.access ??
        null,
    },

    gallery:
      normalizeGallery(rawData.gallery).length > 0
        ? normalizeGallery(rawData.gallery)
        : previous?.gallery ?? [],

    rates:
      isObject(rawData.rates)
        ? normalizeRates(rawData.rates)
        : previous?.rates ?? { currency: null, notes: [], rows: [] },

    experiences:
      isObject(rawData.experiences)
        ? normalizeExperiences(rawData.experiences)
        : previous?.experiences ?? { included: [], paid: [] },

    policies:
      isObject(rawData.policies)
        ? normalizePolicies(rawData.policies)
        : previous?.policies ?? {
            childPolicy: null,
            honeymoonPolicy: null,
            cancellation: null,
            importantNotes: [],
            tradeNotes: [],
          },

    downloads:
      Array.isArray(rawData.downloads)
        ? normalizeDownloads(rawData.downloads)
        : previous?.downloads ?? [],

    contacts:
      isObject(rawData.contacts)
        ? normalizeContacts(rawData.contacts)
        : previous?.contacts ?? {
            reservations: [],
            sales: [],
            marketing: [],
          },

    offers:
      Array.isArray(rawData.offers)
        ? asStringArray(rawData.offers)
        : previous?.offers ?? [],

    sustainability:
      asTrimmedString(rawData.sustainability) ??
      previous?.sustainability ??
      null,
  };
}

export async function GET() {
  const listings = Array.from(listingsStore.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return NextResponse.json({
    listings,
    total: listings.length,
    storage: "memory",
  });
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();

    if (!isObject(rawBody)) {
      return NextResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400 },
      );
    }

    const listingInput = extractListingInput(rawBody);

    if (!isObject(listingInput)) {
      return NextResponse.json(
        { error: "Listing payload is missing." },
        { status: 400 },
      );
    }

    const name = asTrimmedString(listingInput.name) ?? "";

    if (!name) {
      return NextResponse.json(
        { error: "Listing name is required." },
        { status: 400 },
      );
    }

    const slugInput = asTrimmedString(listingInput.slug);
    const slug = slugInput || slugify(name);

    if (!slug) {
      return NextResponse.json(
        { error: "Unable to generate slug." },
        { status: 400 },
      );
    }

    const companySlug = asTrimmedString(listingInput.companySlug);

    if (companySlug && slug === companySlug) {
      return NextResponse.json(
        {
          error:
            "Property slug cannot be the same as the company slug. Use a property slug like 'nyumbani-serengeti'.",
        },
        { status: 400 },
      );
    }

    const existing = listingsStore.get(slug);
    const now = new Date().toISOString();

    const requestedStatus = asTrimmedString(listingInput.status);
    const status: ListingStatus =
      requestedStatus === "draft" ||
      requestedStatus === "published" ||
      requestedStatus === "archived"
        ? requestedStatus
        : existing?.status ?? "draft";

    const location =
      asTrimmedString(listingInput.location) ??
      asTrimmedString(listingInput.locationLabel) ??
      existing?.location ??
      null;

    const record: ListingRecord = {
      id: existing?.id ?? crypto.randomUUID(),
      slug,
      name,
      companySlug: companySlug ?? existing?.companySlug ?? null,
      status,
      location,
      class: asTrimmedString(listingInput.class) ?? existing?.class ?? null,
      vibe: asTrimmedString(listingInput.vibe) ?? existing?.vibe ?? null,
      website:
        asTrimmedString(listingInput.website) ?? existing?.website ?? null,
      mapLink:
        asTrimmedString(listingInput.mapLink) ?? existing?.mapLink ?? null,
      tripadvisorRating: (() => {
        const next = toNumberOrNull(
          listingInput.tripadvisorRating ??
            listingInput.taRating ??
            listingInput.rating,
        );
        return next ?? existing?.tripadvisorRating ?? null;
      })(),
      data: normalizeData(listingInput, existing),
      design: normalizeDesign(rawBody, existing),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    listingsStore.set(slug, record);

    return NextResponse.json({
      success: true,
      listing: record,
      storage: "memory",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }
}
