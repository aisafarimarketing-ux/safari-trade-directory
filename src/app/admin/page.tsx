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

  heroImage: string;
};

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

    hero: true,

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
    },
  ]);

  const camp = portfolio[selectedCampIndex];

  // ---------- UI helpers ----------
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

  // ---------- Styling ----------
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.blockBg,
    borderColor: theme.borderColor,
    color: theme.accent,
  };
  const borderStyle: React.CSSProperties = { borderColor: theme.borderColor };
  const accentText: React.CSSProperties = { color: theme.accent };
  const highlightText: React.CSSProperties = { color: theme.highlight };
  const highlightBg: React.CSSProperties = { backgroundColor: theme.highlight };

  const frame =
    "border rounded-[28px] shadow-[0_18px_60px_rgba(0,0,0,0.08)] hover:shadow-[0_26px_90px_rgba(0,0,0,0.12)] transition-all";
  const soft =
    "bg-white/60 backdrop-blur-md";

  const label = "text-[10px] font-black uppercase tracking-[0.35em]";
  const micro = "text-[9px] font-black uppercase tracking-[0.25em]";

  // ---------- Images ----------
  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  // Room photos
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

  // Hero
  const heroFileRef = useRef<HTMLInputElement | null>(null);
  const setHeroFromFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) return;
    updateField("heroImage", await toDataUrl(f));
  };

  // ---------- vCard + VCF upload ----------
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

  // ---------- List CRUD ----------
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

  return (
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: theme.pageBg }}>
      {/* PHOTO MODAL */}
      {photoModal.open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.78)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closePhoto();
          }}
        >
          <div className="w-full max-w-6xl rounded-3xl overflow-hidden border shadow-2xl" style={cardStyle}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={borderStyle}>
              <div className="text-xs font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.75 }}>
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
              <div className="max-h-[78vh] overflow-auto rounded-2xl border" style={borderStyle}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoModal.src} alt="Preview" className="w-full h-auto block" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      {!isPreview && (
        <aside
          className="w-64 fixed h-screen top-0 left-0 z-[100] p-5 flex flex-col border-r"
          style={{ backgroundColor: theme.blockBg, borderColor: theme.borderColor }}
        >
          <div className="flex items-center justify-between mb-6">
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

          <div className="flex-1 space-y-5 overflow-y-auto pr-2">
            <div>
              <p className="text-[9px] font-bold uppercase mb-3 tracking-[0.2em]" style={{ color: theme.accent, opacity: 0.5 }}>
                View Toggles
              </p>
              <div className="space-y-1">
                {Object.keys(visibleBlocks).map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleBlock(key as any)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                    style={{ backgroundColor: "transparent" }}
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

            <div className="pt-5 border-t space-y-3" style={borderStyle}>
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
            className="mt-5 w-full py-4 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
            style={highlightBg}
            type="button"
          >
            <Save size={14} className="inline mr-2" /> Save Changes
          </button>
        </aside>
      )}

      {/* MAIN */}
      <main className={`flex-1 transition-all ${!isPreview ? "ml-64" : "ml-0"}`}>
        {isPreview && (
          <button
            onClick={() => setIsPreview(false)}
            className="fixed top-6 right-6 z-[200] bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-2xl"
            type="button"
          >
            <Monitor size={14} /> Open Admin
          </button>
        )}

        {/* ABOVE HERO STACK */}
        {visibleBlocks.heroHeaderStack && (
          <div className="max-w-6xl mx-auto px-6 pt-10">
            <div className={`${frame} ${soft} p-6 md:p-7 space-y-5`} style={cardStyle}>
              {/* TOP META */}
              {visibleBlocks.heroTopMeta && (
                <div className={`${frame} p-6 md:p-7`} style={cardStyle}>
                  <div className="flex items-center justify-between mb-5">
                    <div className={label} style={{ color: theme.accent, opacity: 0.55 }}>
                      Brand & Trust
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: theme.accent, opacity: 0.35 }}>
                      Directory Card
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Social */}
                    <div className="space-y-3">
                      <div className={micro} style={{ color: theme.accent, opacity: 0.55 }}>
                        Social proof
                      </div>

                      <div className="flex items-center gap-3">
                        <StarIcon size={18} style={highlightText} />
                        <input
                          inputMode="decimal"
                          className="text-3xl font-black italic outline-none w-24 bg-transparent"
                          value={camp.rating}
                          onChange={(e) => updateField("rating", numDraft(e.target.value))}
                          style={accentText}
                        />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.5 }}>
                          / 5
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.35 }}>
                          Reviews
                        </span>
                        <input
                          inputMode="numeric"
                          className="text-sm font-black outline-none bg-transparent w-20"
                          value={camp.reviewCount}
                          onChange={(e) => updateField("reviewCount", numDraft(e.target.value))}
                          style={accentText}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Instagram size={14} style={{ color: theme.accent, opacity: 0.55 }} />
                        <input
                          className="text-xs font-bold uppercase tracking-wider outline-none bg-transparent w-full"
                          value={camp.instagramHandle}
                          onChange={(e) => updateField("instagramHandle", e.target.value)}
                          style={accentText}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Globe size={14} style={{ color: theme.accent, opacity: 0.55 }} />
                        <input
                          className="text-xs font-bold outline-none bg-transparent w-full"
                          value={camp.website}
                          onChange={(e) => updateField("website", e.target.value)}
                          style={accentText}
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-3">
                      <div className={micro} style={{ color: theme.accent, opacity: 0.55 }}>
                        Location
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin size={16} style={highlightText} />
                        <textarea
                          className="text-sm font-black uppercase tracking-tight outline-none bg-transparent w-full resize-none leading-snug"
                          value={camp.locationLabel}
                          onChange={(e) => updateField("locationLabel", e.target.value)}
                          rows={2}
                          style={{ color: theme.accent, opacity: 0.95 }}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <Compass size={14} style={{ color: theme.accent, opacity: 0.55 }} />
                        <input
                          className="text-xs font-bold outline-none bg-transparent w-full"
                          value={camp.mapLink}
                          onChange={(e) => updateField("mapLink", e.target.value)}
                          style={accentText}
                        />
                      </div>
                    </div>

                    {/* Inventory summary */}
                    <div className="space-y-3">
                      <div className={micro} style={{ color: theme.accent, opacity: 0.55 }}>
                        Inventory
                      </div>

                      <div className="rounded-2xl border p-5" style={{ borderColor: theme.borderColor, backgroundColor: theme.pageBg }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.55 }}>
                              Total rooms
                            </p>
                            <input
                              inputMode="numeric"
                              className="text-4xl font-black italic outline-none bg-transparent w-24"
                              value={camp.rooms}
                              onChange={(e) => updateField("rooms", numDraft(e.target.value))}
                              style={accentText}
                            />
                          </div>
                          <div className="h-12 w-px" style={{ backgroundColor: theme.borderColor }} />
                          <div className="text-right">
                            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.55 }}>
                              Total units
                            </p>
                            <p className="text-4xl font-black italic" style={{ color: theme.accent, opacity: 0.95 }}>
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

              {/* TRADE PROFILE BOX */}
              {visibleBlocks.heroTradeProfile && (
                <div className={`${frame} p-6 md:p-7 space-y-5`} style={cardStyle}>
                  <div className={label} style={{ color: theme.accent, opacity: 0.45 }}>
                    <input
                      className="outline-none bg-transparent w-full"
                      value={`${camp.tradeProfileLabel} ${camp.tradeProfileSub}`}
                      onChange={(e) => updateField("tradeProfileLabel", e.target.value)}
                      style={{ color: theme.accent, opacity: 0.95 }}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className={micro} style={{ color: theme.accent, opacity: 0.55 }}>
                        Property class
                      </p>
                      <input
                        className="mt-2 text-sm font-black uppercase tracking-tight outline-none bg-transparent w-full border-b pb-2"
                        value={camp.class}
                        onChange={(e) => updateField("class", e.target.value)}
                        style={{ borderColor: theme.borderColor, color: theme.accent }}
                      />
                    </div>

                    <div>
                      <p className={micro} style={{ color: theme.accent, opacity: 0.55 }}>
                        Camp name
                      </p>
                      <input
                        className="mt-2 text-2xl md:text-3xl font-black italic tracking-tighter outline-none bg-transparent w-full border-b pb-2"
                        value={camp.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        style={{ borderColor: theme.borderColor, color: theme.accent }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className={micro} style={{ color: theme.accent, opacity: 0.55 }}>
                      Vibe
                    </p>
                    <textarea
                      className="mt-2 text-sm font-semibold outline-none bg-transparent w-full border rounded-2xl p-4 resize-none"
                      value={camp.vibe}
                      onChange={(e) => updateField("vibe", e.target.value)}
                      rows={3}
                      style={{ borderColor: theme.borderColor, color: theme.accent }}
                    />
                  </div>

                  {/* CONTACT CARD + VCF UPLOAD */}
                  <div className="pt-4 border-t space-y-4" style={borderStyle}>
                    <div className="flex items-center justify-between">
                      <p className={micro} style={{ color: theme.accent, opacity: 0.55 }}>
                        Contact card (QR / NFC)
                      </p>

                      <label className="cursor-pointer inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <FileText size={12} style={highlightText} />
                        <span style={highlightText}>Upload .VCF</span>
                        <input type="file" accept=".vcf,text/vcard" className="hidden" onChange={(e) => loadVcfFile(e.target.files)} />
                      </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        { k: "contactName", ph: "Contact name" },
                        { k: "contactTitle", ph: "Title" },
                        { k: "contactCompany", ph: "Company" },
                        { k: "contactPhone", ph: "Phone" },
                      ].map((f) => (
                        <input
                          key={f.k}
                          className="p-4 rounded-2xl border outline-none text-xs font-semibold bg-transparent"
                          style={{ borderColor: theme.borderColor, color: theme.accent }}
                          value={(camp as any)[f.k] as string}
                          onChange={(e) => updateField(f.k as any, e.target.value as any)}
                          placeholder={f.ph}
                        />
                      ))}
                      <input
                        className="p-4 rounded-2xl border outline-none text-xs font-semibold bg-transparent md:col-span-2"
                        style={{ borderColor: theme.borderColor, color: theme.accent }}
                        value={camp.contactEmail}
                        onChange={(e) => updateField("contactEmail", e.target.value)}
                        placeholder="Email"
                      />
                      <input
                        className="p-4 rounded-2xl border outline-none text-xs font-semibold bg-transparent md:col-span-2"
                        style={{ borderColor: theme.borderColor, color: theme.accent }}
                        value={camp.contactWebsite}
                        onChange={(e) => updateField("contactWebsite", e.target.value)}
                        placeholder="Website"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HERO (NO TEXT OVERLAY) */}
        {visibleBlocks.hero && (
          <section
            className="relative h-[66vh] w-full overflow-hidden mt-6 select-none"
            style={{ backgroundColor: theme.accent }}
            onDoubleClick={() => heroFileRef.current?.click()}
            onContextMenu={(e) => {
              e.preventDefault();
              heroFileRef.current?.click();
            }}
            title="Double-click or right-click to change hero image"
          >
            <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setHeroFromFiles(e.target.files)} />

            {camp.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={camp.heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl border px-6 py-4 text-[10px] font-black uppercase tracking-widest"
                  style={{ borderColor: theme.borderColor, color: "#fff", backgroundColor: "rgba(0,0,0,0.22)" }}
                >
                  Double-click / Right-click to upload hero image
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-black/30" />
          </section>
        )}

        {/* CONTENT */}
        <div className="max-w-6xl mx-auto py-10 px-6 space-y-10">
          {/* INVENTORY MATRIX + ROOM PHOTOS */}
          {visibleBlocks.matrix && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3" style={borderStyle}>
                <h2 className={label} style={{ color: theme.accent, opacity: 0.55 }}>
                  Inventory Matrix
                </h2>
                <span className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: theme.accent, opacity: 0.35 }}>
                  Room Orientation
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["family", "double", "single"] as const).map((type) => (
                  <div key={type} className={`${frame} ${soft} p-6`} style={cardStyle}>
                    <input
                      className="text-[10px] font-black uppercase outline-none bg-transparent"
                      value={camp.roomTypeLabels[type]}
                      onChange={(e) =>
                        updateNested((c) => ({
                          ...c,
                          roomTypeLabels: { ...c.roomTypeLabels, [type]: e.target.value },
                        }))
                      }
                      style={{ color: theme.accent, opacity: 0.72 }}
                    />

                    <div className="flex items-center gap-4 mt-5">
                      <input
                        inputMode="numeric"
                        className="text-5xl font-black italic outline-none w-16 bg-transparent"
                        value={camp[type]}
                        onChange={(e) => updateField(type, numDraft(e.target.value) as any)}
                        style={{ color: theme.accent, opacity: 0.95 }}
                      />
                      <div className="h-10 w-px" style={{ backgroundColor: theme.borderColor }} />
                      <span className="text-[10px] font-bold uppercase leading-tight" style={{ color: theme.accent, opacity: 0.5 }}>
                        Total
                        <br />
                        Units
                      </span>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className={micro} style={{ color: theme.accent, opacity: 0.55 }}>
                          Room photos
                        </p>
                        <label className="cursor-pointer inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                          <Upload size={12} style={highlightText} />
                          <span style={highlightText}>Upload</span>
                          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addRoomPhotos(type, e.target.files)} />
                        </label>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {(camp.roomPhotos[type] ?? []).slice(0, 8).map((src, i) => (
                          <button
                            key={i}
                            className="relative rounded-xl overflow-hidden border"
                            style={borderStyle}
                            onClick={() => openPhoto(src, `${camp.roomTypeLabels[type]} — Photo ${i + 1}`)}
                            type="button"
                            title="Click to preview"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt={`${type}-${i}`} className="w-full h-16 object-cover" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRoomPhoto(type, i);
                              }}
                              className="absolute top-1 right-1 p-1 rounded-lg"
                              style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
                              title="Remove"
                              type="button"
                            >
                              <X size={12} className="text-white" />
                            </button>
                          </button>
                        ))}
                      </div>

                      <p className="text-[10px] font-medium" style={{ color: theme.accent, opacity: 0.55 }}>
                        Click any photo to open full-size preview.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INCLUSIONS + EXCLUSIONS */}
          <div className="grid md:grid-cols-2 gap-4">
            {visibleBlocks.inclusions && (
              <div className={`${frame} ${soft} p-7 space-y-5`} style={cardStyle}>
                <div className="flex items-center justify-between border-b pb-3" style={borderStyle}>
                  <div className="flex items-center gap-2">
                    <Utensils size={14} style={accentText} />
                    <h3 className={label} style={{ color: theme.accent, opacity: 0.6 }}>
                      Inclusions
                    </h3>
                  </div>
                  <button onClick={() => addListItem("inclusions")} style={highlightText} type="button">
                    <Plus size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {camp.inclusions.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <Check size={12} className="text-green-500" />
                      <input
                        className="text-sm font-semibold outline-none bg-transparent w-full"
                        value={item}
                        onChange={(e) => updateListItem("inclusions", i, e.target.value)}
                        style={{ color: theme.accent, opacity: 0.92 }}
                      />
                      <button
                        onClick={() => removeListItem("inclusions", i)}
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
              </div>
            )}

            {visibleBlocks.exclusions && (
              <div className={`${frame} ${soft} p-7 space-y-5`} style={{ ...cardStyle, opacity: 0.95 }}>
                <div className="flex items-center justify-between border-b pb-3" style={borderStyle}>
                  <div className="flex items-center gap-2">
                    <Ban size={14} style={{ color: "#f87171" }} />
                    <h3 className={label} style={{ color: theme.accent, opacity: 0.6 }}>
                      Exclusions
                    </h3>
                  </div>
                  <button onClick={() => addListItem("exclusions")} style={highlightText} type="button">
                    <Plus size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {camp.exclusions.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <X size={10} style={{ color: theme.accent, opacity: 0.45 }} />
                      <input
                        className="text-sm font-semibold outline-none bg-transparent w-full italic"
                        value={item}
                        onChange={(e) => updateListItem("exclusions", i, e.target.value)}
                        style={{ color: theme.accent, opacity: 0.86 }}
                      />
                      <button
                        onClick={() => removeListItem("exclusions", i)}
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
              </div>
            )}
          </div>

          {/* SERVICES / EXPERIENCES (FREE + PAID) */}
          {visibleBlocks.experiences && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3" style={borderStyle}>
                <h2 className={label} style={{ color: theme.accent, opacity: 0.55 }}>
                  Services & Experiences
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className={`${frame} ${soft} p-7 space-y-5`} style={cardStyle}>
                  <div className="flex items-center justify-between">
                    <p className={label} style={{ color: theme.accent, opacity: 0.6 }}>
                      Included
                    </p>
                    <button onClick={() => addListItem("freeActivities")} style={highlightText} type="button">
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {camp.freeActivities.map((act, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <Compass size={14} style={highlightText} />
                        <input
                          className="text-sm font-semibold uppercase tracking-tight outline-none bg-transparent w-full"
                          value={act}
                          onChange={(e) => updateListItem("freeActivities", i, e.target.value)}
                          style={{ color: theme.accent, opacity: 0.92 }}
                        />
                        <button
                          onClick={() => removeListItem("freeActivities", i)}
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
                  className={`${frame} p-7 space-y-5`}
                  style={{
                    backgroundColor: theme.accent,
                    borderColor: theme.accent,
                    color: "#fff",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className={label} style={{ color: "#fff", opacity: 0.85 }}>
                      Premium add-ons
                    </p>
                    <button onClick={() => addListItem("paidActivities")} style={{ color: "#fff", opacity: 0.9 }} type="button">
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {camp.paidActivities.map((act, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <MapPin size={14} className="text-white/60" />
                        <input
                          className="text-sm font-semibold uppercase tracking-tight outline-none bg-transparent w-full text-white"
                          value={act}
                          onChange={(e) => updateListItem("paidActivities", i, e.target.value)}
                        />
                        <button
                          onClick={() => removeListItem("paidActivities", i)}
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

          {/* OFFERS */}
          {visibleBlocks.offers && (
            <div className={`${frame} p-10 text-white`} style={{ ...highlightBg, borderColor: theme.highlight }}>
              <div className="text-center space-y-3">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60">Trade Incentive</span>
                <textarea
                  className="bg-transparent text-4xl md:text-5xl font-black italic tracking-tighter outline-none w-full h-28 text-center resize-none leading-none"
                  value={camp.offersText}
                  onChange={(e) => updateField("offersText", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TERMS */}
          {visibleBlocks.terms && (
            <div className={`${frame} ${soft} p-7 space-y-4`} style={cardStyle}>
              <div className="flex items-center justify-between border-b pb-3" style={borderStyle}>
                <h3 className={label} style={{ color: theme.accent, opacity: 0.6 }}>
                  Terms
                </h3>
              </div>
              <textarea
                className="w-full rounded-2xl border p-4 text-sm font-semibold outline-none bg-transparent resize-none"
                style={{ borderColor: theme.borderColor, color: theme.accent }}
                rows={4}
                value={camp.terms}
                onChange={(e) => updateField("terms", e.target.value)}
              />
            </div>
          )}

          {/* LEAD CAPTURE + CONTACT ACTIONS */}
          {visibleBlocks.leadCapture && (
            <div className={`${frame} ${soft} p-8 md:p-10`} style={cardStyle}>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <p className={label} style={{ color: theme.accent, opacity: 0.45 }}>
                    Lead capture
                  </p>

                  <textarea
                    className="text-3xl md:text-4xl font-black italic tracking-tighter outline-none w-full resize-none leading-tight bg-transparent"
                    value={camp.leadHeadline}
                    onChange={(e) => updateField("leadHeadline", e.target.value)}
                    rows={2}
                    style={{ color: theme.accent, opacity: 0.95 }}
                  />

                  <textarea
                    className="text-sm font-semibold outline-none w-full resize-none leading-relaxed bg-transparent"
                    value={camp.leadSubcopy}
                    onChange={(e) => updateField("leadSubcopy", e.target.value)}
                    rows={3}
                    style={{ color: theme.accent, opacity: 0.72 }}
                  />

                  <div className="space-y-3">
                    {(["leadBullet1", "leadBullet2", "leadBullet3"] as const).map((k) => (
                      <div key={k} className="flex items-center gap-3">
                        <Check size={14} className="text-green-500" />
                        <input
                          className="text-xs font-black uppercase tracking-tight outline-none bg-transparent w-full"
                          value={camp[k]}
                          onChange={(e) => updateField(k, e.target.value as any)}
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
                      onChange={(e) => updateField("leadDisclaimer", e.target.value)}
                      style={{ color: theme.accent, opacity: 0.65 }}
                    />
                  </div>
                </div>

                <div className="rounded-[26px] border p-7 space-y-4" style={{ borderColor: theme.borderColor, backgroundColor: theme.pageBg }}>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.55 }}>
                      Enquiry form
                    </p>
                    <button className="p-2 rounded-xl border" style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg }} type="button">
                      <Camera size={14} style={{ color: theme.accent, opacity: 0.55 }} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none" style={cardStyle} placeholder="Full name" />
                    <input className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none" style={cardStyle} placeholder="Agency" />
                    <input className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none md:col-span-2" style={cardStyle} placeholder="Email" />
                    <input className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none md:col-span-2" style={cardStyle} placeholder="WhatsApp / Phone" />
                    <textarea className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none md:col-span-2 resize-none" style={cardStyle} placeholder="Message..." rows={4} />
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <button
                        className="flex-1 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center"
                        style={highlightBg}
                        type="button"
                      >
                        <input className="bg-transparent outline-none text-center w-full cursor-text" value={camp.leadCta} onChange={(e) => updateField("leadCta", e.target.value)} />
                      </button>
                    </div>

                    {/* Contact actions: same line */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={shareContact}
                        className="px-4 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={cardStyle}
                        type="button"
                        title="Share my contacts"
                      >
                        <Share2 size={14} /> Share
                      </button>

                      <a
                        href={vcardUrl || `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardText)}`}
                        download={`${(camp.contactName || "contact").replace(/\s+/g, "_")}.vcf`}
                        className="px-4 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={cardStyle}
                        title="Download contact"
                      >
                        <Download size={14} /> Download
                      </a>

                      <button
                        onClick={saveContact}
                        className="px-4 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={cardStyle}
                        type="button"
                        title="Save contacts"
                      >
                        <Contact size={14} /> Save
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold" style={{ color: theme.accent, opacity: 0.6 }}>
                      <Percent size={12} />
                      Trade-friendly response timing: <span style={{ color: theme.accent, opacity: 1 }}>same day</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tiny spacer at end */}
          <div className="h-2" />
        </div>
      </main>
    </div>
  );
}
