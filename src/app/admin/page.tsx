"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

type ListingStatus = "draft" | "published" | "archived";
type DesignPreset =
  | "safari-dossier"
  | "modern-trade-deck"
  | "editorial-luxury";

type ThemeState = {
  pageBg: string;
  blockBg: string;
  accent: string;
  highlight: string;
  borderColor: string;
};

type SnapshotState = {
  rooms: string;
  location: string;
  bestFor: string;
  setting: string;
  style: string;
  access: string;
};

type GalleryGroup = {
  id: string;
  label: string;
  images: string[];
};

type RateRow = {
  id: string;
  season: string;
  dates: string;
  rackPPPN: string;
};

type DownloadItem = {
  id: string;
  label: string;
  url: string;
  type: string;
};

type ContactItem = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  whatsapp: string;
};

type ListingEditorState = {
  slug: string;
  name: string;
  companySlug: string;
  status: ListingStatus;
  location: string;
  class: string;
  vibe: string;
  website: string;
  mapLink: string;
  tripadvisorRating: string;
  logoImage: string;
  coverImage: string;
  quickTagsText: string;
  preset: DesignPreset;
  theme: ThemeState;
  overview: string;

  roomConfigsText: string;
  roomImages: string[];
  activitiesText: string;
  experienceText: string;

  snapshot: SnapshotState;
  gallery: GalleryGroup[];
  rates: {
    currency: string;
    notesText: string;
    rows: RateRow[];
  };
  experiences: {
    includedText: string;
    paidText: string;
  };
  policies: {
    childPolicy: string;
    honeymoonPolicy: string;
    cancellation: string;
    importantNotesText: string;
    tradeNotesText: string;
  };
  downloads: DownloadItem[];
  contacts: {
    reservations: ContactItem[];
    sales: ContactItem[];
    marketing: ContactItem[];
  };
  offersText: string;
  sustainability: string;
  enquiryEmail: string;
  enquiryWhatsApp: string;
  enquirySubject: string;
  taLogoUrl: string;
  taLink: string;
  tradeProfileLabel: string;
  tradeProfileSub: string;
};

type ApiListingRecord = {
  id?: string;
  slug?: string;
  name?: string;
  companySlug?: string | null;
  status?: ListingStatus | string | null;
  location?: string | null;
  class?: string | null;
  vibe?: string | null;
  website?: string | null;
  mapLink?: string | null;
  tripadvisorRating?: number | null;
  design?: {
    preset?: DesignPreset;
    theme?: Partial<ThemeState> | null;
  } | null;
  data?: Record<string, unknown> | null;
};

type UploadApiResponse = {
  success: boolean;
  file?: {
    url: string;
    fileName: string;
    mimeType: string;
    size: number;
  };
  error?: string;
};

type PdfImportResponse = {
  success: boolean;
  extractedText?: string;
  parsed?: {
    name?: string;
    companySlug?: string;
    location?: string;
    class?: string;
    vibe?: string;
    website?: string;
    mapLink?: string;
    snapshot?: {
      rooms?: string;
      location?: string;
      bestFor?: string;
      setting?: string;
      style?: string;
      access?: string;
    };
    rates?: {
      notes?: string[];
      rows?: Array<{
        season?: string;
        dates?: string;
        rackPPPN?: string;
      }>;
    };
    experiences?: {
      included?: string[];
      paid?: string[];
    };
    policies?: {
      childPolicy?: string;
      honeymoonPolicy?: string;
      cancellation?: string;
      importantNotes?: string[];
      tradeNotes?: string[];
    };
    contacts?: {
      reservations?: Array<{
        name?: string;
        role?: string;
        email?: string;
        phone?: string;
        whatsapp?: string;
      }>;
      sales?: Array<{
        name?: string;
        role?: string;
        email?: string;
        phone?: string;
        whatsapp?: string;
      }>;
      marketing?: Array<{
        name?: string;
        role?: string;
        email?: string;
        phone?: string;
        whatsapp?: string;
      }>;
    };
    enquiryEmail?: string;
    enquiryWhatsApp?: string;
    enquirySubject?: string;
    quickTags?: string[];
    tradeProfileLabel?: string;
    tradeProfileSub?: string;
  };
  warnings?: string[];
  error?: string;
};

const STORAGE_KEY = "safaritrade-admin-v5";

const DEFAULT_THEME: ThemeState = {
  pageBg: "#e8e1d8",
  blockBg: "#f6f1ea",
  accent: "#6a5237",
  highlight: "#8b8364",
  borderColor: "#d7ccbf",
};

const DEFAULT_ROOM_CONFIGS = [
  "Double",
  "Twin",
  "Triple",
  "Single",
  "Family",
];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string")
    .map((item) => String(item).trim())
    .filter(Boolean);
}

function getNumberString(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();
  return "";
}

function textToLines(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function linesToText(value: unknown): string {
  return getStringArray(value).join("\n");
}

async function parseResponseSafely<T = unknown>(response: Response): Promise<{
  json: T | null;
  text: string;
}> {
  const text = await response.text();

  if (!text) {
    return { json: null, text: "" };
  }

  try {
    return {
      json: JSON.parse(text) as T,
      text,
    };
  } catch {
    return {
      json: null,
      text,
    };
  }
}

function makeContact(): ContactItem {
  return {
    id: uid(),
    name: "",
    role: "",
    email: "",
    phone: "",
    whatsapp: "",
  };
}

function makeRateRow(): RateRow {
  return {
    id: uid(),
    season: "",
    dates: "",
    rackPPPN: "",
  };
}

function makeGalleryGroup(label = "Gallery"): GalleryGroup {
  return {
    id: uid(),
    label,
    images: [],
  };
}

function makeDownload(): DownloadItem {
  return {
    id: uid(),
    label: "",
    url: "",
    type: "link",
  };
}

function makeEmptyListing(): ListingEditorState {
  return {
    slug: "",
    name: "New Property",
    companySlug: "nyumbani-collection",
    status: "draft",
    location: "",
    class: "",
    vibe: "",
    website: "",
    mapLink: "",
    tripadvisorRating: "",
    logoImage: "",
    coverImage: "",
    quickTagsText: "",
    preset: "safari-dossier",
    theme: DEFAULT_THEME,
    overview: "",

    roomConfigsText: DEFAULT_ROOM_CONFIGS.join("\n"),
    roomImages: [],
    activitiesText: "",
    experienceText: "",

    snapshot: {
      rooms: "",
      location: "",
      bestFor: "",
      setting: "",
      style: "",
      access: "",
    },
    gallery: [
      makeGalleryGroup("Gallery 1"),
      makeGalleryGroup("Gallery 2"),
      makeGalleryGroup("Gallery 3"),
      makeGalleryGroup("Gallery 4"),
    ],
    rates: {
      currency: "",
      notesText: "Rates per person sharing\nFull board\nPark fees excluded",
      rows: [makeRateRow()],
    },
    experiences: {
      includedText: "",
      paidText: "",
    },
    policies: {
      childPolicy: "",
      honeymoonPolicy: "",
      cancellation: "",
      importantNotesText: "",
      tradeNotesText: "",
    },
    downloads: [],
    contacts: {
      reservations: [makeContact()],
      sales: [makeContact()],
      marketing: [makeContact()],
    },
    offersText: "",
    sustainability: "",
    enquiryEmail: "",
    enquiryWhatsApp: "",
    enquirySubject: "Trade Request",
    taLogoUrl: "",
    taLink: "",
    tradeProfileLabel: "",
    tradeProfileSub: "",
  };
}

function normalizeTheme(value: unknown): ThemeState {
  const raw = getRecord(value);
  return {
    pageBg: getString(raw.pageBg) || DEFAULT_THEME.pageBg,
    blockBg: getString(raw.blockBg) || DEFAULT_THEME.blockBg,
    accent: getString(raw.accent) || DEFAULT_THEME.accent,
    highlight: getString(raw.highlight) || DEFAULT_THEME.highlight,
    borderColor: getString(raw.borderColor) || DEFAULT_THEME.borderColor,
  };
}

function normalizeGallery(value: unknown): GalleryGroup[] {
  if (!Array.isArray(value)) {
    return [
      makeGalleryGroup("Gallery 1"),
      makeGalleryGroup("Gallery 2"),
      makeGalleryGroup("Gallery 3"),
      makeGalleryGroup("Gallery 4"),
    ];
  }

  const rows = value
    .map((item, index) => {
      const row = getRecord(item);
      return {
        id: uid(),
        label: getString(row.label) || `Gallery ${index + 1}`,
        images: getStringArray(row.images),
      };
    })
    .filter((item) => item.label || item.images.length > 0);

  if (rows.length >= 4) return rows;

  const padded = [...rows];
  while (padded.length < 4) {
    padded.push(makeGalleryGroup(`Gallery ${padded.length + 1}`));
  }
  return padded;
}

function normalizeRates(value: unknown) {
  const raw = getRecord(value);
  const rowsSource = raw.rows;

  const rows = Array.isArray(rowsSource)
    ? rowsSource
        .map((item) => {
          const row = getRecord(item);
          return {
            id: uid(),
            season: getString(row.season),
            dates: getString(row.dates),
            rackPPPN:
              getString(row.rackPPPN) ||
              getString(row.rackRate) ||
              getString(row.rack) ||
              getString(row.rate),
          };
        })
        .filter((row) => row.season || row.dates || row.rackPPPN)
    : [makeRateRow()];

  return {
    currency: getString(raw.currency),
    notesText: linesToText(raw.notes),
    rows: rows.length > 0 ? rows : [makeRateRow()],
  };
}

function normalizeContactList(value: unknown): ContactItem[] {
  if (!Array.isArray(value)) return [makeContact()];

  const rows = value
    .map((item) => {
      const row = getRecord(item);
      return {
        id: uid(),
        name: getString(row.name),
        role: getString(row.role),
        email: getString(row.email),
        phone: getString(row.phone),
        whatsapp: getString(row.whatsapp),
      };
    })
    .filter(
      (item) =>
        item.name || item.role || item.email || item.phone || item.whatsapp,
    );

  return rows.length > 0 ? rows : [makeContact()];
}

function normalizeDownloads(value: unknown): DownloadItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const row = getRecord(item);
      return {
        id: uid(),
        label: getString(row.label || row.title || row.name),
        url: getString(row.url),
        type: getString(row.type) || "link",
      };
    })
    .filter((item) => item.label || item.url);
}

function fromApiListing(listing: ApiListingRecord): ListingEditorState {
  const base = makeEmptyListing();
  const data = getRecord(listing.data);
  const snapshot = getRecord(data.snapshot);
  const experiences = getRecord(data.experiences);
  const policies = getRecord(data.policies);
  const contacts = getRecord(data.contacts);

  const gallery = normalizeGallery(data.gallery);
  const flatImages = getStringArray(data.images);

  if (flatImages.length > 0) {
    for (let i = 0; i < flatImages.length && i < gallery.length; i += 1) {
      if (gallery[i] && gallery[i].images.length === 0) {
        gallery[i].images = [flatImages[i]];
      }
    }
  }

  const logoImage = getString(data.logoImage);
  const coverImage =
    getString(data.coverImage) ||
    getString(data.heroImage) ||
    flatImages[0] ||
    gallery.flatMap((group) => group.images)[0] ||
    "";

  const location =
    getString(listing.location) ||
    getString(snapshot.location) ||
    getString(data.locationLabel) ||
    getString(data.location);

  const roomImages =
    getStringArray(data.roomImages).length > 0
      ? getStringArray(data.roomImages)
      : gallery.slice(0, 4).map((group) => group.images[0]).filter(Boolean);

  return {
    ...base,
    slug: getString(listing.slug),
    name: getString(listing.name) || "New Property",
    companySlug: getString(listing.companySlug) || "nyumbani-collection",
    status:
      listing.status === "published" ||
      listing.status === "archived" ||
      listing.status === "draft"
        ? listing.status
        : "draft",
    location,
    class: getString(listing.class) || getString(data.class),
    vibe:
      getString(listing.vibe) ||
      getString(data.vibe) ||
      getString(data.overview),
    website: getString(listing.website) || getString(data.website),
    mapLink: getString(listing.mapLink) || getString(data.mapLink),
    tripadvisorRating: getNumberString(
      data.taRating !== undefined ? data.taRating : listing.tripadvisorRating,
    ),
    logoImage,
    coverImage,
    quickTagsText: getStringArray(data.quickTags).join("\n"),
    preset:
      listing.design?.preset === "modern-trade-deck" ||
      listing.design?.preset === "editorial-luxury" ||
      listing.design?.preset === "safari-dossier"
        ? listing.design.preset
        : "safari-dossier",
    theme: normalizeTheme(listing.design?.theme),
    overview: getString(data.overview),

    roomConfigsText:
      linesToText(data.roomConfigs) || DEFAULT_ROOM_CONFIGS.join("\n"),
    roomImages,
    activitiesText:
      getString(data.activitiesText) ||
      getStringArray(experiences.included).join("\n"),
    experienceText:
      getString(data.experienceText) ||
      getString(data.experienceSummary) ||
      getString(data.sustainability),

    snapshot: {
      rooms: getString(snapshot.rooms) || getNumberString(data.rooms),
      location,
      bestFor: getString(snapshot.bestFor),
      setting: getString(snapshot.setting),
      style: getString(snapshot.style),
      access: getString(snapshot.access),
    },
    gallery,
    rates: normalizeRates(data.rates),
    experiences: {
      includedText: getStringArray(experiences.included).join("\n"),
      paidText: getStringArray(experiences.paid).join("\n"),
    },
    policies: {
      childPolicy: getString(policies.childPolicy),
      honeymoonPolicy: getString(policies.honeymoonPolicy),
      cancellation: getString(policies.cancellation),
      importantNotesText: linesToText(policies.importantNotes),
      tradeNotesText: linesToText(policies.tradeNotes),
    },
    downloads: normalizeDownloads(data.downloads || data.downloadables),
    contacts: {
      reservations:
        Array.isArray(contacts.reservations) && contacts.reservations.length > 0
          ? normalizeContactList(contacts.reservations)
          : normalizeContactList([
              {
                name: data.contactName || "Reservations",
                role: data.contactTitle || "Reservations / Sales",
                email:
                  data.contactEmail || data.enquiryEmail || data.email || "",
                phone:
                  data.contactPhone || data.phone || data.reservationPhone || "",
                whatsapp: data.contactWhatsapp || data.whatsapp || "",
              },
            ]),
      sales:
        Array.isArray(contacts.sales) && contacts.sales.length > 0
          ? normalizeContactList(contacts.sales)
          : [makeContact()],
      marketing:
        Array.isArray(contacts.marketing) && contacts.marketing.length > 0
          ? normalizeContactList(contacts.marketing)
          : [makeContact()],
    },
    offersText: getString(
      data.offersText || data.offerText || data.offerHeadline,
    ),
    sustainability: getString(data.sustainability),
    enquiryEmail:
      getString(data.enquiryEmail) ||
      getString(data.contactEmail) ||
      getString(data.email),
    enquiryWhatsApp: getString(data.enquiryWhatsApp) || getString(data.whatsapp),
    enquirySubject: getString(data.enquirySubject) || "Trade Request",
    taLogoUrl: getString(data.taLogoUrl),
    taLink: getString(data.taLink),
    tradeProfileLabel:
      getString(data.tradeProfileLabel) ||
      (getString(listing.companySlug)
        ? getString(listing.companySlug).replace(/-/g, " ")
        : ""),
    tradeProfileSub: getString(data.tradeProfileSub),
  };
}

function toApiPayload(listing: ListingEditorState) {
  const normalizedSlug = listing.slug.trim() || slugify(listing.name);
  const flatImages = listing.gallery
    .flatMap((group) => group.images)
    .filter(Boolean);

  return {
    slug: normalizedSlug,
    name: listing.name.trim() || "New Property",
    companySlug: listing.companySlug.trim() || "nyumbani-collection",
    status: listing.status,
    location:
      listing.location.trim() || listing.snapshot.location.trim() || null,
    class: listing.class.trim() || null,
    vibe: listing.vibe.trim() || null,
    website: listing.website.trim() || null,
    mapLink: listing.mapLink.trim() || null,
    tripadvisorRating: listing.tripadvisorRating.trim()
      ? Number(listing.tripadvisorRating)
      : null,
    data: {
      overview: listing.overview.trim() || listing.vibe.trim() || null,
      roomConfigs: textToLines(listing.roomConfigsText),
      roomImages: listing.roomImages.filter(Boolean),
      activitiesText: listing.activitiesText.trim() || null,
      experienceText: listing.experienceText.trim() || null,

      snapshot: {
        rooms: listing.snapshot.rooms.trim() || null,
        location:
          listing.snapshot.location.trim() || listing.location.trim() || null,
        bestFor: listing.snapshot.bestFor.trim() || null,
        setting: listing.snapshot.setting.trim() || null,
        style: listing.snapshot.style.trim() || null,
        access: listing.snapshot.access.trim() || null,
      },
      gallery: listing.gallery
        .map((group) => ({
          label: group.label.trim() || "Gallery",
          images: group.images.filter(Boolean),
        }))
        .filter((group) => group.images.length > 0 || group.label),
      images: flatImages,
      rates: {
        currency: listing.rates.currency.trim() || null,
        notes: textToLines(listing.rates.notesText),
        rows: listing.rates.rows
          .map((row) => ({
            season: row.season.trim(),
            dates: row.dates.trim(),
            rackPPPN: row.rackPPPN.trim(),
          }))
          .filter((row) => row.season || row.dates || row.rackPPPN),
      },
      experiences: {
        included: textToLines(listing.experiences.includedText),
        paid: textToLines(listing.experiences.paidText),
      },
      policies: {
        childPolicy: listing.policies.childPolicy.trim() || null,
        honeymoonPolicy: listing.policies.honeymoonPolicy.trim() || null,
        cancellation: listing.policies.cancellation.trim() || null,
        importantNotes: textToLines(listing.policies.importantNotesText),
        tradeNotes: textToLines(listing.policies.tradeNotesText),
      },
      downloads: listing.downloads
        .map((item) => ({
          label: item.label.trim(),
          url: item.url.trim(),
          type: item.type.trim() || "link",
        }))
        .filter((item) => item.label && item.url),
      contacts: {
        reservations: listing.contacts.reservations
          .map((item) => ({
            name: item.name.trim() || null,
            role: item.role.trim() || null,
            email: item.email.trim() || null,
            phone: item.phone.trim() || null,
            whatsapp: item.whatsapp.trim() || null,
          }))
          .filter(
            (item) =>
              item.name ||
              item.role ||
              item.email ||
              item.phone ||
              item.whatsapp,
          ),
        sales: listing.contacts.sales
          .map((item) => ({
            name: item.name.trim() || null,
            role: item.role.trim() || null,
            email: item.email.trim() || null,
            phone: item.phone.trim() || null,
            whatsapp: item.whatsapp.trim() || null,
          }))
          .filter(
            (item) =>
              item.name ||
              item.role ||
              item.email ||
              item.phone ||
              item.whatsapp,
          ),
        marketing: listing.contacts.marketing
          .map((item) => ({
            name: item.name.trim() || null,
            role: item.role.trim() || null,
            email: item.email.trim() || null,
            phone: item.phone.trim() || null,
            whatsapp: item.whatsapp.trim() || null,
          }))
          .filter(
            (item) =>
              item.name ||
              item.role ||
              item.email ||
              item.phone ||
              item.whatsapp,
          ),
      },
      offersText: listing.offersText.trim() || null,
      sustainability: listing.sustainability.trim() || null,
      logoImage: listing.logoImage.trim() || null,
      coverImage: listing.coverImage.trim() || null,
      heroImage: listing.coverImage.trim() || null,
      website: listing.website.trim() || null,
      mapLink: listing.mapLink.trim() || null,
      taLogoUrl: listing.taLogoUrl.trim() || null,
      taLink: listing.taLink.trim() || null,
      taRating: listing.tripadvisorRating.trim()
        ? Number(listing.tripadvisorRating)
        : null,
      enquiryEmail: listing.enquiryEmail.trim() || null,
      enquiryWhatsApp: listing.enquiryWhatsApp.trim() || null,
      enquirySubject: listing.enquirySubject.trim() || null,
      tradeProfileLabel: listing.tradeProfileLabel.trim() || null,
      tradeProfileSub: listing.tradeProfileSub.trim() || null,
      quickTags: textToLines(listing.quickTagsText),
    },
    preset: listing.preset,
    theme: listing.theme,
  };
}

function mergeImportedListing(
  current: ListingEditorState,
  parsed?: PdfImportResponse["parsed"],
) {
  if (!parsed) return current;

  return {
    ...current,
    name: parsed.name || current.name,
    slug: current.slug || (parsed.name ? slugify(parsed.name) : current.slug),
    companySlug: parsed.companySlug || current.companySlug,
    location: parsed.location || current.location,
    class: parsed.class || current.class,
    vibe: parsed.vibe || current.vibe,
    website: parsed.website || current.website,
    mapLink: parsed.mapLink || current.mapLink,
    enquiryEmail: parsed.enquiryEmail || current.enquiryEmail,
    enquiryWhatsApp: parsed.enquiryWhatsApp || current.enquiryWhatsApp,
    enquirySubject: parsed.enquirySubject || current.enquirySubject,
    tradeProfileLabel: parsed.tradeProfileLabel || current.tradeProfileLabel,
    tradeProfileSub: parsed.tradeProfileSub || current.tradeProfileSub,
    quickTagsText:
      parsed.quickTags && parsed.quickTags.length > 0
        ? parsed.quickTags.join("\n")
        : current.quickTagsText,
    activitiesText:
      parsed.experiences?.included && parsed.experiences.included.length > 0
        ? parsed.experiences.included.join("\n")
        : current.activitiesText,
    snapshot: {
      ...current.snapshot,
      rooms: parsed.snapshot?.rooms || current.snapshot.rooms,
      location: parsed.snapshot?.location || current.snapshot.location,
      bestFor: parsed.snapshot?.bestFor || current.snapshot.bestFor,
      setting: parsed.snapshot?.setting || current.snapshot.setting,
      style: parsed.snapshot?.style || current.snapshot.style,
      access: parsed.snapshot?.access || current.snapshot.access,
    },
    rates: {
      ...current.rates,
      notesText:
        parsed.rates?.notes && parsed.rates.notes.length > 0
          ? parsed.rates.notes.join("\n")
          : current.rates.notesText,
      rows:
        parsed.rates?.rows && parsed.rates.rows.length > 0
          ? parsed.rates.rows.map((row) => ({
              id: uid(),
              season: row.season || "",
              dates: row.dates || "",
              rackPPPN: row.rackPPPN || "",
            }))
          : current.rates.rows,
    },
    experiences: {
      includedText:
        parsed.experiences?.included && parsed.experiences.included.length > 0
          ? parsed.experiences.included.join("\n")
          : current.experiences.includedText,
      paidText:
        parsed.experiences?.paid && parsed.experiences.paid.length > 0
          ? parsed.experiences.paid.join("\n")
          : current.experiences.paidText,
    },
    policies: {
      ...current.policies,
      childPolicy:
        parsed.policies?.childPolicy || current.policies.childPolicy,
      honeymoonPolicy:
        parsed.policies?.honeymoonPolicy || current.policies.honeymoonPolicy,
      cancellation:
        parsed.policies?.cancellation || current.policies.cancellation,
      importantNotesText:
        parsed.policies?.importantNotes && parsed.policies.importantNotes.length > 0
          ? parsed.policies.importantNotes.join("\n")
          : current.policies.importantNotesText,
      tradeNotesText:
        parsed.policies?.tradeNotes && parsed.policies.tradeNotes.length > 0
          ? parsed.policies.tradeNotes.join("\n")
          : current.policies.tradeNotesText,
    },
    contacts: {
      reservations:
        parsed.contacts?.reservations && parsed.contacts.reservations.length > 0
          ? parsed.contacts.reservations.map((item) => ({
              id: uid(),
              name: item.name || "",
              role: item.role || "",
              email: item.email || "",
              phone: item.phone || "",
              whatsapp: item.whatsapp || "",
            }))
          : current.contacts.reservations,
      sales:
        parsed.contacts?.sales && parsed.contacts.sales.length > 0
          ? parsed.contacts.sales.map((item) => ({
              id: uid(),
              name: item.name || "",
              role: item.role || "",
              email: item.email || "",
              phone: item.phone || "",
              whatsapp: item.whatsapp || "",
            }))
          : current.contacts.sales,
      marketing:
        parsed.contacts?.marketing && parsed.contacts.marketing.length > 0
          ? parsed.contacts.marketing.map((item) => ({
              id: uid(),
              name: item.name || "",
              role: item.role || "",
              email: item.email || "",
              phone: item.phone || "",
              whatsapp: item.whatsapp || "",
            }))
          : current.contacts.marketing,
    },
  };
}

function Section(props: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-white/60">
        {props.title}
      </h2>
      <div className="space-y-3">{props.children}</div>
    </div>
  );
}

function Field(props: {
  label: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block" id={props.id}>
      <div className="mb-1 text-xs font-semibold text-white/55">
        {props.label}
      </div>
      {props.children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 ${props.className || ""}`}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 ${props.className || ""}`}
    />
  );
}

function SmallButton(props: {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit
