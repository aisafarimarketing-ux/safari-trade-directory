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
  Layout,
  FileText,
} from "lucide-react";

type RoomKey = "family" | "double" | "single";

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
    hero: true,
    heroTopMeta: true,
    heroTradeProfile: true,
    heroHeaderStack: true,
    matrix: true,
    inclusions: true,
    exclusions: true,
    experiences: true, // ✅ ensure service/experiences is back
    offers: true,
    terms: true,
    leadCapture: true,
  });

  const [portfolio, setPortfolio] = useState([
    {
      name: "Nyumbani Serengeti",
      class: "Tented (Luxury)",

      // numbers can temporarily be "" while typing (prevents NaN)
      rooms: 10 as number | "",
      family: 2 as number | "",
      double: 6 as number | "",
      single: 2 as number | "",

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

      rating: 4.9 as number | "",
      reviewCount: 128 as number | "",
      instagramHandle: "@nyumbani.collections",
      website: "https://example.com",

      roomTypeLabels: {
        family: "Family setup",
        double: "Double setup",
        single: "Single setup",
      },

      roomPhotos: {
        family: [] as string[],
        double: [] as string[],
        single: [] as string[],
      },

      leadHeadline: "Get rates, availability & trade support in one reply.",
      leadSubcopy:
        "Leave your details and we’ll send a trade-ready fact sheet, inclusions, and a quick quote.",
      leadBullet1: "Agent-ready proposal + net rates",
      leadBullet2: "Seasonality guidance + offers",
      leadBullet3: "Fast response from reservations",
      leadCta: "Request Trade Pack",
      leadDisclaimer:
        "By submitting, you agree to be contacted by our reservations team.",

      contactName: "Nyumbani Reservations",
      contactTitle: "Trade Desk",
      contactCompany: "Nyumbani Collections",
      contactEmail: "trade@nyumbani.example",
      contactPhone: "+255 000 000 000",
      contactWebsite: "https://example.com",

      heroImage: "" as string,
    },
  ]);

  const camp = portfolio[selectedCampIndex];

  const toggleBlock = (key: keyof typeof visibleBlocks) => {
    setVisibleBlocks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ✅ Numeric typing fix (no more NaN while deleting)
  const numberDraft = (raw: string): number | "" => {
    if (raw === "") return "";
    const n = Number(raw);
    return Number.isFinite(n) ? n : "";
  };

  const updateField = (field: string, value: any) => {
    const updated = [...portfolio];
    (updated[selectedCampIndex] as any)[field] = value;
    setPortfolio(updated);
  };

  const addItem = (listKey: string) => {
    const updated = [...portfolio];
    (updated[selectedCampIndex] as any)[listKey].push("New Item");
    setPortfolio(updated);
  };

  const deleteItem = (listKey: string, index: number) => {
    const updated = [...portfolio];
    (updated[selectedCampIndex] as any)[listKey] = (updated[selectedCampIndex] as any)[
      listKey
    ].filter((_: any, i: number) => i !== index);
    setPortfolio(updated);
  };

  const totalUnits =
    (Number(camp.family) || 0) + (Number(camp.double) || 0) + (Number(camp.single) || 0);

  // THEME (applied everywhere)
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.blockBg,
    borderColor: theme.borderColor,
    color: theme.accent,
  };
  const borderStyle: React.CSSProperties = { borderColor: theme.borderColor };
  const accentText: React.CSSProperties = { color: theme.accent };
  const highlightText: React.CSSProperties = { color: theme.highlight };
  const highlightBg: React.CSSProperties = { backgroundColor: theme.highlight };

  // Shadcn-ish “frame”
  const frameClass =
    "border rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.10)] hover:shadow-[0_26px_80px_rgba(0,0,0,0.14)] transition-all";
  const cardClass = `border rounded-[2.5rem] ${frameClass}`;
  const miniCardClass = `border rounded-2xl ${frameClass}`;
  const headingClass =
    "text-[10px] font-black uppercase tracking-[0.35em]";
  const subLabelClass =
    "text-[9px] font-black uppercase tracking-[0.25em]";

  // ---- Image utils ----
  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ---- Room photo upload + modal preview ----
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
    const updated = [...portfolio];
    const cur = updated[selectedCampIndex] as any;
    const existing: string[] = cur.roomPhotos?.[roomKey] ?? [];
    cur.roomPhotos[roomKey] = [...existing, ...urls].slice(0, 6);
    setPortfolio(updated);
  };

  const removeRoomPhoto = (roomKey: RoomKey, index: number) => {
    const updated = [...portfolio];
    const cur = updated[selectedCampIndex] as any;
    cur.roomPhotos[roomKey] = (cur.roomPhotos?.[roomKey] ?? []).filter((_: any, i: number) => i !== index);
    setPortfolio(updated);
  };

  // ---- Hero change: right click / double click ----
  const heroFileRef = useRef<HTMLInputElement | null>(null);
  const setHeroFromFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) return;
    updateField("heroImage", await toDataUrl(f));
  };

  // ---- vCard ----
  const vcardText = useMemo(() => {
    const esc = (s: string) =>
      String(s ?? "").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
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
      } else {
        if (vcardUrl) window.open(vcardUrl, "_blank");
      }
    } catch {
      if (vcardUrl) window.open(vcardUrl, "_blank");
    }
  };

  const saveContact = () => {
    const a = document.createElement("a");
    a.href = vcardUrl || "data:text/vcard;charset=utf-8," + encodeURIComponent(vcardText);
    a.download = `${(camp.contactName || "contact").replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const parseVcf = (text: string) => {
    const lines = text.split(/\r?\n/);
    const get = (prefix: string) => {
      const hit = lines.find((l) => l.toUpperCase().startsWith(prefix.toUpperCase()));
      if (!hit) return "";
      return hit.split(":").slice(1).join(":").trim();
    };

    const fn = get("FN");
    const org = get("ORG");
    const title = get("TITLE");
    const emailLine = lines.find((l) => l.toUpperCase().includes("EMAIL"));
    const telLine = lines.find((l) => l.toUpperCase().includes("TEL"));
    const urlLine = lines.find((l) => l.toUpperCase().startsWith("URL"));

    const email = emailLine ? emailLine.split(":").slice(1).join(":").trim() : "";
    const tel = telLine ? telLine.split(":").slice(1).join(":").trim() : "";
    const url = urlLine ? urlLine.split(":").slice(1).join(":").trim() : "";

    return {
      contactName: fn || "",
      contactCompany: org || "",
      contactTitle: title || "",
      contactEmail: email || "",
      contactPhone: tel || "",
      contactWebsite: url || "",
    };
  };

  const loadVcfFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.toLowerCase().endsWith(".vcf")) return;

    const text = await file.text();
    const parsed = parseVcf(text);

    const updated = [...portfolio];
    const cur = updated[selectedCampIndex] as any;
    Object.entries(parsed).forEach(([k, v]) => {
      if (v) cur[k] = v;
    });
    setPortfolio(updated);
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
              <div className="text-xs font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.7 }}>
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

      {/* SIDEBAR */}
      {!isPreview && (
        <aside
          className="w-64 fixed h-screen top-0 left-0 z-[100] p-5 flex flex-col shadow-2xl border-r"
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
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-black/5"
                    type="button"
                  >
                    <span
                      style={{
                        color: theme.accent,
                        opacity: visibleBlocks[key as keyof typeof visibleBlocks] ? 1 : 0.25,
                      }}
                    >
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

        {/* ABOVE HERO */}
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
                          onChange={(e) => updateField("rating", numberDraft(e.target.value))}
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
                          onChange={(e) => updateField("reviewCount", numberDraft(e.target.value))}
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

                    <div className="space-y-3">
                      <div className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
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

                    <div className="space-y-3">
                      <div className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
                        Inventory
                      </div>
                      <div className={`${miniCardClass} p-5`} style={{ borderColor: theme.borderColor, backgroundColor: theme.pageBg }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.55 }}>
                              Total rooms
                            </p>
                            <input
                              inputMode="numeric"
                              className="text-4xl font-black italic outline-none bg-transparent w-24"
                              value={camp.rooms}
                              onChange={(e) => updateField("rooms", numberDraft(e.target.value))}
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

              {visibleBlocks.heroTradeProfile && (
                <div className={`${cardClass} p-8 md:p-10 space-y-6`} style={cardStyle}>
                  <div className={headingClass} style={{ color: theme.accent, opacity: 0.45 }}>
                    <input
                      className="outline-none bg-transparent w-full"
                      value={`${camp.tradeProfileLabel} ${camp.tradeProfileSub}`}
                      onChange={(e) => updateField("tradeProfileLabel", e.target.value)}
                      style={{ color: theme.accent, opacity: 0.95 }}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
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
                      <p className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
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
                    <p className={subLabelClass} style={{ color: theme.accent, opacity: 0.55 }}>
                      Vibe
                    </p>
                    <textarea
                      className="mt-2 text-sm font-medium outline-none bg-transparent w-full border rounded-2xl p-4 resize-none"
                      value={camp.vibe}
                      onChange={(e) => updateField("vibe", e.target.value)}
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
                          onChange={(e) => loadVcfFile(e.target.files)}
                        />
                      </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
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
                          value={(camp as any)[f.k]}
                          onChange={(e) => updateField(f.k, e.target.value)}
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

        {/* HERO */}
        {visibleBlocks.hero && (
          <section
            className="relative h-[70vh] w-full overflow-hidden mt-6 select-none"
            style={{ backgroundColor: theme.accent }}
            onDoubleClick={() => heroFileRef.current?.click()}
            onContextMenu={(e) => {
              e.preventDefault();
              heroFileRef.current?.click();
            }}
            title="Double-click or right-click to change hero image"
          >
            <input
              ref={heroFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setHeroFromFiles(e.target.files)}
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

        {/* CONTENT */}
        <div className="max-w-5xl mx-auto py-12 px-6 space-y-12">
          {/* MATRIX */}
          {visibleBlocks.matrix && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b pb-3" style={borderStyle}>
                <h2 className={headingClass} style={{ color: theme.accent, opacity: 0.55 }}>
                  Inventory Matrix
                </h2>
                <Layout size={16} style={{ color: theme.accent, opacity: 0.45 }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["family", "double", "single"] as const).map((type) => (
                  <div key={type} className={`${cardClass} p-8`} style={cardStyle}>
                    <input
                      className="text-[10px] font-black uppercase outline-none bg-transparent"
                      value={camp.roomTypeLabels[type]}
                      onChange={(e) => {
                        const updated = [...portfolio];
                        const cur = updated[selectedCampIndex] as any;
                        cur.roomTypeLabels[type] = e.target.value;
                        setPortfolio(updated);
                      }}
                      style={{ color: theme.accent, opacity: 0.65 }}
                    />

                    <div className="flex items-center gap-4 mt-6">
                      <input
                        inputMode="numeric"
                        className="text-5xl font-black italic outline-none w-16 bg-transparent"
                        value={(camp as any)[type]}
                        onChange={(e) => updateField(type, numberDraft(e.target.value))}
                        style={{ color: theme.accent, opacity: 0.95 }}
                      />
                      <div className="h-10 w-px" style={{ backgroundColor: theme.borderColor }} />
                      <span className="text-[10px] font-bold uppercase leading-tight" style={{ color: theme.accent, opacity: 0.5 }}>
                        Total
                        <br />
                        Units
                      </span>
                    </div>

                    {/* Photos */}
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
                            onChange={(e) => addRoomPhotos(type, e.target.files)}
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {(camp.roomPhotos[type] ?? []).map((src: string, i: number) => (
                          <button
                            key={i}
                            className="relative rounded-xl overflow-hidden border text-left"
                            style={borderStyle}
                            onClick={() => openPhoto(src, `${camp.roomTypeLabels[type]} — Photo ${i + 1}`)}
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

                      <p className="text-[10px] font-medium" style={{ color: theme.accent, opacity: 0.6 }}>
                        Click any thumbnail for full-size preview.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INCLUSIONS & EXCLUSIONS */}
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
                  {camp.inclusions.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <Check size={12} className="text-green-500" />
                      <input
                        className="text-sm font-semibold outline-none bg-transparent w-full"
                        value={item}
                        onChange={(e) => {
                          const updated = [...portfolio];
                          updated[selectedCampIndex].inclusions[i] = e.target.value;
                          setPortfolio(updated);
                        }}
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
                  {camp.exclusions.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <X size={10} style={{ color: theme.accent, opacity: 0.45 }} />
                      <input
                        className="text-sm font-semibold outline-none bg-transparent w-full italic"
                        value={item}
                        onChange={(e) => {
                          const updated = [...portfolio];
                          updated[selectedCampIndex].exclusions[i] = e.target.value;
                          setPortfolio(updated);
                        }}
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

          {/* ✅ EXPERIENCES / SERVICES (FREE + PAID) */}
          {visibleBlocks.experiences && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b pb-3" style={borderStyle}>
                <h2 className={headingClass} style={{ color: theme.accent, opacity: 0.55 }}>
                  Services & Experiences
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Free */}
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
                    {camp.freeActivities.map((act: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <Compass size={14} style={highlightText} />
                        <input
                          className="text-sm font-semibold uppercase tracking-tight outline-none bg-transparent w-full"
                          value={act}
                          onChange={(e) => {
                            const updated = [...portfolio];
                            updated[selectedCampIndex].freeActivities[i] = e.target.value;
                            setPortfolio(updated);
                          }}
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

                {/* Paid */}
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
                    <button onClick={() => addItem("paidActivities")} style={{ color: "#fff", opacity: 0.85 }} type="button">
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {camp.paidActivities.map((act: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <MapPin size={14} className="text-white/60" />
                        <input
                          className="text-sm font-semibold uppercase tracking-tight outline-none bg-transparent w-full text-white"
                          value={act}
                          onChange={(e) => {
                            const updated = [...portfolio];
                            updated[selectedCampIndex].paidActivities[i] = e.target.value;
                            setPortfolio(updated);
                          }}
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

          {/* LEAD CAPTURE */}
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
                    {["leadBullet1", "leadBullet2", "leadBullet3"].map((k) => (
                      <div key={k} className="flex items-center gap-3">
                        <Check size={14} className="text-green-500" />
                        <input
                          className="text-xs font-black uppercase tracking-tight outline-none bg-transparent w-full"
                          value={(camp as any)[k]}
                          onChange={(e) => updateField(k, e.target.value)}
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

                <div className="rounded-[2.5rem] border p-8 space-y-4" style={{ borderColor: theme.borderColor, backgroundColor: theme.pageBg }}>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.55 }}>
                      Enquiry form
                    </p>
                    <button className="p-2 rounded-xl border" style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg }} type="button">
                      <Camera size={14} style={{ color: theme.accent, opacity: 0.55 }} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["Full name", "Agency"].map((ph) => (
                      <input
                        key={ph}
                        className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none"
                        style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg, color: theme.accent }}
                        placeholder={ph}
                      />
                    ))}
                    {["Email", "WhatsApp / Phone"].map((ph) => (
                      <input
                        key={ph}
                        className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none md:col-span-2"
                        style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg, color: theme.accent }}
                        placeholder={ph}
                      />
                    ))}
                    <textarea
                      className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none md:col-span-2 resize-none"
                      style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg, color: theme.accent }}
                      placeholder="Message..."
                      rows={4}
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                    <button
                      className="flex-1 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center"
                      style={highlightBg}
                      type="button"
                    >
                      <input
                        className="bg-transparent outline-none text-center w-full cursor-text"
                        value={camp.leadCta}
                        onChange={(e) => updateField("leadCta", e.target.value)}
                      />
                    </button>

                    <div className="flex gap-2">
                      <button onClick={shareContact} className="px-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={cardStyle} type="button">
                        <Share2 size={14} /> Share
                      </button>
                      <a
                        href={vcardUrl || "data:text/vcard;charset=utf-8," + encodeURIComponent(vcardText)}
                        download={`${(camp.contactName || "contact").replace(/\s+/g, "_")}.vcf`}
                        className="px-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={cardStyle}
                      >
                        <Download size={14} /> Download
                      </a>
                      <button onClick={saveContact} className="px-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={cardStyle} type="button">
                        <Contact size={14} /> Save
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold" style={{ color: theme.accent, opacity: 0.6 }}>
                    <Percent size={12} />
                    Trade-friendly response timing: <span style={{ color: theme.accent, opacity: 1 }}>same day</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reference: layout tightening + “framed” look aligned to your screenshot */}
          <div className="text-[10px] font-semibold" style={{ color: theme.accent, opacity: 0.35 }}>
            Layout tightened and framed to match your admin UI screenshots. :contentReference[oaicite:0]{index=0}
          </div>
        </div>
      </main>
    </div>
  );
}
