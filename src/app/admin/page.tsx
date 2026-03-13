"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Save,
  Camera,
  Check,
  Percent,
  ShieldAlert,
  Eye,
  EyeOff,
  Star as StarIcon,
  Compass,
  MapPin,
  Trash2,
  Plus,
  X,
  Monitor,
  Ban,
  Upload,
  Download,
  Share2,
  Contact,
  FileText,
  Mail,
  MessageCircle,
  Building2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Info,
  Link as LinkIcon,
  Paperclip,
  Facebook,
  Instagram,
  Music2,
  Youtube,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

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

type CampStatus = "draft" | "published" | "archived";

type Camp = {
  slug: string;
  companySlug: string;
  status: CampStatus;

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

type SocialFieldKey =
  | "facebookUrl"
  | "instagramUrl"
  | "tiktokUrl"
  | "youtubeUrl";

type ContactFieldKey =
  | "contactName"
  | "contactTitle"
  | "contactCompany"
  | "contactPhone";

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

type SavePayload = {
  version: 1;
  savedAt: string;
  portfolio: Camp[];
  selectedCampIndex: number;
  theme: ThemeState;
  blockColors: BlockColorState;
  visibleBlocks: VisibleBlocksState;
};

type ApiListingRecord = {
  slug?: string;
  companySlug?: string;
  status?: CampStatus;
  data?: Partial<Camp>;
};

const STORAGE_KEY = "restoration-safari-admin-v1";

const uid = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const DEFAULT_TA_LOGO =
  "https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg";

const DEFAULT_THEME: ThemeState = {
  pageBg: "#F4F2EE",
  blockBg: "#FFFFFF",
  accent: "#2D3436",
  highlight: "#9E5A24",
  borderColor: "#E2E8F0",
};

const DEFAULT_BLOCK_COLORS: BlockColorState = {
  header: "#F6E7D8",
  tripadvisor: "#E7F6EA",
  tradeDetails: "#F6E7D8",
  matrix: "#F4EFE7",
  inclusions: "#E8F7EC",
  exclusions: "#FCE9E9",
  experiences: "#EFE8FB",
  offers: "#F8EEDF",
  terms: "#EEF2F7",
  leadCapture: "#EAF1FF",
  contactCard: "#E7F6F4",
  downloadables: "#FBF3DD",
};

const DEFAULT_VISIBLE_BLOCKS: VisibleBlocksState = {
  header: true,
  tripadvisor: true,
  tradeDetails: true,
  matrix: true,
  inclusions: true,
  exclusions: true,
  experiences: true,
  offers: true,
  terms: true,
  leadCapture: true,
  contactCard: true,
  downloadables: true,
  hero: false,
};

const makeNewCamp = (): Camp => ({
  slug: "",
  companySlug: "nyumbani-collection",
  status: "published",

  name: "New Camp",
  class: "Tented (Luxury)",

  rooms: "",
  family: "",
  double: "",
  single: "",

  vibe: "Describe the feel of this property.",

  inclusions: ["Three meals", "Bottled water"],
  exclusions: ["Park fees", "Flights"],

  freeActivities: ["Game drive"],
  paidActivities: ["Balloon safari"],

  offersText: "Seasonal offer goes here.",
  terms: "Deposit and cancellation policy goes here.",

  tradeProfileLabel: "Nyumbani Collection",
  tradeProfileSub: "Trade profile.",

  locationLabel: "Location name here",
  mapLink: "https://maps.google.com",

  rating: "",
  reviewCount: "",

  website: "https://yourwebsite.com",
  facebookUrl: "https://facebook.com/",
  instagramUrl: "https://instagram.com/",
  tiktokUrl: "https://tiktok.com/",
  youtubeUrl: "https://youtube.com/",

  roomTypeLabels: {
    family: "Family setup",
    double: "Double setup",
    single: "Single setup",
  },

  roomPhotos: {
    family: [],
    double: [],
    single: [],
  },

  leadHeadline: "Get rates, availability & trade support in one reply.",
  leadSubcopy:
    "Leave your details and we’ll send a trade-ready fact sheet and quick quote.",
  leadBullet1: "Agent-ready proposal + net rates",
  leadBullet2: "Seasonality guidance + offers",
  leadBullet3: "Fast response from reservations",
  leadCta: "Request Trade Pack",
  leadDisclaimer:
    "By submitting, you agree to be contacted by our reservations team.",

  contactName: "Reservations",
  contactTitle: "Trade Desk",
  contactCompany: "Nyumbani Collections",
  contactEmail: "trade@yourcompany.com",
  contactPhone: "+255000000000",
  contactWebsite: "https://yourwebsite.com",

  enquiryEmail: "trade@yourcompany.com",
  enquiryWhatsApp: "+255000000000",
  enquirySubject: "Trade Request / Rates & Availability",

  logoImage: "",
  coverImage: "",

  downloadables: [
    {
      id: uid(),
      title: "Trade Fact Sheet (Google Drive)",
      type: "link",
      url: "https://drive.google.com/",
    },
  ],

  taLogoUrl: DEFAULT_TA_LOGO,
  taLink: "https://www.tripadvisor.com/",
  taRating: "",
  taStyle: "dots",
});

const DEFAULT_PORTFOLIO: Camp[] = [
  {
    ...makeNewCamp(),
    name: "Nyumbani Serengeti",
    slug: "nyumbani-serengeti",
    companySlug: "nyumbani-collection",
    status: "published",
    class: "Tented (Luxury)",
    rooms: 10,
    family: 2,
    double: 6,
    single: 2,
    vibe: "High-end canvas meets the raw heartbeat of the Serengeti.",
    inclusions: ["Three gourmet meals", "Bottled water", "Laundry"],
    exclusions: ["Park Fees", "Premium Spirits", "Flights"],
    freeActivities: ["Morning Game Drive", "Nature Walk"],
    paidActivities: ["Hot Air Balloon", "Night Drive"],
    offersText: "Stay 5 Pay 4 during Green Season.",
    terms: "30% non-refundable deposit.",
    locationLabel: "Serengeti National Park, Tanzania",
    rating: 4.9,
    reviewCount: 128,
    website: "https://example.com",
    facebookUrl: "https://facebook.com/",
    instagramUrl: "https://instagram.com/nyumbani.collections",
    tiktokUrl: "https://tiktok.com/",
    youtubeUrl: "https://youtube.com/",
    contactName: "Nyumbani Reservations",
    contactTitle: "Trade Desk",
    contactCompany: "Nyumbani Collections",
    contactEmail: "trade@nyumbani.example",
    contactPhone: "+255 000 000 000",
    contactWebsite: "https://example.com",
    enquiryEmail: "trade@nyumbani.example",
    enquiryWhatsApp: "+255000000000",
    taLink: "https://www.tripadvisor.com/",
    taRating: 4.5,
  },
];

function CompactPanel({
  title,
  subtitle,
  right,
  defaultOpen = true,
  children,
  style,
  headerStyle,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="overflow-hidden rounded-2xl border shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
      style={style}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        style={headerStyle}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.28em] opacity-80">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-0.5 truncate text-xs font-semibold opacity-75">
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {right}
          <span
            className="rounded-xl border p-2"
            style={{
              borderColor:
                (style?.borderColor as string) || "rgba(0,0,0,0.12)",
              backgroundColor: "rgba(255,255,255,0.75)",
            }}
          >
            {open ? (
              <ChevronUp size={16} className="opacity-70" />
            ) : (
              <ChevronDown size={16} className="opacity-70" />
            )}
          </span>
        </div>
      </button>

      {open && <div className="px-4 py-3">{children}</div>}
    </div>
  );
}

function AdminHint({
  text,
  borderColor,
  bg,
  color,
}: {
  text: string;
  borderColor: string;
  bg: string;
  color: string;
}) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest"
      style={{ borderColor, backgroundColor: bg, color }}
    >
      <Info size={12} className="opacity-80" />
      <span className="opacity-85">{text}</span>
    </div>
  );
}

function RatingPips({
  value,
  onChange,
  highlight,
  mode,
}: {
  value: number;
  onChange: (v: number) => void;
  highlight: string;
  mode: "dots" | "stars";
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;

  const renderDots = () => {
    const total = 5;
    return (
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const idx = i + 1;
          const isFull = idx <= full;
          const isHalf = idx === full + 1 && half;
          return (
            <div
              key={i}
              className="h-2.5 w-2.5 cursor-pointer rounded-full border"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const shift = (e as React.MouseEvent<HTMLDivElement>).shiftKey;
                if (shift) onChange(idx - 0.5);
                else onChange(idx);
              }}
              style={{
                borderColor: "rgba(0,0,0,0.15)",
                background: isFull
                  ? highlight
                  : isHalf
                    ? `linear-gradient(90deg, ${highlight} 50%, rgba(0,0,0,0.08) 50%)`
                    : "rgba(0,0,0,0.08)",
              }}
              title="Click for full, Shift+Click for half"
            />
          );
        })}
      </div>
    );
  };

  const renderStars = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = value >= n ? highlight : "rgba(0,0,0,0.10)";
        return (
          <button
            key={n}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(n);
            }}
            className="leading-none"
            title="Click to set rating"
          >
            <StarIcon size={16} fill={fill} color={fill} />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex items-center gap-3">
      <div className="text-[11px] font-black tabular-nums opacity-85">
        {value.toFixed(1)}
      </div>
      {mode === "stars" ? renderStars() : renderDots()}
      <div className="hidden text-[10px] font-bold uppercase tracking-widest opacity-60 sm:block">
        (click / shift+click)
      </div>
    </div>
  );
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function serializeState(payload: SavePayload): string {
  return JSON.stringify(payload);
}

function normalizeCamp(input?: Partial<Camp>): Camp {
  const base = makeNewCamp();

  return {
    ...base,
    ...input,
    slug: input?.slug?.trim() || slugify(input?.name || base.name),
    companySlug: input?.companySlug?.trim() || "nyumbani-collection",
    status: input?.status || "published",
    roomTypeLabels: {
      ...base.roomTypeLabels,
      ...(input?.roomTypeLabels ?? {}),
    },
    roomPhotos: {
      ...base.roomPhotos,
      ...(input?.roomPhotos ?? {}),
    },
    inclusions: input?.inclusions ?? base.inclusions,
    exclusions: input?.exclusions ?? base.exclusions,
    freeActivities: input?.freeActivities ?? base.freeActivities,
    paidActivities: input?.paidActivities ?? base.paidActivities,
    downloadables: input?.downloadables ?? base.downloadables,
  };
}

export default function RestorationSafariAdmin() {
  const [isPreview, setIsPreview] = useState(false);
  const [selectedCampIndex, setSelectedCampIndex] = useState(0);
  const [sendState, setSendState] = useState<"idle" | "sending">("idle");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [saveMessage, setSaveMessage] = useState("Local save ready");
  const [hasHydrated, setHasHydrated] = useState(false);

  const [theme, setTheme] = useState<ThemeState>(DEFAULT_THEME);
  const [blockColors, setBlockColors] =
    useState<BlockColorState>(DEFAULT_BLOCK_COLORS);
  const [visibleBlocks, setVisibleBlocks] =
    useState<VisibleBlocksState>(DEFAULT_VISIBLE_BLOCKS);

  const [hoveredRoomPhoto, setHoveredRoomPhoto] = useState<{
    src: string;
    title: string;
  } | null>(null);

  const socialFields: Array<{
    key: SocialFieldKey;
    icon: React.ReactNode;
    label: string;
  }> = [
    { key: "facebookUrl", icon: <Facebook size={14} />, label: "Facebook" },
    { key: "instagramUrl", icon: <Instagram size={14} />, label: "Instagram" },
    { key: "tiktokUrl", icon: <Music2 size={14} />, label: "TikTok" },
    { key: "youtubeUrl", icon: <Youtube size={14} />, label: "YouTube" },
  ];

  const contactFields: Array<{ k: ContactFieldKey; ph: string }> = [
    { k: "contactName", ph: "Contact name" },
    { k: "contactTitle", ph: "Title" },
    { k: "contactCompany", ph: "Company" },
    { k: "contactPhone", ph: "Phone" },
  ];

  const [portfolio, setPortfolio] = useState<Camp[]>(DEFAULT_PORTFOLIO);

  const toggleBlock = (key: keyof typeof visibleBlocks) => {
    setVisibleBlocks((p) => ({ ...p, [key]: !p[key] }));
  };

  useEffect(() => {
    async function loadListings() {
      try {
        const res = await fetch("/api/admin/listings");
        const json = await res.json();

        if (res.ok && Array.isArray(json.listings) && json.listings.length > 0) {
          const camps: Camp[] = (json.listings as ApiListingRecord[]).map((l) =>
            normalizeCamp({
              ...(l.data ?? {}),
              slug: l.slug ?? l.data?.slug ?? "",
              companySlug:
                l.companySlug ?? l.data?.companySlug ?? "nyumbani-collection",
              status: l.status ?? l.data?.status ?? "published",
            }),
          );

          setPortfolio(camps);
          setSelectedCampIndex(0);
          setSaveMessage(`Loaded ${camps.length} listing(s) from API`);
        } else {
          const saved = safeJsonParse<SavePayload>(
            window.localStorage.getItem(STORAGE_KEY),
          );

          if (saved) {
            setPortfolio(
              saved.portfolio?.length
                ? saved.portfolio.map((item) => normalizeCamp(item))
                : DEFAULT_PORTFOLIO,
            );
            setSelectedCampIndex(saved.selectedCampIndex ?? 0);
            setTheme({ ...DEFAULT_THEME, ...saved.theme });
            setBlockColors({ ...DEFAULT_BLOCK_COLORS, ...saved.blockColors });
            setVisibleBlocks({ ...DEFAULT_VISIBLE_BLOCKS, ...saved.visibleBlocks });

            setSaveMessage(
              `Loaded local draft from ${new Date(saved.savedAt).toLocaleString()}`,
            );
          }
        }
      } catch {
        setSaveMessage("Failed to load listings");
      }

      setHasHydrated(true);
    }

    loadListings();
  }, []);

  const camp = portfolio[selectedCampIndex] ?? portfolio[0] ?? makeNewCamp();

  const profileSlug = camp?.slug?.trim() || slugify(camp?.name || "new-camp");

  const updateField = <K extends keyof Camp>(field: K, value: Camp[K]) => {
    setPortfolio((prev) => {
      const next = [...prev];
      const current = next[selectedCampIndex] ?? makeNewCamp();
      const updated: Camp = { ...current, [field]: value };

      if (field === "name") {
        updated.slug = current.slug?.trim() || slugify(String(value || ""));
      }

      next[selectedCampIndex] = updated;
      return next;
    });
  };

  const updateNested = (updater: (draft: Camp) => Camp) => {
    setPortfolio((prev) => {
      const next = [...prev];
      next[selectedCampIndex] = normalizeCamp(
        updater(next[selectedCampIndex] ?? makeNewCamp()),
      );
      return next;
    });
  };

  const numDraft = (raw: string): NumDraft => {
    if (raw === "") return "";
    const cleaned = raw.replace(/[^\d.]/g, "");
    if (cleaned === "") return "";
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : "";
  };

  const totalUnits =
    (typeof camp?.family === "number" ? camp.family : 0) +
    (typeof camp?.double === "number" ? camp.double : 0) +
    (typeof camp?.single === "number" ? camp.single : 0);

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.blockBg,
    borderColor: theme.borderColor,
    color: theme.accent,
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: theme.blockBg,
    color: theme.accent,
  };

  const borderStyle: React.CSSProperties = { borderColor: theme.borderColor };
  const accentText: React.CSSProperties = { color: theme.accent };
  const highlightText: React.CSSProperties = { color: theme.highlight };
  const highlightBg: React.CSSProperties = { backgroundColor: theme.highlight };

  const blockCardStyle = (
    key: keyof typeof blockColors,
  ): React.CSSProperties => ({
    backgroundColor: blockColors[key],
    borderColor: theme.borderColor,
    color: theme.accent,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  });

  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const buildPayload = (): SavePayload => ({
    version: 1,
    savedAt: new Date().toISOString(),
    portfolio: portfolio.map((item) => normalizeCamp(item)),
    selectedCampIndex,
    theme,
    blockColors,
    visibleBlocks,
  });

  const persistToLocalStorage = () => {
    const payload = buildPayload();
    window.localStorage.setItem(STORAGE_KEY, serializeState(payload));
    return payload;
  };

  const handleSave = async () => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    try {
      setSaveState("saving");
      setSaveMessage("Saving...");

      const payload = persistToLocalStorage();
      const activeCamp = payload.portfolio[payload.selectedCampIndex];

      if (!activeCamp) {
        throw new Error("No active camp selected.");
      }

      const normalizedCamp: Camp = normalizeCamp({
        ...activeCamp,
        slug: activeCamp.slug?.trim() || slugify(activeCamp.name || "new-camp"),
        companySlug: activeCamp.companySlug?.trim() || "nyumbani-collection",
        status: activeCamp.status || "published",
      });

      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizedCamp),
        signal: controller.signal,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Save failed.");
      }

      setPortfolio((prev) => {
        const next = [...prev];
        next[selectedCampIndex] = normalizedCamp;
        return next;
      });

      setSaveState("saved");
      setSaveMessage(
        `Saved to API at ${new Date().toLocaleTimeString()} (${json.storage ?? "api"})`,
      );

      window.setTimeout(() => setSaveState("idle"), 1800);
    } catch (error) {
      setSaveState("error");

      if (error instanceof DOMException && error.name === "AbortError") {
        setSaveMessage("Save timed out after 12 seconds");
      } else {
        setSaveMessage(error instanceof Error ? error.message : "Save failed");
      }
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const exportBackup = () => {
    try {
      const payload = persistToLocalStorage();
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `restoration-hub-backup-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setSaveMessage("Backup exported");
    } catch {
      setSaveMessage("Backup export failed");
    }
  };

  const importBackupFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      const text = await file.text();
      const parsed = safeJsonParse<SavePayload>(text);

      if (!parsed) {
        alert("That backup file could not be read.");
        return;
      }

      setPortfolio(
        parsed.portfolio?.length
          ? parsed.portfolio.map((item) => normalizeCamp(item))
          : DEFAULT_PORTFOLIO,
      );
      setSelectedCampIndex(
        Math.min(
          Math.max(parsed.selectedCampIndex ?? 0, 0),
          Math.max((parsed.portfolio?.length ?? 1) - 1, 0),
        ),
      );
      setTheme({ ...DEFAULT_THEME, ...parsed.theme });
      setBlockColors({ ...DEFAULT_BLOCK_COLORS, ...parsed.blockColors });
      setVisibleBlocks({ ...DEFAULT_VISIBLE_BLOCKS, ...parsed.visibleBlocks });

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      setSaveMessage("Backup imported");
    } catch {
      alert("Import failed.");
    }
  };

  const clearSavedDraft = () => {
    const confirmed = window.confirm(
      "Clear the saved local draft and reset the editor to default?",
    );
    if (!confirmed) return;

    window.localStorage.removeItem(STORAGE_KEY);
    setPortfolio(DEFAULT_PORTFOLIO);
    setSelectedCampIndex(0);
    setTheme(DEFAULT_THEME);
    setBlockColors(DEFAULT_BLOCK_COLORS);
    setVisibleBlocks(DEFAULT_VISIBLE_BLOCKS);
    setSaveMessage("Saved local draft cleared");
  };

  const [photoModal, setPhotoModal] = useState<{
    open: boolean;
    src: string;
    title?: string;
  }>({
    open: false,
    src: "",
    title: "",
  });

  const openPhoto = (src: string, title?: string) =>
    setPhotoModal({ open: true, src, title });
  const closePhoto = () => setPhotoModal({ open: false, src: "", title: "" });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePhoto();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const addRoomPhotos = async (roomKey: RoomKey, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      urls.push(await toDataUrl(file));
    }

    updateNested((c) => ({
      ...c,
      roomPhotos: {
        ...c.roomPhotos,
        [roomKey]: [...(c.roomPhotos[roomKey] ?? []), ...urls].slice(0, 12),
      },
    }));
  };

  const removeRoomPhoto = (roomKey: RoomKey, index: number) => {
    updateNested((c) => ({
      ...c,
      roomPhotos: {
        ...c.roomPhotos,
        [roomKey]: (c.roomPhotos[roomKey] ?? []).filter((_, i) => i !== index),
      },
    }));
  };

  const logoFileRef = useRef<HTMLInputElement | null>(null);
  const coverFileRef = useRef<HTMLInputElement | null>(null);
  const backupImportRef = useRef<HTMLInputElement | null>(null);

  const setLogoFromFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) return;
    updateField("logoImage", await toDataUrl(f));
  };

  const setCoverFromFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) return;
    updateField("coverImage", await toDataUrl(f));
  };

  const taLogoFileRef = useRef<HTMLInputElement | null>(null);
  const [taLogoPromptOpen, setTaLogoPromptOpen] = useState(false);
  const [taLogoUrlDraft, setTaLogoUrlDraft] = useState("");

  const setTaLogoFromFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) return;
    updateField("taLogoUrl", await toDataUrl(f));
  };

  const openTripadvisor = () => {
    if (!camp.taLink) return;
    window.open(camp.taLink, "_blank");
  };

  const vcardText = useMemo(() => {
    const esc = (s: string) =>
      String(s ?? "")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");

    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${esc(camp.contactName)}`,
      `ORG:${esc(camp.contactCompany)}`,
      `TITLE:${esc(camp.contactTitle)}`,
      camp.contactPhone ? `TEL;TYPE=CELL:${esc(camp.contactPhone)}` : "",
      camp.contactEmail ? `EMAIL;TYPE=INTERNET:${esc(camp.contactEmail)}` : "",
      camp.contactWebsite ? `URL:${esc(camp.contactWebsite)}` : "",
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");
  }, [
    camp.contactName,
    camp.contactCompany,
    camp.contactTitle,
    camp.contactPhone,
    camp.contactEmail,
    camp.contactWebsite,
  ]);

  const vcardUrl = useMemo(() => {
    try {
      const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8" });
      return URL.createObjectURL(blob);
    } catch {
      return "";
    }
  }, [vcardText]);

  useEffect(() => {
    return () => {
      if (vcardUrl) URL.revokeObjectURL(vcardUrl);
    };
  }, [vcardUrl]);

  const shareContact = async () => {
  try {
    const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8" });
    const file = new File([blob], "contact.vcf", { type: "text/vcard" });

    if (
      typeof navigator !== "undefined" &&
      "share" in navigator &&
      (!("canShare" in navigator) || navigator.canShare?.({ files: [file] }))
    ) {
      await navigator.share({
        title: camp.contactName,
        text: "Contact card",
        files: [file],
      });
    } else if (vcardUrl) {
      window.open(vcardUrl, "_blank");
    }
  } catch {
    if (vcardUrl) window.open(vcardUrl, "_blank");
  }
};

  const saveContact = () => {
    const a = document.createElement("a");
    a.href =
      vcardUrl ||
      `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardText)}`;
    a.download = `${(camp.contactName || "contact").replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const parseVcf = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const pick = (startsWith: string) => {
      const hit = lines.find((l) =>
        l.toUpperCase().startsWith(startsWith.toUpperCase()),
      );
      if (!hit) return "";
      return hit.split(":").slice(1).join(":").trim();
    };

    const fn = pick("FN");
    const org = pick("ORG");
    const title = pick("TITLE");

    const emailLine = lines.find((l) => l.toUpperCase().includes("EMAIL"));
    const telLine = lines.find((l) => l.toUpperCase().includes("TEL"));
    const urlLine = lines.find((l) => l.toUpperCase().startsWith("URL"));

    const email = emailLine
      ? emailLine.split(":").slice(1).join(":").trim()
      : "";
    const tel = telLine ? telLine.split(":").slice(1).join(":").trim() : "";
    const url = urlLine ? urlLine.split(":").slice(1).join(":").trim() : "";

    return {
      contactName: fn,
      contactCompany: org,
      contactTitle: title,
      contactEmail: email,
      contactPhone: tel,
      contactWebsite: url,
    };
  };

  const loadVcfFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.toLowerCase().endsWith(".vcf")) return;

    const text = await file.text();
    const parsed = parseVcf(text);

    updateNested((c) => ({
      ...c,
      contactName: parsed.contactName || c.contactName,
      contactCompany: parsed.contactCompany || c.contactCompany,
      contactTitle: parsed.contactTitle || c.contactTitle,
      contactEmail: parsed.contactEmail || c.contactEmail,
      contactPhone: parsed.contactPhone || c.contactPhone,
      contactWebsite: parsed.contactWebsite || c.contactWebsite,
    }));
  };

  const downloadableFileRef = useRef<HTMLInputElement | null>(null);

  const addDownloadableLink = () => {
    updateNested((c) => ({
      ...c,
      downloadables: [
        ...c.downloadables,
        {
          id: uid(),
          title: "New Link",
          type: "link",
          url: "https://drive.google.com/",
        },
      ],
    }));
  };

  const addDownloadableFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const added: Downloadable[] = [];
    for (const f of Array.from(files)) {
      const ok =
        f.type.startsWith("image/") ||
        f.type === "application/pdf" ||
        f.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        f.type === "application/msword";
      if (!ok) continue;

      const objectUrl = URL.createObjectURL(f);
      added.push({
        id: uid(),
        title: f.name,
        type: "file",
        url: objectUrl,
        mime: f.type,
        fileName: f.name,
      });
    }

    if (added.length === 0) return;

    updateNested((c) => ({
      ...c,
      downloadables: [...c.downloadables, ...added],
    }));
  };

  const updateDownloadable = (id: string, patch: Partial<Downloadable>) => {
    updateNested((c) => ({
      ...c,
      downloadables: c.downloadables.map((d) =>
        d.id === id ? { ...d, ...patch } : d,
      ),
    }));
  };

  const removeDownloadable = (id: string) => {
    updateNested((c) => {
      const hit = c.downloadables.find((d) => d.id === id);
      if (hit?.type === "file" && hit.url.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(hit.url);
        } catch {}
      }
      return {
        ...c,
        downloadables: c.downloadables.filter((d) => d.id !== id),
      };
    });
  };

  const openDownloadable = (d: Downloadable) => {
    window.open(d.url, "_blank");
  };

  const updateListItem = (
    key:
      | "inclusions"
      | "exclusions"
      | "freeActivities"
      | "paidActivities",
    idx: number,
    value: string,
  ) => {
    setPortfolio((prev) => {
      const next = [...prev];
      const current = { ...next[selectedCampIndex] };
      const list = [...current[key]];
      list[idx] = value;
      current[key] = list;
      next[selectedCampIndex] = current;
      return next;
    });
  };

  const addListItem = (
    key:
      | "inclusions"
      | "exclusions"
      | "freeActivities"
      | "paidActivities",
  ) => {
    setPortfolio((prev) => {
      const next = [...prev];
      const current = { ...next[selectedCampIndex] };
      current[key] = [...current[key], "New Item"];
      next[selectedCampIndex] = current;
      return next;
    });
  };

  const removeListItem = (
    key:
      | "inclusions"
      | "exclusions"
      | "freeActivities"
      | "paidActivities",
    idx: number,
  ) => {
    setPortfolio((prev) => {
      const next = [...prev];
      const current = { ...next[selectedCampIndex] };
      current[key] = current[key].filter((_, i) => i !== idx);
      next[selectedCampIndex] = current;
      return next;
    });
  };

  const addCamp = () => {
    setPortfolio((prev) => [...prev, makeNewCamp()]);
    setSelectedCampIndex(portfolio.length);
  };

  const deleteCamp = () => {
    setPortfolio((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== selectedCampIndex);
    });
    setSelectedCampIndex((prev) => Math.max(0, prev - 1));
  };

  const [lead, setLead] = useState({
    fullName: "",
    agency: "",
    email: "",
    phone: "",
    message: "",
  });

  const buildLeadMessage = (data: typeof lead) => {
    const lines = [
      `Property: ${camp.name}`,
      `Class: ${camp.class}`,
      `Location: ${camp.locationLabel}`,
      "",
      `Full name: ${data.fullName}`,
      `Agency: ${data.agency}`,
      `Email: ${data.email}`,
      `Phone/WhatsApp: ${data.phone}`,
      "",
      "Message:",
      data.message,
      "",
      "Requested via: Trade Directory Lead Capture",
    ];
    return lines.join("\n");
  };

  const normalizeWhatsApp = (v: string) => v.replace(/[^\d]/g, "");

  const leadPayload = useMemo(
    () => buildLeadMessage(lead),
    [lead, camp.name, camp.class, camp.locationLabel],
  );

  const openMailto = (payload: string) => {
    const to = (camp.enquiryEmail || "").trim();
    if (!to) return;
    const subject = encodeURIComponent(
      (camp.enquirySubject || "Trade Request").trim(),
    );
    const body = encodeURIComponent(payload);
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;
  };

  const openWhatsApp = (payload: string) => {
    const digits = normalizeWhatsApp(camp.enquiryWhatsApp || "");
    if (!digits) return;
    const text = encodeURIComponent(payload);
    window.open(`https://wa.me/${digits}?text=${text}`, "_blank");
  };

  const sendLeadEmail = async () => {
    const to = (camp.enquiryEmail || "").trim();
    if (!to) {
      alert("Please set a company enquiry email first.");
      return;
    }

    setSendState("sending");

    try {
      const res = await fetch("/api/contact-exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          subject: camp.enquirySubject || "Trade Request",
          fullName: lead.fullName,
          agency: lead.agency,
          email: lead.email,
          phone: lead.phone,
          message: lead.message,
          property: camp.name,
          propertyClass: camp.class,
          location: camp.locationLabel,
        }),
      });

      if (res.ok) {
        alert("Email sent successfully.");
        setLead({
          fullName: "",
          agency: "",
          email: "",
          phone: "",
          message: "",
        });
        setSendState("idle");
        return;
      }

      openMailto(leadPayload);
      alert(
        "Direct email endpoint is not ready yet. Your mail app has been opened instead.",
      );
    } catch {
      openMailto(leadPayload);
      alert(
        "Direct email send is not configured yet. Your mail app has been opened instead.",
      );
    } finally {
      setSendState("idle");
    }
  };

  if (!hasHydrated) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: DEFAULT_THEME.pageBg,
          color: DEFAULT_THEME.accent,
        }}
      >
        <div className="rounded-2xl border bg-white px-6 py-4 text-sm font-semibold shadow-sm">
          Loading editor…
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen font-sans"
      style={{ backgroundColor: theme.pageBg }}
    >
      {photoModal.open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-3"
          style={{ backgroundColor: "rgba(0,0,0,0.78)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closePhoto();
          }}
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-3xl border shadow-2xl"
            style={{
              backgroundColor: theme.blockBg,
              borderColor: theme.borderColor,
            }}
          >
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={borderStyle}
            >
              <div
                className="text-[11px] font-black uppercase tracking-widest"
                style={{ color: theme.accent, opacity: 0.8 }}
              >
                {photoModal.title || "Preview"}
              </div>
              <button
                onClick={closePhoto}
                className="rounded-xl border p-2"
                style={{
                  borderColor: theme.borderColor,
                  backgroundColor: theme.blockBg,
                }}
                type="button"
                aria-label="Close preview"
              >
                <X size={16} style={{ color: theme.accent }} />
              </button>
            </div>

            <div className="p-3">
              <div
                className="flex h-[78vh] w-full items-center justify-center overflow-hidden rounded-2xl border md:h-[80vh]"
                style={borderStyle}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoModal.src}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {taLogoPromptOpen && (
        <div
          className="fixed inset-0 z-[950] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setTaLogoPromptOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg rounded-3xl border p-4"
            style={cardStyle}
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ opacity: 0.75 }}
              >
                Paste Logo Image URL
              </div>
              <button
                type="button"
                className="rounded-xl border p-2"
                style={cardStyle}
                onClick={() => setTaLogoPromptOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <input
              className="w-full rounded-2xl border bg-transparent p-3 text-sm font-semibold outline-none"
              style={cardStyle}
              value={taLogoUrlDraft}
              onChange={(e) => setTaLogoUrlDraft(e.target.value)}
              placeholder="https://..."
            />

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-2xl py-3 text-[10px] font-black uppercase tracking-widest text-white"
                style={{ backgroundColor: theme.highlight }}
                onClick={() => {
                  const next = taLogoUrlDraft.trim();
                  updateField("taLogoUrl", next || DEFAULT_TA_LOGO);
                  setTaLogoPromptOpen(false);
                }}
              >
                Save URL
              </button>
              <button
                type="button"
                className="rounded-2xl border px-4 py-3 text-[10px] font-black uppercase tracking-widest"
                style={cardStyle}
                onClick={() => setTaLogoPromptOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!isPreview && (
        <aside
          className="fixed left-0 top-0 z-[100] flex h-screen w-72 flex-col border-r p-4"
          style={{
            backgroundColor: theme.blockBg,
            borderColor: theme.borderColor,
            color: theme.accent,
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ opacity: 0.55 }}
            >
              Restoration Hub
            </span>
            <button
              onClick={() => setIsPreview(true)}
              className="rounded-lg border p-2"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.blockBg,
              }}
              type="button"
              title="Open live preview"
            >
              <Eye size={14} style={{ color: theme.accent }} />
            </button>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => setIsPreview(true)}
              className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest"
              style={cardStyle}
              type="button"
            >
              <Eye size={12} />
              Live Preview
            </button>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest"
              style={cardStyle}
            >
              <Monitor size={12} />
              Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest"
              style={cardStyle}
              type="button"
            >
              <ArrowLeft size={12} />
              Return
            </button>

            <button
              onClick={() => setIsPreview(false)}
              className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest"
              style={cardStyle}
              type="button"
            >
              <Save size={12} />
              Editor
            </button>

            <a
              href={`/profiles/${profileSlug}`}
              target="_blank"
              rel="noreferrer"
              className="col-span-2 flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest"
              style={cardStyle}
            >
              <ExternalLink size={12} />
              Public Profile
            </a>

            <button
              onClick={handleSave}
              className="col-span-2 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white"
              style={{
                backgroundColor: theme.highlight,
                border: `1px solid ${theme.highlight}`,
              }}
              type="button"
            >
              <Save size={12} />
              {saveState === "saving" ? "Saving..." : "Save Draft"}
            </button>

            <button
              onClick={exportBackup}
              className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest"
              style={cardStyle}
              type="button"
            >
              <Download size={12} />
              Export
            </button>

            <button
              onClick={() => backupImportRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest"
              style={cardStyle}
              type="button"
            >
              <Upload size={12} />
              Import
            </button>

            <input
              ref={backupImportRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => importBackupFile(e.target.files)}
            />

            <button
              onClick={clearSavedDraft}
              className="col-span-2 flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest"
              style={cardStyle}
              type="button"
            >
              <Trash2 size={12} />
              Reset Saved Draft
            </button>
          </div>

          <div
            className="mb-4 rounded-2xl border px-3 py-2 text-[10px] font-bold"
            style={{
              borderColor: theme.borderColor,
              backgroundColor: theme.pageBg,
              color: theme.accent,
            }}
          >
            {saveMessage}
          </div>

          <div className="mb-4">
            <p
              className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em]"
              style={{ opacity: 0.5 }}
            >
              Camps
            </p>

            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={addCamp}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 text-[10px] font-black uppercase tracking-widest"
                  style={{
                    borderColor: theme.borderColor,
                    color: theme.accent,
                    backgroundColor: theme.blockBg,
                  }}
                  type="button"
                >
                  <Plus size={14} /> Add
                </button>
                <button
                  onClick={deleteCamp}
                  className="rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest"
                  style={{
                    borderColor: theme.borderColor,
                    color: theme.accent,
                    opacity: portfolio.length > 1 ? 1 : 0.35,
                    backgroundColor: theme.blockBg,
                  }}
                  type="button"
                  disabled={portfolio.length <= 1}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div
                className="rounded-2xl border p-2"
                style={{
                  borderColor: theme.borderColor,
                  backgroundColor: theme.pageBg,
                }}
              >
                {portfolio.map((c, i) => (
                  <button
                    key={`${c.slug || c.name}-${i}`}
                    onClick={() => setSelectedCampIndex(i)}
                    className="w-full rounded-xl px-3 py-2 text-left transition-all"
                    style={{
                      backgroundColor:
                        i === selectedCampIndex ? theme.blockBg : "transparent",
                      border:
                        i === selectedCampIndex
                          ? `1px solid ${theme.borderColor}`
                          : "1px solid transparent",
                    }}
                    type="button"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2
                          size={14}
                          style={{ color: theme.accent, opacity: 0.55 }}
                        />
                        <span
                          className="text-xs font-black"
                          style={{ color: theme.accent, opacity: 0.9 }}
                        >
                          {c.name || `Camp ${i + 1}`}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase"
                        style={{ color: theme.accent, opacity: 0.4 }}
                      >
                        #{i + 1}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            <div>
              <p
                className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em]"
                style={{ opacity: 0.5 }}
              >
                View Toggles
              </p>
              <div className="space-y-1">
                {Object.keys(visibleBlocks).map((key) => (
                  <button
                    key={key}
                    onClick={() =>
                      toggleBlock(key as keyof typeof visibleBlocks)
                    }
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider hover:opacity-90"
                    type="button"
                    style={{ color: theme.accent }}
                  >
                    <span
                      style={{
                        opacity: visibleBlocks[key as keyof typeof visibleBlocks]
                          ? 1
                          : 0.25,
                      }}
                    >
                      {key}
                    </span>
                    {visibleBlocks[key as keyof typeof visibleBlocks] ? (
                      <Eye size={12} style={{ color: theme.accent }} />
                    ) : (
                      <EyeOff
                        size={12}
                        style={{ color: theme.accent, opacity: 0.3 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="space-y-2 border-t pt-4"
              style={{ borderColor: theme.borderColor }}
            >
              <p className="text-[9px] font-bold uppercase" style={{ opacity: 0.5 }}>
                Global Colors
              </p>
              {Object.entries(theme).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span
                    className="text-[9px] font-medium uppercase"
                    style={{ color: theme.accent, opacity: 0.85 }}
                  >
                    {k}
                  </span>
                  <input
                    type="color"
                    value={v}
                    onChange={(e) =>
                      setTheme((t) => ({
                        ...t,
                        [k]: e.target.value,
                      }))
                    }
                    className="h-4 w-4 cursor-pointer rounded-full border-none"
                  />
                </div>
              ))}
            </div>

            <div
              className="space-y-2 border-t pt-4"
              style={{ borderColor: theme.borderColor }}
            >
              <p className="text-[9px] font-bold uppercase" style={{ opacity: 0.5 }}>
                Block Backgrounds
              </p>
              {Object.entries(blockColors).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-2">
                  <span
                    className="text-[9px] font-medium uppercase"
                    style={{ color: theme.accent, opacity: 0.85 }}
                  >
                    {k}
                  </span>
                  <input
                    type="color"
                    value={v}
                    onChange={(e) =>
                      setBlockColors((prev) => ({
                        ...prev,
                        [k]: e.target.value,
                      }))
                    }
                    className="h-5 w-5 cursor-pointer rounded-full border-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className="mt-4 w-full rounded-xl py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
            style={highlightBg}
            type="button"
            onClick={handleSave}
          >
            <Save size={14} className="mr-2 inline" />
            {saveState === "saving" ? "Saving..." : "Save Changes"}
          </button>
        </aside>
      )}

      <main className={`flex-1 transition-all ${!isPreview ? "ml-72" : "ml-0"}`}>
        <div
          className="sticky top-0 z-40 border-b px-4 py-3 sm:px-6"
          style={{
            backgroundColor: theme.blockBg,
            borderColor: theme.borderColor,
          }}
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsPreview((v) => !v)}
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest"
                style={cardStyle}
                type="button"
              >
                {isPreview ? <EyeOff size={12} /> : <Eye size={12} />}
                {isPreview ? "Editor View" : "Live Preview"}
              </button>

              <Link
                href="/"
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest"
                style={cardStyle}
              >
                <Monitor size={12} />
                Home
              </Link>

              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest"
                style={cardStyle}
                type="button"
              >
                <ArrowLeft size={12} />
                Return
              </button>

              <button
                onClick={() => setIsPreview(false)}
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest"
                style={cardStyle}
                type="button"
              >
                <Save size={12} />
                Editor
              </button>

              <a
                href={`/profiles/${profileSlug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest"
                style={cardStyle}
              >
                <ExternalLink size={12} />
                Public Profile
              </a>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white"
                style={{
                  backgroundColor: theme.highlight,
                  border: `1px solid ${theme.highlight}`,
                }}
                type="button"
              >
                <Save size={12} />
                {saveState === "saving" ? "Saving..." : "Save"}
              </button>
            </div>

            <div
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: theme.accent, opacity: 0.55 }}
            >
              {camp.name}
            </div>
          </div>
        </div>

        {visibleBlocks.header && (
          <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6">
            <div
              className="relative rounded-2xl border px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
              style={blockCardStyle("header")}
            >
              <input
                ref={logoFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setLogoFromFiles(e.target.files)}
              />
              <input
                ref={coverFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setCoverFromFiles(e.target.files)}
              />

              <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
                <div
                  className="flex h-14 w-20 cursor-pointer select-none items-center justify-center overflow-hidden rounded-2xl border md:h-16 md:w-28"
                  style={{
                    borderColor: theme.borderColor,
                    backgroundColor: theme.pageBg,
                  }}
                  onDoubleClick={() => logoFileRef.current?.click()}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    logoFileRef.current?.click();
                  }}
                  title="Double-click or right-click to replace logo"
                  role="button"
                  tabIndex={0}
                >
                  {camp.logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={camp.logoImage}
                      alt="Logo"
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <ImageIcon
                        size={18}
                        style={{ color: theme.accent, opacity: 0.5 }}
                      />
                      <span
                        className="text-[8px] font-black uppercase tracking-widest"
                        style={{ color: theme.accent, opacity: 0.45 }}
                      >
                        Logo
                      </span>
                    </div>
                  )}
                </div>

                {!isPreview && (
                  <AdminHint
                    text="Double/right click logo to replace"
                    borderColor={theme.borderColor}
                    bg={theme.blockBg}
                    color={theme.accent}
                  />
                )}
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="flex h-24 w-24 cursor-pointer select-none items-center justify-center overflow-hidden rounded-full border md:h-28 md:w-28"
                    style={{
                      borderColor: theme.borderColor,
                      backgroundColor: theme.pageBg,
                    }}
                    onDoubleClick={() => coverFileRef.current?.click()}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      coverFileRef.current?.click();
                    }}
                    title="Double-click or right-click to replace cover image"
                    role="button"
                    tabIndex={0}
                  >
                    {camp.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={camp.coverImage}
                        alt="Cover"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Camera
                          size={18}
                          style={{ color: theme.accent, opacity: 0.5 }}
                        />
                        <span
                          className="text-[8px] font-black uppercase tracking-widest"
                          style={{ color: theme.accent, opacity: 0.45 }}
                        >
                          Cover
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 w-full max-w-2xl space-y-2 text-center">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input
                      className="w-full bg-transparent text-center text-[10px] font-black uppercase tracking-[0.25em] outline-none"
                      value={camp.tradeProfileLabel}
                      onChange={(e) =>
                        updateField("tradeProfileLabel", e.target.value)
                      }
                      style={{ color: theme.accent, opacity: 0.75 }}
                      placeholder="Trade profile label"
                    />
                    <input
                      className="w-full bg-transparent text-center text-[10px] font-black uppercase tracking-[0.25em] outline-none"
                      value={camp.tradeProfileSub}
                      onChange={(e) =>
                        updateField("tradeProfileSub", e.target.value)
                      }
                      style={{ color: theme.accent, opacity: 0.75 }}
                      placeholder="Trade profile subtext"
                    />
                  </div>

                  <div
                    className="text-base font-black italic md:text-lg"
                    style={{ color: theme.accent, opacity: 0.95 }}
                  >
                    <input
                      className="w-full bg-transparent text-center outline-none"
                      value={camp.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      style={{ color: theme.accent }}
                    />
                  </div>

                  <div
                    className="text-[11px] font-black uppercase tracking-widest"
                    style={{ color: theme.accent, opacity: 0.7 }}
                  >
                    <input
                      className="w-full bg-transparent text-center outline-none"
                      value={camp.class}
                      onChange={(e) => updateField("class", e.target.value)}
                      style={{ color: theme.accent }}
                    />
                  </div>
                </div>

                <div
                  className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-2 text-[10px] font-black uppercase tracking-widest"
                  style={{ color: theme.accent, opacity: 0.8 }}
                >
                  <div className="flex items-center gap-2">
                    <StarIcon size={14} style={highlightText} />
                    <input
                      className="w-14 bg-transparent text-center font-black outline-none"
                      value={camp.rating}
                      onChange={(e) =>
                        updateField("rating", numDraft(e.target.value))
                      }
                      style={accentText}
                    />
                    <span style={{ opacity: 0.55 }}>
                      ({camp.reviewCount || 0})
                    </span>
                  </div>

                  <div
                    className="hidden h-4 w-px sm:block"
                    style={{ backgroundColor: theme.borderColor }}
                  />

                  <div className="flex items-center gap-2">
                    <MapPin size={14} style={highlightText} />
                    <input
                      className="max-w-[70vw] w-[240px] bg-transparent text-center font-black outline-none"
                      value={camp.locationLabel}
                      onChange={(e) =>
                        updateField("locationLabel", e.target.value)
                      }
                      style={accentText}
                    />
                  </div>

                  <div
                    className="hidden h-4 w-px sm:block"
                    style={{ backgroundColor: theme.borderColor }}
                  />

                  <div>
                    Rooms:{" "}
                    <input
                      className="w-12 bg-transparent text-center font-black outline-none"
                      value={camp.rooms}
                      onChange={(e) =>
                        updateField("rooms", numDraft(e.target.value))
                      }
                      style={accentText}
                    />
                    <span style={{ opacity: 0.55 }}> • Units:</span>{" "}
                    <span style={{ opacity: 0.95 }}>{totalUnits}</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {socialFields.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-2 rounded-xl border px-3 py-2"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.blockBg,
                        color: theme.accent,
                      }}
                    >
                      <span style={{ color: theme.highlight }}>{item.icon}</span>
                      <input
                        className="w-36 bg-transparent text-[10px] font-black outline-none md:w-44"
                        value={camp[item.key]}
                        onChange={(e) => updateField(item.key, e.target.value)}
                        placeholder={item.label}
                        style={{ color: theme.accent }}
                      />
                    </div>
                  ))}
                </div>

                {visibleBlocks.tripadvisor && (
                  <div
                    className="mt-3 w-full max-w-3xl cursor-pointer rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: theme.borderColor,
                      backgroundColor: blockColors.tripadvisor,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                    }}
                    onClick={openTripadvisor}
                    title="Open Tripadvisor"
                  >
                    <input
                      ref={taLogoFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setTaLogoFromFiles(e.target.files)}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex min-w-[220px] items-center gap-3">
                        <div
                          className="flex h-10 w-32 items-center justify-center overflow-hidden rounded-xl border"
                          style={{
                            borderColor: "rgba(0,0,0,0.12)",
                            backgroundColor: "rgba(255,255,255,0.85)",
                          }}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            taLogoFileRef.current?.click();
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            taLogoFileRef.current?.click();
                          }}
                          title="Double-click or right-click to upload logo"
                          role="button"
                          tabIndex={0}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={camp.taLogoUrl || DEFAULT_TA_LOGO}
                            alt="Tripadvisor"
                            className="h-full w-full object-contain p-2"
                          />
                        </div>

                        <button
                          type="button"
                          className="rounded-xl border px-3 py-2 text-[10px] font-black uppercase tracking-widest"
                          style={{
                            borderColor: theme.borderColor,
                            backgroundColor: theme.blockBg,
                            color: theme.accent,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setTaLogoUrlDraft(camp.taLogoUrl || DEFAULT_TA_LOGO);
                            setTaLogoPromptOpen(true);
                          }}
                          title="Paste logo URL"
                        >
                          Paste URL
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={camp.taStyle}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            updateField(
                              "taStyle",
                              e.target.value as Camp["taStyle"],
                            )
                          }
                          className="rounded-xl border bg-transparent px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none"
                          style={{
                            borderColor: theme.borderColor,
                            color: theme.accent,
                            backgroundColor: theme.blockBg,
                          }}
                          title="Dots or Stars"
                        >
                          <option value="dots">Dots</option>
                          <option value="stars">Stars</option>
                        </select>

                        <div onClick={(e) => e.stopPropagation()}>
                          <RatingPips
                            value={
                              typeof camp.taRating === "number" ? camp.taRating : 0
                            }
                            onChange={(v) => updateField("taRating", v)}
                            highlight="#34A853"
                            mode={camp.taStyle}
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className="mt-2 flex flex-wrap items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="text-[9px] font-black uppercase tracking-widest"
                        style={{ color: theme.accent, opacity: 0.55 }}
                      >
                        Tripadvisor Link
                      </div>
                      <input
                        className="flex-1 bg-transparent text-[10px] font-semibold outline-none"
                        value={camp.taLink}
                        onChange={(e) => updateField("taLink", e.target.value)}
                        style={{ color: theme.accent, opacity: 0.85 }}
                        placeholder="Paste Tripadvisor property link here"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="space-y-3 lg:col-span-7">
              {visibleBlocks.tradeDetails && (
                <CompactPanel
                  title="Trade Profile Details"
                  subtitle="Vibe + links (editable)"
                  defaultOpen={false}
                  style={blockCardStyle("tradeDetails")}
                  headerStyle={headerStyle}
                >
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="rounded-xl border p-3" style={borderStyle}>
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-55">
                        Map link
                      </div>
                      <input
                        className="mt-1 w-full bg-transparent text-sm font-black outline-none"
                        value={camp.mapLink}
                        onChange={(e) => updateField("mapLink", e.target.value)}
                        style={accentText}
                      />
                    </div>

                    <div className="rounded-xl border p-3" style={borderStyle}>
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-55">
                        Website
                      </div>
                      <input
                        className="mt-1 w-full bg-transparent text-sm font-black outline-none"
                        value={camp.website}
                        onChange={(e) => updateField("website", e.target.value)}
                        style={accentText}
                      />
                    </div>

                    <div
                      className="rounded-xl border p-3 md:col-span-2"
                      style={borderStyle}
                    >
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-55">
                        Vibe
                      </div>
                      <textarea
                        className="mt-1 w-full resize-none bg-transparent text-sm font-semibold outline-none"
                        rows={2}
                        value={camp.vibe}
                        onChange={(e) => updateField("vibe", e.target.value)}
                        style={{ color: theme.accent, opacity: 0.92 }}
                      />
                    </div>
                  </div>
                </CompactPanel>
              )}

              {visibleBlocks.matrix && (
                <CompactPanel
                  title="Property Section"
                  subtitle="Inventory + hover preview + room photos"
                  defaultOpen
                  style={blockCardStyle("matrix")}
                  headerStyle={headerStyle}
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {(["family", "double", "single"] as const).map((type) => (
                      <div
                        key={type}
                        className="rounded-xl border p-3"
                        style={borderStyle}
                      >
                        <input
                          className="w-full bg-transparent text-[10px] font-black uppercase outline-none"
                          value={camp.roomTypeLabels[type]}
                          onChange={(e) =>
                            updateNested((c) => ({
                              ...c,
                              roomTypeLabels: {
                                ...c.roomTypeLabels,
                                [type]: e.target.value,
                              },
                            }))
                          }
                          style={{ color: theme.accent, opacity: 0.8 }}
                        />

                        <div className="mt-2 flex items-center justify-between">
                          <input
                            inputMode="numeric"
                            className="w-16 bg-transparent text-3xl font-black italic outline-none"
                            value={camp[type]}
                            onChange={(e) =>
                              updateField(
                                type,
                                numDraft(e.target.value) as Camp[typeof type],
                              )
                            }
                            style={{ color: theme.accent, opacity: 0.95 }}
                          />
                          <label
                            className="inline-flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                            style={highlightText}
                          >
                            <Upload size={12} />
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => addRoomPhotos(type, e.target.files)}
                            />
                          </label>
                        </div>

                        <div className="mt-3 grid grid-cols-4 gap-1.5">
                          {(camp.roomPhotos[type] ?? []).slice(0, 12).map((src, i) => (
                            <button
                              key={i}
                              className="group relative overflow-hidden rounded-lg border"
                              style={borderStyle}
                              onClick={() =>
                                openPhoto(
                                  src,
                                  `${camp.roomTypeLabels[type]} — Photo ${i + 1}`,
                                )
                              }
                              onMouseEnter={() =>
                                setHoveredRoomPhoto({
                                  src,
                                  title: `${camp.roomTypeLabels[type]} — Photo ${i + 1}`,
                                })
                              }
                              onMouseLeave={() => setHoveredRoomPhoto(null)}
                              type="button"
                              title="Hover to preview, click to open"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={src}
                                alt={`${type}-${i}`}
                                className="aspect-square w-full object-cover transition duration-200 group-hover:scale-[1.03]"
                              />

                              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 transition group-hover:opacity-100">
                                <span className="mb-1 rounded-full border border-white/20 bg-black/35 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur">
                                  Hover preview
                                </span>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeRoomPhoto(type, i);
                                }}
                                className="absolute right-1 top-1 rounded-md p-1"
                                style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
                                title="Remove"
                                type="button"
                              >
                                <X size={10} className="text-white" />
                              </button>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    <div className="rounded-xl border p-3" style={borderStyle}>
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-55">
                        Total rooms
                      </div>
                      <input
                        className="mt-1 w-full bg-transparent text-sm font-black outline-none"
                        value={camp.rooms}
                        onChange={(e) =>
                          updateField("rooms", numDraft(e.target.value))
                        }
                        style={accentText}
                      />
                    </div>
                    <div className="rounded-xl border p-3" style={borderStyle}>
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-55">
                        Total units (computed)
                      </div>
                      <div
                        className="mt-1 text-sm font-black"
                        style={{ color: theme.accent, opacity: 0.95 }}
                      >
                        {totalUnits}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border p-3" style={borderStyle}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: theme.accent, opacity: 0.7 }}
                      >
                        Hover Preview
                      </div>
                      <div
                        className="text-[9px] font-semibold uppercase tracking-widest"
                        style={{ color: theme.accent, opacity: 0.5 }}
                      >
                        Desktop hover • Tap opens modal
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-[220px_1fr]">
                      <div
                        className="overflow-hidden rounded-2xl border"
                        style={borderStyle}
                      >
                        {hoveredRoomPhoto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={hoveredRoomPhoto.src}
                            alt={hoveredRoomPhoto.title}
                            className="aspect-[4/3] w-full object-cover"
                          />
                        ) : (
                          <div
                            className="flex aspect-[4/3] items-center justify-center"
                            style={{ backgroundColor: theme.pageBg }}
                          >
                            <div className="text-center">
                              <ImageIcon
                                size={18}
                                style={{ color: theme.accent, opacity: 0.45 }}
                              />
                              <div
                                className="mt-2 text-[9px] font-black uppercase tracking-widest"
                                style={{ color: theme.accent, opacity: 0.5 }}
                              >
                                Hover a photo above
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        className="rounded-2xl border p-4"
                        style={{ ...borderStyle, backgroundColor: theme.pageBg }}
                      >
                        <div
                          className="text-xs font-black uppercase tracking-[0.2em]"
                          style={{ color: theme.accent, opacity: 0.75 }}
                        >
                          {hoveredRoomPhoto
                            ? hoveredRoomPhoto.title
                            : "Property media preview"}
                        </div>

                        <p
                          className="mt-3 text-sm leading-7"
                          style={{ color: theme.accent, opacity: 0.72 }}
                        >
                          Hovering any room thumbnail opens a scaled preview in this
                          property section, while click still opens the full image
                          modal. Your right-click and double-click upload behavior
                          remains unchanged.
                        </p>
                      </div>
                    </div>
                  </div>
                </CompactPanel>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                {visibleBlocks.inclusions && (
                  <CompactPanel
                    title="Inclusions"
                    defaultOpen={false}
                    style={blockCardStyle("inclusions")}
                    headerStyle={headerStyle}
                    right={
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addListItem("inclusions");
                        }}
                        type="button"
                        title="Add"
                        className="rounded-xl border p-2"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: theme.blockBg,
                        }}
                      >
                        <Plus size={14} style={highlightText} />
                      </button>
                    }
                  >
                    <div className="space-y-2">
                      {camp.inclusions.map((item, i) => (
                        <div key={i} className="group flex items-center gap-2">
                          <Check size={12} className="text-green-500" />
                          <input
                            className="w-full bg-transparent text-sm font-semibold outline-none"
                            value={item}
                            onChange={(e) =>
                              updateListItem("inclusions", i, e.target.value)
                            }
                            style={{ color: theme.accent, opacity: 0.9 }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeListItem("inclusions", i);
                            }}
                            className="opacity-0 group-hover:opacity-100"
                            style={{ color: "#f87171" }}
                            type="button"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CompactPanel>
                )}

                {visibleBlocks.exclusions && (
                  <CompactPanel
                    title="Exclusions"
                    defaultOpen={false}
                    style={blockCardStyle("exclusions")}
                    headerStyle={headerStyle}
                    right={
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addListItem("exclusions");
                        }}
                        type="button"
                        title="Add"
                        className="rounded-xl border p-2"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: theme.blockBg,
                        }}
                      >
                        <Plus size={14} style={highlightText} />
                      </button>
                    }
                  >
                    <div className="space-y-2">
                      {camp.exclusions.map((item, i) => (
                        <div key={i} className="group flex items-center gap-2">
                          <Ban
                            size={12}
                            style={{ color: theme.accent, opacity: 0.5 }}
                          />
                          <input
                            className="w-full bg-transparent text-sm font-semibold italic outline-none"
                            value={item}
                            onChange={(e) =>
                              updateListItem("exclusions", i, e.target.value)
                            }
                            style={{ color: theme.accent, opacity: 0.85 }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeListItem("exclusions", i);
                            }}
                            className="opacity-0 group-hover:opacity-100"
                            style={{ color: "#f87171" }}
                            type="button"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CompactPanel>
                )}
              </div>

              {visibleBlocks.experiences && (
                <CompactPanel
                  title="Services & Experiences"
                  subtitle="Included vs Paid"
                  defaultOpen={false}
                  style={blockCardStyle("experiences")}
                  headerStyle={headerStyle}
                >
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border p-3" style={borderStyle}>
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-70">
                          Included
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addListItem("freeActivities");
                          }}
                          type="button"
                          className="rounded-xl border p-2"
                          style={{
                            borderColor: theme.borderColor,
                            backgroundColor: theme.blockBg,
                          }}
                        >
                          <Plus size={14} style={highlightText} />
                        </button>
                      </div>
                      <div className="mt-2 space-y-2">
                        {camp.freeActivities.map((act, i) => (
                          <div key={i} className="group flex items-center gap-2">
                            <Compass size={12} style={highlightText} />
                            <input
                              className="w-full bg-transparent text-sm font-semibold uppercase tracking-tight outline-none"
                              value={act}
                              onChange={(e) =>
                                updateListItem("freeActivities", i, e.target.value)
                              }
                              style={{ color: theme.accent, opacity: 0.9 }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeListItem("freeActivities", i);
                              }}
                              className="opacity-0 group-hover:opacity-100"
                              style={{ color: "#f87171" }}
                              type="button"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      className="rounded-xl border p-3"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.accent,
                        color: "#fff",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/80">
                          Paid
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addListItem("paidActivities");
                          }}
                          type="button"
                          className="rounded-xl border p-2"
                          style={{
                            borderColor: "rgba(255,255,255,0.25)",
                            backgroundColor: "rgba(255,255,255,0.06)",
                          }}
                        >
                          <Plus size={14} className="text-white/80" />
                        </button>
                      </div>
                      <div className="mt-2 space-y-2">
                        {camp.paidActivities.map((act, i) => (
                          <div key={i} className="group flex items-center gap-2">
                            <MapPin size={12} className="text-white/60" />
                            <input
                              className="w-full bg-transparent text-sm font-semibold uppercase tracking-tight text-white outline-none"
                              value={act}
                              onChange={(e) =>
                                updateListItem("paidActivities", i, e.target.value)
                              }
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeListItem("paidActivities", i);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-white/70"
                              type="button"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CompactPanel>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                {visibleBlocks.offers && (
                  <CompactPanel
                    title="Offer"
                    defaultOpen={false}
                    style={blockCardStyle("offers")}
                    headerStyle={headerStyle}
                  >
                    <div className="rounded-xl p-3 text-white" style={highlightBg}>
                      <div className="mb-2 text-[9px] font-black uppercase tracking-[0.35em] text-white/70">
                        Trade incentive
                      </div>
                      <textarea
                        className="w-full resize-none bg-transparent text-xl font-black italic leading-snug tracking-tight outline-none md:text-2xl"
                        rows={3}
                        value={camp.offersText}
                        onChange={(e) => updateField("offersText", e.target.value)}
                      />
                    </div>
                  </CompactPanel>
                )}

                {visibleBlocks.terms && (
                  <CompactPanel
                    title="Terms"
                    defaultOpen={false}
                    style={blockCardStyle("terms")}
                    headerStyle={headerStyle}
                  >
                    <textarea
                      className="w-full resize-none rounded-xl border bg-transparent p-3 text-sm font-semibold outline-none"
                      style={{
                        borderColor: theme.borderColor,
                        color: theme.accent,
                      }}
                      rows={6}
                      value={camp.terms}
                      onChange={(e) => updateField("terms", e.target.value)}
                    />
                  </CompactPanel>
                )}
              </div>
            </div>

            <div className="space-y-3 lg:col-span-5">
              {visibleBlocks.leadCapture && (
                <CompactPanel
                  title="Lead Capture"
                  subtitle="Send by Email or WhatsApp"
                  defaultOpen
                  style={blockCardStyle("leadCapture")}
                  headerStyle={headerStyle}
                >
                  <div className="rounded-xl border p-3" style={borderStyle}>
                    <div
                      className="text-[10px] font-black uppercase tracking-widest opacity-65"
                      style={{ color: theme.accent }}
                    >
                      Enquiry form
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                      <input
                        className="w-full rounded-xl border bg-transparent p-3 text-xs font-semibold outline-none"
                        style={cardStyle}
                        placeholder="Full name"
                        value={lead.fullName}
                        onChange={(e) =>
                          setLead((p) => ({ ...p, fullName: e.target.value }))
                        }
                      />
                      <input
                        className="w-full rounded-xl border bg-transparent p-3 text-xs font-semibold outline-none"
                        style={cardStyle}
                        placeholder="Agency"
                        value={lead.agency}
                        onChange={(e) =>
                          setLead((p) => ({ ...p, agency: e.target.value }))
                        }
                      />
                      <input
                        className="w-full rounded-xl border bg-transparent p-3 text-xs font-semibold outline-none md:col-span-2"
                        style={cardStyle}
                        placeholder="Email"
                        value={lead.email}
                        onChange={(e) =>
                          setLead((p) => ({ ...p, email: e.target.value }))
                        }
                      />
                      <input
                        className="w-full rounded-xl border bg-transparent p-3 text-xs font-semibold outline-none md:col-span-2"
                        style={cardStyle}
                        placeholder="WhatsApp / Phone"
                        value={lead.phone}
                        onChange={(e) =>
                          setLead((p) => ({ ...p, phone: e.target.value }))
                        }
                      />
                      <textarea
                        className="w-full resize-none rounded-xl border bg-transparent p-3 text-xs font-semibold outline-none md:col-span-2"
                        style={cardStyle}
                        placeholder="Message..."
                        rows={3}
                        value={lead.message}
                        onChange={(e) =>
                          setLead((p) => ({ ...p, message: e.target.value }))
                        }
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        className="flex min-w-[180px] flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
                        style={highlightBg}
                        type="button"
                        onClick={sendLeadEmail}
                        disabled={sendState === "sending"}
                        title="Send request by email"
                      >
                        <Mail size={14} />
                        <span className="truncate">
                          {sendState === "sending" ? "Sending..." : camp.leadCta}
                        </span>
                      </button>

                      <button
                        className="flex items-center gap-2 rounded-xl border px-4 py-3 text-[10px] font-black uppercase tracking-widest"
                        style={cardStyle}
                        type="button"
                        onClick={() => openWhatsApp(leadPayload)}
                        title="Send request on WhatsApp"
                      >
                        <MessageCircle size={14} />
                        WhatsApp
                      </button>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <ShieldAlert
                        size={14}
                        style={{ color: theme.accent, opacity: 0.35 }}
                      />
                      <input
                        className="w-full bg-transparent text-[10px] font-semibold outline-none"
                        value={camp.leadDisclaimer}
                        onChange={(e) =>
                          updateField("leadDisclaimer", e.target.value)
                        }
                        style={{ color: theme.accent, opacity: 0.65 }}
                      />
                    </div>

                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      <input
                        className="rounded-xl border bg-transparent p-3 text-xs font-semibold outline-none"
                        style={cardStyle}
                        value={camp.enquiryEmail}
                        onChange={(e) =>
                          updateField("enquiryEmail", e.target.value)
                        }
                        placeholder="Company enquiry email"
                      />
                      <input
                        className="rounded-xl border bg-transparent p-3 text-xs font-semibold outline-none"
                        style={cardStyle}
                        value={camp.enquiryWhatsApp}
                        onChange={(e) =>
                          updateField("enquiryWhatsApp", e.target.value)
                        }
                        placeholder="Company WhatsApp (intl)"
                      />
                      <input
                        className="rounded-xl border bg-transparent p-3 text-xs font-semibold outline-none md:col-span-2"
                        style={cardStyle}
                        value={camp.enquirySubject}
                        onChange={(e) =>
                          updateField("enquirySubject", e.target.value)
                        }
                        placeholder="Email subject"
                      />
                    </div>

                    <div
                      className="mt-2 flex items-center justify-center gap-2 text-[10px] font-bold"
                      style={{ color: theme.accent, opacity: 0.6 }}
                    >
                      <Percent size={12} />
                      Sends to:{" "}
                      <span style={{ color: theme.accent, opacity: 1 }}>
                        {camp.enquiryEmail || "set enquiry email"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
                    {visibleBlocks.downloadables && (
                      <div
                        className="rounded-2xl border p-3 sm:p-4"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: blockColors.downloadables,
                        }}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div
                            className="text-[10px] font-black uppercase tracking-widest opacity-70"
                            style={{ color: theme.accent }}
                          >
                            Downloads
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded-xl border p-2"
                              style={cardStyle}
                              onClick={addDownloadableLink}
                              title="Add link"
                            >
                              <LinkIcon size={14} style={highlightText} />
                            </button>

                            <button
                              type="button"
                              className="rounded-xl border p-2"
                              style={cardStyle}
                              onClick={() => downloadableFileRef.current?.click()}
                              title="Upload file"
                            >
                              <Paperclip size={14} style={highlightText} />
                            </button>

                            <input
                              ref={downloadableFileRef}
                              type="file"
                              className="hidden"
                              multiple
                              accept="application/pdf,image/*,.doc,.docx"
                              onChange={(e) => addDownloadableFiles(e.target.files)}
                            />
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          {(camp.downloadables ?? []).length === 0 ? (
                            <div
                              className="rounded-xl border p-3 text-xs font-semibold"
                              style={{ ...cardStyle, opacity: 0.7 }}
                            >
                              No downloadables yet.
                            </div>
                          ) : null}

                          {(camp.downloadables ?? []).slice(0, 8).map((d) => (
                            <div
                              key={d.id}
                              className="rounded-xl border p-3"
                              style={cardStyle}
                            >
                              <div className="flex items-start gap-2">
                                <button
                                  type="button"
                                  className="shrink-0 rounded-xl border p-2"
                                  style={cardStyle}
                                  title="Open"
                                  onClick={() => openDownloadable(d)}
                                >
                                  {d.type === "link" ? (
                                    <LinkIcon size={14} style={highlightText} />
                                  ) : (
                                    <Download size={14} style={highlightText} />
                                  )}
                                </button>

                                <div className="min-w-0 flex-1">
                                  <input
                                    className="w-full bg-transparent text-xs font-semibold outline-none"
                                    style={{ color: theme.accent, opacity: 0.9 }}
                                    value={d.title}
                                    onChange={(e) =>
                                      updateDownloadable(d.id, {
                                        title: e.target.value,
                                      })
                                    }
                                  />

                                  {d.type === "link" ? (
                                    <input
                                      className="mt-2 w-full bg-transparent text-[10px] font-semibold outline-none"
                                      style={{ color: theme.accent, opacity: 0.75 }}
                                      value={d.url}
                                      onChange={(e) =>
                                        updateDownloadable(d.id, {
                                          url: e.target.value,
                                        })
                                      }
                                    />
                                  ) : (
                                    <div
                                      className="mt-2 text-[10px] font-semibold"
                                      style={{ color: theme.accent, opacity: 0.65 }}
                                    >
                                      {d.fileName || "Uploaded file"}
                                    </div>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  className="shrink-0 rounded-xl border p-2"
                                  style={cardStyle}
                                  onClick={() => removeDownloadable(d.id)}
                                  title="Remove"
                                >
                                  <Trash2 size={14} style={{ color: "#f87171" }} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div
                      className="rounded-2xl border p-3 sm:p-4"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: blockColors.contactCard,
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div
                          className="text-[10px] font-black uppercase tracking-widest opacity-70"
                          style={{ color: theme.accent }}
                        >
                          Contact Card (QR / NFC)
                        </div>
                        <label
                          className="inline-flex cursor-pointer items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                          style={{ color: theme.highlight }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FileText size={12} />
                          Upload .VCF
                          <input
                            type="file"
                            accept=".vcf,text/vcard"
                            className="hidden"
                            onChange={(e) => loadVcfFile(e.target.files)}
                          />
                        </label>
                      </div>

                      <div
                        className="mt-3 rounded-2xl border p-3 sm:p-4"
                        style={cardStyle}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
                            style={{
                              borderColor: theme.borderColor,
                              backgroundColor: theme.pageBg,
                            }}
                          >
                            <Contact
                              size={18}
                              style={{ color: theme.highlight }}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div
                              className="truncate text-sm font-black uppercase tracking-[0.16em]"
                              style={{ color: theme.accent, opacity: 0.72 }}
                            >
                              {camp.contactCompany || "Company"}
                            </div>
                            <div
                              className="mt-1 break-words text-lg font-black leading-tight sm:text-xl"
                              style={{ color: theme.accent }}
                            >
                              {camp.contactName || "Contact name"}
                            </div>
                            <div
                              className="mt-1 break-words text-xs font-semibold uppercase tracking-[0.18em] sm:text-[11px]"
                              style={{ color: theme.accent, opacity: 0.65 }}
                            >
                              {camp.contactTitle || "Role"}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                          <div
                            className="rounded-xl border p-3"
                            style={{
                              borderColor: theme.borderColor,
                              backgroundColor: theme.pageBg,
                            }}
                          >
                            <div
                              className="text-[9px] font-black uppercase tracking-widest"
                              style={{ color: theme.accent, opacity: 0.5 }}
                            >
                              Email
                            </div>
                            <div
                              className="mt-1 break-all font-semibold"
                              style={{ color: theme.accent }}
                            >
                              {camp.contactEmail || "No email yet"}
                            </div>
                          </div>

                          <div
                            className="rounded-xl border p-3"
                            style={{
                              borderColor: theme.borderColor,
                              backgroundColor: theme.pageBg,
                            }}
                          >
                            <div
                              className="text-[9px] font-black uppercase tracking-widest"
                              style={{ color: theme.accent, opacity: 0.5 }}
                            >
                              Phone
                            </div>
                            <div
                              className="mt-1 break-words font-semibold"
                              style={{ color: theme.accent }}
                            >
                              {camp.contactPhone || "No phone yet"}
                            </div>
                          </div>

                          <div
                            className="rounded-xl border p-3 sm:col-span-2"
                            style={{
                              borderColor: theme.borderColor,
                              backgroundColor: theme.pageBg,
                            }}
                          >
                            <div
                              className="text-[9px] font-black uppercase tracking-widest"
                              style={{ color: theme.accent, opacity: 0.5 }}
                            >
                              Website
                            </div>
                            <div
                              className="mt-1 break-all font-semibold"
                              style={{ color: theme.accent }}
                            >
                              {camp.contactWebsite || "No website yet"}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                          <button
                            onClick={shareContact}
                            className="flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-[10px] font-black uppercase tracking-widest"
                            style={cardStyle}
                            type="button"
                            title="Share contacts"
                          >
                            <Share2 size={14} />
                            Share
                          </button>

                          <a
                            href={
                              vcardUrl ||
                              `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardText)}`
                            }
                            download={`${(camp.contactName || "contact").replace(/\s+/g, "_")}.vcf`}
                            className="flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-[10px] font-black uppercase tracking-widest"
                            style={cardStyle}
                            title="Download contact"
                          >
                            <Download size={14} />
                            Download
                          </a>

                          <button
                            onClick={saveContact}
                            className="flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-[10px] font-black uppercase tracking-widest"
                            style={cardStyle}
                            type="button"
                            title="Save contacts"
                          >
                            <Contact size={14} />
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CompactPanel>
              )}

              {visibleBlocks.contactCard && (
                <CompactPanel
                  title="Contact Card (Edit)"
                  subtitle="Edit fields (used in the VCF)"
                  defaultOpen={false}
                  style={blockCardStyle("contactCard")}
                  headerStyle={headerStyle}
                >
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {contactFields.map((f) => (
                      <input
                        key={f.k}
                        className="rounded-xl border bg-transparent p-3 text-xs font-semibold outline-none"
                        style={cardStyle}
                        value={camp[f.k]}
                        onChange={(e) => updateField(f.k, e.target.value)}
                        placeholder={f.ph}
                      />
                    ))}
                    <input
                      className="rounded-xl border bg-transparent p-3 text-xs font-semibold outline-none md:col-span-2"
                      style={cardStyle}
                      value={camp.contactEmail}
                      onChange={(e) =>
                        updateField("contactEmail", e.target.value)
                      }
                      placeholder="Email"
                    />
                    <input
                      className="rounded-xl border bg-transparent p-3 text-xs font-semibold outline-none md:col-span-2"
                      style={cardStyle}
                      value={camp.contactWebsite}
                      onChange={(e) =>
                        updateField("contactWebsite", e.target.value)
                      }
                      placeholder="Website"
                    />
                  </div>
                </CompactPanel>
              )}
            </div>
          </div>

          <div className="h-3" />
        </div>
      </main>
    </div>
  );
}
