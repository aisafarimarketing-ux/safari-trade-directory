"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
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
  status?: ListingStatus;
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

const STORAGE_KEY = "safaritrade-admin-v2";

const DEFAULT_THEME: ThemeState = {
  pageBg: "#0A0A0A",
  blockBg: "#111111",
  accent: "#FFFFFF",
  highlight: "#9E5A24",
  borderColor: "rgba(255,255,255,0.10)",
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
    gallery: [makeGalleryGroup("Camp Exterior")],
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
    downloads: [makeDownload()],
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
  if (!Array.isArray(value)) return [makeGalleryGroup("Camp Exterior")];

  const rows = value
    .map((item) => {
      const row = getRecord(item);
      const label = getString(row.label) || "Gallery";
      const images = getStringArray(row.images);
      return {
        id: uid(),
        label,
        images,
      };
    })
    .filter((item) => item.label || item.images.length > 0);

  return rows.length > 0 ? rows : [makeGalleryGroup("Camp Exterior")];
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
            rackPPPN: getString(row.rackPPPN || row.rackRate),
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
  if (!Array.isArray(value)) return [makeDownload()];

  const rows = value
    .map((item) => {
      const row = getRecord(item);
      return {
        id: uid(),
        label: getString(row.label || row.title),
        url: getString(row.url),
        type: getString(row.type) || "link",
      };
    })
    .filter((item) => item.label || item.url);

  return rows.length > 0 ? rows : [makeDownload()];
}

function fromApiListing(listing: ApiListingRecord): ListingEditorState {
  const base = makeEmptyListing();
  const data = getRecord(listing.data);
  const snapshot = getRecord(data.snapshot);
  const experiences = getRecord(data.experiences);
  const policies = getRecord(data.policies);
  const contacts = getRecord(data.contacts);

  const legacyFreeActivities = getStringArray(data.freeActivities);
  const legacyPaidActivities = getStringArray(data.paidActivities);
  const legacyDownloads = data.downloadables;

  const logoImage = getString(data.logoImage);
  const coverImage = getString(data.coverImage);
  const location =
    getString(listing.location) ||
    getString(snapshot.location) ||
    getString(data.locationLabel);

  const quickTags = getStringArray(data.quickTags);

  return {
    ...base,
    slug: getString(listing.slug),
    name: getString(listing.name) || "New Property",
    companySlug: getString(listing.companySlug) || "nyumbani-collection",
    status: listing.status || "draft",
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
    quickTagsText: quickTags.join("\n"),
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
    gallery: normalizeGallery(data.gallery),
    rates: normalizeRates(data.rates),
    experiences: {
      includedText: (
        getStringArray(experiences.included).length > 0
          ? getStringArray(experiences.included)
          : legacyFreeActivities
      ).join("\n"),
      paidText: (
        getStringArray(experiences.paid).length > 0
          ? getStringArray(experiences.paid)
          : legacyPaidActivities
      ).join("\n"),
    },
    policies: {
      childPolicy: getString(policies.childPolicy),
      honeymoonPolicy: getString(policies.honeymoonPolicy),
      cancellation: getString(policies.cancellation),
      importantNotesText: linesToText(policies.importantNotes),
      tradeNotesText: linesToText(policies.tradeNotes),
    },
    downloads: normalizeDownloads(data.downloads || legacyDownloads),
    contacts: {
      reservations: normalizeContactList(contacts.reservations),
      sales:
        Array.isArray(contacts.sales) && contacts.sales.length > 0
          ? normalizeContactList(contacts.sales)
          : normalizeContactList([
              {
                name: data.contactName,
                role: data.contactTitle,
                email: data.contactEmail,
                phone: data.contactPhone,
                whatsapp: "",
              },
            ]),
      marketing: normalizeContactList(contacts.marketing),
    },
    offersText: getString(data.offersText || data.offers),
    sustainability: getString(data.sustainability),
    enquiryEmail: getString(data.enquiryEmail),
    enquiryWhatsApp: getString(data.enquiryWhatsApp),
    enquirySubject: getString(data.enquirySubject) || "Trade Request",
    taLogoUrl: getString(data.taLogoUrl),
    taLink: getString(data.taLink),
    tradeProfileLabel: getString(data.tradeProfileLabel),
    tradeProfileSub: getString(data.tradeProfileSub),
  };
}

function toApiPayload(listing: ListingEditorState) {
  const normalizedSlug = listing.slug.trim() || slugify(listing.name);

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
      overview: listing.overview.trim() || null,
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
      offers: listing.offersText.trim() ? [listing.offersText.trim()] : [],
      sustainability: listing.sustainability.trim() || null,

      logoImage: listing.logoImage.trim() || null,
      coverImage: listing.coverImage.trim() || null,
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
  children: React.ReactNode;
}) {
  return (
    <label className="block">
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

export default function AdminPage() {
  const [listings, setListings] = useState<ListingEditorState[]>([
    makeEmptyListing(),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [saveState, setSaveState] = useState("Ready");
  const [uploadState, setUploadState] = useState("Upload ready");

  const downloadFileRef = useRef<HTMLInputElement | null>(null);

  const selected = listings[selectedIndex] || listings[0];

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/admin/listings", {
          cache: "no-store",
        });
        if (response.ok) {
          const json = await response.json();
          if (Array.isArray(json.listings) && json.listings.length > 0) {
            const next = (json.listings as ApiListingRecord[]).map(
              fromApiListing,
            );
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
      gallery: [...selected.gallery, makeGalleryGroup("New Group")],
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
      gallery:
        next.length > 0 ? next : [makeGalleryGroup("Camp Exterior")],
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
    const rows = selected.downloads.filter((_, i) => i !== index);
    updateListing({
      downloads: rows.length > 0 ? rows : [makeDownload()],
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

    const json = (await response.json()) as UploadApiResponse;

    if (!response.ok || !json.success || !json.file) {
      throw new Error(json.error || "Upload failed");
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

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.error || "Save failed");
      }

      const normalized = fromApiListing(json.listing as ApiListingRecord);
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
  const previewTags = textToLines(selected.quickTagsText);
  const previewRateRows = selected.rates.rows.filter(
    (row) => row.season || row.dates || row.rackPPPN,
  );
  const previewDownloads = selected.downloads.filter(
    (item) => item.label || item.url,
  );

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: isPreview ? previewTheme.pageBg : "#0b0b0b",
        color: "#fff",
      }}
    >
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
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-white/40">{uploadState}</div>
            <div className="text-xs text-white/55">{saveState}</div>
            <button
              onClick={saveActiveListing}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white"
              style={{ backgroundColor: selected.theme.highlight }}
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

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(selected.theme).map(([key, value]) => (
                  <Field key={key} label={key}>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) =>
                        updateListing({
                          theme: {
                            ...selected.theme,
                            [key]: e.target.value,
                          },
                        })
                      }
                      className="h-10 w-full rounded-xl border border-white/10 bg-black/20"
                    />
                  </Field>
                ))}
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
                    onChange={(e) =>
                      updateListing({ location: e.target.value })
                    }
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
                    onChange={(e) =>
                      updateListing({ website: e.target.value })
                    }
                  />
                </Field>

                <Field label="Map link">
                  <TextInput
                    value={selected.mapLink}
                    onChange={(e) =>
                      updateListing({ mapLink: e.target.value })
                    }
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

              <Field label="Overview / vibe">
                <TextArea
                  rows={4}
                  value={selected.vibe}
                  onChange={(e) => updateListing({ vibe: e.target.value })}
                />
              </Field>

              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Logo image">
                  <div className="flex gap-2">
                    <TextInput
                      value={selected.logoImage}
                      onChange={(e) =>
                        updateListing({ logoImage: e.target.value })
                      }
                    />
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white">
                      <Upload size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleSingleImageUpload(e, "logoImage")
                        }
                      />
                    </label>
                  </div>
                </Field>

                <Field label="Cover image">
                  <div className="flex gap-2">
                    <TextInput
                      value={selected.coverImage}
                      onChange={(e) =>
                        updateListing({ coverImage: e.target.value })
                      }
                    />
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white">
                      <Upload size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleSingleImageUpload(e, "coverImage")
                        }
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
                    onChange={(e) =>
                      updateSnapshot("location", e.target.value)
                    }
                  />
                </Field>

                <Field label="Best for">
                  <TextInput
                    value={selected.snapshot.bestFor}
                    onChange={(e) =>
                      updateSnapshot("bestFor", e.target.value)
                    }
                  />
                </Field>

                <Field label="Setting">
                  <TextInput
                    value={selected.snapshot.setting}
                    onChange={(e) =>
                      updateSnapshot("setting", e.target.value)
                    }
                  />
                </Field>

                <Field label="Style">
                  <TextInput
                    value={selected.snapshot.style}
                    onChange={(e) =>
                      updateSnapshot("style", e.target.value)
                    }
                  />
                </Field>

                <Field label="Access">
                  <TextInput
                    value={selected.snapshot.access}
                    onChange={(e) =>
                      updateSnapshot("access", e.target.value)
                    }
                  />
                </Field>
              </div>
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
                          updateGalleryGroup(groupIndex, {
                            label: e.target.value,
                          })
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

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
              {(["reservations", "sales", "marketing"] as const).map(
                (group) => (
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
                              updateContact(group, index, {
                                name: e.target.value,
                              })
                            }
                            placeholder="Name"
                          />
                          <TextInput
                            value={item.role}
                            onChange={(e) =>
                              updateContact(group, index, {
                                role: e.target.value,
                              })
                            }
                            placeholder="Role"
                          />
                          <TextInput
                            value={item.email}
                            onChange={(e) =>
                              updateContact(group, index, {
                                email: e.target.value,
                              })
                            }
                            placeholder="Email"
                          />
                          <TextInput
                            value={item.phone}
                            onChange={(e) =>
                              updateContact(group, index, {
                                phone: e.target.value,
                              })
                            }
                            placeholder="Phone"
                          />
                          <TextInput
                            value={item.whatsapp}
                            onChange={(e) =>
                              updateContact(group, index, {
                                whatsapp: e.target.value,
                              })
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
                ),
              )}
            </Section>

            <Section title="Commercial & extras">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Offers text">
                  <TextArea
                    rows={4}
                    value={selected.offersText}
                    onChange={(e) =>
                      updateListing({ offersText: e.target.value })
                    }
                  />
                </Field>

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
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div
            className="overflow-hidden rounded-[32px] border"
            style={{
              borderColor: previewTheme.borderColor,
              backgroundColor: previewTheme.blockBg,
              color: previewTheme.accent,
            }}
          >
            <div className="grid gap-8 p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em]"
                    style={{
                      borderColor: previewTheme.highlight,
                      backgroundColor: `${previewTheme.highlight}22`,
                    }}
                  >
                    Property
                  </span>

                  {selected.tradeProfileLabel || selected.tradeProfileSub ? (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] opacity-50">
                      {[selected.tradeProfileLabel, selected.tradeProfileSub]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-start gap-4">
                  {selected.logoImage ? (
                    <div
                      className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[22px] border"
                      style={{
                        borderColor: previewTheme.borderColor,
                        backgroundColor: previewTheme.pageBg,
                      }}
                    >
                      <img
                        src={selected.logoImage}
                        alt={`${selected.name} logo`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <div className="min-w-0">
                    <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                      {selected.name}
                    </h1>
                    <p className="mt-3 max-w-3xl text-base leading-8 opacity-75 md:text-lg">
                      {selected.vibe || "Trade-ready safari property profile."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[selected.location, selected.class, ...previewTags]
                    .filter(Boolean)
                    .slice(0, 6)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border px-3 py-1.5 text-sm"
                        style={{
                          borderColor: previewTheme.borderColor,
                          backgroundColor: previewTheme.pageBg,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Rooms", selected.snapshot.rooms || "—"],
                    ["Best For", selected.snapshot.bestFor || "—"],
                    ["Setting", selected.snapshot.setting || "—"],
                    ["Access", selected.snapshot.access || "—"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-[24px] border p-4"
                      style={{
                        borderColor: previewTheme.borderColor,
                        backgroundColor: previewTheme.pageBg,
                      }}
                    >
                      <p className="text-[11px] uppercase tracking-[0.18em] opacity-45">
                        {label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {previewDownloads[0]?.url ? (
                    <a
                      href={previewDownloads[0].url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl px-5 py-3 text-sm font-semibold text-white"
                      style={{ backgroundColor: previewTheme.highlight }}
                    >
                      Request Trade Pack
                    </a>
                  ) : null}

                  {selected.enquiryEmail ? (
                    <a
                      href={`mailto:${selected.enquiryEmail}?subject=${encodeURIComponent(
                        selected.enquirySubject || "Trade Request",
                      )}`}
                      className="rounded-2xl border px-5 py-3 text-sm font-semibold"
                      style={{
                        borderColor: previewTheme.borderColor,
                        backgroundColor: previewTheme.pageBg,
                        color: previewTheme.accent,
                      }}
                    >
                      Request Quote
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="space-y-5">
                <div
                  className="overflow-hidden rounded-[34px] border"
                  style={{
                    borderColor: previewTheme.borderColor,
                    backgroundColor: previewTheme.pageBg,
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {selected.coverImage ? (
                      <img
                        src={selected.coverImage}
                        alt={`${selected.name} hero`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.08))]" />
                    )}
                  </div>
                </div>

                <div
                  className="rounded-[30px] border p-6"
                  style={{
                    borderColor: previewTheme.borderColor,
                    backgroundColor: previewTheme.pageBg,
                  }}
                >
                  <p className="text-sm uppercase tracking-[0.2em] opacity-45">
                    Quick Trade Snapshot
                  </p>
                  <div className="mt-5 space-y-3">
                    {[
                      ["Location", selected.location || "—"],
                      ["Best for", selected.snapshot.bestFor || "—"],
                      ["Style", selected.snapshot.style || "—"],
                      ["Access", selected.snapshot.access || "—"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-4 rounded-2xl border px-4 py-3"
                        style={{
                          borderColor: previewTheme.borderColor,
                          backgroundColor: previewTheme.blockBg,
                        }}
                      >
                        <span className="opacity-50">{label}</span>
                        <span className="text-right font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="grid gap-8 border-t px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10"
              style={{ borderColor: previewTheme.borderColor }}
            >
              <div className="space-y-8">
                {selected.gallery.some((group) => group.images.length > 0) ? (
                  <div
                    className="rounded-[30px] border p-6"
                    style={{
                      borderColor: previewTheme.borderColor,
                      backgroundColor: previewTheme.pageBg,
                    }}
                  >
                    <p className="text-sm uppercase tracking-[0.2em] opacity-45">
                      Gallery
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {selected.gallery
                        .flatMap((group) =>
                          group.images.map((image, index) => ({
                            src: image,
                            label: `${group.label} ${index + 1}`,
                          })),
                        )
                        .slice(0, 6)
                        .map((image) => (
                          <div
                            key={`${image.src}-${image.label}`}
                            className="overflow-hidden rounded-[22px] border"
                            style={{
                              borderColor: previewTheme.borderColor,
                              backgroundColor: previewTheme.blockBg,
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

                {previewRateRows.length > 0 ? (
                  <div
                    className="rounded-[30px] border p-6"
                    style={{
                      borderColor: previewTheme.borderColor,
                      backgroundColor: previewTheme.pageBg,
                    }}
                  >
                    <p className="text-sm uppercase tracking-[0.2em] opacity-45">
                      Rates
                    </p>
                    <div
                      className="mt-5 overflow-hidden rounded-[22px] border"
                      style={{
                        borderColor: previewTheme.borderColor,
                        backgroundColor: previewTheme.blockBg,
                      }}
                    >
                      <div
                        className="grid grid-cols-3 border-b px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] opacity-60"
                        style={{ borderColor: previewTheme.borderColor }}
                      >
                        <span>Season</span>
                        <span>Dates</span>
                        <span>Rack PPPN</span>
                      </div>

                      {previewRateRows.map((row, index) => (
                        <div
                          key={row.id}
                          className="grid grid-cols-3 px-4 py-3 text-sm"
                          style={{
                            borderTop:
                              index === 0
                                ? "none"
                                : `1px solid ${previewTheme.borderColor}`,
                          }}
                        >
                          <span>{row.season || "—"}</span>
                          <span>{row.dates || "—"}</span>
                          <span>{row.rackPPPN || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <aside className="space-y-6">
                {previewDownloads.length > 0 ? (
                  <div
                    className="rounded-[30px] border p-6"
                    style={{
                      borderColor: previewTheme.borderColor,
                      backgroundColor: previewTheme.pageBg,
                    }}
                  >
                    <p className="text-sm uppercase tracking-[0.2em] opacity-45">
                      Downloads
                    </p>
                    <div className="mt-5 space-y-3">
                      {previewDownloads.map((item) => (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-2xl border px-4 py-3 text-sm font-semibold"
                          style={{
                            borderColor: previewTheme.borderColor,
                            backgroundColor: previewTheme.blockBg,
                            color: previewTheme.accent,
                          }}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}

                {selected.contacts.sales.some(
                  (item) => item.name || item.email || item.phone,
                ) ? (
                  <div
                    className="rounded-[30px] border p-6"
                    style={{
                      borderColor: previewTheme.borderColor,
                      backgroundColor: previewTheme.pageBg,
                    }}
                  >
                    <p className="text-sm uppercase tracking-[0.2em] opacity-45">
                      Contact
                    </p>
                    <div className="mt-5 space-y-3">
                      {selected.contacts.sales
                        .filter((item) => item.name || item.email || item.phone)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="rounded-2xl border px-4 py-3"
                            style={{
                              borderColor: previewTheme.borderColor,
                              backgroundColor: previewTheme.blockBg,
                            }}
                          >
                            {item.name ? (
                              <p className="text-sm font-semibold">
                                {item.name}
                              </p>
                            ) : null}
                            {item.role ? (
                              <p className="mt-1 text-sm opacity-75">
                                {item.role}
                              </p>
                            ) : null}
                            {item.email ? (
                              <p className="mt-2 text-sm">{item.email}</p>
                            ) : null}
                            {item.phone ? (
                              <p className="mt-1 text-sm">{item.phone}</p>
                            ) : null}
                          </div>
                        ))}
                    </div>
                  </div>
                ) : null}

                {selected.tripadvisorRating || selected.taLink ? (
                  <div
                    className="rounded-[30px] border p-6"
                    style={{
                      borderColor: previewTheme.borderColor,
                      backgroundColor: previewTheme.pageBg,
                    }}
                  >
                    <p className="text-sm uppercase tracking-[0.2em] opacity-45">
                      Tripadvisor
                    </p>
                    {selected.tripadvisorRating ? (
                      <div
                        className="mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold"
                        style={{
                          borderColor: previewTheme.borderColor,
                          backgroundColor: previewTheme.blockBg,
                        }}
                      >
                        Rating {selected.tripadvisorRating}
                      </div>
                    ) : null}
                    {selected.taLink ? (
                      <a
                        href={selected.taLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 block rounded-2xl border px-4 py-3 text-sm font-semibold"
                        style={{
                          borderColor: previewTheme.borderColor,
                          backgroundColor: previewTheme.blockBg,
                          color: previewTheme.accent,
                        }}
                      >
                        Open Tripadvisor
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
