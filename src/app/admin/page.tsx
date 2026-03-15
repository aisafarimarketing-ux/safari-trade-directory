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

const STORAGE_KEY = "safaritrade-admin-v4";

const DEFAULT_THEME: ThemeState = {
  pageBg: "#e8e1d8",
  blockBg: "#f6f1ea",
  accent: "#6a5237",
  highlight: "#8b8364",
  borderColor: "#d7ccbf",
};

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
  type?: "button" | "submit";
}) {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white"
    >
      {props.children}
    </button>
  );
}

function EditorUploadZone(props: {
  title: string;
  subtitle: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`group relative w-full overflow-hidden rounded-[12px] border border-dashed text-left transition hover:opacity-95 ${props.className || ""}`}
      style={{
        borderColor: "rgba(106,82,55,0.24)",
        backgroundColor: "rgba(255,255,255,0.28)",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(106,82,55,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(106,82,55,0.03)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute left-4 top-4 z-10 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6a5237]">
        Click to upload
      </div>
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="text-sm font-semibold text-[#6a5237]">{props.title}</div>
        <div className="mt-1 text-xs text-[#7d654a]">{props.subtitle}</div>
      </div>
    </button>
  );
}

export default function AdminPage() {
  const [listings, setListings] = useState<ListingEditorState[]>([
    makeEmptyListing(),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [saveState, setSaveState] = useState("Ready");
  const [uploadState, setUploadState] = useState("Upload ready");

  const downloadFileRef = useRef<HTMLInputElement | null>(null);
  const importPdfRef = useRef<HTMLInputElement | null>(null);
  const logoFileRef = useRef<HTMLInputElement | null>(null);
  const coverFileRef = useRef<HTMLInputElement | null>(null);
  const galleryFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const selected = listings[selectedIndex] || listings[0];

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/admin/listings", {
          cache: "no-store",
        });

        if (response.ok) {
          const { json } = await parseResponseSafely<{
            listings?: ApiListingRecord[];
          } | ApiListingRecord[]>(response);

          const rawListings = Array.isArray(json)
            ? json
            : Array.isArray(json?.listings)
              ? json.listings
              : [];

          if (rawListings.length > 0) {
            const next = rawListings.map(fromApiListing);
            setListings(next);
            setSelectedIndex(0);
            setSaveState(`Loaded ${next.length} listing(s) from API`);
            return;
          }
        }
      } catch {}

      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as ListingEditorState[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setListings(parsed);
          setSelectedIndex(0);
          setSaveState("Loaded local draft");
        }
      } catch {}
    }

    load();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  }, [listings]);

  const profileSlug = useMemo(() => {
    return selected.slug.trim() || slugify(selected.name);
  }, [selected.slug, selected.name]);

  function updateListing(patch: Partial<ListingEditorState>) {
    setListings((prev) => {
      const next = [...prev];
      next[selectedIndex] = {
        ...next[selectedIndex],
        ...patch,
      };
      return next;
    });
  }

  function updateSnapshot(key: keyof SnapshotState, value: string) {
    updateListing({
      snapshot: {
        ...selected.snapshot,
        [key]: value,
      },
    });
  }

  function addListing() {
    setListings((prev) => [...prev, makeEmptyListing()]);
    setSelectedIndex(listings.length);
  }

  function deleteListing() {
    if (listings.length <= 1) return;
    const next = listings.filter((_, index) => index !== selectedIndex);
    setListings(next);
    setSelectedIndex(Math.max(0, selectedIndex - 1));
  }

  function addGalleryGroup() {
    updateListing({
      gallery: [...selected.gallery, makeGalleryGroup(`Gallery ${selected.gallery.length + 1}`)],
    });
  }

  function updateGalleryGroup(index: number, patch: Partial<GalleryGroup>) {
    const next = [...selected.gallery];
    next[index] = { ...next[index], ...patch };
    updateListing({ gallery: next });
  }

  function removeGalleryGroup(index: number) {
    const next = selected.gallery.filter((_, i) => i !== index);
    updateListing({
      gallery: next.length > 0 ? next : [makeGalleryGroup("Gallery 1")],
    });
  }

  function addRateRow() {
    updateListing({
      rates: {
        ...selected.rates,
        rows: [...selected.rates.rows, makeRateRow()],
      },
    });
  }

  function updateRateRow(index: number, patch: Partial<RateRow>) {
    const rows = [...selected.rates.rows];
    rows[index] = { ...rows[index], ...patch };
    updateListing({
      rates: {
        ...selected.rates,
        rows,
      },
    });
  }

  function removeRateRow(index: number) {
    const rows = selected.rates.rows.filter((_, i) => i !== index);
    updateListing({
      rates: {
        ...selected.rates,
        rows: rows.length > 0 ? rows : [makeRateRow()],
      },
    });
  }

  function addDownload() {
    updateListing({
      downloads: [...selected.downloads, makeDownload()],
    });
  }

  function updateDownload(index: number, patch: Partial<DownloadItem>) {
    const rows = [...selected.downloads];
    rows[index] = { ...rows[index], ...patch };
    updateListing({ downloads: rows });
  }

  function removeDownload(index: number) {
    updateListing({
      downloads: selected.downloads.filter((_, i) => i !== index),
    });
  }

  function addContact(group: "reservations" | "sales" | "marketing") {
    updateListing({
      contacts: {
        ...selected.contacts,
        [group]: [...selected.contacts[group], makeContact()],
      },
    });
  }

  function updateContact(
    group: "reservations" | "sales" | "marketing",
    index: number,
    patch: Partial<ContactItem>,
  ) {
    const rows = [...selected.contacts[group]];
    rows[index] = { ...rows[index], ...patch };
    updateListing({
      contacts: {
        ...selected.contacts,
        [group]: rows,
      },
    });
  }

  function removeContact(
    group: "reservations" | "sales" | "marketing",
    index: number,
  ) {
    const rows = selected.contacts[group].filter((_, i) => i !== index);
    updateListing({
      contacts: {
        ...selected.contacts,
        [group]: rows.length > 0 ? rows : [makeContact()],
      },
    });
  }

  async function uploadFile(file: File): Promise<UploadApiResponse["file"]> {
    const form = new FormData();
    form.append("file", file);

   const response = await fetch("/api/admin/upload", {
  method: "POST",
  body: form,
});
    const { json, text } = await parseResponseSafely<UploadApiResponse>(response);

    if (!response.ok) {
      throw new Error(
        json?.error ||
          text ||
          `Upload failed with status ${response.status}`,
      );
    }

    if (!json?.success || !json.file) {
      throw new Error(json?.error || "Upload failed");
    }

    return json.file;
  }

  async function handleSingleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logoImage" | "coverImage",
  ) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    try {
      setUploadState("Uploading image...");
      const uploaded = await uploadFile(file);
      updateListing({ [field]: uploaded.url } as Partial<ListingEditorState>);
      setUploadState("Image uploaded");
    } catch (error) {
      setUploadState(error instanceof Error ? error.message : "Upload failed");
    } finally {
      e.target.value = "";
    }
  }

  async function handleGalleryUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    groupIndex: number,
  ) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploadState("Uploading gallery images...");
      const uploadedUrls: string[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        const uploaded = await uploadFile(file);
        uploadedUrls.push(uploaded.url);
      }

      const target = selected.gallery[groupIndex];
      updateGalleryGroup(groupIndex, {
        images: [...target.images, ...uploadedUrls],
      });

      setUploadState(
        uploadedUrls.length > 0
          ? `${uploadedUrls.length} image(s) uploaded`
          : "No valid image files selected",
      );
    } catch (error) {
      setUploadState(error instanceof Error ? error.message : "Upload failed");
    } finally {
      e.target.value = "";
    }
  }

  async function handleDownloadableUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploadState("Uploading files...");
      const uploadedItems: DownloadItem[] = [];

      for (const file of files) {
        const uploaded = await uploadFile(file);
        uploadedItems.push({
          id: uid(),
          label: file.name,
          url: uploaded.url,
          type: file.type || uploaded.mimeType || "file",
        });
      }

      updateListing({
        downloads: [...selected.downloads, ...uploadedItems],
      });

      setUploadState(`${uploadedItems.length} file(s) uploaded`);
    } catch (error) {
      setUploadState(error instanceof Error ? error.message : "Upload failed");
    } finally {
      e.target.value = "";
    }
  }

  async function handlePdfImport(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadState("Only PDF files are supported for import");
      e.target.value = "";
      return;
    }

    try {
      setUploadState("Uploading and reading PDF...");

      const uploaded = await uploadFile(file);

      const form = new FormData();
      form.append("file", file);

      const response = await fetch("/api/import-pdf", {
        method: "POST",
        body: form,
      });

      const { json, text } = await parseResponseSafely<PdfImportResponse>(response);

      if (!response.ok || !json?.success) {
        throw new Error(json?.error || text || "PDF import failed");
      }

      const merged = mergeImportedListing(selected, json.parsed);

      const alreadyHasPdf = merged.downloads.some(
        (item) => item.url === uploaded.url,
      );

      const nextListing: ListingEditorState = {
        ...merged,
        downloads: alreadyHasPdf
          ? merged.downloads
          : [
              ...merged.downloads,
              {
                id: uid(),
                label: file.name,
                url: uploaded.url,
                type: "application/pdf",
              },
            ],
      };

      setListings((prev) => {
        const next = [...prev];
        next[selectedIndex] = nextListing;
        return next;
      });

      setUploadState(
        json.warnings && json.warnings.length > 0
          ? "PDF imported. Review suggested fields."
          : "PDF imported",
      );
    } catch (error) {
      setUploadState(
        error instanceof Error ? error.message : "PDF import failed",
      );
    } finally {
      e.target.value = "";
    }
  }

  async function saveActiveListing() {
    try {
      setSaveState("Saving...");
      const payload = toApiPayload(selected);

      const response = await fetch("/api/admin/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const { json, text } = await parseResponseSafely<{
        listing?: ApiListingRecord;
        error?: string;
      }>(response);

      if (!response.ok) {
        throw new Error(json?.error || text || "Save failed");
      }

      if (!json?.listing) {
        throw new Error("Save succeeded but no listing was returned");
      }

      const normalized = fromApiListing(json.listing);
      setListings((prev) => {
        const next = [...prev];
        next[selectedIndex] = normalized;
        return next;
      });

      setSaveState("Saved to API");
    } catch (error) {
      setSaveState(error instanceof Error ? error.message : "Save failed");
    }
  }

  const previewTheme = selected.theme;
  const previewRateRows = selected.rates.rows.filter(
    (row) => row.season || row.dates || row.rackPPPN,
  );
  const previewDownloads = selected.downloads.filter(
    (item) => item.label || item.url,
  );

  const previewReservations = selected.contacts.reservations.filter(
    (item) => item.name || item.role || item.email || item.phone || item.whatsapp,
  );

  const overviewText =
    selected.overview.trim() ||
    selected.vibe.trim() ||
    "A luxury tented camp profile designed for quick trade qualification, elegant presentation, and fast quoting.";

  const factTabs = [
    { label: "Rooms", value: selected.snapshot.rooms || "—", sub: selected.class || "Inventory" },
    { label: "Location", value: selected.location || selected.snapshot.location || "—", sub: "Safari region" },
    { label: "Best For", value: selected.snapshot.bestFor || "—", sub: "Guest fit" },
    { label: "Setting", value: selected.snapshot.setting || "—", sub: "Landscape" },
    { label: "Style", value: selected.snapshot.style || selected.class || "—", sub: "Property style" },
    { label: "Access", value: selected.snapshot.access || "—", sub: "Arrival" },
  ];

  const promoText =
    selected.offersText.trim() ||
    "Book 10+ guests in Green Season, 3rd night 50% off";

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: isPreview ? previewTheme.pageBg : "#0b0b0b",
        color: isPreview ? previewTheme.accent : "#fff",
      }}
    >
      <input
        ref={logoFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleSingleImageUpload(e, "logoImage")}
      />

      <input
        ref={coverFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleSingleImageUpload(e, "coverImage")}
      />

      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPreview((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white"
              type="button"
            >
              {isPreview ? <EyeOff size={14} /> : <Eye size={14} />}
              {isPreview ? "Editor" : "Preview"}
            </button>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white"
              type="button"
            >
              <ArrowLeft size={14} />
              Return
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white"
            >
              Home
            </Link>

            <a
              href={`/profiles/${profileSlug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white"
            >
              <ExternalLink size={14} />
              Public Profile
            </a>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white">
              <FileText size={14} />
              Import PDF
              <input
                ref={importPdfRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handlePdfImport}
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="max-w-[280px] truncate text-xs text-white/40">
              {uploadState}
            </div>
            <div className="max-w-[220px] truncate text-xs text-white/55">
              {saveState}
            </div>
            <button
              onClick={saveActiveListing}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white"
              style={{ backgroundColor: "#b36a31" }}
              type="button"
            >
              <Save size={14} />
              Save
            </button>
          </div>
        </div>
      </div>

      {!isPreview ? (
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-4">
            <Section title="Listings">
              <div className="flex gap-2">
                <SmallButton onClick={addListing}>
                  <Plus size={14} />
                  Add
                </SmallButton>

                <SmallButton onClick={deleteListing}>
                  <Trash2 size={14} />
                  Delete
                </SmallButton>
              </div>

              <div className="space-y-2">
                {listings.map((item, index) => (
                  <button
                    key={`${item.slug}-${index}`}
                    onClick={() => setSelectedIndex(index)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                      index === selectedIndex
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/75"
                    }`}
                    type="button"
                  >
                    {item.name || `Listing ${index + 1}`}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Preview shortcuts">
              <div className="space-y-2">
                <SmallButton onClick={() => setIsPreview(true)}>
                  <Eye size={14} />
                  Open dossier preview
                </SmallButton>

                <SmallButton onClick={() => logoFileRef.current?.click()}>
                  <Upload size={14} />
                  Upload logo
                </SmallButton>

                <SmallButton onClick={() => coverFileRef.current?.click()}>
                  <Upload size={14} />
                  Upload hero
                </SmallButton>

                <SmallButton onClick={() => downloadFileRef.current?.click()}>
                  <Upload size={14} />
                  Upload downloadable
                </SmallButton>
              </div>
            </Section>

            <Section title="Design">
              <Field label="Preset">
                <select
                  value={selected.preset}
                  onChange={(e) =>
                    updateListing({ preset: e.target.value as DesignPreset })
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="safari-dossier">Safari Dossier</option>
                  <option value="modern-trade-deck">Modern Trade Deck</option>
                  <option value="editorial-luxury">Editorial Luxury</option>
                </select>
              </Field>

              <div className="grid gap-3">
                <Field label="Page background">
                  <TextInput
                    value={selected.theme.pageBg}
                    onChange={(e) =>
                      updateListing({
                        theme: { ...selected.theme, pageBg: e.target.value },
                      })
                    }
                  />
                </Field>

                <Field label="Block background">
                  <TextInput
                    value={selected.theme.blockBg}
                    onChange={(e) =>
                      updateListing({
                        theme: { ...selected.theme, blockBg: e.target.value },
                      })
                    }
                  />
                </Field>

                <Field label="Accent text">
                  <TextInput
                    value={selected.theme.accent}
                    onChange={(e) =>
                      updateListing({
                        theme: { ...selected.theme, accent: e.target.value },
                      })
                    }
                  />
                </Field>

                <Field label="Highlight">
                  <TextInput
                    value={selected.theme.highlight}
                    onChange={(e) =>
                      updateListing({
                        theme: { ...selected.theme, highlight: e.target.value },
                      })
                    }
                  />
                </Field>

                <Field label="Border color">
                  <TextInput
                    value={selected.theme.borderColor}
                    onChange={(e) =>
                      updateListing({
                        theme: { ...selected.theme, borderColor: e.target.value },
                      })
                    }
                  />
                </Field>
              </div>
            </Section>
          </aside>

          <div className="space-y-4">
            <Section title="Identity">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Property name">
                  <TextInput
                    value={selected.name}
                    onChange={(e) =>
                      updateListing({
                        name: e.target.value,
                        slug: selected.slug || slugify(e.target.value),
                      })
                    }
                  />
                </Field>

                <Field label="Slug">
                  <TextInput
                    value={selected.slug}
                    onChange={(e) =>
                      updateListing({ slug: slugify(e.target.value) })
                    }
                  />
                </Field>

                <Field label="Company slug">
                  <TextInput
                    value={selected.companySlug}
                    onChange={(e) =>
                      updateListing({ companySlug: slugify(e.target.value) })
                    }
                  />
                </Field>

                <Field label="Status">
                  <select
                    value={selected.status}
                    onChange={(e) =>
                      updateListing({ status: e.target.value as ListingStatus })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                </Field>

                <Field label="Location">
                  <TextInput
                    value={selected.location}
                    onChange={(e) => updateListing({ location: e.target.value })}
                  />
                </Field>

                <Field label="Class / type">
                  <TextInput
                    value={selected.class}
                    onChange={(e) => updateListing({ class: e.target.value })}
                  />
                </Field>

                <Field label="Website">
                  <TextInput
                    value={selected.website}
                    onChange={(e) => updateListing({ website: e.target.value })}
                  />
                </Field>

                <Field label="Map link">
                  <TextInput
                    value={selected.mapLink}
                    onChange={(e) => updateListing({ mapLink: e.target.value })}
                  />
                </Field>

                <Field label="Trade profile label">
                  <TextInput
                    value={selected.tradeProfileLabel}
                    onChange={(e) =>
                      updateListing({ tradeProfileLabel: e.target.value })
                    }
                  />
                </Field>

                <Field label="Trade profile sub">
                  <TextInput
                    value={selected.tradeProfileSub}
                    onChange={(e) =>
                      updateListing({ tradeProfileSub: e.target.value })
                    }
                  />
                </Field>

                <Field label="Tripadvisor rating">
                  <TextInput
                    value={selected.tripadvisorRating}
                    onChange={(e) =>
                      updateListing({ tripadvisorRating: e.target.value })
                    }
                  />
                </Field>

                <Field label="Quick tags (one per line)">
                  <TextArea
                    rows={4}
                    value={selected.quickTagsText}
                    onChange={(e) =>
                      updateListing({ quickTagsText: e.target.value })
                    }
                  />
                </Field>
              </div>

              <Field label="Short intro / vibe">
                <TextArea
                  rows={4}
                  value={selected.vibe}
                  onChange={(e) => updateListing({ vibe: e.target.value })}
                />
              </Field>

              <Field label="Main overview">
                <TextArea
                  rows={5}
                  value={selected.overview}
                  onChange={(e) => updateListing({ overview: e.target.value })}
                />
              </Field>

              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Logo image">
                  <div className="flex gap-2">
                    <TextInput
                      value={selected.logoImage}
                      onChange={(e) => updateListing({ logoImage: e.target.value })}
                    />
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white">
                      <Upload size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleSingleImageUpload(e, "logoImage")}
                      />
                    </label>
                  </div>
                </Field>

                <Field label="Hero image">
                  <div className="flex gap-2">
                    <TextInput
                      value={selected.coverImage}
                      onChange={(e) => updateListing({ coverImage: e.target.value })}
                    />
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white">
                      <Upload size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleSingleImageUpload(e, "coverImage")}
                      />
                    </label>
                  </div>
                </Field>
              </div>
            </Section>

            <Section title="Snapshot">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Rooms">
                  <TextInput
                    value={selected.snapshot.rooms}
                    onChange={(e) => updateSnapshot("rooms", e.target.value)}
                  />
                </Field>

                <Field label="Location">
                  <TextInput
                    value={selected.snapshot.location}
                    onChange={(e) => updateSnapshot("location", e.target.value)}
                  />
                </Field>

                <Field label="Best for">
                  <TextInput
                    value={selected.snapshot.bestFor}
                    onChange={(e) => updateSnapshot("bestFor", e.target.value)}
                  />
                </Field>

                <Field label="Setting">
                  <TextInput
                    value={selected.snapshot.setting}
                    onChange={(e) => updateSnapshot("setting", e.target.value)}
                  />
                </Field>

                <Field label="Style">
                  <TextInput
                    value={selected.snapshot.style}
                    onChange={(e) => updateSnapshot("style", e.target.value)}
                  />
                </Field>

                <Field label="Access">
                  <TextInput
                    value={selected.snapshot.access}
                    onChange={(e) => updateSnapshot("access", e.target.value)}
                  />
                </Field>
              </div>
            </Section>

            <Section title="Offer strip">
              <Field label="Promo text shown below hero" id="offers-field">
                <TextInput
                  value={selected.offersText}
                  onChange={(e) => updateListing({ offersText: e.target.value })}
                />
              </Field>
            </Section>

            <Section title="Gallery">
              <div className="space-y-4">
                <SmallButton onClick={addGalleryGroup}>
                  <Plus size={14} />
                  Add group
                </SmallButton>

                {selected.gallery.map((group, groupIndex) => (
                  <div
                    key={group.id}
                    className="rounded-xl border border-white/10 bg-black/20 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <TextInput
                        value={group.label}
                        onChange={(e) =>
                          updateGalleryGroup(groupIndex, { label: e.target.value })
                        }
                      />
                      <SmallButton onClick={() => removeGalleryGroup(groupIndex)}>
                        <Trash2 size={14} />
                      </SmallButton>
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white">
                        <Upload size={14} />
                        Upload images
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleGalleryUpload(e, groupIndex)}
                        />
                      </label>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {group.images.map((image, imageIndex) => (
                        <div
                          key={`${group.id}-${imageIndex}`}
                          className="overflow-hidden rounded-xl border border-white/10"
                        >
                          <img
                            src={image}
                            alt={`${group.label} ${imageIndex + 1}`}
                            className="aspect-[4/3] h-full w-full object-cover"
                          />
                        </div>
                      ))}

                      {group.images.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-white/45">
                          No images in this group yet.
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Rates">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Currency">
                  <TextInput
                    value={selected.rates.currency}
                    onChange={(e) =>
                      updateListing({
                        rates: { ...selected.rates, currency: e.target.value },
                      })
                    }
                  />
                </Field>

                <Field label="Notes (one per line)">
                  <TextArea
                    rows={4}
                    value={selected.rates.notesText}
                    onChange={(e) =>
                      updateListing({
                        rates: { ...selected.rates, notesText: e.target.value },
                      })
                    }
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <SmallButton onClick={addRateRow}>
                  <Plus size={14} />
                  Add rate row
                </SmallButton>

                {selected.rates.rows.map((row, index) => (
                  <div
                    key={row.id}
                    className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-3 md:grid-cols-[1fr_1fr_1fr_auto]"
                  >
                    <TextInput
                      value={row.season}
                      onChange={(e) =>
                        updateRateRow(index, { season: e.target.value })
                      }
                      placeholder="Season"
                    />
                    <TextInput
                      value={row.dates}
                      onChange={(e) =>
                        updateRateRow(index, { dates: e.target.value })
                      }
                      placeholder="Dates"
                    />
                    <TextInput
                      value={row.rackPPPN}
                      onChange={(e) =>
                        updateRateRow(index, { rackPPPN: e.target.value })
                      }
                      placeholder="Rack PPPN"
                    />
                    <SmallButton onClick={() => removeRateRow(index)}>
                      <Trash2 size={14} />
                    </SmallButton>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Experiences">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Included (one per line)">
                  <TextArea
                    rows={8}
                    value={selected.experiences.includedText}
                    onChange={(e) =>
                      updateListing({
                        experiences: {
                          ...selected.experiences,
                          includedText: e.target.value,
                        },
                      })
                    }
                  />
                </Field>

                <Field label="Paid (one per line)">
                  <TextArea
                    rows={8}
                    value={selected.experiences.paidText}
                    onChange={(e) =>
                      updateListing({
                        experiences: {
                          ...selected.experiences,
                          paidText: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
              </div>
            </Section>

            <Section title="Policies">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Child policy">
                  <TextArea
                    rows={3}
                    value={selected.policies.childPolicy}
                    onChange={(e) =>
                      updateListing({
                        policies: {
                          ...selected.policies,
                          childPolicy: e.target.value,
                        },
                      })
                    }
                  />
                </Field>

                <Field label="Honeymoon policy">
                  <TextArea
                    rows={3}
                    value={selected.policies.honeymoonPolicy}
                    onChange={(e) =>
                      updateListing({
                        policies: {
                          ...selected.policies,
                          honeymoonPolicy: e.target.value,
                        },
                      })
                    }
                  />
                </Field>

                <Field label="Cancellation">
                  <TextArea
                    rows={3}
                    value={selected.policies.cancellation}
                    onChange={(e) =>
                      updateListing({
                        policies: {
                          ...selected.policies,
                          cancellation: e.target.value,
                        },
                      })
                    }
                  />
                </Field>

                <Field label="Important notes (one per line)">
                  <TextArea
                    rows={5}
                    value={selected.policies.importantNotesText}
                    onChange={(e) =>
                      updateListing({
                        policies: {
                          ...selected.policies,
                          importantNotesText: e.target.value,
                        },
                      })
                    }
                  />
                </Field>

                <Field label="Trade notes (one per line)">
                  <TextArea
                    rows={5}
                    value={selected.policies.tradeNotesText}
                    onChange={(e) =>
                      updateListing({
                        policies: {
                          ...selected.policies,
                          tradeNotesText: e.target.value,
                        },
                      })
                    }
                  />
                </Field>
              </div>
            </Section>

            <Section title="Downloads">
              <div className="flex items-center gap-2">
                <SmallButton onClick={addDownload}>
                  <Plus size={14} />
                  Add download
                </SmallButton>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white">
                  <Upload size={14} />
                  Upload files
                  <input
                    ref={downloadFileRef}
                    type="file"
                    multiple
                    accept="application/pdf,image/*,.doc,.docx"
                    className="hidden"
                    onChange={handleDownloadableUpload}
                  />
                </label>
              </div>

              <div className="space-y-3">
                {selected.downloads.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-3 md:grid-cols-[1fr_1fr_120px_auto]"
                  >
                    <TextInput
                      value={item.label}
                      onChange={(e) =>
                        updateDownload(index, { label: e.target.value })
                      }
                      placeholder="Label"
                    />
                    <TextInput
                      value={item.url}
                      onChange={(e) =>
                        updateDownload(index, { url: e.target.value })
                      }
                      placeholder="URL"
                    />
                    <TextInput
                      value={item.type}
                      onChange={(e) =>
                        updateDownload(index, { type: e.target.value })
                      }
                      placeholder="Type"
                    />
                    <SmallButton onClick={() => removeDownload(index)}>
                      <Trash2 size={14} />
                    </SmallButton>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Contacts">
              {(["reservations", "sales", "marketing"] as const).map((group) => (
                <div
                  key={group}
                  className="rounded-xl border border-white/10 bg-black/20 p-3"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold capitalize text-white">
                      {group}
                    </h3>
                    <SmallButton onClick={() => addContact(group)}>
                      <Plus size={14} />
                      Add
                    </SmallButton>
                  </div>

                  <div className="space-y-3">
                    {selected.contacts[group].map((item, index) => (
                      <div
                        key={item.id}
                        className="grid gap-3 rounded-xl border border-white/10 p-3 md:grid-cols-2"
                      >
                        <TextInput
                          value={item.name}
                          onChange={(e) =>
                            updateContact(group, index, { name: e.target.value })
                          }
                          placeholder="Name"
                        />
                        <TextInput
                          value={item.role}
                          onChange={(e) =>
                            updateContact(group, index, { role: e.target.value })
                          }
                          placeholder="Role"
                        />
                        <TextInput
                          value={item.email}
                          onChange={(e) =>
                            updateContact(group, index, { email: e.target.value })
                          }
                          placeholder="Email"
                        />
                        <TextInput
                          value={item.phone}
                          onChange={(e) =>
                            updateContact(group, index, { phone: e.target.value })
                          }
                          placeholder="Phone"
                        />
                        <TextInput
                          value={item.whatsapp}
                          onChange={(e) =>
                            updateContact(group, index, { whatsapp: e.target.value })
                          }
                          placeholder="WhatsApp"
                        />
                        <SmallButton onClick={() => removeContact(group, index)}>
                          <Trash2 size={14} />
                          Remove
                        </SmallButton>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Section>

            <Section title="Commercial & extras">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Sustainability">
                  <TextArea
                    rows={4}
                    value={selected.sustainability}
                    onChange={(e) =>
                      updateListing({ sustainability: e.target.value })
                    }
                  />
                </Field>

                <Field label="Enquiry email">
                  <TextInput
                    value={selected.enquiryEmail}
                    onChange={(e) =>
                      updateListing({ enquiryEmail: e.target.value })
                    }
                  />
                </Field>

                <Field label="Enquiry WhatsApp">
                  <TextInput
                    value={selected.enquiryWhatsApp}
                    onChange={(e) =>
                      updateListing({ enquiryWhatsApp: e.target.value })
                    }
                  />
                </Field>

                <Field label="Enquiry subject">
                  <TextInput
                    value={selected.enquirySubject}
                    onChange={(e) =>
                      updateListing({ enquirySubject: e.target.value })
                    }
                  />
                </Field>

                <Field label="Tripadvisor logo URL">
                  <TextInput
                    value={selected.taLogoUrl}
                    onChange={(e) =>
                      updateListing({ taLogoUrl: e.target.value })
                    }
                  />
                </Field>

                <Field label="Tripadvisor link">
                  <TextInput
                    value={selected.taLink}
                    onChange={(e) => updateListing({ taLink: e.target.value })}
                  />
                </Field>
              </div>
            </Section>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[1220px] px-4 py-6 md:px-6 md:py-8">
          <div
            className="overflow-hidden rounded-[18px] border shadow-[0_22px_60px_rgba(78,56,28,0.08)]"
            style={{
              borderColor: previewTheme.borderColor,
              backgroundColor: previewTheme.blockBg,
              color: previewTheme.accent,
            }}
          >
            <section
              className="border-b px-5 py-4 md:px-10 md:py-5"
              style={{ borderColor: previewTheme.borderColor }}
            >
              <div className="flex items-center justify-center">
                {selected.logoImage ? (
                  <button
                    type="button"
                    onClick={() => logoFileRef.current?.click()}
                    className="h-16 w-44 overflow-hidden rounded-xl"
                    title="Replace logo"
                  >
                    <img
                      src={selected.logoImage}
                      alt={`${selected.name} logo`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => logoFileRef.current?.click()}
                    className="rounded-full border px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.24em]"
                    style={{
                      borderColor: previewTheme.borderColor,
                      backgroundColor: "rgba(255,255,255,0.42)",
                    }}
                  >
                    Upload logo
                  </button>
                )}
              </div>
            </section>

            <section className="px-4 pb-5 pt-4 md:px-8 md:pt-6">
              <div
                className="overflow-hidden rounded-[16px] border"
                style={{ borderColor: previewTheme.borderColor }}
              >
                <div className="relative">
                  {selected.coverImage ? (
                    <button
                      type="button"
                      onClick={() => coverFileRef.current?.click()}
                      className="relative block w-full overflow-hidden text-left"
                      title="Replace hero image"
                    >
                      <img
                        src={selected.coverImage}
                        alt={`${selected.name} hero`}
                        className="aspect-[16/6.6] w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(76,56,32,0.58)] via-[rgba(76,56,32,0.10)] to-transparent" />
                    </button>
                  ) : (
                    <EditorUploadZone
                      title="Hero image"
                      subtitle="Upload the main cover image"
                      onClick={() => coverFileRef.current?.click()}
                      className="aspect-[16/6.6]"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-8 text-center text-[#f7f1e8] md:px-10 md:pb-10">
                    <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                      {selected.name}
                    </h1>

                    <div className="mt-3 text-sm md:text-2xl">
                      {[
                        selected.tradeProfileLabel ||
                          selected.companySlug.replace(/-/g, " "),
                        selected.location || selected.snapshot.location,
                        selected.class,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>

                    {selected.tripadvisorRating ? (
                      <div className="mt-4 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] md:text-sm">
                        <span>
                          {"★".repeat(
                            Math.max(
                              1,
                              Math.min(5, Math.round(Number(selected.tripadvisorRating) || 0)),
                            ),
                          )}
                        </span>
                        <span>Top 5% on Tripadvisor</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("offers-field");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="flex w-full items-center justify-center border-t px-5 py-3 text-center text-sm md:text-[18px]"
                  style={{
                    borderColor: previewTheme.borderColor,
                    backgroundColor: `${previewTheme.highlight}45`,
                    color: previewTheme.accent,
                  }}
                >
                  {promoText}
                </button>

                <div className="px-4 py-4 md:px-6">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {selected.gallery.slice(0, 4).map((group, groupIndex) => {
                      const image = group.images[0];

                      return (
                        <React.Fragment key={group.id}>
                          <input
                            ref={(node) => {
                              galleryFileRefs.current[group.id] = node;
                            }}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleGalleryUpload(e, groupIndex)}
                          />
                          {image ? (
                            <button
                              type="button"
                              onClick={() => galleryFileRefs.current[group.id]?.click()}
                              className="overflow-hidden rounded-[10px] border text-left"
                              style={{ borderColor: previewTheme.borderColor }}
                              title="Replace gallery image"
                            >
                              <img
                                src={image}
                                alt={group.label}
                                className="aspect-[4/2.25] w-full object-cover"
                              />
                            </button>
                          ) : (
                            <EditorUploadZone
                              title={group.label || `Gallery ${groupIndex + 1}`}
                              subtitle="Upload gallery image"
                              onClick={() => galleryFileRefs.current[group.id]?.click()}
                              className="aspect-[4/2.25]"
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                <div
                  className="border-t px-4 py-3 md:px-6"
                  style={{ borderColor: previewTheme.borderColor }}
                >
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
                    {factTabs.map((fact, index) => (
                      <div key={`${fact.label}-${index}`}>
                        <div
                          className="rounded-t-[8px] border border-b-0 px-4 py-2 text-center text-[11px] uppercase tracking-[0.14em]"
                          style={{
                            borderColor: previewTheme.borderColor,
                            backgroundColor: "rgba(255,255,255,0.22)",
                          }}
                        >
                          {fact.label}
                        </div>
                        <div
                          className="rounded-b-[8px] border px-4 py-4 text-center"
                          style={{
                            borderColor: previewTheme.borderColor,
                            backgroundColor: "rgba(255,255,255,0.40)",
                          }}
                        >
                          <div className="text-[24px] font-semibold leading-none md:text-[30px]">
                            {fact.value}
                          </div>
                          <div className="mt-2 text-sm" style={{ opacity: 0.72 }}>
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
              <div className="grid gap-5 lg:grid-cols-[1.05fr_390px]">
                <div
                  className="rounded-[14px] border px-5 py-5 md:px-7 md:py-6"
                  style={{
                    borderColor: previewTheme.borderColor,
                    backgroundColor: "rgba(255,255,255,0.20)",
                  }}
                >
                  <h2 className="text-[30px] font-semibold leading-tight md:text-[40px]">
                    {selected.name}
                  </h2>
                  <p
                    className="mt-4 max-w-3xl text-base leading-8 md:text-[18px]"
                    style={{ opacity: 0.76 }}
                  >
                    {overviewText}
                  </p>
                </div>

                <div
                  className="rounded-[14px] border p-4 md:p-5"
                  style={{
                    borderColor: previewTheme.borderColor,
                    backgroundColor: "rgba(255,255,255,0.20)",
                  }}
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => downloadFileRef.current?.click()}
                      className="rounded-[8px] px-4 py-3 text-sm font-semibold text-white"
                      style={{ backgroundColor: previewTheme.highlight }}
                    >
                      Request Trade Pack
                    </button>

                    <a
                      href={
                        selected.enquiryEmail
                          ? `mailto:${selected.enquiryEmail}?subject=${encodeURIComponent(
                              selected.enquirySubject || "Trade Request",
                            )}`
                          : "#"
                      }
                      className="rounded-[8px] px-4 py-3 text-center text-sm font-semibold text-white"
                      style={{ backgroundColor: previewTheme.highlight }}
                    >
                      Check Availability
                    </a>

                    <a
                      href={
                        selected.enquiryEmail
                          ? `mailto:${selected.enquiryEmail}?subject=${encodeURIComponent(
                              selected.enquirySubject || "Trade Request",
                            )}`
                          : "#"
                      }
                      className="rounded-[8px] border px-4 py-3 text-center text-sm font-semibold"
                      style={{
                        borderColor: previewTheme.borderColor,
                        backgroundColor: "rgba(255,255,255,0.42)",
                        color: previewTheme.accent,
                      }}
                    >
                      Request Quote
                    </a>

                    <a
                      href={selected.website || "#"}
                      className="rounded-[8px] border px-4 py-3 text-center text-sm font-semibold"
                      style={{
                        borderColor: previewTheme.borderColor,
                        backgroundColor: "rgba(255,255,255,0.42)",
                        color: previewTheme.accent,
                      }}
                    >
                      {selected.website ? "Visit Website" : "Share with Client"}
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <div className="px-4 pb-2 pt-2 md:px-8">
              <div className="hidden md:flex md:flex-wrap md:gap-1">
                {["Overview", "Rates", "Experiences", "Policies", "Downloads"].map(
                  (tab, index) => (
                    <div
                      key={tab}
                      className="rounded-t-[8px] border px-5 py-3 text-sm font-medium"
                      style={{
                        borderColor: previewTheme.borderColor,
                        backgroundColor:
                          index === 0
                            ? `${previewTheme.highlight}45`
                            : "rgba(255,255,255,0.28)",
                      }}
                    >
                      {tab}
                    </div>
                  ),
                )}
                <div
                  className="rounded-t-[8px] border px-5 py-3 text-sm font-medium"
                  style={{
                    borderColor: previewTheme.borderColor,
                    backgroundColor: "rgba(255,255,255,0.28)",
                  }}
                >
                  →
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:hidden">
                {["Overview", "Rates", "Experiences", "Policies", "Downloads"].map(
                  (tab, index) => (
                    <div
                      key={tab}
                      className="rounded-full border px-4 py-2 text-xs font-medium"
                      style={{
                        borderColor: previewTheme.borderColor,
                        backgroundColor:
                          index === 0
                            ? `${previewTheme.highlight}45`
                            : "rgba(255,255,255,0.28)",
                      }}
                    >
                      {tab}
                    </div>
                  ),
                )}
              </div>
            </div>

            <section className="px-4 pb-8 md:px-8 md:pb-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                <div className="space-y-8">
                  {previewRateRows.length > 0 ? (
                    <section
                      className="rounded-[14px] border p-5 md:p-6"
                      style={{
                        borderColor: previewTheme.borderColor,
                        backgroundColor: "rgba(255,255,255,0.20)",
                      }}
                    >
                      <div className="flex items-end gap-3">
                        <h3 className="text-xl font-semibold tracking-[0.08em] md:text-[22px]">
                          PUBLIC RACK RATES
                        </h3>
                        <span
                          className="pb-1 text-lg font-medium tracking-[0.18em] md:text-[22px]"
                          style={{ color: previewTheme.highlight }}
                        >
                          2026
                        </span>
                      </div>

                      <div
                        className="mt-5 overflow-hidden rounded-[10px] border"
                        style={{
                          borderColor: previewTheme.borderColor,
                          backgroundColor: "rgba(255,255,255,0.36)",
                        }}
                      >
                        <div
                          className="grid grid-cols-3 border-b px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] md:grid-cols-[1.2fr_1.5fr_1fr]"
                          style={{ borderColor: previewTheme.borderColor, opacity: 0.62 }}
                        >
                          <span>Season</span>
                          <span>Dates</span>
                          <span>Rack PPPN</span>
                        </div>

                        {previewRateRows.map((row, index) => (
                          <div
                            key={row.id}
                            className="grid grid-cols-3 px-4 py-3 text-sm md:grid-cols-[1.2fr_1.5fr_1fr] md:text-[16px]"
                            style={{
                              borderTop:
                                index === 0
                                  ? "none"
                                  : `1px solid ${previewTheme.borderColor}`,
                            }}
                          >
                            <span className="font-medium">{row.season || "—"}</span>
                            <span>{row.dates || "—"}</span>
                            <span>{row.rackPPPN || "—"}</span>
                          </div>
                        ))}
                      </div>

                      {selected.rates.notesText.trim() ? (
                        <div className="mt-4 text-sm leading-7" style={{ opacity: 0.78 }}>
                          {textToLines(selected.rates.notesText).join(" • ")}
                        </div>
                      ) : null}

                      {textToLines(selected.experiences.paidText).length > 0 ? (
                        <div
                          className="mt-4 border-t pt-4"
                          style={{ borderColor: previewTheme.borderColor }}
                        >
                          <div className="text-sm font-semibold">Supplements</div>
                          <div className="mt-2 text-sm" style={{ opacity: 0.75 }}>
                            {textToLines(selected.experiences.paidText)
                              .slice(0, 4)
                              .join(" • ")}
                          </div>
                        </div>
                      ) : null}
                    </section>
                  ) : null}

                  {(selected.experiences.includedText.trim() ||
                    selected.experiences.paidText.trim()) ? (
                    <section
                      className="rounded-[14px] border p-5 md:p-6"
                      style={{
                        borderColor: previewTheme.borderColor,
                        backgroundColor: "rgba(255,255,255,0.20)",
                      }}
                    >
                      <h3 className="text-xl font-semibold tracking-[0.08em] md:text-[22px]">
                        EXPERIENCES
                      </h3>

                      <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div
                          className="rounded-[10px] border p-4"
                          style={{
                            borderColor: previewTheme.borderColor,
                            backgroundColor: "rgba(255,255,255,0.36)",
                          }}
                        >
                          <div
                            className="text-[11px] uppercase tracking-[0.18em]"
                            style={{ opacity: 0.6 }}
                          >
                            Included
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {textToLines(selected.experiences.includedText).map((item) => (
                              <span
                                key={item}
                                className="rounded-full border px-3 py-1.5 text-xs"
                                style={{
                                  borderColor: previewTheme.borderColor,
                                  backgroundColor: "rgba(255,255,255,0.46)",
                                }}
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div
                          className="rounded-[10px] border p-4"
                          style={{
                            borderColor: previewTheme.borderColor,
                            backgroundColor: "rgba(255,255,255,0.36)",
                          }}
                        >
                          <div
                            className="text-[11px] uppercase tracking-[0.18em]"
                            style={{ opacity: 0.6 }}
                          >
                            Paid
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {textToLines(selected.experiences.paidText).map((item) => (
                              <span
                                key={item}
                                className="rounded-full border px-3 py-1.5 text-xs"
                                style={{
                                  borderColor: previewTheme.borderColor,
                                  backgroundColor: "rgba(255,255,255,0.46)",
                                }}
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  ) : null}

                  {(selected.policies.childPolicy.trim() ||
                    selected.policies.honeymoonPolicy.trim() ||
                    selected.policies.cancellation.trim() ||
                    selected.policies.importantNotesText.trim() ||
                    selected.policies.tradeNotesText.trim()) ? (
                    <section
                      className="rounded-[14px] border p-5 md:p-6"
                      style={{
                        borderColor: previewTheme.borderColor,
                        backgroundColor: "rgba(255,255,255,0.20)",
                      }}
                    >
                      <h3 className="text-xl font-semibold tracking-[0.08em] md:text-[22px]">
                        POLICIES
                      </h3>

                      <div className="mt-5 grid gap-3">
                        {[
                          ["Child policy", selected.policies.childPolicy],
                          ["Honeymoon policy", selected.policies.honeymoonPolicy],
                          ["Cancellation", selected.policies.cancellation],
                          ...textToLines(selected.policies.importantNotesText).map((item) => [
                            "Important note",
                            item,
                          ]),
                          ...textToLines(selected.policies.tradeNotesText).map((item) => [
                            "Trade note",
                            item,
                          ]),
                        ]
                          .filter((row) => row[1])
                          .map(([label, value], index) => (
                            <div
                              key={`${label}-${index}`}
                              className="rounded-[10px] border px-4 py-4"
                              style={{
                                borderColor: previewTheme.borderColor,
                                backgroundColor: "rgba(255,255,255,0.36)",
                              }}
                            >
                              <div
                                className="text-[11px] uppercase tracking-[0.18em]"
                                style={{ opacity: 0.6 }}
                              >
                                {label}
                              </div>
                              <div className="mt-2 whitespace-pre-line text-sm leading-7 md:text-base">
                                {value}
                              </div>
                            </div>
                          ))}
                      </div>
                    </section>
                  ) : null}
                </div>

                <aside className="space-y-6">
                  <section
                    className="rounded-[14px] border p-5 md:p-6"
                    style={{
                      borderColor: previewTheme.borderColor,
                      backgroundColor: "rgba(255,255,255,0.20)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold tracking-[0.08em] md:text-[22px]">
                        DOWNLOADS
                      </h3>
                      <button
                        type="button"
                        onClick={() => downloadFileRef.current?.click()}
                        className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                        style={{
                          borderColor: previewTheme.borderColor,
                          backgroundColor: "rgba(255,255,255,0.42)",
                        }}
                      >
                        Upload
                      </button>
                    </div>

                    <div className="mt-5 space-y-3">
                      {previewDownloads.length > 0 ? (
                        previewDownloads.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => downloadFileRef.current?.click()}
                            className="block w-full rounded-[10px] border px-4 py-3 text-left text-sm font-medium"
                            style={{
                              borderColor: previewTheme.borderColor,
                              backgroundColor: "rgba(255,255,255,0.36)",
                              color: previewTheme.accent,
                            }}
                          >
                            {item.label}
                          </button>
                        ))
                      ) : (
                        <EditorUploadZone
                          title="Downloads panel"
                          subtitle="Upload PDFs, brochures, or fact sheets"
                          onClick={() => downloadFileRef.current?.click()}
                          className="h-[120px]"
                        />
                      )}
                    </div>
                  </section>

                  <section
                    className="rounded-[14px] border p-5 md:p-6"
                    style={{
                      borderColor: previewTheme.borderColor,
                      backgroundColor: "rgba(255,255,255,0.20)",
                    }}
                  >
                    <h3 className="text-xl font-semibold tracking-[0.08em] md:text-[22px]">
                      CONTACT
                    </h3>

                    <div className="mt-5 space-y-3">
                      {previewReservations.length > 0 ? (
                        previewReservations.map((item, index) => (
                          <div
                            key={`${item.id}-${index}`}
                            className="rounded-[10px] border px-4 py-4"
                            style={{
                              borderColor: previewTheme.borderColor,
                              backgroundColor: "rgba(255,255,255,0.36)",
                            }}
                          >
                            <div className="text-base font-semibold">
                              {item.name || "Reservations"}
                            </div>
                            {item.role ? (
                              <div className="mt-1 text-sm" style={{ opacity: 0.72 }}>
                                {item.role}
                              </div>
                            ) : null}
                            {item.email ? (
                              <div className="mt-3 text-sm underline">{item.email}</div>
                            ) : null}
                            {item.phone ? (
                              <div className="mt-2 text-sm">{item.phone}</div>
                            ) : null}
                            {item.whatsapp ? (
                              <div className="mt-2 text-sm underline">WhatsApp</div>
                            ) : null}
                          </div>
                        ))
                      ) : (
                        <div
                          className="rounded-[10px] border px-4 py-4 text-sm"
                          style={{
                            borderColor: previewTheme.borderColor,
                            backgroundColor: "rgba(255,255,255,0.36)",
                          }}
                        >
                          Add reservations contact details in the editor.
                        </div>
                      )}
                    </div>
                  </section>
                </aside>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
