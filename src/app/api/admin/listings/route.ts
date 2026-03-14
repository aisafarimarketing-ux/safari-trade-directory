import { NextResponse } from "next/server";

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

type ListingDesign = {
  theme: ThemeState | null;
  blockColors: BlockColorState | null;
  visibleBlocks: VisibleBlocksState | null;
};

type ListingRecord = {
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
  data: unknown;
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

function toNumberOrNull(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pickDesign(
  body: Record<string, unknown>,
  existing?: ListingRecord,
): ListingDesign {
  const theme = isObject(body.theme)
    ? (body.theme as ThemeState)
    : existing?.design.theme ?? null;

  const blockColors = isObject(body.blockColors)
    ? (body.blockColors as BlockColorState)
    : existing?.design.blockColors ?? null;

  const visibleBlocks = isObject(body.visibleBlocks)
    ? (body.visibleBlocks as VisibleBlocksState)
    : existing?.design.visibleBlocks ?? null;

  return {
    theme,
    blockColors,
    visibleBlocks,
  };
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

    const name =
      typeof listingInput.name === "string" ? listingInput.name.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Listing name is required." },
        { status: 400 },
      );
    }

    const slugInput =
      typeof listingInput.slug === "string" ? listingInput.slug.trim() : "";

    const slug = slugInput || slugify(name);

    const companySlug =
      typeof listingInput.companySlug === "string" &&
      listingInput.companySlug.trim()
        ? listingInput.companySlug.trim()
        : "";

    if (!slug) {
      return NextResponse.json(
        { error: "Unable to generate slug." },
        { status: 400 },
      );
    }

    if (companySlug && slug === companySlug) {
      return NextResponse.json(
        {
          error:
            "Property slug cannot be the same as the company slug. Use a property name like 'nyumbani-serengeti'.",
        },
        { status: 400 },
      );
    }

    const existing = listingsStore.get(slug);
    const now = new Date().toISOString();

    const record: ListingRecord = {
      id: existing?.id ?? crypto.randomUUID(),
      slug,
      name,
      companySlug: companySlug || existing?.companySlug || "nyumbani-collection",
      status:
        listingInput.status === "published" ||
        listingInput.status === "archived" ||
        listingInput.status === "draft"
          ? listingInput.status
          : existing?.status ?? "published",
      locationLabel:
        typeof listingInput.locationLabel === "string" &&
        listingInput.locationLabel.trim()
          ? listingInput.locationLabel.trim()
          : existing?.locationLabel ?? null,
      class:
        typeof listingInput.class === "string" && listingInput.class.trim()
          ? listingInput.class.trim()
          : existing?.class ?? null,
      vibe:
        typeof listingInput.vibe === "string" && listingInput.vibe.trim()
          ? listingInput.vibe.trim()
          : existing?.vibe ?? null,
      website:
        typeof listingInput.website === "string" && listingInput.website.trim()
          ? listingInput.website.trim()
          : existing?.website ?? null,
      mapLink:
        typeof listingInput.mapLink === "string" && listingInput.mapLink.trim()
          ? listingInput.mapLink.trim()
          : existing?.mapLink ?? null,
      tripadvisorRating: toNumberOrNull(
        listingInput.taRating ?? listingInput.rating,
      ),
      data: listingInput,
      design: pickDesign(rawBody, existing),
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
