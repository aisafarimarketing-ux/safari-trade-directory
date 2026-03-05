"use client";

import React, { useMemo, useRef, useState } from "react";
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
  Contact,
  FileText,
  Mail,
  MessageCircle,
  Building2,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Image as ImageIcon,
  Info,
} from "lucide-react";

type RoomKey = "family" | "double" | "single";
type NumDraft = number | "";

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

  rating: NumDraft;
  reviewCount: NumDraft;

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

  enquiryEmail: string;
  enquiryWhatsApp: string;
  enquirySubject: string;

  logoImage: string;
  coverImage: string;
};

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

  rating: "",
  reviewCount: "",

  instagramHandle: "@yourhandle",
  website: "https://yourwebsite.com",

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
  leadSubcopy: "Leave your details and we’ll send a trade-ready fact sheet and quick quote.",
  leadBullet1: "Agent-ready proposal + net rates",
  leadBullet2: "Seasonality guidance + offers",
  leadBullet3: "Fast response from reservations",
  leadCta: "Request Trade Pack",
  leadDisclaimer: "By submitting, you agree to be contacted by our reservations team.",

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
});

function CompactPanel({
  title,
  subtitle,
  right,
  defaultOpen = true,
  children,
  style,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)]" style={style}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3"
        style={{ backgroundColor: "rgba(255,255,255,0.65)" }}
        aria-expanded={open}
      >
        <div className="text-left">
          <div className="text-[10px] font-black uppercase tracking-[0.28em] opacity-70">{title}</div>
          {subtitle ? <div className="text-xs font-semibold opacity-70 mt-0.5">{subtitle}</div> : null}
        </div>
        <div className="flex items-center gap-2">
          {right}
          {open ? <ChevronUp size={16} className="opacity-60" /> : <ChevronDown size={16} className="opacity-60" />}
        </div>
      </button>
      {open && <div className="px-4 py-3">{children}</div>}
    </div>
  );
}

function AdminHint({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest"
      style={{ borderColor: "rgba(0,0,0,0.08)", backgroundColor: "rgba(255,255,255,0.75)" }}
    >
      <Info size={12} className="opacity-70" />
      <span className="opacity-70">{text}</span>
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
    borderColor: "#E2E8F0",
  });

  const [visibleBlocks, setVisibleBlocks] = useState({
    heroHeaderStack: true,
    heroTopMeta: true,
    heroTradeProfile: true,

    hero: false, // retired

    matrix: true,
    inclusions: true,
    exclusions: true,
    experiences: true,
    offers: true,
    terms: true,
    leadCapture: true,
  });

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
      rating: 4.9,
      reviewCount: 128,
      instagramHandle: "@nyumbani.collections",
      website: "https://example.com",
      contactName: "Nyumbani Reservations",
      contactEmail: "trade@nyumbani.example",
      contactPhone: "+255 000 000 000",
      contactWebsite: "https://example.com",
      enquiryEmail: "trade@nyumbani.example",
      enquiryWhatsApp: "+255000000000",
    },
  ]);

  const camp = portfolio[selectedCampIndex] ?? portfolio[0];

  // ---------- helpers ----------
  const toggleBlock = (key: keyof typeof visibleBlocks) => {
    setVisibleBlocks((p) => ({ ...p, [key]: !p[key] }));
  };

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

  // ---------- styles ----------
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.blockBg,
    borderColor: theme.borderColor,
    color: theme.accent,
  };
  const borderStyle: React.CSSProperties = { borderColor: theme.borderColor };
  const accentText: React.CSSProperties = { color: theme.accent };
  const highlightText: React.CSSProperties = { color: theme.highlight };
  const highlightBg: React.CSSProperties = { backgroundColor: theme.highlight };

  // ---------- images ----------
  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  // Responsive image modal: fit image fully to viewport (no “too big + scroll”)
  const [photoModal, setPhotoModal] = useState<{ open: boolean; src: string; title?: string }>({
    open: false,
    src: "",
    title: "",
  });
  const openPhoto = (src: string, title?: string) => setPhotoModal({ open: true, src, title });
  const closePhoto = () => setPhotoModal({ open: false, src: "", title: "" });

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
        [roomKey]: [...(c.roomPhotos[roomKey] ?? []), ...urls].slice(0, 8),
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

  // Logo + cover upload refs
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

  // ---------- vCard ----------
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

  const shareContact = async () => {
    try {
      const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8" });
      const file = new File([blob], "contact.vcf", { type: "text/vcard" });
      // @ts-ignore
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        // @ts-ignore
        await navigator.share({ title: camp.contactName, text: "Contact card", files: [file] });
      } else if (vcardUrl) {
        window.open(vcardUrl, "_blank");
      }
    } catch {
      if (vcardUrl) window.open(vcardUrl, "_blank");
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
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    const pick = (startsWith: string) => {
      const hit = lines.find((l) => l.toUpperCase().startsWith(startsWith.toUpperCase()));
      if (!hit) return "";
      return hit.split(":").slice(1).join(":").trim();
    };

    const fn = pick("FN");
    const org = pick("ORG");
    const title = pick("TITLE");

    const emailLine = lines.find((l) => l.toUpperCase().includes("EMAIL"));
    const telLine = lines.find((l) => l.toUpperCase().includes("TEL"));
    const urlLine = lines.find((l) => l.toUpperCase().startsWith("URL"));

    const email = emailLine ? emailLine.split(":").slice(1).join(":").trim() : "";
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

  // ---------- list crud ----------
  const addListItem = (key: keyof Camp) => {
    updateNested((c) => {
      const list = (c as any)[key] as string[];
      return { ...c, [key]: [...list, "New Item"] } as Camp;
    });
  };

  const removeListItem = (key: keyof Camp, idx: number) => {
    updateNested((c) => {
      const list = (c as any)[key] as string[];
      return { ...c, [key]: list.filter((_, i) => i !== idx) } as Camp;
    });
  };

  const updateListItem = (key: keyof Camp, idx: number, value: string) => {
    updateNested((c) => {
      const list = [...((c as any)[key] as string[])];
      list[idx] = value;
      return { ...c, [key]: list } as Camp;
    });
  };

  // ---------- Multi-camp ----------
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

  // ---------- Lead sending ----------
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
      `Message:`,
      data.message,
      "",
      `Requested via: Trade Directory Lead Capture`,
    ];
    return lines.join("\n");
  };

  const normalizeWhatsApp = (v: string) => v.replace(/[^\d]/g, "");

  const leadPayload = useMemo(() => buildLeadMessage(lead), [lead, camp.name, camp.class, camp.locationLabel]);

  const openMailto = (payload: string) => {
    const to = (camp.enquiryEmail || "").trim();
    if (!to) return;
    const subject = encodeURIComponent((camp.enquirySubject || "Trade Request").trim());
    const body = encodeURIComponent(payload);
    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;
  };

  const openWhatsApp = (payload: string) => {
    const digits = normalizeWhatsApp(camp.enquiryWhatsApp || "");
    if (!digits) return;
    const text = encodeURIComponent(payload);
    window.open(`https://wa.me/${digits}?text=${text}`, "_blank");
  };

  // keyboard close for modal
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePhoto();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: theme.pageBg }}>
      {/* RESPONSIVE IMAGE MODAL (fits full image without scroll) */}
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
            <div className="flex items-center justify-between px-4 py-3 border-b" style={borderStyle}>
              <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.8 }}>
                {photoModal.title || "Preview"}
              </div>
              <button
                onClick={closePhoto}
                className="p-2 rounded-xl border"
                style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg }}
                type="button"
                aria-label="Close preview"
              >
                <X size={16} style={accentText} />
              </button>
            </div>

            {/* Viewport: image fits fully (no scrolling needed) */}
            <div className="p-3">
              <div className="w-full h-[78vh] md:h-[80vh] flex items-center justify-center rounded-2xl border overflow-hidden" style={borderStyle}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoModal.src}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="mt-2 text-[10px] font-semibold" style={{ color: theme.accent, opacity: 0.65 }}>
                Tip: press <span style={{ opacity: 0.9 }}>Esc</span> to close.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      {!isPreview && (
        <aside
          className="w-72 fixed h-screen top-0 left-0 z-[100] p-4 flex flex-col border-r"
          style={{ backgroundColor: theme.blockBg, borderColor: theme.borderColor }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.55 }}>
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

          {/* Camps */}
          <div className="mb-4">
            <p className="text-[9px] font-bold uppercase mb-2 tracking-[0.2em]" style={{ color: theme.accent, opacity: 0.5 }}>
              Camps
            </p>

            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={addCamp}
                  className="flex-1 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  style={{ borderColor: theme.borderColor, color: theme.accent }}
                  type="button"
                >
                  <Plus size={14} /> Add
                </button>
                <button
                  onClick={deleteCamp}
                  className="py-2 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest"
                  style={{ borderColor: theme.borderColor, color: theme.accent, opacity: portfolio.length > 1 ? 1 : 0.35 }}
                  type="button"
                  disabled={portfolio.length <= 1}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="rounded-2xl border p-2" style={{ borderColor: theme.borderColor, backgroundColor: theme.pageBg }}>
                {portfolio.map((c, i) => (
                  <button
                    key={`${c.name}-${i}`}
                    onClick={() => setSelectedCampIndex(i)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all"
                    style={{
                      backgroundColor: i === selectedCampIndex ? theme.blockBg : "transparent",
                      border: i === selectedCampIndex ? `1px solid ${theme.borderColor}` : "1px solid transparent",
                    }}
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 size={14} style={{ color: theme.accent, opacity: 0.55 }} />
                      <span className="text-xs font-black" style={{ color: theme.accent, opacity: 0.9 }}>
                        {c.name || `Camp ${i + 1}`}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase" style={{ color: theme.accent, opacity: 0.4 }}>
                      #{i + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            <div>
              <p className="text-[9px] font-bold uppercase mb-2 tracking-[0.2em]" style={{ color: theme.accent, opacity: 0.5 }}>
                View Toggles
              </p>
              <div className="space-y-1">
                {Object.keys(visibleBlocks).map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleBlock(key as any)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                    type="button"
                  >
                    <span style={{ color: theme.accent, opacity: visibleBlocks[key as keyof typeof visibleBlocks] ? 1 : 0.25 }}>
                      {key}
                    </span>
                    {visibleBlocks[key as keyof typeof visibleBlocks] ? (
                      <Eye size={12} style={accentText} />
                    ) : (
                      <EyeOff size={12} style={{ color: theme.accent, opacity: 0.3 }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t space-y-2" style={borderStyle}>
              <p className="text-[9px] font-bold uppercase" style={{ color: theme.accent, opacity: 0.5 }}>
                Accents
              </p>
              {Object.entries(theme).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-medium" style={{ color: theme.accent, opacity: 0.85 }}>
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

      {/* MAIN */}
      <main className={`flex-1 transition-all ${!isPreview ? "ml-72" : "ml-0"}`}>
        {isPreview && (
          <button
            onClick={() => setIsPreview(false)}
            className="fixed top-4 right-4 z-[200] bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-2xl"
            type="button"
          >
            <Monitor size={14} /> Open Admin
          </button>
        )}

        {/* TOP HEADER: LOGO (left) + CIRCULAR COVER (center) + ADMIN HINTS */}
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <div className="relative border rounded-2xl px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]" style={cardStyle}>
            {/* hidden inputs */}
            <input ref={logoFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFromFiles(e.target.files)} />
            <input ref={coverFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setCoverFromFiles(e.target.files)} />

            {/* Logo left (RESPONSIVE + object-contain so full logo shows) */}
            <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
              <div
                className="w-20 h-14 md:w-24 md:h-16 rounded-2xl border overflow-hidden flex items-center justify-center cursor-pointer select-none"
                style={{ borderColor: theme.borderColor, backgroundColor: theme.pageBg }}
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
                  <img src={camp.logoImage} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <ImageIcon size={18} style={{ color: theme.accent, opacity: 0.5 }} />
                    <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.45 }}>
                      Logo
                    </span>
                  </div>
                )}
              </div>

              {/* Admin-only hint */}
              {!isPreview && <AdminHint text="Double-click / Right-click logo to replace" />}
            </div>

            {/* Center stack */}
            <div className="flex flex-col items-center justify-center">
              {/* Circular cover (RESPONSIVE + object-cover) */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full border overflow-hidden flex items-center justify-center cursor-pointer select-none"
                  style={{ borderColor: theme.borderColor, backgroundColor: theme.pageBg }}
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
                    <img src={camp.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Camera size={18} style={{ color: theme.accent, opacity: 0.5 }} />
                      <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.45 }}>
                        Cover
                      </span>
                    </div>
                  )}
                </div>

                {/* Admin-only hint */}
                {!isPreview && <AdminHint text="Double-click / Right-click cover to replace" />}
              </div>

              {/* Title line below cover */}
              <div className="mt-2 text-center space-y-1 w-full max-w-2xl">
                <div className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: theme.accent, opacity: 0.7 }}>
                  <input
                    className="bg-transparent outline-none text-center w-full"
                    value={`${camp.tradeProfileLabel} ${camp.tradeProfileSub}`}
                    onChange={(e) => updateField("tradeProfileLabel", e.target.value)}
                    style={{ color: theme.accent }}
                  />
                </div>
                <div className="text-base md:text-lg font-black italic" style={{ color: theme.accent, opacity: 0.95 }}>
                  <input
                    className="bg-transparent outline-none text-center w-full"
                    value={camp.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    style={{ color: theme.accent }}
                  />
                </div>
                <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.65 }}>
                  <input
                    className="bg-transparent outline-none text-center w-full"
                    value={camp.class}
                    onChange={(e) => updateField("class", e.target.value)}
                    style={{ color: theme.accent }}
                  />
                </div>
              </div>

              {/* Micro meta row */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-widest px-2"
                style={{ color: theme.accent, opacity: 0.75 }}
              >
                <div className="flex items-center gap-2">
                  <StarIcon size={14} style={highlightText} />
                  <input
                    className="w-14 bg-transparent outline-none font-black text-center"
                    value={camp.rating}
                    onChange={(e) => updateField("rating", numDraft(e.target.value))}
                    style={accentText}
                  />
                  <span style={{ opacity: 0.45 }}>({camp.reviewCount || 0})</span>
                </div>
                <div className="hidden sm:block h-4 w-px" style={{ backgroundColor: theme.borderColor }} />
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={highlightText} />
                  <input
                    className="bg-transparent outline-none font-black text-center w-[240px] max-w-[70vw]"
                    value={camp.locationLabel}
                    onChange={(e) => updateField("locationLabel", e.target.value)}
                    style={accentText}
                  />
                </div>
                <div className="hidden sm:block h-4 w-px" style={{ backgroundColor: theme.borderColor }} />
                <div>
                  Rooms:{" "}
                  <input
                    className="w-12 bg-transparent outline-none font-black text-center"
                    value={camp.rooms}
                    onChange={(e) => updateField("rooms", numDraft(e.target.value))}
                    style={accentText}
                  />
                  <span style={{ opacity: 0.45 }}> • Units:</span> <span style={{ opacity: 0.95 }}>{totalUnits}</span>
                </div>
              </div>

              {!isPreview && (
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  <AdminHint text="Click any room photo to preview full-screen" />
                  <AdminHint text="Photos scale to your device" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-7 space-y-3">
              {visibleBlocks.matrix && (
                <CompactPanel title="Inventory + Room Photos" subtitle="Responsive thumbnails + full preview" defaultOpen={true} style={cardStyle}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(["family", "double", "single"] as const).map((type) => (
                      <div key={type} className="border rounded-xl p-3" style={borderStyle}>
                        <input
                          className="text-[10px] font-black uppercase outline-none bg-transparent w-full"
                          value={camp.roomTypeLabels[type]}
                          onChange={(e) =>
                            updateNested((c) => ({
                              ...c,
                              roomTypeLabels: { ...c.roomTypeLabels, [type]: e.target.value },
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
                          <label className="cursor-pointer inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={highlightText}>
                            <Upload size={12} />
                            Upload
                            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addRoomPhotos(type, e.target.files)} />
                          </label>
                        </div>

                        {/* Responsive thumbnails */}
                        <div className="grid grid-cols-4 gap-1.5 mt-3">
                          {(camp.roomPhotos[type] ?? []).slice(0, 8).map((src, i) => (
                            <button
                              key={i}
                              className="relative rounded-lg overflow-hidden border"
                              style={borderStyle}
                              onClick={() => openPhoto(src, `${camp.roomTypeLabels[type]} — Photo ${i + 1}`)}
                              type="button"
                              title="Click to preview"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt={`${type}-${i}`} className="w-full aspect-square object-cover" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeRoomPhoto(type, i);
                                }}
                                className="absolute top-1 right-1 p-1 rounded-md"
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
                </CompactPanel>
              )}

              {/* The rest of your panels remain intact (kept short here to stay focused on your request) */}
              {/* Keep your inclusions/exclusions/experiences/offers/terms panels exactly as you already have them in your file */}
            </div>

            <div className="lg:col-span-5 space-y-3">
              {/* Keep your lead capture + contact panels exactly as already implemented */}
            </div>
          </div>

          <div className="h-3" />
        </div>
      </main>
    </div>
  );
}
