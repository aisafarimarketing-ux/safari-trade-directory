"use client";

import React, { ReactNode, useEffect, useMemo, useState } from "react";

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
  mutedText: string;
};

type ApiListingRecord = {
  id: string;
  slug: string;
  name: string;
  companySlug: string | null;
  status: "draft" | "published" | "archived" | string | null;
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

type ProfileTab =
  | "rooms"
  | "activities"
  | "experience"
  | "contact"
  | "downloads";

type ContactGroup = {
  title: string;
  items: Array<{
    name: string;
    role: string;
    email: string;
    phone: string;
    whatsapp: string;
  }>;
};

const DEFAULT_THEME: ThemeState = {
  pageBg: "#e9e1d8",
  blockBg: "#f7f2eb",
  accent: "#5f472f",
  highlight: "#8e8260",
  borderColor: "rgba(117, 93, 62, 0.16)",
  mutedText: "rgba(95, 71, 47, 0.72)",
};

const DEFAULT_INCLUDED_ACTIVITIES = [
  "Stargazing",
  "Spear throwing with Maasai",
];

const DEFAULT_PAID_ACTIVITIES = [
  "Resident rate",
  "All-inclusive supplement",
  "Sundowner",
  "Private bush dinner",
  "Private bush breakfast",
  "Picnic hamper lunch",
  "Extra lunch",
  "Seronera / Kuro airstrip transfer",
  "Exclusive game drive vehicle",
  "Tour leader room",
  "Night game drive (Tarangire)",
];

const DEFAULT_ROOM_CONFIGS = [
  "Double",
  "Twin",
  "Triple",
  "Single",
  "Family",
];

const MAX_PROPERTY_IMAGES = 20;
const HERO_STRIP_VISIBLE = 5;

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

function normalizeResponse(json: unknown): ApiListingRecord[] {
  if (Array.isArray(json)) {
    return json as ApiListingRecord[];
  }

  const root = getRecord(json);

  if (Array.isArray(root.listings)) {
    return root.listings as ApiListingRecord[];
  }

  if (Array.isArray(root.data)) {
    return root.data as ApiListingRecord[];
  }

  return [];
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function getTheme(listing: ApiListingRecord): ThemeState {
  const raw = getRecord(listing.design?.theme);

  return {
    pageBg: getString(raw.pageBg) || DEFAULT_THEME.pageBg,
    blockBg: getString(raw.blockBg) || DEFAULT_THEME.blockBg,
    accent: getString(raw.accent) || DEFAULT_THEME.accent,
    highlight: getString(raw.highlight) || DEFAULT_THEME.highlight,
    borderColor: getString(raw.borderColor) || DEFAULT_THEME.borderColor,
    mutedText: getString(raw.mutedText) || DEFAULT_THEME.mutedText,
  };
}

function isValidPropertyProfile(item: ApiListingRecord, slug: string): boolean {
  const requestedSlug = slug.toLowerCase().trim();
  const listingSlug = getString(item.slug).toLowerCase();
  const status = getString(item.status).toLowerCase();

  if (!listingSlug) return false;
  if (status === "archived") return false;

  return listingSlug === requestedSlug;
}

function getData(listing: ApiListingRecord): Record<string, unknown> {
  return getRecord(listing.data);
}

function getSnapshot(listing: ApiListingRecord): Record<string, unknown> {
  const data = getData(listing);
  return getRecord(data.snapshot);
}

function getExperiences(listing: ApiListingRecord): Record<string, unknown> {
  const data = getData(listing);
  return getRecord(data.experiences);
}

function getLocation(listing: ApiListingRecord): string {
  const data = getData(listing);
  const snapshot = getSnapshot(listing);

  return (
    listing.location ||
    getString(snapshot.location) ||
    getString(data.locationLabel) ||
    getString(data.location) ||
    "Location not set"
  );
}

function getClassLabel(listing: ApiListingRecord): string {
  const data = getData(listing);
  return (
    listing.class ||
    getString(data.class) ||
    getString(getSnapshot(listing).style) ||
    "Property"
  );
}

function getOverview(listing: ApiListingRecord): string {
  const data = getData(listing);
  return (
    getString(data.overview) ||
    getString(data.description) ||
    ""
  );
}

function getVibe(listing: ApiListingRecord): string {
  const data = getData(listing);

  return (
    listing.vibe ||
    getString(data.vibe) ||
    getString(data.overview) ||
    getString(data.description) ||
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
  return (
    getString(data.tradeProfileLabel) ||
    (listing.companySlug ? listing.companySlug.replace(/-/g, " ") : "")
  );
}

function getTradeProfileSub(listing: ApiListingRecord): string {
  const data = getData(listing);
  return getString(data.tradeProfileSub) || getString(data.importSource);
}

function getQuickTags(listing: ApiListingRecord): string[] {
  const data = getData(listing);
  const quickTags = getStringArray(data.quickTags);

  if (quickTags.length > 0) {
    return Array.from(new Set(quickTags)).slice(0, 6);
  }

  const snapshot = getSnapshot(listing);
  return Array.from(
    new Set(
      [
        getLocation(listing),
        getClassLabel(listing),
        getString(snapshot.bestFor),
        getString(snapshot.setting),
        getString(snapshot.style),
      ].filter(Boolean),
    ),
  ).slice(0, 6);
}

function getRoomConfigs(listing: ApiListingRecord): string[] {
  const data = getData(listing);
  const configs = getStringArray(data.roomConfigs);
  if (configs.length > 0) return configs;
  return DEFAULT_ROOM_CONFIGS;
}

function getAllPropertyImages(
  listing: ApiListingRecord,
): Array<{ src: string; label: string }> {
  const data = getData(listing);
  const results: Array<{ src: string; label: string }> = [];

  const roomImages = getStringArray(data.roomImages);
  roomImages.forEach((src, index) => {
    results.push({
      src,
      label: `Property image ${index + 1}`,
    });
  });

  const gallery = data.gallery;
  if (Array.isArray(gallery)) {
    gallery.forEach((group, groupIndex) => {
      const groupRecord = getRecord(group);
      const groupLabel = getString(groupRecord.label) || `Gallery ${groupIndex + 1}`;
      const images = getStringArray(groupRecord.images);

      images.forEach((src, imageIndex) => {
        results.push({
          src,
          label: `${groupLabel} ${imageIndex + 1}`,
        });
      });
    });
  }

  const directImages = getStringArray(data.images);
  directImages.forEach((src, index) => {
    results.push({
      src,
      label: `Property image ${index + 1}`,
    });
  });

  return Array.from(new Map(results.map((item) => [item.src, item])).values()).slice(
    0,
    MAX_PROPERTY_IMAGES,
  );
}

function getHeroImage(listing: ApiListingRecord): string {
  const data = getData(listing);

  const cover = getString(data.coverImage);
  if (cover) return cover;

  const hero = getString(data.heroImage);
  if (hero) return hero;

  const allImages = getAllPropertyImages(listing);
  if (allImages.length > 0) return allImages[0].src;

  return "";
}

function getQuickSnapshot(listing: ApiListingRecord) {
  const data = getData(listing);
  const snapshot = getSnapshot(listing);

  const roomsValue = getString(snapshot.rooms);
  const legacyRooms = getNumber(data.rooms);

  return {
    rooms: roomsValue || (legacyRooms !== null ? String(legacyRooms) : ""),
    bestFor: getString(snapshot.bestFor) || getString(data.bestFor),
    setting: getString(snapshot.setting),
    style: getString(snapshot.style),
    access: getString(snapshot.access),
  };
}

function getIncludedExperiences(listing: ApiListingRecord): string[] {
  const experiences = getExperiences(listing);
  const included = getStringArray(experiences.included);
  if (included.length > 0) return included;

  const data = getData(listing);
  const freeActivities = getStringArray(data.freeActivities);
  if (freeActivities.length > 0) return freeActivities;

  return DEFAULT_INCLUDED_ACTIVITIES;
}

function getPaidExperiences(listing: ApiListingRecord): string[] {
  const experiences = getExperiences(listing);
  const paid = getStringArray(experiences.paid);
  if (paid.length > 0) return paid;

  const data = getData(listing);
  const paidActivities = getStringArray(data.paidActivities);
  if (paidActivities.length > 0) return paidActivities;

  return DEFAULT_PAID_ACTIVITIES;
}

function getActivitiesSummary(listing: ApiListingRecord): string {
  const data = getData(listing);
  return getString(data.activitiesText);
}

function getDownloads(listing: ApiListingRecord): Array<{ label: string; url: string }> {
  const data = getData(listing);
  const source = data.downloads || data.downloadables;

  const results: Array<{ label: string; url: string }> = [];

  if (Array.isArray(source)) {
    source.forEach((item, index) => {
      const row = getRecord(item);
      const label =
        getString(row.label || row.title || row.name) || `Download ${index + 1}`;
      const url = getString(row.url);

      if (url) {
        results.push({ label, url });
      }
    });
  }

  const uploadedPdfUrl = getString(data.pdfUrl) || getString(data.sourcePdfUrl);
  const uploadedPdfName =
    getString(data.pdfName) || getString(data.sourcePdfName) || "Property PDF";

  if (uploadedPdfUrl) {
    results.push({ label: uploadedPdfName, url: uploadedPdfUrl });
  }

  return Array.from(new Map(results.map((item) => [item.url, item])).values());
}

function getContactGroups(listing: ApiListingRecord): ContactGroup[] {
  const data = getData(listing);
  const contacts = getRecord(data.contacts);

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

  const directEmail =
    getString(data.contactEmail) ||
    getString(data.email) ||
    getString(data.reservationEmail) ||
    getString(data.reservationsEmail);

  const directPhone =
    getString(data.contactPhone) ||
    getString(data.phone) ||
    getString(data.reservationPhone) ||
    getString(data.reservationsPhone);

  const directWhatsapp =
    getString(data.contactWhatsapp) ||
    getString(data.whatsapp);

  const directName = getString(data.contactName);
  const directRole = getString(data.contactTitle) || "Reservations / Sales";

  if (directName || directRole || directEmail || directPhone || directWhatsapp) {
    return [
      {
        title: "Reservations",
        items: [
          {
            name: directName || "Reservations",
            role: directRole,
            email: directEmail,
            phone: directPhone,
            whatsapp: directWhatsapp,
          },
        ],
      },
    ];
  }

  return [];
}

function getTradeActions(listing: ApiListingRecord) {
  const data = getData(listing);
  const contactGroups = getContactGroups(listing);

  const fallbackEmail =
    getString(data.enquiryEmail) ||
    getString(data.contactEmail) ||
    getString(data.email) ||
    contactGroups.flatMap((group) => group.items).find((item) => item.email)?.email ||
    "";

  const fallbackWhatsApp =
    getString(data.enquiryWhatsApp) ||
    getString(data.whatsapp) ||
    contactGroups.flatMap((group) => group.items).find((item) => item.whatsapp)?.whatsapp ||
    "";

  return {
    enquiryEmail: fallbackEmail,
    enquiryWhatsApp: fallbackWhatsApp,
    enquirySubject: getString(data.enquirySubject) || `Trade Request: ${listing.name}`,
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

function getOverviewCopy(listing: ApiListingRecord): string {
  const overview = getOverview(listing);
  if (overview) return overview;

  const vibe = getVibe(listing);
  if (vibe) return vibe;

  return "A trade-facing safari dossier built for quick qualification, faster quoting, and elegant client-ready sharing.";
}

function getExperienceItems(listing: ApiListingRecord): string[] {
  const data = getData(listing);

  const explicitExperienceLines = uniqueStrings(
    getString(data.experienceText)
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
  );

  if (explicitExperienceLines.length > 0) {
    return explicitExperienceLines;
  }

  const activitiesSummaryLines = uniqueStrings(
    getString(data.activitiesText)
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
  );

  const included = getIncludedExperiences(listing);
  const paid = getPaidExperiences(listing);

  const merged = uniqueStrings([
    ...activitiesSummaryLines,
    ...included,
    ...paid,
  ]);

  if (merged.length > 0) {
    return merged.slice(0, 16);
  }

  return [
    "Bush breakfast",
    "Sundowner",
    "Private bush dinner",
    "Night game drive",
    "Picnic hamper lunch",
  ];
}

function getBestFacts(listing: ApiListingRecord) {
  const snapshot = getQuickSnapshot(listing);
  const location = getLocation(listing);
  const classLabel = getClassLabel(listing);

  return [
    {
      label: "Capacity",
      value: snapshot.rooms || "—",
      sub: snapshot.rooms ? classLabel : "Inventory pending",
    },
    {
      label: "Location",
      value: location || "—",
      sub: "Safari region",
    },
    {
      label: "Best For",
      value: snapshot.bestFor || "All year round",
      sub: "Ideal fit",
    },
    {
      label: "Setting",
      value: snapshot.setting || "—",
      sub: "Landscape",
    },
    {
      label: "Style",
      value: snapshot.style || classLabel || "Luxury",
      sub: "Property style",
    },
    {
      label: "Access",
      value: snapshot.access || "25 mins from Kuro airstrip",
      sub: "Arrival",
    },
  ];
}

function formatWhatsappLink(value: string): string {
  return `https://wa.me/${value.replace(/[^\d]/g, "")}`;
}

function getWrappedVisibleImages<T>(
  items: T[],
  startIndex: number,
  visibleCount: number,
): T[] {
  if (items.length === 0) return [];
  if (items.length <= visibleCount) return items;

  const result: T[] = [];
  for (let i = 0; i < visibleCount; i += 1) {
    result.push(items[(startIndex + i) % items.length]);
  }
  return result;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const slug = params.slug;
  const [listing, setListing] = useState<ApiListingRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>("rooms");
  const [heroStripIndex, setHeroStripIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch("/api/admin/listings", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (mounted) {
            setListing(null);
            setIsLoading(false);
          }
          return;
        }

        const json = await response.json();
        const listings = normalizeResponse(json);
        const match =
          listings.find((item) => isValidPropertyProfile(item, slug)) || null;

        if (mounted) {
          setListing(match);
          setIsLoading(false);
        }
      } catch {
        if (mounted) {
          setListing(null);
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const theme = useMemo(
    () => (listing ? getTheme(listing) : DEFAULT_THEME),
    [listing],
  );

  useEffect(() => {
    setHeroStripIndex(0);
  }, [listing?.slug]);

  if (isLoading) {
    return (
      <main
        className="min-h-screen"
        style={{
          backgroundColor: DEFAULT_THEME.pageBg,
          color: DEFAULT_THEME.accent,
        }}
      >
        <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6">
          <div
            className="rounded-[28px] border p-10"
            style={{
              borderColor: DEFAULT_THEME.borderColor,
              backgroundColor: DEFAULT_THEME.blockBg,
            }}
          >
            <div
              className="text-sm uppercase tracking-[0.22em]"
              style={{ color: DEFAULT_THEME.mutedText }}
            >
              SafariTrade
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              Loading profile…
            </h1>
          </div>
        </div>
      </main>
    );
  }

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

  const location = getLocation(listing);
  const propertyClass = getClassLabel(listing);
  const overviewCopy = getOverviewCopy(listing);
  const website = getWebsite(listing);
  const logoImage = getLogoImage(listing);
  const heroImage = getHeroImage(listing);
  const propertyImages = getAllPropertyImages(listing);
  const includedExperiences = getIncludedExperiences(listing);
  const paidExperiences = getPaidExperiences(listing);
  const activitiesSummary = getActivitiesSummary(listing);
  const downloads = getDownloads(listing);
  const contactGroups = getContactGroups(listing);
  const tradeActions = getTradeActions(listing);
  const tripadvisor = getTripadvisorData(listing);
  const quickTags = getQuickTags(listing);
  const label = getTradeProfileLabel(listing);
  const subLabel = getTradeProfileSub(listing);
  const bestFacts = getBestFacts(listing);
  const roomConfigs = getRoomConfigs(listing);
  const experienceItems = getExperienceItems(listing);
  const statusLabel = getString(listing.status).toLowerCase();

  const safeHeroStripIndex =
    propertyImages.length > 0
      ? Math.min(heroStripIndex, Math.max(propertyImages.length - 1, 0))
      : 0;

  const visibleHeroStripImages = getWrappedVisibleImages(
    propertyImages,
    safeHeroStripIndex,
    HERO_STRIP_VISIBLE,
  );

  function moveHeroStrip(direction: "prev" | "next") {
    if (propertyImages.length <= 1) return;

    if (direction === "prev") {
      setHeroStripIndex((prev) =>
        prev === 0 ? propertyImages.length - 1 : prev - 1,
      );
      return;
    }

    setHeroStripIndex((prev) => (prev + 1) % propertyImages.length);
  }

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: theme.pageBg, color: theme.accent }}
    >
      <div className="mx-auto max-w-[1280px] px-4 py-5 md:px-6 md:py-8">
        <div
          className="overflow-hidden rounded-[28px] border shadow-[0_20px_60px_rgba(70,48,22,0.10)]"
          style={{
            borderColor: theme.borderColor,
            backgroundColor: theme.blockBg,
          }}
        >
          <section
            className="border-b px-5 py-6 md:px-10 md:py-8"
            style={{ borderColor: theme.borderColor }}
          >
            <div className="flex flex-col items-center justify-center text-center">
              {logoImage ? (
                <div className="mb-4 h-16 w-28 overflow-hidden rounded-xl">
                  <img
                    src={logoImage}
                    alt={`${listing.name} logo`}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div
                  className="mb-4 text-[13px] font-semibold uppercase tracking-[0.32em]"
                  style={{ color: theme.accent, opacity: 0.8 }}
                >
                  {label || listing.companySlug?.replace(/-/g, " ") || "SafariTrade"}
                </div>
              )}

              <h1
                className="text-4xl font-semibold tracking-tight md:text-6xl"
                style={{ color: theme.accent }}
              >
                {listing.name}
              </h1>

              <p className="mt-3 text-sm md:text-xl" style={{ color: theme.mutedText }}>
                {[label, location, propertyClass].filter(Boolean).join(" · ")}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {statusLabel ? (
                  <span
                    className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em]"
                    style={{
                      borderColor: theme.borderColor,
                      backgroundColor: "rgba(255,255,255,0.42)",
                      color: theme.accent,
                    }}
                  >
                    {statusLabel}
                  </span>
                ) : null}

                {subLabel ? (
                  <span
                    className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em]"
                    style={{
                      borderColor: theme.borderColor,
                      backgroundColor: "rgba(255,255,255,0.42)",
                      color: theme.accent,
                    }}
                  >
                    {subLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </section>

          <section className="px-4 pb-5 pt-4 md:px-8 md:pb-6 md:pt-6">
            <div
              className="overflow-hidden rounded-[24px] border"
              style={{ borderColor: theme.borderColor }}
            >
              <div className="relative">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt={`${listing.name} hero`}
                    className="aspect-[16/7.2] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[16/7.2] w-full bg-[linear-gradient(135deg,#d8c2a0,#9b7d54)]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(60,41,22,0.52)] via-[rgba(60,41,22,0.08)] to-transparent" />

                <div className="absolute inset-x-0 bottom-0 px-5 pb-6 pt-16 md:px-10 md:pb-8">
                  <div className="text-center text-[#f8f3eb]">
                    <h2 className="text-3xl font-semibold drop-shadow-sm md:text-6xl">
                      {listing.name}
                    </h2>

                    <p className="mt-3 text-sm md:text-2xl">
                      {[label, location, propertyClass].filter(Boolean).join(" · ")}
                    </p>

                    {tripadvisor.rating !== null ? (
                      <div className="mt-4 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.20em] md:text-base">
                        <span>
                          {"★".repeat(
                            Math.max(1, Math.min(5, Math.round(tripadvisor.rating))),
                          )}
                        </span>
                        <span>Top trade-rated safari profile</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div
                className="border-t px-4 py-4 md:px-6"
                style={{ borderColor: theme.borderColor }}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div
                    className="text-sm font-semibold uppercase tracking-[0.14em]"
                    style={{ color: theme.accent }}
                  >
                    Camp preview
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveHeroStrip("prev")}
                      className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: "rgba(255,255,255,0.42)",
                        color: theme.accent,
                      }}
                    >
                      Prev
                    </button>

                    <button
                      type="button"
                      onClick={() => moveHeroStrip("next")}
                      className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: "rgba(255,255,255,0.42)",
                        color: theme.accent,
                      }}
                    >
                      Next
                    </button>

                    {downloads.length > 0 ? (
                      <a
                        href={downloads[0].url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: "rgba(255,255,255,0.42)",
                          color: theme.accent,
                        }}
                      >
                        Fact Sheet
                      </a>
                    ) : null}
                  </div>
                </div>

                {propertyImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    {visibleHeroStripImages.map((image, visibleIndex) => {
                      const realIndex =
                        propertyImages.length <= HERO_STRIP_VISIBLE
                          ? visibleIndex
                          : (safeHeroStripIndex + visibleIndex) % propertyImages.length;

                      return (
                        <div
                          key={`${image.src}-${realIndex}`}
                          className="group overflow-hidden rounded-[12px] border"
                          style={{
                            borderColor: theme.borderColor,
                            backgroundColor: "rgba(255,255,255,0.36)",
                          }}
                        >
                          <div className="overflow-hidden">
                            <img
                              src={image.src}
                              alt={image.label}
                              className="aspect-[4/2.3] w-full object-cover transition duration-300 group-hover:scale-110"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={`empty-room-${index}`}
                        className="rounded-[12px] border"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: "rgba(255,255,255,0.36)",
                        }}
                      >
                        <div className="aspect-[4/2.3] w-full" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="border-t px-4 py-4 md:px-6"
                style={{ borderColor: theme.borderColor }}
              >
                <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
                  {bestFacts.map((fact, index) => (
                    <div key={`${fact.label}-${index}`} className="flex h-full flex-col">
                      <div
                        className="rounded-t-[10px] border border-b-0 px-4 py-2 text-center text-[11px] uppercase tracking-[0.14em]"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: "rgba(255,255,255,0.22)",
                        }}
                      >
                        {fact.label}
                      </div>

                      <div
                        className="flex min-h-[128px] flex-1 flex-col items-center justify-center rounded-b-[10px] border px-3 py-4 text-center"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: "rgba(255,255,255,0.40)",
                        }}
                      >
                        <div className="line-clamp-3 text-[22px] font-semibold leading-tight md:text-[28px]">
                          {fact.value}
                        </div>
                        <div className="mt-2 text-sm" style={{ color: theme.mutedText }}>
                          {fact.sub}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 pb-4 md:px-8">
            <div className="grid gap-5 lg:grid-cols-[1.15fr_430px]">
              <div
                className="rounded-[22px] border px-5 py-5 md:px-7 md:py-7"
                style={{ borderColor: theme.borderColor }}
              >
                <h3 className="text-3xl font-semibold md:text-5xl">{listing.name}</h3>
                <p
                  className="mt-4 max-w-3xl text-base leading-8 md:text-xl"
                  style={{ color: theme.mutedText }}
                >
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
                className="rounded-[22px] border p-4 md:p-5"
                style={{
                  borderColor: theme.borderColor,
                  backgroundColor: "rgba(255,255,255,0.32)",
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {downloads.length > 0 ? (
                    <PrimaryAction href={downloads[0].url} theme={theme}>
                      Fact Sheet
                    </PrimaryAction>
                  ) : (
                    <PrimaryButton theme={theme}>Fact Sheet</PrimaryButton>
                  )}

                  {tradeActions.enquiryEmail ? (
                    <PrimaryAction
                      href={`mailto:${tradeActions.enquiryEmail}?subject=${encodeURIComponent(
                        tradeActions.enquirySubject,
                      )}`}
                      theme={theme}
                    >
                      Ask for Details
                    </PrimaryAction>
                  ) : (
                    <PrimaryButton theme={theme}>Ask for Details</PrimaryButton>
                  )}

                  {tradeActions.enquiryEmail ? (
                    <SecondaryAction
                      href={`mailto:${tradeActions.enquiryEmail}?subject=${encodeURIComponent(
                        `STO Request: ${listing.name}`,
                      )}`}
                      theme={theme}
                    >
                      Ask for STO
                    </SecondaryAction>
                  ) : (
                    <SecondaryButton theme={theme}>Ask for STO</SecondaryButton>
                  )}

                  {tradeActions.enquiryWhatsApp ? (
                    <SecondaryAction
                      href={formatWhatsappLink(tradeActions.enquiryWhatsApp)}
                      theme={theme}
                    >
                      Quick Message
                    </SecondaryAction>
                  ) : website ? (
                    <SecondaryAction href={website} theme={theme}>
                      Visit Website
                    </SecondaryAction>
                  ) : (
                    <SecondaryButton theme={theme}>Visit Website</SecondaryButton>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div className="px-4 pb-2 pt-3 md:px-8">
            <DossierTabs
              theme={theme}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>

          <section className="px-4 pb-8 md:px-8 md:pb-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              <div className="space-y-8">
                {activeTab === "rooms" ? (
                  <DossierCard title="ROOMS" theme={theme}>
                    <div className="flex flex-wrap gap-2">
                      {roomConfigs.map((item) => (
                        <SoftTag key={item} text={item} theme={theme} />
                      ))}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                      {propertyImages.length > 0 ? (
                        propertyImages.map((image, index) => (
                          <div
                            key={`${image.src}-${index}`}
                            className="group overflow-hidden rounded-[14px] border"
                            style={{
                              borderColor: theme.borderColor,
                              backgroundColor: "rgba(255,255,255,0.42)",
                            }}
                          >
                            <div className="overflow-hidden">
                              <img
                                src={image.src}
                                alt={image.label}
                                className="aspect-[4/2.8] w-full object-cover transition duration-300 group-hover:scale-110"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div
                          className="rounded-[14px] border px-4 py-4 text-sm"
                          style={{
                            borderColor: theme.borderColor,
                            backgroundColor: "rgba(255,255,255,0.42)",
                            color: theme.mutedText,
                          }}
                        >
                          Room imagery will appear here.
                        </div>
                      )}
                    </div>
                  </DossierCard>
                ) : null}

                {activeTab === "activities" ? (
                  <DossierCard title="ACTIVITIES" theme={theme}>
                    <div className="grid gap-5 md:grid-cols-2">
                      <ExperienceCard
                        title="Included"
                        items={includedExperiences}
                        theme={theme}
                      />
                      <ExperienceCard
                        title="Paid"
                        items={paidExperiences}
                        theme={theme}
                      />
                    </div>

                    {activitiesSummary ? (
                      <div
                        className="mt-5 rounded-[16px] border px-4 py-4 text-sm leading-7 md:text-base"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: "rgba(255,255,255,0.42)",
                          color: theme.accent,
                        }}
                      >
                        {activitiesSummary}
                      </div>
                    ) : null}
                  </DossierCard>
                ) : null}

                {activeTab === "experience" ? (
                  <DossierCard title="EXPERIENCE" theme={theme}>
                    <div className="flex flex-wrap gap-2">
                      {experienceItems.map((item) => (
                        <SoftTag key={item} text={item} theme={theme} />
                      ))}
                    </div>
                  </DossierCard>
                ) : null}
              </div>

              <aside className="space-y-6">
                {activeTab === "contact" ? (
                  <DossierCard title="CONTACT" theme={theme}>
                    {contactGroups.length > 0 ? (
                      <div className="space-y-5">
                        {contactGroups.map((group) => (
                          <div key={group.title}>
                            <div
                              className="text-[11px] uppercase tracking-[0.18em]"
                              style={{ color: theme.mutedText }}
                            >
                              {group.title}
                            </div>

                            <div className="mt-3 space-y-3">
                              {group.items.map((item, index) => (
                                <div
                                  key={`${group.title}-${index}`}
                                  className="rounded-[16px] border px-4 py-4"
                                  style={{
                                    borderColor: theme.borderColor,
                                    backgroundColor: "rgba(255,255,255,0.42)",
                                  }}
                                >
                                  {item.name ? (
                                    <div className="text-base font-semibold md:text-lg">
                                      {item.name}
                                    </div>
                                  ) : null}
                                  {item.role ? (
                                    <div
                                      className="mt-1 text-sm md:text-base"
                                      style={{ color: theme.mutedText }}
                                    >
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
                                    <div className="mt-2 text-sm md:text-base">
                                      {item.phone}
                                    </div>
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
                    ) : (
                      <div
                        className="rounded-[16px] border px-4 py-4 text-sm"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: "rgba(255,255,255,0.42)",
                          color: theme.mutedText,
                        }}
                      >
                        Contact details will appear here.
                      </div>
                    )}
                  </DossierCard>
                ) : null}

                {activeTab === "downloads" ? (
                  <DossierCard title="DOWNLOADS" theme={theme}>
                    {downloads.length > 0 ? (
                      <div className="space-y-3">
                        {downloads.map((item, index) => (
                          <a
                            key={`${item.label}-${index}`}
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-[16px] border px-4 py-3 text-sm font-medium md:text-base"
                            style={{
                              borderColor: theme.borderColor,
                              backgroundColor: "rgba(255,255,255,0.42)",
                              color: theme.accent,
                            }}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="rounded-[16px] border px-4 py-4 text-sm"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: "rgba(255,255,255,0.42)",
                          color: theme.mutedText,
                        }}
                      >
                        No downloads available yet.
                      </div>
                    )}
                  </DossierCard>
                ) : null}

                {(tripadvisor.rating !== null || tripadvisor.link) ? (
                  <DossierCard title="TRIPADVISOR" theme={theme}>
                    {tripadvisor.logoUrl ? (
                      <div
                        className="overflow-hidden rounded-[16px] border px-4 py-3"
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
                        className="mt-3 rounded-[16px] border px-4 py-3 text-sm font-medium md:text-base"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: "rgba(255,255,255,0.42)",
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
                        className="mt-3 block rounded-[16px] border px-4 py-3 text-sm font-medium md:text-base"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: "rgba(255,255,255,0.42)",
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

function DossierTabs(props: {
  theme: ThemeState;
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}) {
  const tabs: Array<{ key: ProfileTab; label: string }> = [
    { key: "rooms", label: "Rooms" },
    { key: "activities", label: "Activities" },
    { key: "experience", label: "Experience" },
    { key: "contact", label: "Contact" },
    { key: "downloads", label: "Downloads" },
  ];

  return (
    <>
      <div className="hidden md:flex md:flex-wrap md:gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => props.onChange(tab.key)}
            className="rounded-t-[14px] border px-5 py-3 text-sm font-medium transition"
            style={{
              borderColor: props.theme.borderColor,
              backgroundColor:
                props.activeTab === tab.key
                  ? `${props.theme.highlight}22`
                  : "rgba(255,255,255,0.36)",
              color: props.theme.accent,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 md:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => props.onChange(tab.key)}
            className="rounded-full border px-4 py-2 text-xs font-medium transition"
            style={{
              borderColor: props.theme.borderColor,
              backgroundColor:
                props.activeTab === tab.key
                  ? `${props.theme.highlight}22`
                  : "rgba(255,255,255,0.36)",
              color: props.theme.accent,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </>
  );
}

function DossierCard(props: {
  title: string;
  theme: ThemeState;
  children: ReactNode;
}) {
  return (
    <section
      className="rounded-[22px] border p-5 md:p-6"
      style={{
        borderColor: props.theme.borderColor,
        backgroundColor: "rgba(255,255,255,0.24)",
        color: props.theme.accent,
      }}
    >
      <div className="flex items-end gap-3">
        <h3 className="text-xl font-semibold tracking-[0.08em] md:text-3xl">
          {props.title}
        </h3>
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
      className="rounded-[16px] border p-4"
      style={{
        borderColor: props.theme.borderColor,
        backgroundColor: "rgba(255,255,255,0.42)",
      }}
    >
      <div
        className="text-[11px] uppercase tracking-[0.18em]"
        style={{ color: props.theme.mutedText }}
      >
        {props.title}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {props.items.length > 0 ? (
          props.items.map((item) => (
            <SoftTag key={item} text={item} theme={props.theme} />
          ))
        ) : (
          <span style={{ color: props.theme.mutedText }}>None listed</span>
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
        backgroundColor: "rgba(255,255,255,0.46)",
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
  const external = /^https?:\/\//i.test(props.href);

  return (
    <a
      href={props.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="block rounded-[14px] px-4 py-3 text-center text-sm font-medium md:text-base"
      style={{
        backgroundColor: `${props.theme.highlight}dd`,
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
  const external = /^https?:\/\//i.test(props.href);

  return (
    <a
      href={props.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="block rounded-[14px] border px-4 py-3 text-center text-sm font-medium md:text-base"
      style={{
        borderColor: props.theme.borderColor,
        backgroundColor: "rgba(255,255,255,0.42)",
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
      className="rounded-[14px] px-4 py-3 text-center text-sm font-medium md:text-base"
      style={{
        backgroundColor: `${props.theme.highlight}dd`,
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
      className="rounded-[14px] border px-4 py-3 text-center text-sm font-medium md:text-base"
      style={{
        borderColor: props.theme.borderColor,
        backgroundColor: "rgba(255,255,255,0.42)",
        color: props.theme.accent,
      }}
    >
      {props.children}
    </div>
  );
}
