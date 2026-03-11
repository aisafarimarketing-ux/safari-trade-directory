import { NextResponse } from "next/server";

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
    const body = await req.json();

    const name =
      typeof body?.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Listing name is required." },
        { status: 400 },
      );
    }

    const slugInput =
      typeof body?.slug === "string" ? body.slug.trim() : "";

    const slug = slugInput || slugify(name);

    if (!slug) {
      return NextResponse.json(
        { error: "Unable to generate slug." },
        { status: 400 },
      );
    }

    const existing = listingsStore.get(slug);
    const now = new Date().toISOString();

    const record: ListingRecord = {
      id: existing?.id ?? crypto.randomUUID(),
      slug,
      name,
      companySlug:
        typeof body?.companySlug === "string" && body.companySlug.trim()
          ? body.companySlug.trim()
          : null,
      status:
        body?.status === "published" || body?.status === "archived"
          ? body.status
          : "draft",
      locationLabel:
        typeof body?.locationLabel === "string" && body.locationLabel.trim()
          ? body.locationLabel.trim()
          : null,
      class:
        typeof body?.class === "string" && body.class.trim()
          ? body.class.trim()
          : null,
      vibe:
        typeof body?.vibe === "string" && body.vibe.trim()
          ? body.vibe.trim()
          : null,
      website:
        typeof body?.website === "string" && body.website.trim()
          ? body.website.trim()
          : null,
      mapLink:
        typeof body?.mapLink === "string" && body.mapLink.trim()
          ? body.mapLink.trim()
          : null,
      tripadvisorRating: toNumberOrNull(body?.taRating ?? body?.rating),
      data: body,
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
