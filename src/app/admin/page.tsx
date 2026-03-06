"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Save,
  Camera,
  Check,
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

type Camp = {
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

  website: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;

  roomTypeLabels: Record<RoomKey, string>;
  roomPhotos: Record<RoomKey, string[]>;

  contactHeadline: string;
  contactSubcopy: string;
  contactBullet1: string;
  contactBullet2: string;
  contactBullet3: string;
  contactCta: string;
  contactDisclaimer: string;

  contactName: string;
  contactTitle: string;
  contactCompany: string;
  contactEmail: string;
  contactPhone: string;
  contactWebsite: string;

  reservationEmail: string;
  marketingEmail: string;
  salesEmail: string;
  companyPhone: string;
  companyWhatsApp: string;

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

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const DEFAULT_TA_LOGO =
  "https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg";

const makeNewCamp = (): Camp => ({
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

  tradeProfileLabel: "Nyumbani-Collections",
  tradeProfileSub: "Trade profile.",

  locationLabel: "Location name here",
  mapLink: "https://maps.google.com",

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

  contactHeadline: "Get rates, availability and trade support in one reply.",
  contactSubcopy:
    "Leave your details and we’ll send a trade-ready fact sheet and quick quote.",
  contactBullet1: "Agent-ready proposal + net rates",
  contactBullet2: "Seasonality guidance + offers",
  contactBullet3: "Fast response from reservations",
  contactCta: "Request Trade Pack",
  contactDisclaimer:
    "By submitting, you agree to be contacted by our reservations team.",

  contactName: "Reservations",
  contactTitle: "Trade Desk",
  contactCompany: "Nyumbani Collections",
  contactEmail: "trade@yourcompany.com",
  contactPhone: "+255000000000",
  contactWebsite: "https://yourwebsite.com",

  reservationEmail: "reservations@yourcompany.com",
  marketingEmail: "marketing@yourcompany.com",
  salesEmail: "sales@yourcompany.com",
  companyPhone: "+255000000000",
  companyWhatsApp: "+255000000000",

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
      className="border rounded-2xl overflow-hidden shadow-[0_14px_34px_rgba(0,0,0,0.08)]"
      style={style}
    >
      <div
        className="w-full px-4 py-3 flex items-center justify-between gap-3"
        style={headerStyle}
      >
        <div className="text-left min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.28em] opacity-80">
            {title}
          </div>
          {subtitle ? (
            <div className="text-xs font-semibold opacity-75 mt-0.5 truncate">
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          className="flex items-center gap-2 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {right}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            className="p-2 rounded-xl border shrink-0"
            style={{
              borderColor: (style?.borderColor as string) || "rgba(0,0,0,0.12)",
              backgroundColor: "rgba(255,255,255,0.65)",
            }}
            aria-expanded={open}
            title={open ? "Collapse" : "Expand"}
          >
            {open ? (
              <ChevronUp size={16} className="opacity-70" />
            ) : (
              <ChevronDown size={16} className="opacity-70" />
            )}
          </button>
        </div>
      </div>

      <div className={open ? "block" : "hidden"}>
        <div className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
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
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest"
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
              className="w-2.5 h-2.5 rounded-full border cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const shift = (e as any).shiftKey;
                onChange(shift ? idx - 0.5 : idx);
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
      <div
        className="text-[11px] font-black tabular-nums"
        style={{ opacity: 0.85 }}
      >
        {value.toFixed(1)}
      </div>
      {mode === "stars" ? renderStars() : renderDots()}
    </div>
  );
}

export default function RestorationSafariAdmin() {
  const [isPreview, setIsPreview] = useState(false);
  const [selectedCampIndex, setSelectedCampIndex] = useState(0);

  const [theme, setTheme] = useState({
    pageBg: "#F4F2EE",
    blockBg: "#FFFFFF",
    accent: "#2D3436",
    highlight: "#9E5A24",
    borderColor: "#D6CFC5",
  });

  const [blockColors, setBlockColors] = useState({
    header: "#F7EFE5",
    tripadvisor: "#EAF7EE",
    tradeDetails: "#F7EFE5",
    matrix: "#F6F3EE",
    inclusions: "#EEF8F0",
    exclusions: "#FCEEEE",
    experiences: "#F3EEFB",
    offers: "#F8EFE7",
    terms: "#EFF3F7",
    contactExchange: "#EEF4FF",
    contactCard: "#ECF7F5",
    downloadables: "#FBF5E8",
  });

  const [visibleBlocks, setVisibleBlocks] = useState({
    header: true,
    tripadvisor: true,
    tradeDetails: true,
    matrix: true,
    inclusions: true,
    exclusions: true,
    experiences: true,
    offers: true,
    terms: true,
    contactExchange: true,
    contactCard: true,
    downloadables: true,
    hero: false,
  });

  const toggleBlock = (key: keyof typeof visibleBlocks) => {
    setVisibleBlocks((p) => ({ ...p, [key]: !p[key] }));
  };

  const [portfolio, setPortfolio] = useState<Camp[]>([
    {
      ...makeNewCamp(),
      name: "Nyumbani Serengeti",
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
      website: "https://example.com",
      facebookUrl: "https://facebook.com/",
      instagramUrl: "https://instagram.com/nyumbani.collections",
      tiktokUrl: "https://tiktok.com/",
      youtubeUrl: "https://youtube.com/",
      contactName: "Nyumbani Reservations",
      contactTitle: "Trade Desk",
      contactCompany: "Nyumbani Collections",
      contactEmail: "trade@nyumbani.example",
      contactPhone: "+255000000000",
      contactWebsite: "https://example.com",
      reservationEmail: "reservations@nyumbani.example",
      marketingEmail: "marketing@nyumbani.example",
      salesEmail: "sales@nyumbani.example",
      companyPhone: "+255000000000",
      companyWhatsApp: "+255000000000",
      enquiryEmail: "trade@nyumbani.example",
      enquiryWhatsApp: "+255000000000",
      taLink: "https://www.tripadvisor.com/",
      taRating: 4.5,
    },
  ]);

  const camp = portfolio[selectedCampIndex] ?? portfolio[0];

  const profileSlug =
    camp.name
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") || "new-camp";

  const updateField = <K extends keyof Camp>(field: K, value: Camp[K]) => {
    setPortfolio((prev) => {
      const next = [...prev];
      next[selectedCampIndex] = { ...next[selectedCampIndex], [field]: value };
      return next;
    });
  };

  const updateNested = (updater: (draft: Camp) => Camp) => {
    setPortfolio((prev) => {
      const next = [...prev];
      next[selectedCampIndex] = updater(next[selectedCampIndex]);
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
    (typeof camp.family === "number" ? camp.family : 0) +
    (typeof camp.double === "number" ? camp.double : 0) +
    (typeof camp.single === "number" ? camp.single : 0);

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.blockBg,
    borderColor: theme.borderColor,
    color: theme.accent,
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: theme.blockBg,
    color: theme.accent,
  };

  const accentText: React.CSSProperties = { color: theme.accent };
  const highlightText: React.CSSProperties = { color: theme.highlight };
  const highlightBg: React.CSSProperties = { backgroundColor: theme.highlight };

  const blockCardStyle = (
    key: keyof typeof blockColors,
  ): React.CSSProperties => ({
    backgroundColor: blockColors[key],
    borderColor: theme.accent,
    color: theme.accent,
    borderWidth: 2,
    boxShadow: `0 12px 28px rgba(0,0,0,0.08)`,
  });

  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(file);
    });

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
    window.open(camp.taLink, "_blank", "noopener,noreferrer");
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
      camp.companyPhone ? `TEL;TYPE=WORK,VOICE:${esc(camp.companyPhone)}` : "",
      camp.companyWhatsApp
        ? `TEL;TYPE=CELL,WORK:${esc(camp.companyWhatsApp)}`
        : "",
      camp.reservationEmail
        ? `EMAIL;TYPE=INTERNET,WORK:${esc(camp.reservationEmail)}`
        : "",
      camp.marketingEmail
        ? `EMAIL;TYPE=INTERNET,WORK:${esc(camp.marketingEmail)}`
        : "",
      camp.salesEmail
        ? `EMAIL;TYPE=INTERNET,WORK:${esc(camp.salesEmail)}`
        : "",
      camp.contactWebsite ? `URL:${esc(camp.contactWebsite)}` : "",
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");
  }, [
    camp.contactName,
    camp.contactCompany,
    camp.contactTitle,
    camp.companyPhone,
    camp.companyWhatsApp,
    camp.reservationEmail,
    camp.marketingEmail,
    camp.salesEmail,
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

  const shareContact = async () => {
    try {
      const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8" });
      const file = new File([blob], "contact.vcf", { type: "text/vcard" });
      // @ts-ignore
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        // @ts-ignore
        await navigator.share({
          title: camp.contactName,
          text: "Contact card",
          files: [file],
        });
      } else if (vcardUrl) {
        window.open(vcardUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      if (vcardUrl) window.open(vcardUrl, "_blank", "noopener,noreferrer");
    }
  };

  const saveContact = () => {
    const a = document.createElement("a");
    a.href = vcardUrl || `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardText)}`;
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

    const emails = lines
      .filter((l) => l.toUpperCase().includes("EMAIL"))
      .map((l) => l.split(":").slice(1).join(":").trim())
      .filter(Boolean);

    const tels = lines
      .filter((l) => l.toUpperCase().includes("TEL"))
      .map((l) => l.split(":").slice(1).join(":").trim())
      .filter(Boolean);

    const urlLine = lines.find((l) => l.toUpperCase().startsWith("URL"));
    const url = urlLine ? urlLine.split(":").slice(1).join(":").trim() : "";

    return {
      contactName: fn,
      contactCompany: org,
      contactTitle: title,
      reservationEmail: emails[0] || "",
      marketingEmail: emails[1] || "",
      salesEmail: emails[2] || "",
      companyPhone: tels[0] || "",
      companyWhatsApp: tels[1] || "",
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
      reservationEmail: parsed.reservationEmail || c.reservationEmail,
      marketingEmail: parsed.marketingEmail || c.marketingEmail,
      salesEmail: parsed.salesEmail || c.salesEmail,
      companyPhone: parsed.companyPhone || c.companyPhone,
      companyWhatsApp: parsed.companyWhatsApp || c.companyWhatsApp,
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
    window.open(d.url, "_blank", "noopener,noreferrer");
  };

  const updateListItem = (key: keyof Camp, idx: number, value: string) => {
    setPortfolio((prev) => {
      const next = [...prev];
      const current = { ...next[selectedCampIndex] } as any;
      const list = [...current[key]];
      list[idx] = value;
      current[key] = list;
      next[selectedCampIndex] = current;
      return next;
    });
  };

  const addListItem = (key: keyof Camp) => {
    setPortfolio((prev) => {
      const next = [...prev];
      const current = { ...next[selectedCampIndex] } as any;
      current[key] = [...current[key], "New Item"];
      next[selectedCampIndex] = current;
      return next;
    });
  };

  const removeListItem = (key: keyof Camp, idx: number) => {
    setPortfolio((prev) => {
      const next = [...prev];
      const current = { ...next[selectedCampIndex] } as any;
      current[key] = current[key].filter((_: string, i: number) => i !== idx);
      next[selectedCampIndex] = current;
      return next;
    });
  };

  const addCamp = () => {
    setPortfolio((prev) => [...prev, makeNewCamp()]);
    setSelectedCampIndex((prev) => prev + 1);
  };

  const deleteCamp = () => {
    setPortfolio((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== selectedCampIndex);
    });
    setSelectedCampIndex((prev) => Math.max(0, prev - 1));
  };

  const [contactExchange, setContactExchange] = useState({
    fullName: "",
    agency: "",
    email: "",
    phone: "",
    message: "",
  });

  const sendEmailDirect = async () => {
    const to = (camp.enquiryEmail || "").trim();

    if (!to) {
      alert("Please set a company enquiry email first.");
      return;
    }

    try {
      const res = await fetch("/api/contact-exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          subject: camp.enquirySubject || "Trade Request",
          fullName: contactExchange.fullName,
          agency: contactExchange.agency,
          email: contactExchange.email,
          phone: contactExchange.phone,
          message: contactExchange.message,
          property: camp.name,
          propertyClass: camp.class,
          location: camp.locationLabel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Email failed to send.");
        return;
      }

      alert("Email sent successfully.");
      setContactExchange({
        fullName: "",
        agency: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch {
      alert("Email failed to send.");
    }
  };

  const openWhatsApp = (payload: string) => {
    const digits = (camp.enquiryWhatsApp || "").replace(/[^\d]/g, "");
    if (!digits) return;
    const text = encodeURIComponent(payload);
    window.open(`https://wa.me/${digits}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const contactPayload = useMemo(() => {
    const lines = [
      `Property: ${camp.name}`,
      `Class: ${camp.class}`,
      `Location: ${camp.locationLabel}`,
      "",
      `Full name: ${contactExchange.fullName}`,
      `Agency: ${contactExchange.agency}`,
      `Email: ${contactExchange.email}`,
      `Phone/WhatsApp: ${contactExchange.phone}`,
      "",
      `Message:`,
      contactExchange.message,
      "",
      `Sent via: Contact Exchange`,
    ];
    return lines.join("\n");
  }, [contactExchange, camp.name, camp.class, camp.locationLabel]);

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
            className="w-full max-w-5xl rounded-3xl overflow-hidden border shadow-2xl"
            style={{ backgroundColor: theme.blockBg, borderColor: theme.borderColor }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: theme.borderColor }}
            >
              <div
                className="text-[11px] font-black uppercase tracking-widest"
                style={{ color: theme.accent, opacity: 0.8 }}
              >
                {photoModal.title || "Preview"}
              </div>
              <button
                onClick={closePhoto}
                className="p-2 rounded-xl border"
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
                className="w-full h-[78vh] md:h-[80vh] flex items-center justify-center rounded-2xl border overflow-hidden"
                style={{ borderColor: theme.borderColor }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoModal.src}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
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
          <div className="w-full max-w-lg rounded-3xl border p-4" style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <div
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ opacity: 0.75 }}
              >
                Paste Logo Image URL
              </div>
              <button
                type="button"
                className="p-2 rounded-xl border"
                style={cardStyle}
                onClick={() => setTaLogoPromptOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <input
              className="w-full p-3 rounded-2xl border outline-none text-sm font-semibold bg-transparent"
              style={cardStyle}
              value={taLogoUrlDraft}
              onChange={(e) => setTaLogoUrlDraft(e.target.value)}
              placeholder="https://..."
            />

            <div className="flex gap-2 mt-3">
              <button
                type="button"
                className="flex-1 py-3 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest"
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
                className="py-3 px-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest"
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
          className="w-72 fixed h-screen top-0 left-0 z-[100] p-4 flex flex-col border-r"
          style={{
            backgroundColor: theme.blockBg,
            borderColor: theme.borderColor,
            color: theme.accent,
          }}
        >
          <div className="mb-3 space-y-3">
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ opacity: 0.55 }}
              >
                Restoration Hub
              </span>

              <button
                onClick={() => setIsPreview(true)}
                className="p-2 rounded-lg border"
                style={{
                  borderColor: theme.borderColor,
                  backgroundColor: theme.blockBg,
                }}
                type="button"
                title="Open internal preview"
              >
                <Eye size={14} style={{ color: theme.accent }} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                className="py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest text-center"
                style={{
                  borderColor: theme.borderColor,
                  color: theme.accent,
                  backgroundColor: theme.blockBg,
                }}
              >
                Home
              </Link>

              <Link
                href="/directory"
                className="py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest text-center"
                style={{
                  borderColor: theme.borderColor,
                  color: theme.accent,
                  backgroundColor: theme.blockBg,
                }}
              >
                Directory
              </Link>

              <a
                href={`/profiles/${profileSlug}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest text-center"
                style={{
                  borderColor: theme.borderColor,
                  color: theme.accent,
                  backgroundColor: theme.blockBg,
                }}
              >
                Public Profile
              </a>

              <button
                onClick={() => setIsPreview(true)}
                className="py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest"
                style={{
                  borderColor: theme.borderColor,
                  color: theme.accent,
                  backgroundColor: theme.blockBg,
                }}
                type="button"
              >
                Live Preview
              </button>
            </div>
          </div>

          <div className="mb-4">
            <p
              className="text-[9px] font-bold uppercase mb-2 tracking-[0.2em]"
              style={{ opacity: 0.5 }}
            >
              Camps
            </p>

            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={addCamp}
                  className="flex-1 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
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
                  className="py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest"
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
                    key={`${c.name}-${i}`}
                    onClick={() => setSelectedCampIndex(i)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all"
                    style={{
                      backgroundColor: i === selectedCampIndex ? theme.blockBg : "transparent",
                      border:
                        i === selectedCampIndex
                          ? `1px solid ${theme.borderColor}`
                          : "1px solid transparent",
                    }}
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 size={14} style={{ color: theme.accent, opacity: 0.55 }} />
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
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            <div>
              <p
                className="text-[9px] font-bold uppercase mb-2 tracking-[0.2em]"
                style={{ opacity: 0.5 }}
              >
                View Toggles
              </p>
              <div className="space-y-1">
                {Object.keys(visibleBlocks).map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleBlock(key as any)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:opacity-90"
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
                      <EyeOff size={12} style={{ color: theme.accent, opacity: 0.3 }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="pt-4 border-t space-y-2"
              style={{ borderColor: theme.borderColor }}
            >
              <p className="text-[9px] font-bold uppercase" style={{ opacity: 0.5 }}>
                Global Colors
              </p>
              {Object.entries(theme).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span
                    className="text-[9px] uppercase font-medium"
                    style={{ color: theme.accent, opacity: 0.85 }}
                  >
                    {k}
                  </span>
                  <input
                    type="color"
                    value={v}
                    onChange={(e) => setTheme((t) => ({ ...t, [k]: e.target.value }))}
                    className="w-4 h-4 rounded-full cursor-pointer border-none"
                  />
                </div>
              ))}
            </div>

            <div
              className="pt-4 border-t space-y-2"
              style={{ borderColor: theme.borderColor }}
            >
              <p className="text-[9px] font-bold uppercase" style={{ opacity: 0.5 }}>
                Block Backgrounds
              </p>
              {Object.entries(blockColors).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-2">
                  <span
                    className="text-[9px] uppercase font-medium"
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
                    className="w-5 h-5 rounded-full cursor-pointer border-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className="mt-4 w-full py-3 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
            style={highlightBg}
            type="button"
          >
            <Save size={14} className="inline mr-2" /> Save Changes
          </button>
        </aside>
      )}

      <main className={`flex-1 transition-all ${!isPreview ? "ml-72" : "ml-0"}`}>
        {isPreview && (
          <div className="fixed top-4 right-4 z-[200] flex flex-wrap gap-2">
            <Link
              href="/"
              className="bg-white text-slate-900 px-4 py-2 rounded-full text-[10px] font-black uppercase shadow-2xl"
            >
              Home
            </Link>

            <Link
              href="/directory"
              className="bg-white text-slate-900 px-4 py-2 rounded-full text-[10px] font-black uppercase shadow-2xl"
            >
              Directory
            </Link>

            <a
              href={`/profiles/${profileSlug}`}
              target="_blank"
              rel="noreferrer"
              className="bg-white text-slate-900 px-4 py-2 rounded-full text-[10px] font-black uppercase shadow-2xl"
            >
              Public Profile
            </a>

            <button
              onClick={() => setIsPreview(false)}
              className="bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-2xl"
              type="button"
            >
              <Monitor size={14} /> Open Admin
            </button>
          </div>
        )}

        {visibleBlocks.header && (
          <div className="max-w-6xl mx-auto px-6 pt-6">
            <div
              className="relative border rounded-2xl px-4 py-4"
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
                  className="w-20 h-14 md:w-28 md:h-16 rounded-2xl border overflow-hidden flex items-center justify-center cursor-pointer select-none"
                  style={{ borderColor: theme.accent, backgroundColor: theme.pageBg }}
                  onDoubleClick={() => logoFileRef.current?.click()}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    logoFileRef.current?.click();
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {camp.logoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={camp.logoImage}
                      alt="Logo"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <ImageIcon size={18} style={{ color: theme.accent, opacity: 0.5 }} />
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
                    borderColor={theme.accent}
                    bg={theme.blockBg}
                    color={theme.accent}
                  />
                )}
              </div>

              <div className="flex flex-col items-center justify-center">
                <div
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full border overflow-hidden flex items-center justify-center cursor-pointer select-none"
                  style={{ borderColor: theme.accent, backgroundColor: theme.pageBg }}
                  onDoubleClick={() => coverFileRef.current?.click()}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    coverFileRef.current?.click();
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {camp.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={camp.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Camera size={18} style={{ color: theme.accent, opacity: 0.5 }} />
                      <span
                        className="text-[8px] font-black uppercase tracking-widest"
                        style={{ color: theme.accent, opacity: 0.45 }}
                      >
                        Cover
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-center space-y-1 w-full max-w-2xl">
                  <div
                    className="text-[10px] font-black uppercase tracking-[0.25em]"
                    style={{ color: theme.accent, opacity: 0.75 }}
                  >
                    <input
                      className="bg-transparent outline-none text-center w-full"
                      value={`${camp.tradeProfileLabel} ${camp.tradeProfileSub}`}
                      onChange={(e) => updateField("tradeProfileLabel", e.target.value)}
                      style={{ color: theme.accent }}
                    />
                  </div>

                  <div
                    className="text-base md:text-lg font-black italic"
                    style={{ color: theme.accent, opacity: 0.95 }}
                  >
                    <input
                      className="bg-transparent outline-none text-center w-full"
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
                      className="bg-transparent outline-none text-center w-full"
                      value={camp.class}
                      onChange={(e) => updateField("class", e.target.value)}
                      style={{ color: theme.accent }}
                    />
                  </div>
                </div>

                <div
                  className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-widest px-2"
                  style={{ color: theme.accent, opacity: 0.8 }}
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={14} style={highlightText} />
                    <input
                      className="bg-transparent outline-none font-black text-center w-[240px] max-w-[70vw]"
                      value={camp.locationLabel}
                      onChange={(e) => updateField("locationLabel", e.target.value)}
                      style={accentText}
                    />
                  </div>

                  <div
                    className="hidden sm:block h-4 w-px"
                    style={{ backgroundColor: theme.accent }}
                  />

                  <div>
                    Rooms:{" "}
                    <input
                      className="w-12 bg-transparent outline-none font-black text-center"
                      value={camp.rooms}
                      onChange={(e) => updateField("rooms", numDraft(e.target.value))}
                      style={accentText}
                    />
                    <span style={{ opacity: 0.55 }}> • Units:</span>{" "}
                    <span style={{ opacity: 0.95 }}>{totalUnits}</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {[
                    {
                      key: "facebookUrl",
                      icon: <Facebook size={14} />,
                      label: "Facebook",
                    },
                    {
                      key: "instagramUrl",
                      icon: <Instagram size={14} />,
                      label: "Instagram",
                    },
                    { key: "tiktokUrl", icon: <Music2 size={14} />, label: "TikTok" },
                    { key: "youtubeUrl", icon: <Youtube size={14} />, label: "YouTube" },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                      style={{
                        borderColor: theme.accent,
                        backgroundColor: theme.blockBg,
                        color: theme.accent,
                      }}
                    >
                      <span style={{ color: theme.highlight }}>{item.icon}</span>
                      <input
                        className="bg-transparent outline-none text-[10px] font-black w-36 md:w-44"
                        value={(camp as any)[item.key]}
                        onChange={(e) => updateField(item.key as any, e.target.value)}
                        placeholder={item.label}
                        style={{ color: theme.accent }}
                      />
                    </div>
                  ))}
                </div>

                {visibleBlocks.tripadvisor && (
                  <div
                    className="mt-3 w-full max-w-3xl border rounded-2xl px-4 py-3 cursor-pointer"
                    style={{
                      backgroundColor: blockColors.tripadvisor,
                      borderColor: theme.accent,
                      borderWidth: 2,
                      boxShadow: `0 12px 28px rgba(0,0,0,0.08)`,
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
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <div
                          className="w-32 h-10 rounded-xl border overflow-hidden flex items-center justify-center"
                          style={{
                            borderColor: theme.accent,
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
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={camp.taLogoUrl || DEFAULT_TA_LOGO}
                            alt="Tripadvisor"
                            className="w-full h-full object-contain p-2"
                          />
                        </div>

                        <button
                          type="button"
                          className="px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest"
                          style={{
                            borderColor: theme.accent,
                            backgroundColor: theme.blockBg,
                            color: theme.accent,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setTaLogoUrlDraft(camp.taLogoUrl || DEFAULT_TA_LOGO);
                            setTaLogoPromptOpen(true);
                          }}
                        >
                          Paste URL
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={camp.taStyle}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateField("taStyle", e.target.value as any)}
                          className="px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest bg-transparent outline-none"
                          style={{
                            borderColor: theme.accent,
                            color: theme.accent,
                            backgroundColor: theme.blockBg,
                          }}
                        >
                          <option value="dots">Dots</option>
                          <option value="stars">Stars</option>
                        </select>

                        <div onClick={(e) => e.stopPropagation()}>
                          <RatingPips
                            value={typeof camp.taRating === "number" ? camp.taRating : 0}
                            onChange={(v) => updateField("taRating", v)}
                            highlight="#34A853"
                            mode={camp.taStyle}
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className="mt-2 flex flex-wrap gap-2 items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="text-[9px] font-black uppercase tracking-widest"
                        style={{ color: theme.accent, opacity: 0.55 }}
                      >
                        Tripadvisor Link
                      </div>
                      <input
                        className="flex-1 bg-transparent outline-none text-[10px] font-semibold"
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

        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-7 space-y-3">
              {visibleBlocks.tradeDetails && (
                <CompactPanel
                  title="Trade Profile Details"
                  subtitle="Vibe + links"
                  defaultOpen={false}
                  style={blockCardStyle("tradeDetails")}
                  headerStyle={{
                    ...headerStyle,
                    backgroundColor: blockColors.tradeDetails,
                  }}
                >
                  <div className="grid md:grid-cols-2 gap-2">
                    <div
                      className="border rounded-xl p-3"
                      style={{ borderColor: theme.accent }}
                    >
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-55">
                        Map link
                      </div>
                      <input
                        className="mt-1 w-full bg-transparent outline-none text-sm font-black"
                        value={camp.mapLink}
                        onChange={(e) => updateField("mapLink", e.target.value)}
                        style={accentText}
                      />
                    </div>

                    <div
                      className="border rounded-xl p-3"
                      style={{ borderColor: theme.accent }}
                    >
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-55">
                        Website
                      </div>
                      <input
                        className="mt-1 w-full bg-transparent outline-none text-sm font-black"
                        value={camp.website}
                        onChange={(e) => updateField("website", e.target.value)}
                        style={accentText}
                      />
                    </div>

                    <div
                      className="border rounded-xl p-3 md:col-span-2"
                      style={{ borderColor: theme.accent }}
                    >
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-55">
                        Vibe
                      </div>
                      <textarea
                        className="mt-1 w-full bg-transparent outline-none text-sm font-semibold resize-none"
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
                  title="Inventory + Room Photos"
                  subtitle="Counts + multi-photo + responsive preview"
                  defaultOpen={true}
                  style={blockCardStyle("matrix")}
                  headerStyle={{ ...headerStyle, backgroundColor: blockColors.matrix }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(["family", "double", "single"] as const).map((type) => (
                      <div
                        key={type}
                        className="border rounded-xl p-3"
                        style={{ borderColor: theme.accent }}
                      >
                        <input
                          className="text-[10px] font-black uppercase outline-none bg-transparent w-full"
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

                        <div className="flex items-center justify-between mt-2">
                          <input
                            inputMode="numeric"
                            className="text-3xl font-black italic outline-none bg-transparent w-16"
                            value={camp[type]}
                            onChange={(e) => updateField(type, numDraft(e.target.value) as any)}
                            style={{ color: theme.accent, opacity: 0.95 }}
                          />
                          <label
                            className="cursor-pointer inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
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

                        <div className="grid grid-cols-4 gap-1.5 mt-3">
                          {(camp.roomPhotos[type] ?? []).slice(0, 12).map((src, i) => (
                            <button
                              key={i}
                              className="relative rounded-lg overflow-hidden border"
                              style={{ borderColor: theme.accent }}
                              onClick={() =>
                                openPhoto(src, `${camp.roomTypeLabels[type]} — Photo ${i + 1}`)
                              }
                              type="button"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={src}
                                alt={`${type}-${i}`}
                                className="w-full aspect-square object-cover"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeRoomPhoto(type, i);
                                }}
                                className="absolute top-1 right-1 p-1 rounded-md"
                                style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
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

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div
                      className="border rounded-xl p-3"
                      style={{ borderColor: theme.accent }}
                    >
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-55">
                        Total rooms
                      </div>
                      <input
                        className="mt-1 w-full bg-transparent outline-none text-sm font-black"
                        value={camp.rooms}
                        onChange={(e) => updateField("rooms", numDraft(e.target.value))}
                        style={accentText}
                      />
                    </div>
                    <div
                      className="border rounded-xl p-3"
                      style={{ borderColor: theme.accent }}
                    >
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
                </CompactPanel>
              )}

              <div className="grid md:grid-cols-2 gap-3">
                {visibleBlocks.inclusions && (
                  <CompactPanel
                    title="Inclusions"
                    defaultOpen={false}
                    style={blockCardStyle("inclusions")}
                    headerStyle={{
                      ...headerStyle,
                      backgroundColor: blockColors.inclusions,
                    }}
                    right={
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addListItem("inclusions");
                        }}
                        type="button"
                        title="Add"
                        className="p-2 rounded-xl border shrink-0"
                        style={{
                          borderColor: theme.accent,
                          backgroundColor: "rgba(255,255,255,0.65)",
                        }}
                      >
                        <Plus size={14} style={highlightText} />
                      </button>
                    }
                  >
                    <div className="space-y-2">
                      {camp.inclusions.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 group min-w-0">
                          <Check size={12} className="text-green-500 shrink-0" />
                          <input
                            className="flex-1 min-w-0 bg-transparent outline-none text-sm font-semibold"
                            value={item}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateListItem("inclusions", i, e.target.value)}
                            style={{ color: theme.accent, opacity: 0.9 }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeListItem("inclusions", i);
                            }}
                            className="opacity-0 group-hover:opacity-100 shrink-0"
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
                    headerStyle={{
                      ...headerStyle,
                      backgroundColor: blockColors.exclusions,
                    }}
                    right={
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addListItem("exclusions");
                        }}
                        type="button"
                        title="Add"
                        className="p-2 rounded-xl border shrink-0"
                        style={{
                          borderColor: theme.accent,
                          backgroundColor: "rgba(255,255,255,0.65)",
                        }}
                      >
                        <Plus size={14} style={highlightText} />
                      </button>
                    }
                  >
                    <div className="space-y-2">
                      {camp.exclusions.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 group min-w-0">
                          <Ban
                            size={12}
                            style={{ color: theme.accent, opacity: 0.5 }}
                            className="shrink-0"
                          />
                          <input
                            className="flex-1 min-w-0 bg-transparent outline-none text-sm font-semibold italic"
                            value={item}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateListItem("exclusions", i, e.target.value)}
                            style={{ color: theme.accent, opacity: 0.85 }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeListItem("exclusions", i);
                            }}
                            className="opacity-0 group-hover:opacity-100 shrink-0"
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
                  headerStyle={{
                    ...headerStyle,
                    backgroundColor: blockColors.experiences,
                  }}
                >
                  <div className="grid md:grid-cols-2 gap-3">
                    <div
                      className="border rounded-xl p-3"
                      style={{ borderColor: theme.accent }}
                    >
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
                          className="p-2 rounded-xl border"
                          style={{
                            borderColor: theme.accent,
                            backgroundColor: "rgba(255,255,255,0.65)",
                          }}
                        >
                          <Plus size={14} style={highlightText} />
                        </button>
                      </div>
                      <div className="space-y-2 mt-2">
                        {camp.freeActivities.map((act, i) => (
                          <div key={i} className="flex items-center gap-2 group">
                            <Compass size={12} style={highlightText} />
                            <input
                              className="w-full bg-transparent outline-none text-sm font-semibold uppercase tracking-tight"
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
                      className="border rounded-xl p-3"
                      style={{
                        borderColor: theme.accent,
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
                          className="p-2 rounded-xl border"
                          style={{
                            borderColor: "rgba(255,255,255,0.25)",
                            backgroundColor: "rgba(255,255,255,0.06)",
                          }}
                        >
                          <Plus size={14} className="text-white/80" />
                        </button>
                      </div>
                      <div className="space-y-2 mt-2">
                        {camp.paidActivities.map((act, i) => (
                          <div key={i} className="flex items-center gap-2 group">
                            <MapPin size={12} className="text-white/60" />
                            <input
                              className="w-full bg-transparent outline-none text-sm font-semibold uppercase tracking-tight text-white"
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

              <div className="grid md:grid-cols-2 gap-3">
                {visibleBlocks.offers && (
                  <CompactPanel
                    title="Offer"
                    defaultOpen={false}
                    style={blockCardStyle("offers")}
                    headerStyle={{ ...headerStyle, backgroundColor: blockColors.offers }}
                  >
                    <div className="rounded-xl p-3 text-white" style={highlightBg}>
                      <div className="text-[9px] font-black uppercase tracking-[0.35em] text-white/70 mb-2">
                        Trade incentive
                      </div>
                      <textarea
                        className="bg-transparent w-full outline-none resize-none text-xl md:text-2xl font-black italic tracking-tight leading-snug"
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
                    headerStyle={{ ...headerStyle, backgroundColor: blockColors.terms }}
                  >
                    <textarea
                      className="w-full rounded-xl border p-3 text-sm font-semibold outline-none bg-transparent resize-none"
                      style={{ borderColor: theme.accent, color: theme.accent }}
                      rows={6}
                      value={camp.terms}
                      onChange={(e) => updateField("terms", e.target.value)}
                    />
                  </CompactPanel>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              {visibleBlocks.contactExchange && (
                <CompactPanel
                  title="Contact Exchange"
                  subtitle="Send by email or WhatsApp"
                  defaultOpen={true}
                  style={blockCardStyle("contactExchange")}
                  headerStyle={{
                    ...headerStyle,
                    backgroundColor: blockColors.contactExchange,
                  }}
                >
                  <div
                    className="border rounded-xl p-3"
                    style={{ borderColor: theme.accent }}
                  >
                    <textarea
                      className="w-full bg-transparent outline-none resize-none text-lg font-black italic tracking-tight leading-snug"
                      rows={2}
                      value={camp.contactHeadline}
                      onChange={(e) => updateField("contactHeadline", e.target.value)}
                      style={{ color: theme.accent, opacity: 0.95 }}
                    />
                    <textarea
                      className="mt-2 w-full bg-transparent outline-none resize-none text-sm font-semibold leading-relaxed"
                      rows={2}
                      value={camp.contactSubcopy}
                      onChange={(e) => updateField("contactSubcopy", e.target.value)}
                      style={{ color: theme.accent, opacity: 0.75 }}
                    />

                    <div className="grid gap-2 mt-2">
                      {(
                        ["contactBullet1", "contactBullet2", "contactBullet3"] as const
                      ).map((k) => (
                        <div key={k} className="flex items-center gap-2">
                          <Check size={12} className="text-green-500" />
                          <input
                            className="w-full bg-transparent outline-none text-[11px] font-black uppercase tracking-tight"
                            value={camp[k]}
                            onChange={(e) => updateField(k, e.target.value as any)}
                            style={{ color: theme.accent, opacity: 0.9 }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="border rounded-xl p-3 mt-3"
                    style={{ borderColor: theme.accent }}
                  >
                    <div
                      className="text-[10px] font-black uppercase tracking-widest opacity-65"
                      style={{ color: theme.accent }}
                    >
                      Enquiry form
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <input
                        className="w-full p-3 rounded-xl border text-xs font-semibold outline-none bg-transparent"
                        style={{ ...cardStyle, borderColor: theme.accent }}
                        placeholder="Full name"
                        value={contactExchange.fullName}
                        onChange={(e) =>
                          setContactExchange((p) => ({ ...p, fullName: e.target.value }))
                        }
                      />
                      <input
                        className="w-full p-3 rounded-xl border text-xs font-semibold outline-none bg-transparent"
                        style={{ ...cardStyle, borderColor: theme.accent }}
                        placeholder="Agency"
                        value={contactExchange.agency}
                        onChange={(e) =>
                          setContactExchange((p) => ({ ...p, agency: e.target.value }))
                        }
                      />
                      <input
                        className="w-full p-3 rounded-xl border text-xs font-semibold outline-none bg-transparent md:col-span-2"
                        style={{ ...cardStyle, borderColor: theme.accent }}
                        placeholder="Email"
                        value={contactExchange.email}
                        onChange={(e) =>
                          setContactExchange((p) => ({ ...p, email: e.target.value }))
                        }
                      />
                      <input
                        className="w-full p-3 rounded-xl border text-xs font-semibold outline-none bg-transparent md:col-span-2"
                        style={{ ...cardStyle, borderColor: theme.accent }}
                        placeholder="WhatsApp / Phone"
                        value={contactExchange.phone}
                        onChange={(e) =>
                          setContactExchange((p) => ({ ...p, phone: e.target.value }))
                        }
                      />
                      <textarea
                        className="w-full p-3 rounded-xl border text-xs font-semibold outline-none bg-transparent md:col-span-2 resize-none"
                        style={{ ...cardStyle, borderColor: theme.accent }}
                        placeholder="Message..."
                        rows={3}
                        value={contactExchange.message}
                        onChange={(e) =>
                          setContactExchange((p) => ({ ...p, message: e.target.value }))
                        }
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        className="flex-1 min-w-[180px] py-3 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
                        style={highlightBg}
                        type="button"
                        onClick={sendEmailDirect}
                      >
                        <Mail size={14} />
                        <span className="truncate">{camp.contactCta}</span>
                      </button>

                      <button
                        className="py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={{ ...cardStyle, borderColor: theme.accent }}
                        type="button"
                        onClick={() => openWhatsApp(contactPayload)}
                      >
                        <MessageCircle size={14} />
                        WhatsApp
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <ShieldAlert
                        size={14}
                        style={{ color: theme.accent, opacity: 0.35 }}
                      />
                      <input
                        className="text-[10px] font-semibold outline-none bg-transparent w-full"
                        value={camp.contactDisclaimer}
                        onChange={(e) =>
                          updateField("contactDisclaimer", e.target.value)
                        }
                        style={{ color: theme.accent, opacity: 0.65 }}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-2 mt-2">
                      <input
                        className="p-3 rounded-xl border outline-none text-xs font-semibold bg-transparent"
                        style={{ ...cardStyle, borderColor: theme.accent }}
                        value={camp.enquiryEmail}
                        onChange={(e) => updateField("enquiryEmail", e.target.value)}
                        placeholder="Company enquiry email"
                      />
                      <input
                        className="p-3 rounded-xl border outline-none text-xs font-semibold bg-transparent"
                        style={{ ...cardStyle, borderColor: theme.accent }}
                        value={camp.enquiryWhatsApp}
                        onChange={(e) => updateField("enquiryWhatsApp", e.target.value)}
                        placeholder="Company WhatsApp (intl)"
                      />
                      <input
                        className="p-3 rounded-xl border outline-none text-xs font-semibold bg-transparent md:col-span-2"
                        style={{ ...cardStyle, borderColor: theme.accent }}
                        value={camp.enquirySubject}
                        onChange={(e) => updateField("enquirySubject", e.target.value)}
                        placeholder="Email subject"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 items-start">
                    {visibleBlocks.downloadables && (
                      <div
                        className="border rounded-xl p-3 overflow-hidden min-w-0"
                        style={{
                          backgroundColor: blockColors.downloadables,
                          borderColor: theme.accent,
                          borderWidth: 2,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div
                            className="text-[10px] font-black uppercase tracking-widest opacity-70 min-w-0"
                            style={{ color: theme.accent }}
                          >
                            Downloads
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              className="p-2 rounded-xl border"
                              style={{ ...cardStyle, borderColor: theme.accent }}
                              onClick={addDownloadableLink}
                            >
                              <LinkIcon size={14} style={highlightText} />
                            </button>

                            <button
                              type="button"
                              className="p-2 rounded-xl border"
                              style={{ ...cardStyle, borderColor: theme.accent }}
                              onClick={() => downloadableFileRef.current?.click()}
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

                        <div className="mt-2 space-y-2 overflow-hidden">
                          {(camp.downloadables ?? []).slice(0, 6).map((d) => (
                            <div
                              key={d.id}
                              className="flex items-center gap-2 group min-w-0 overflow-hidden"
                            >
                              <button
                                type="button"
                                className="p-2 rounded-xl border shrink-0"
                                style={{ ...cardStyle, borderColor: theme.accent }}
                                onClick={() => openDownloadable(d)}
                              >
                                {d.type === "link" ? (
                                  <LinkIcon size={14} style={highlightText} />
                                ) : (
                                  <Download size={14} style={highlightText} />
                                )}
                              </button>

                              <input
                                className="flex-1 min-w-0 bg-transparent outline-none text-xs font-semibold truncate"
                                style={{ color: theme.accent, opacity: 0.9 }}
                                value={d.title}
                                onChange={(e) =>
                                  updateDownloadable(d.id, { title: e.target.value })
                                }
                              />

                              <button
                                type="button"
                                className="opacity-0 group-hover:opacity-100 p-2 rounded-xl border shrink-0"
                                style={{ ...cardStyle, borderColor: theme.accent }}
                                onClick={() => removeDownloadable(d.id)}
                              >
                                <Trash2 size={14} style={{ color: "#f87171" }} />
                              </button>
                            </div>
                          ))}

                          {(camp.downloadables ?? [])
                            .filter((d) => d.type === "link")
                            .slice(0, 2)
                            .map((d) => (
                              <div
                                key={`${d.id}-url`}
                                className="flex items-center gap-2 min-w-0 overflow-hidden"
                              >
                                <div
                                  className="text-[9px] font-black uppercase tracking-widest shrink-0"
                                  style={{ color: theme.accent, opacity: 0.5 }}
                                >
                                  URL
                                </div>
                                <input
                                  className="flex-1 min-w-0 bg-transparent outline-none text-[10px] font-semibold"
                                  style={{ color: theme.accent, opacity: 0.85 }}
                                  value={d.url}
                                  onChange={(e) =>
                                    updateDownloadable(d.id, { url: e.target.value })
                                  }
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div
                      className="border rounded-xl p-3 overflow-hidden min-w-0"
                      style={{
                        backgroundColor: blockColors.contactCard,
                        borderColor: theme.accent,
                        borderWidth: 2,
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="text-[10px] font-black uppercase tracking-widest opacity-70 min-w-0"
                          style={{ color: theme.accent }}
                        >
                          Contact Card (QR / NFC)
                        </div>
                        <label
                          className="cursor-pointer inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shrink-0"
                          style={{ color: theme.highlight }}
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

                      <div className="flex flex-wrap gap-2 mt-2">
                        <button
                          onClick={shareContact}
                          className="flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                          style={{ ...cardStyle, borderColor: theme.accent }}
                          type="button"
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
                          className="flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                          style={{ ...cardStyle, borderColor: theme.accent }}
                        >
                          <Download size={14} />
                          Download
                        </a>

                        <button
                          onClick={saveContact}
                          className="flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                          style={{ ...cardStyle, borderColor: theme.accent }}
                          type="button"
                        >
                          <Contact size={14} />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </CompactPanel>
              )}

              {visibleBlocks.contactCard && (
                <CompactPanel
                  title="Contact Card (Edit)"
                  subtitle="Edit fields used in the VCF"
                  defaultOpen={false}
                  style={blockCardStyle("contactCard")}
                  headerStyle={{
                    ...headerStyle,
                    backgroundColor: blockColors.contactCard,
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { k: "contactName", ph: "Contact name" },
                      { k: "contactTitle", ph: "Title" },
                      { k: "contactCompany", ph: "Company" },
                      { k: "contactPhone", ph: "Direct contact phone" },
                    ].map((f) => (
                      <input
                        key={f.k}
                        className="p-3 rounded-xl border outline-none text-xs font-semibold bg-transparent"
                        style={{ ...cardStyle, borderColor: theme.accent }}
                        value={(camp as any)[f.k] as string}
                        onChange={(e) => updateField(f.k as any, e.target.value as any)}
                        placeholder={f.ph}
                      />
                    ))}

                    <input
                      className="p-3 rounded-xl border outline-none text-xs font-semibold bg-transparent md:col-span-2"
                      style={{ ...cardStyle, borderColor: theme.accent }}
                      value={camp.reservationEmail}
                      onChange={(e) => updateField("reservationEmail", e.target.value)}
                      placeholder="Reservation email"
                    />

                    <input
                      className="p-3 rounded-xl border outline-none text-xs font-semibold bg-transparent md:col-span-2"
                      style={{ ...cardStyle, borderColor: theme.accent }}
                      value={camp.marketingEmail}
                      onChange={(e) => updateField("marketingEmail", e.target.value)}
                      placeholder="Marketing email"
                    />

                    <input
                      className="p-3 rounded-xl border outline-none text-xs font-semibold bg-transparent md:col-span-2"
                      style={{ ...cardStyle, borderColor: theme.accent }}
                      value={camp.salesEmail}
                      onChange={(e) => updateField("salesEmail", e.target.value)}
                      placeholder="Sales email"
                    />

                    <input
                      className="p-3 rounded-xl border outline-none text-xs font-semibold bg-transparent"
                      style={{ ...cardStyle, borderColor: theme.accent }}
                      value={camp.companyPhone}
                      onChange={(e) => updateField("companyPhone", e.target.value)}
                      placeholder="Company phone"
                    />

                    <input
                      className="p-3 rounded-xl border outline-none text-xs font-semibold bg-transparent"
                      style={{ ...cardStyle, borderColor: theme.accent }}
                      value={camp.companyWhatsApp}
                      onChange={(e) => updateField("companyWhatsApp", e.target.value)}
                      placeholder="Company WhatsApp"
                    />

                    <input
                      className="p-3 rounded-xl border outline-none text-xs font-semibold bg-transparent md:col-span-2"
                      style={{ ...cardStyle, borderColor: theme.accent }}
                      value={camp.contactWebsite}
                      onChange={(e) => updateField("contactWebsite", e.target.value)}
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
