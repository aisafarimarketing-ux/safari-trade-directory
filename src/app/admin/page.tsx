"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Save,
  Camera,
  Check,
  Percent,
  Instagram,
  Globe,
  Utensils,
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
  Layout,
  FileText,
} from "lucide-react";

type RoomKey = "family" | "double" | "single";
type NumericDraft = number | "";
type ListField = "inclusions" | "exclusions" | "freeActivities" | "paidActivities";

type Theme = {
  pageBg: string;
  blockBg: string;
  accent: string;
  highlight: string;
  borderColor: string;
};

type VisibleBlocks = {
  hero: boolean;
  heroTopMeta: boolean;
  heroTradeProfile: boolean;
  heroHeaderStack: boolean;
  matrix: boolean;
  inclusions: boolean;
  exclusions: boolean;
  experiences: boolean;
  offers: boolean;
  terms: boolean;
  leadCapture: boolean;
};

interface Camp {
  name: string;
  propertyClass: string;

  rooms: NumericDraft;
  family: NumericDraft;
  double: NumericDraft;
  single: NumericDraft;

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

  rating: NumericDraft;
  reviewCount: NumericDraft;
  instagramHandle: string;
  website: string;

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

  heroImage: string;
}

const ROOM_KEYS: readonly RoomKey[] = ["family", "double", "single"];

const DEFAULT_THEME: Theme = {
  pageBg: "#F4F2EE",
  blockBg: "#FFFFFF",
  accent: "#2D3436",
  highlight: "#9E5A24",
  borderColor: "#E2E8F0",
};

const DEFAULT_VISIBLE_BLOCKS: VisibleBlocks = {
  hero: true,
  heroTopMeta: true,
  heroTradeProfile: true,
  heroHeaderStack: true,
  matrix: true,
  inclusions: true,
  exclusions: true,
  experiences: true,
  offers: true,
  terms: true,
  leadCapture: true,
};

const BLOCK_LABELS: Record<keyof VisibleBlocks, string> = {
  hero: "Hero",
  heroTopMeta: "Hero Top Meta",
  heroTradeProfile: "Hero Trade Profile",
  heroHeaderStack: "Hero Header Stack",
  matrix: "Inventory Matrix",
  inclusions: "Inclusions",
  exclusions: "Exclusions",
  experiences: "Experiences",
  offers: "Offers",
  terms: "Terms",
  leadCapture: "Lead Capture",
};

const DEFAULT_CAMP: Camp = {
  name: "Nyumbani Serengeti",
  propertyClass: "Tented (Luxury)",

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

  tradeProfileLabel: "Nyumbani-Collections",
  tradeProfileSub: "Trade profile.",
  locationLabel: "Serengeti National Park, Tanzania",
  mapLink: "https://maps.google.com",

  rating: 4.9,
  reviewCount: 128,
  instagramHandle: "@nyumbani.collections",
  website: "https://example.com",

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
    "Leave your details and we’ll send a trade-ready fact sheet, inclusions, and a quick quote.",
  leadBullet1: "Agent-ready proposal + net rates",
  leadBullet2: "Seasonality guidance + offers",
  leadBullet3: "Fast response from reservations",
  leadCta: "Request Trade Pack",
  leadDisclaimer: "By submitting, you agree to be contacted by our reservations team.",

  contactName: "Nyumbani Reservations",
  contactTitle: "Trade Desk",
  contactCompany: "Nyumbani Collections",
  contactEmail: "trade@nyumbani.example",
  contactPhone: "+255 000 000 000",
  contactWebsite: "https://example.com",

  heroImage: "",
};

const parseNumericDraft = (raw: string): NumericDraft => {
  if (raw.trim() === "") return "";
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : "";
};

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const encodeVCardValue = (value: string): string =>
  value.replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

const decodeVCardValue = (value: string): string =>
  value.replace(/\\n/gi, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";");

const buildVcard = (camp: Camp) =>
  [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${encodeVCardValue(camp.contactName || "")}`,
    `ORG:${encodeVCardValue(camp.contactCompany || "")}`,
    `TITLE:${encodeVCardValue(camp.contactTitle || "")}`,
    camp.contactPhone ? `TEL;TYPE=CELL:${encodeVCardValue(camp.contactPhone)}` : "",
    camp.contactEmail ? `EMAIL;TYPE=INTERNET:${encodeVCardValue(camp.contactEmail)}` : "",
    camp.contactWebsite ? `URL:${encodeVCardValue(camp.contactWebsite)}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");

const parseVcf = (
  text: string,
): Partial<
  Pick<
    Camp,
    | "contactName"
    | "contactCompany"
    | "contactTitle"
    | "contactEmail"
    | "contactPhone"
    | "contactWebsite"
  >
> => {
  const unfolded = text.replace(/\r?\n[ \t]/g, "");
  const lines = unfolded
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const readValue = (matcher: (line: string) => boolean): string => {
    const line = lines.find(matcher);
    if (!line) return "";
    const value = line.split(":").slice(1).join(":").trim();
    return decodeVCardValue(value);
  };

  return {
    contactName: readValue((line) => /^FN/i.test(line)),
    contactCompany: readValue((line) => /^ORG/i.test(line)),
    contactTitle: readValue((line) => /^TITLE/i.test(line)),
    contactEmail: readValue((line) => line.toUpperCase().includes("EMAIL")),
    contactPhone: readValue((line) => line.toUpperCase().includes("TEL")),
    contactWebsite: readValue((line) => line.toUpperCase().includes("URL")),
  };
};

export default function RestorationSafariAdmin() {
  const [isPreview, setIsPreview] = useState(false);
  const [selectedCampIndex, setSelectedCampIndex] = useState(0);

  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [visibleBlocks, setVisibleBlocks] = useState<VisibleBlocks>(DEFAULT_VISIBLE_BLOCKS);
  const [portfolio, setPortfolio] = useState<Camp[]>([DEFAULT_CAMP]);

  useEffect(() => {
    if (selectedCampIndex >= portfolio.length) {
      setSelectedCampIndex(Math.max(0, portfolio.length - 1));
    }
  }, [portfolio.length, selectedCampIndex]);

  const camp = portfolio[selectedCampIndex] ?? DEFAULT_CAMP;

  const updateSelectedCamp = useCallback(
    (updater: (current: Camp) => Camp) => {
      setPortfolio((prev) =>
        prev.map((item, index) => (index === selectedCampIndex ? updater(item) : item)),
      );
    },
    [selectedCampIndex],
  );

  function updateField<K extends keyof Camp>(field: K, value: Camp[K]) {
    updateSelectedCamp((current) => ({ ...current, [field]: value }));
  }

  const toggleBlock = (key: keyof VisibleBlocks) => {
    setVisibleBlocks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addItem = (listKey: ListField) => {
    updateSelectedCamp((current) => ({
      ...current,
      [listKey]: [...current[listKey], "New Item"],
    }));
  };

  const deleteItem = (listKey: ListField, index: number) => {
    updateSelectedCamp((current) => ({
      ...current,
      [listKey]: current[listKey].filter((_, i) => i !== index),
    }));
  };

  const updateListItem = (listKey: ListField, index: number, value: string) => {
    updateSelectedCamp((current) => ({
      ...current,
      [listKey]: current[listKey].map((item, i) => (i === index ? value : item)),
    }));
  };

  const updateRoomTypeLabel = (roomKey: RoomKey, value: string) => {
    updateSelectedCamp((current) => ({
      ...current,
      roomTypeLabels: {
        ...current.roomTypeLabels,
        [roomKey]: value,
      },
    }));
  };

  const totalUnits =
    (Number(camp.family) || 0) + (Number(camp.double) || 0) + (Number(camp.single) || 0);

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.blockBg,
    borderColor: theme.borderColor,
    color: theme.accent,
  };
  const borderStyle: React.CSSProperties = { borderColor: theme.borderColor };
  const accentText: React.CSSProperties = { color: theme.accent };
  const highlightText: React.CSSProperties = { color: theme.highlight };
  const highlightBg: React.CSSProperties = { backgroundColor: theme.highlight };

  const frameClass =
    "shadow-[0_20px_60px_rgba(0,0,0,0.10)] hover:shadow-[0_26px_80px_rgba(0,0,0,0.14)] transition-all";
  const cardClass = `border rounded-[2.5rem] ${frameClass}`;
  const miniCardClass = `border rounded-2xl ${frameClass}`;
  const headingClass = "text-[10px] font-black uppercase tracking-[0.35em]";
  const subLabelClass = "text-[9px] font-black uppercase tracking-[0.25em]";

  const [photoModal, setPhotoModal] = useState<{ open: boolean; src: string; title: string }>({
    open: false,
    src: "",
    title: "",
  });

  const openPhoto = (src: string, title = "Preview") => setPhotoModal({ open: true, src, title });
  const closePhoto = () => setPhotoModal({ open: false, src: "", title: "" });

  const addRoomPhotos = async (roomKey: RoomKey, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const urls = (
      await Promise.all(
        Array.from(files).map(async (file) => {
          if (!file.type.startsWith("image/")) return "";
          return toDataUrl(file);
        }),
      )
    ).filter(Boolean) as string[];

    if (urls.length === 0) return;

    updateSelectedCamp((current) => ({
      ...current,
      roomPhotos: {
        ...current.roomPhotos,
        [roomKey]: [...current.roomPhotos[roomKey], ...urls].slice(0, 6),
      },
    }));
  };

  const removeRoomPhoto = (roomKey: RoomKey, index: number) => {
    updateSelectedCamp((current) => ({
      ...current,
      roomPhotos: {
        ...current.roomPhotos,
        [roomKey]: current.roomPhotos[roomKey].filter((_, i) => i !== index),
      },
    }));
  };

  const heroFileRef = useRef<HTMLInputElement | null>(null);

  const setHeroFromFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;
    updateField("heroImage", await toDataUrl(file));
  };

  const vcardText = useMemo(() => buildVcard(camp), [camp]);

  const [vcardUrl, setVcardUrl] = useState("");
  useEffect(() => {
    try {
      const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      setVcardUrl(url);
      return () => URL.revokeObjectURL(url);
    } catch {
      setVcardUrl("");
      return undefined;
    }
  }, [vcardText]);

  const downloadHref = vcardUrl || `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardText)}`;

  const saveContact = useCallback(() => {
    const link = document.createElement("a");
    link.href = downloadHref;
    link.download = `${(camp.contactName || "contact").replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [camp.contactName, downloadHref]);

  const shareContact = useCallback(async () => {
    try {
      const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8" });
      const file = new File([blob], "contact.vcf", { type: "text/vcard" });

      const nav = navigator as Navigator & {
        share?: (data: ShareData) => Promise<void>;
        canShare?: (data?: ShareData) => boolean;
      };

      if (nav.share) {
        const canShareFiles =
          typeof nav.canShare === "function" ? nav.canShare({ files: [file] }) : false;

        if (canShareFiles) {
          await nav.share({
            title: camp.contactName || "Contact card",
            text: "Contact card",
            files: [file],
          });
          return;
        }
      }

      saveContact();
    } catch {
      saveContact();
    }
  }, [camp.contactName, saveContact, vcardText]);

  const loadVcfFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.toLowerCase().endsWith(".vcf")) return;

    const text = await file.text();
    const parsed = parseVcf(text);

    updateSelectedCamp((current) => ({
      ...current,
      contactName: parsed.contactName || current.contactName,
      contactCompany: parsed.contactCompany || current.contactCompany,
      contactTitle: parsed.contactTitle || current.contactTitle,
      contactEmail: parsed.contactEmail || current.contactEmail,
      contactPhone: parsed.contactPhone || current.contactPhone,
      contactWebsite: parsed.contactWebsite || current.contactWebsite,
    }));
  };

  const themeEntries = Object.entries(theme) as Array<[keyof Theme, string]>;
  const visibleBlockEntries = Object.entries(visibleBlocks) as Array<[keyof VisibleBlocks, boolean]>;
  const leadBulletKeys: Array<"leadBullet1" | "leadBullet2" | "leadBullet3"> = [
    "leadBullet1",
    "leadBullet2",
    "leadBullet3",
  ];
  const contactFields: Array<{
    key: "contactName" | "contactTitle" | "contactCompany" | "contactPhone";
    placeholder: string;
  }> = [
    { key: "contactName", placeholder: "Contact name" },
    { key: "contactTitle", placeholder: "Title" },
    { key: "contactCompany", placeholder: "Company" },
    { key: "contactPhone", placeholder: "Phone" },
  ];

  return (
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: theme.pageBg }}>
      {photoModal.open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.78)" }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePhoto();
          }}
        >
          <div
            className="w-full max-w-6xl rounded-3xl overflow-hidden border shadow-2xl"
            style={cardStyle}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b" style={borderStyle}>
              <div
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: theme.accent, opacity: 0.7 }}
              >
                {photoModal.title || "Preview"}
              </div>
              <button
                onClick={closePhoto}
                className="p-2 rounded-xl border"
                style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg }}
                type="button"
              >
                <X size={16} style={accentText} />
              </button>
            </div>

            <div className="p-4">
              <div className="max-h-[75vh] overflow-auto rounded-2xl border" style={borderStyle}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoModal.src} alt="Preview" className="w-full h-auto block" />
              </div>
            </div>
          </div>
        </div>
      )}

      {!isPreview && (
        <aside
          className="w-64 fixed h-screen top-0 left-0 z-[100] p-5 flex flex-col shadow-2xl border-r"
          style={{ backgroundColor: theme.blockBg, borderColor: theme.borderColor }}
        >
          <div className="flex items-center justify-between mb-6">
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: theme.accent, opacity: 0.55 }}
            >
              Restoration Hub
            </span>
            <button
              onClick={() => setIsPreview(true)}
              className="p-2 rounded-lg border"
              style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg }}
              type="button"
            >
              <Eye size={14} style={accentText} />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto pr-2">
            <div>
              <p
                className="text-[9px] font-bold uppercase mb-3 tracking-[0.2em]"
                style={{ color: theme.accent, opacity: 0.5 }}
              >
                View Toggles
              </p>
              <div className="space-y-1">
                {visibleBlockEntries.map(([key, enabled]) => (
                  <button
                    key={key}
                    onClick={() => toggleBlock(key)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-black/5"
                    type="button"
                  >
                    <span style={{ color: theme.accent, opacity: enabled ? 1 : 0.25 }}>
                      {BLOCK_LABELS[key]}
                    </span>
                    {enabled ? (
                      <Eye size={12} style={accentText} />
                    ) : (
                      <EyeOff size={12} style={{ color: theme.accent, opacity: 0.3 }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t space-y-3" style={borderStyle}>
              <p className="text-[9px] font-bold uppercase" style={{ color: theme.accent, opacity: 0.5 }}>
                Accents
              </p>
              {themeEntries.map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span
                    className="text-[9px] uppercase font-medium"
                    style={{ color: theme.accent, opacity: 0.85 }}
                  >
                    {key}
                  </span>
                  <input
                    type="color"
                    value={value}
                    onChange={(event) =>
                      setTheme((current) => ({ ...current, [key]: event.target.value }))
                    }
                    className="w-4 h-4 rounded-full cursor-pointer border-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className="mt-5 w-full py-4 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
            style={highlightBg}
            type="button"
          >
            <Save size={14} className="inline mr-2" />
            Save Changes
          </button>
        </aside>
      )}

      <main className={`flex-1 transition-all ${!isPreview ? "ml-64" : "ml-0"}`}>
        {isPreview && (
          <button
            onClick={() => setIsPreview(false)}
            className="fixed top-6 right-6 z-[200] bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-2xl"
            type="button"
          >
            <Monitor size={14} />
            Open Admin
          </button>
        )}

        {visibleBlocks.heroHeaderStack && (
          <div className="max-w-6xl mx-auto px-6 pt-10">
            <div className={`${cardClass} p-6 md:p-8 space-y-5`} style={cardStyle}>
              {visibleBlocks.heroTopMeta && (
                <div className={`${cardClass} p-6 md:p-8`} style={cardStyle}>
                  <div className="flex items-center justify-between mb-5">
                    <div className={headingClass} style={{ color: theme.accent, opacity: 0.55 }}>
                      Brand & Trust
                    </div>
                    <Layout size={16} style={{ color: theme.accent, opacity: 0.45 }} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
                        Social proof
                      </div>

                      <div className="flex items-center gap-3">
                        <StarIcon size={18} style={highlightText} />
                        <input
                          inputMode="decimal"
                          className="text-3xl font-black italic outline-none w-24 bg-transparent"
                          value={camp.rating}
                          onChange={(event) =>
                            updateField("rating", parseNumericDraft(event.target.value))
                          }
                          style={accentText}
                        />
                        <span
                          className="text-xs font-bold uppercase tracking-widest"
                          style={{ color: theme.accent, opacity: 0.5 }}
                        >
                          / 5
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className="text-[10px] font-black uppercase tracking-widest"
                          style={{ color: theme.accent, opacity: 0.35 }}
                        >
                          Reviews
                        </span>
                        <input
                          inputMode="numeric"
                          className="text-sm font-black outline-none bg-transparent w-20"
                          value={camp.reviewCount}
                          onChange={(event) =>
                            updateField("reviewCount", parseNumericDraft(event.target.value))
                          }
                          style={accentText}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Instagram size={14} style={{ color: theme.accent, opacity: 0.55 }} />
                        <input
                          className="text-xs font-bold uppercase tracking-wider outline-none bg-transparent w-full"
                          value={camp.instagramHandle}
                          onChange={(event) => updateField("instagramHandle", event.target.value)}
                          style={accentText}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Globe size={14} style={{ color: theme.accent, opacity: 0.55 }} />
                        <input
                          className="text-xs font-bold outline-none bg-transparent w-full"
                          value={camp.website}
                          onChange={(event) => updateField("website", event.target.value)}
                          style={accentText}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
                        Location
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin size={16} style={highlightText} />
                        <textarea
                          className="text-sm font-black uppercase tracking-tight outline-none bg-transparent w-full resize-none leading-snug"
                          value={camp.locationLabel}
                          onChange={(event) => updateField("locationLabel", event.target.value)}
                          rows={2}
                          style={{ color: theme.accent, opacity: 0.95 }}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Compass size={14} style={{ color: theme.accent, opacity: 0.55 }} />
                        <input
                          className="text-xs font-bold outline-none bg-transparent w-full"
                          value={camp.mapLink}
                          onChange={(event) => updateField("mapLink", event.target.value)}
                          style={accentText}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
                        Inventory
                      </div>
                      <div
                        className={`${miniCardClass} p-5`}
                        style={{ borderColor: theme.borderColor, backgroundColor: theme.pageBg }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className="text-[9px] font-black uppercase tracking-widest"
                              style={{ color: theme.accent, opacity: 0.55 }}
                            >
                              Total rooms
                            </p>
                            <input
                              inputMode="numeric"
                              className="text-4xl font-black italic outline-none bg-transparent w-24"
                              value={camp.rooms}
                              onChange={(event) =>
                                updateField("rooms", parseNumericDraft(event.target.value))
                              }
                              style={accentText}
                            />
                          </div>
                          <div className="h-12 w-px" style={{ backgroundColor: theme.borderColor }} />
                          <div className="text-right">
                            <p
                              className="text-[9px] font-black uppercase tracking-widest"
                              style={{ color: theme.accent, opacity: 0.55 }}
                            >
                              Total units
                            </p>
                            <p
                              className="text-4xl font-black italic"
                              style={{ color: theme.accent, opacity: 0.95 }}
                            >
                              {totalUnits}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] font-medium" style={{ color: theme.accent, opacity: 0.55 }}>
                        Units = family + double + single.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {visibleBlocks.heroTradeProfile && (
                <div className={`${cardClass} p-8 md:p-10 space-y-6`} style={cardStyle}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
                        Profile label
                      </p>
                      <input
                        className="mt-2 text-sm font-black uppercase tracking-[0.2em] outline-none bg-transparent w-full border-b pb-2"
                        value={camp.tradeProfileLabel}
                        onChange={(event) => updateField("tradeProfileLabel", event.target.value)}
                        style={{ borderColor: theme.borderColor, color: theme.accent }}
                      />
                    </div>
                    <div>
                      <p className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
                        Profile sublabel
                      </p>
                      <input
                        className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] outline-none bg-transparent w-full border-b pb-2"
                        value={camp.tradeProfileSub}
                        onChange={(event) => updateField("tradeProfileSub", event.target.value)}
                        style={{ borderColor: theme.borderColor, color: theme.accent }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
                        Property class
                      </p>
                      <input
                        className="mt-2 text-sm font-black uppercase tracking-tight outline-none bg-transparent w-full border-b pb-2"
                        value={camp.propertyClass}
                        onChange={(event) => updateField("propertyClass", event.target.value)}
                        style={{ borderColor: theme.borderColor, color: theme.accent }}
                      />
                    </div>
                    <div>
                      <p className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
                        Camp name
                      </p>
                      <input
                        className="mt-2 text-2xl md:text-3xl font-black italic tracking-tighter outline-none bg-transparent w-full border-b pb-2"
                        value={camp.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        style={{ borderColor: theme.borderColor, color: theme.accent }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
                      Vibe
                    </p>
                    <textarea
                      className="mt-2 text-sm font-medium outline-none bg-transparent w-full border rounded-2xl p-4 resize-none"
                      value={camp.vibe}
                      onChange={(event) => updateField("vibe", event.target.value)}
                      rows={3}
                      style={{ borderColor: theme.borderColor, color: theme.accent }}
                    />
                  </div>

                  <div className="pt-4 border-t space-y-4" style={borderStyle}>
                    <div className="flex items-center justify-between">
                      <p className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
                        Contact card (QR / NFC)
                      </p>

                      <label className="cursor-pointer inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <FileText size={12} style={highlightText} />
                        <span style={highlightText}>Upload .VCF</span>
                        <input
                          type="file"
                          accept=".vcf,text/vcard"
                          className="hidden"
                          onChange={async (event) => {
                            await loadVcfFile(event.target.files);
                            event.currentTarget.value = "";
                          }}
                        />
                      </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {contactFields.map((field) => (
                        <input
                          key={field.key}
                          className="p-4 rounded-2xl border outline-none text-xs font-semibold bg-transparent"
                          style={{ borderColor: theme.borderColor, color: theme.accent }}
                          value={camp[field.key]}
                          onChange={(event) => updateField(field.key, event.target.value)}
                          placeholder={field.placeholder}
                        />
                      ))}
                      <input
                        className="p-4 rounded-2xl border outline-none text-xs font-semibold bg-transparent md:col-span-2"
                        style={{ borderColor: theme.borderColor, color: theme.accent }}
                        value={camp.contactEmail}
                        onChange={(event) => updateField("contactEmail", event.target.value)}
                        placeholder="Email"
                      />
                      <input
                        className="p-4 rounded-2xl border outline-none text-xs font-semibold bg-transparent md:col-span-2"
                        style={{ borderColor: theme.borderColor, color: theme.accent }}
                        value={camp.contactWebsite}
                        onChange={(event) => updateField("contactWebsite", event.target.value)}
                        placeholder="Website"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {visibleBlocks.hero && (
          <section
            className="relative h-[70vh] w-full overflow-hidden mt-6 select-none"
            style={{ backgroundColor: theme.accent }}
            onDoubleClick={() => heroFileRef.current?.click()}
            onContextMenu={(event) => {
              event.preventDefault();
              heroFileRef.current?.click();
            }}
            title="Double-click or right-click to change hero image"
          >
            <input
              ref={heroFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (event) => {
                await setHeroFromFiles(event.target.files);
                event.currentTarget.value = "";
              }}
            />

            {camp.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={camp.heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="rounded-2xl border px-6 py-4 text-[10px] font-black uppercase tracking-widest"
                  style={{
                    borderColor: theme.borderColor,
                    color: "#fff",
                    backgroundColor: "rgba(0,0,0,0.25)",
                  }}
                >
                  Double-click / Right-click to upload hero image
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-black/40 z-10" />
          </section>
        )}

        <div className="max-w-5xl mx-auto py-12 px-6 space-y-12">
          {visibleBlocks.matrix && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b pb-3" style={borderStyle}>
                <h2 className={headingClass} style={{ color: theme.accent, opacity: 0.55 }}>
                  Inventory Matrix
                </h2>
                <Layout size={16} style={{ color: theme.accent, opacity: 0.45 }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ROOM_KEYS.map((type) => (
                  <div key={type} className={`${cardClass} p-8`} style={cardStyle}>
                    <input
                      className="text-[10px] font-black uppercase outline-none bg-transparent"
                      value={camp.roomTypeLabels[type]}
                      onChange={(event) => updateRoomTypeLabel(type, event.target.value)}
                      style={{ color: theme.accent, opacity: 0.65 }}
                    />

                    <div className="flex items-center gap-4 mt-6">
                      <input
                        inputMode="numeric"
                        className="text-5xl font-black italic outline-none w-16 bg-transparent"
                        value={camp[type]}
                        onChange={(event) =>
                          updateField(type, parseNumericDraft(event.target.value))
                        }
                        style={{ color: theme.accent, opacity: 0.95 }}
                      />
                      <div className="h-10 w-px" style={{ backgroundColor: theme.borderColor }} />
                      <span className="text-[10px] font-bold uppercase leading-tight" style={{ color: theme.accent, opacity: 0.5 }}>
                        Total
                        <br />
                        Units
                      </span>
                    </div>

                    <div className="mt-7 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
                          Room setup photos
                        </p>
                        <label className="cursor-pointer inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                          <Upload size={12} style={highlightText} />
                          <span style={highlightText}>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={async (event) => {
                              await addRoomPhotos(type, event.target.files);
                              event.currentTarget.value = "";
                            }}
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {(camp.roomPhotos[type] ?? []).map((src, i) => (
                          <div
                            key={`${type}-${i}`}
                            className="relative rounded-xl overflow-hidden border"
                            style={borderStyle}
                          >
                            <button
                              className="block w-full text-left"
                              onClick={() =>
                                openPhoto(src, `${camp.roomTypeLabels[type]} — Photo ${i + 1}`)
                              }
                              type="button"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt={`${type}-${i}`} className="w-full h-20 object-cover" />
                              <span
                                className="absolute bottom-1 left-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest"
                                style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "#fff" }}
                              >
                                View
                              </span>
                            </button>

                            <button
                              onClick={() => removeRoomPhoto(type, i)}
                              className="absolute top-1 right-1 p-1 rounded-lg"
                              style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
                              title="Remove"
                              type="button"
                            >
                              <X size={12} className="text-white" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <p className="text-[10px] font-medium" style={{ color: theme.accent, opacity: 0.6 }}>
                        Click any thumbnail for full-size preview.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {visibleBlocks.inclusions && (
              <div className={`${cardClass} p-10 space-y-6`} style={cardStyle}>
                <div className="flex items-center justify-between border-b pb-4" style={borderStyle}>
                  <div className="flex items-center gap-2">
                    <Utensils size={14} style={accentText} />
                    <h3 className={headingClass} style={{ color: theme.accent, opacity: 0.65 }}>
                      Inclusions
                    </h3>
                  </div>
                  <button onClick={() => addItem("inclusions")} style={highlightText} type="button">
                    <Plus size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {camp.inclusions.map((item, i) => (
                    <div key={`inc-${i}`} className="flex items-center gap-3 group">
                      <Check size={12} className="text-green-500" />
                      <input
                        className="text-sm font-semibold outline-none bg-transparent w-full"
                        value={item}
                        onChange={(event) => updateListItem("inclusions", i, event.target.value)}
                        style={{ color: theme.accent, opacity: 0.92 }}
                      />
                      <button
                        onClick={() => deleteItem("inclusions", i)}
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
            )}

            {visibleBlocks.exclusions && (
              <div className={`${cardClass} p-10 space-y-6`} style={{ ...cardStyle, opacity: 0.9 }}>
                <div className="flex items-center justify-between border-b pb-4" style={borderStyle}>
                  <div className="flex items-center gap-2">
                    <Ban size={14} style={{ color: "#f87171" }} />
                    <h3 className={headingClass} style={{ color: theme.accent, opacity: 0.65 }}>
                      Exclusions
                    </h3>
                  </div>
                  <button onClick={() => addItem("exclusions")} style={highlightText} type="button">
                    <Plus size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {camp.exclusions.map((item, i) => (
                    <div key={`exc-${i}`} className="flex items-center gap-3 group">
                      <X size={10} style={{ color: theme.accent, opacity: 0.45 }} />
                      <input
                        className="text-sm font-semibold outline-none bg-transparent w-full italic"
                        value={item}
                        onChange={(event) => updateListItem("exclusions", i, event.target.value)}
                        style={{ color: theme.accent, opacity: 0.85 }}
                      />
                      <button
                        onClick={() => deleteItem("exclusions", i)}
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
            )}
          </div>

          {visibleBlocks.experiences && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b pb-3" style={borderStyle}>
                <h2 className={headingClass} style={{ color: theme.accent, opacity: 0.55 }}>
                  Services & Experiences
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className={`${cardClass} p-10 space-y-6`} style={cardStyle}>
                  <div className="flex items-center justify-between">
                    <p className={headingClass} style={{ color: theme.accent, opacity: 0.65 }}>
                      Included
                    </p>
                    <button onClick={() => addItem("freeActivities")} style={highlightText} type="button">
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {camp.freeActivities.map((activity, i) => (
                      <div key={`free-${i}`} className="flex items-center gap-3 group">
                        <Compass size={14} style={highlightText} />
                        <input
                          className="text-sm font-semibold uppercase tracking-tight outline-none bg-transparent w-full"
                          value={activity}
                          onChange={(event) =>
                            updateListItem("freeActivities", i, event.target.value)
                          }
                          style={{ color: theme.accent, opacity: 0.92 }}
                        />
                        <button
                          onClick={() => deleteItem("freeActivities", i)}
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
                  className={`${cardClass} p-10 space-y-6`}
                  style={{
                    backgroundColor: theme.accent,
                    borderColor: theme.accent,
                    color: "#fff",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className={headingClass} style={{ color: "#fff", opacity: 0.85 }}>
                      Premium add-ons
                    </p>
                    <button
                      onClick={() => addItem("paidActivities")}
                      style={{ color: "#fff", opacity: 0.85 }}
                      type="button"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {camp.paidActivities.map((activity, i) => (
                      <div key={`paid-${i}`} className="flex items-center gap-3 group">
                        <MapPin size={14} className="text-white/60" />
                        <input
                          className="text-sm font-semibold uppercase tracking-tight outline-none bg-transparent w-full text-white"
                          value={activity}
                          onChange={(event) =>
                            updateListItem("paidActivities", i, event.target.value)
                          }
                        />
                        <button
                          onClick={() => deleteItem("paidActivities", i)}
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
            </div>
          )}

          {(visibleBlocks.offers || visibleBlocks.terms) && (
            <div className="grid md:grid-cols-2 gap-6">
              {visibleBlocks.offers && (
                <div className={`${cardClass} p-10 space-y-4`} style={cardStyle}>
                  <h3 className={headingClass} style={{ color: theme.accent, opacity: 0.65 }}>
                    Offers
                  </h3>
                  <textarea
                    className="w-full p-4 rounded-2xl border text-sm font-semibold outline-none resize-none bg-transparent"
                    style={{ borderColor: theme.borderColor, color: theme.accent }}
                    value={camp.offersText}
                    onChange={(event) => updateField("offersText", event.target.value)}
                    rows={5}
                  />
                </div>
              )}

              {visibleBlocks.terms && (
                <div className={`${cardClass} p-10 space-y-4`} style={cardStyle}>
                  <h3 className={headingClass} style={{ color: theme.accent, opacity: 0.65 }}>
                    Terms
                  </h3>
                  <textarea
                    className="w-full p-4 rounded-2xl border text-sm font-semibold outline-none resize-none bg-transparent"
                    style={{ borderColor: theme.borderColor, color: theme.accent }}
                    value={camp.terms}
                    onChange={(event) => updateField("terms", event.target.value)}
                    rows={5}
                  />
                </div>
              )}
            </div>
          )}

          {visibleBlocks.leadCapture && (
            <div className={`${cardClass} p-10 md:p-14`} style={cardStyle}>
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div className="space-y-5">
                  <p className={headingClass} style={{ color: theme.accent, opacity: 0.45 }}>
                    Lead capture
                  </p>

                  <textarea
                    className="text-3xl md:text-4xl font-black italic tracking-tighter outline-none w-full resize-none leading-tight bg-transparent"
                    value={camp.leadHeadline}
                    onChange={(event) => updateField("leadHeadline", event.target.value)}
                    rows={2}
                    style={{ color: theme.accent, opacity: 0.95 }}
                  />

                  <textarea
                    className="text-sm font-semibold outline-none w-full resize-none leading-relaxed bg-transparent"
                    value={camp.leadSubcopy}
                    onChange={(event) => updateField("leadSubcopy", event.target.value)}
                    rows={3}
                    style={{ color: theme.accent, opacity: 0.72 }}
                  />

                  <div className="space-y-3">
                    {leadBulletKeys.map((key) => (
                      <div key={key} className="flex items-center gap-3">
                        <Check size={14} className="text-green-500" />
                        <input
                          className="text-xs font-black uppercase tracking-tight outline-none bg-transparent w-full"
                          value={camp[key]}
                          onChange={(event) => updateField(key, event.target.value)}
                          style={{ color: theme.accent, opacity: 0.9 }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <ShieldAlert size={14} style={{ color: theme.accent, opacity: 0.35 }} />
                    <input
                      className="text-[10px] font-semibold outline-none bg-transparent w-full"
                      value={camp.leadDisclaimer}
                      onChange={(event) => updateField("leadDisclaimer", event.target.value)}
                      style={{ color: theme.accent, opacity: 0.65 }}
                    />
                  </div>
                </div>

                <div
                  className="rounded-[2.5rem] border p-8 space-y-4"
                  style={{ borderColor: theme.borderColor, backgroundColor: theme.pageBg }}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: theme.accent, opacity: 0.55 }}
                    >
                      Enquiry form
                    </p>
                    <button
                      className="p-2 rounded-xl border"
                      style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg }}
                      type="button"
                    >
                      <Camera size={14} style={{ color: theme.accent, opacity: 0.55 }} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["Full name", "Agency"].map((placeholder) => (
                      <input
                        key={placeholder}
                        className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: theme.blockBg,
                          color: theme.accent,
                        }}
                        placeholder={placeholder}
                      />
                    ))}
                    {["Email", "WhatsApp / Phone"].map((placeholder) => (
                      <input
                        key={placeholder}
                        className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none md:col-span-2"
                        style={{
                          borderColor: theme.borderColor,
                          backgroundColor: theme.blockBg,
                          color: theme.accent,
                        }}
                        placeholder={placeholder}
                      />
                    ))}
                    <textarea
                      className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none md:col-span-2 resize-none"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.blockBg,
                        color: theme.accent,
                      }}
                      placeholder="Message..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-3">
                    <input
                      className="w-full p-4 rounded-2xl border text-xs font-black uppercase tracking-widest outline-none"
                      style={{
                        borderColor: theme.borderColor,
                        backgroundColor: theme.blockBg,
                        color: theme.accent,
                      }}
                      value={camp.leadCta}
                      onChange={(event) => updateField("leadCta", event.target.value)}
                      placeholder="CTA label"
                    />

                    <button
                      className="w-full py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center"
                      style={highlightBg}
                      type="button"
                    >
                      {camp.leadCta || "Request Trade Pack"}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={shareContact}
                        className="px-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={cardStyle}
                        type="button"
                      >
                        <Share2 size={14} />
                        Share
                      </button>
                      <a
                        href={downloadHref}
                        download={`${(camp.contactName || "contact").replace(/\s+/g, "_")}.vcf`}
                        className="px-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={cardStyle}
                      >
                        <Download size={14} />
                        Download
                      </a>
                      <button
                        onClick={saveContact}
                        className="px-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={cardStyle}
                        type="button"
                      >
                        <Save size={14} />
                        Save
                      </button>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-center gap-2 text-[10px] font-bold"
                    style={{ color: theme.accent, opacity: 0.6 }}
                  >
                    <Percent size={12} />
                    Trade-friendly response timing:
                    <span style={{ color: theme.accent, opacity: 1 }}>same day</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-[10px] font-semibold" style={{ color: theme.accent, opacity: 0.35 }}>
            UI tightened and production-hardened for trade desk workflows.
          </div>
        </div>
      </main>
    </div>
  );
}
