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
  Star as StarIcon, // ✅ FIX: alias prevents "Cannot find name 'Star'" + avoids collisions
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
} from "lucide-react";

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
    experiences: true,
    offers: true,
    terms: true,
    leadCapture: true,
  });

  const [portfolio, setPortfolio] = useState([
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

      // ✅ NEW: Hero image (data URL)
      heroImage: "" as string,
    },
  ]);

  const toggleBlock = (key: keyof typeof visibleBlocks) => {
    setVisibleBlocks((prev) => ({ ...prev, [key]: !prev[key] }));
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
    (updated[selectedCampIndex] as any)[listKey] = (updated[
      selectedCampIndex
    ] as any)[listKey].filter((_: any, i: number) => i !== index);
    setPortfolio(updated);
  };

  const camp = portfolio[selectedCampIndex];

  const totalUnits =
    (Number(camp.family) || 0) +
    (Number(camp.double) || 0) +
    (Number(camp.single) || 0);

  // THEME HELPERS (applied beyond pageBg)
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.blockBg,
    borderColor: theme.borderColor,
    color: theme.accent,
  };
  const mutedCardStyle: React.CSSProperties = {
    backgroundColor: theme.blockBg,
    borderColor: theme.borderColor,
    color: theme.accent,
    opacity: 0.85,
  };
  const borderStyle: React.CSSProperties = { borderColor: theme.borderColor };
  const accentText: React.CSSProperties = { color: theme.accent };
  const highlightText: React.CSSProperties = { color: theme.highlight };
  const highlightBg: React.CSSProperties = { backgroundColor: theme.highlight };

  // ---- Room Photo Upload ----
  const addRoomPhotos = async (
    roomKey: "family" | "double" | "single",
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;

    const toDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const urls: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const url = await toDataUrl(file);
      urls.push(url);
    }

    const updated = [...portfolio];
    const current = updated[selectedCampIndex] as any;

    const existing: string[] = current.roomPhotos?.[roomKey] ?? [];
    current.roomPhotos =
      current.roomPhotos || ({"family": [], "double": [], "single": []} as any);
    current.roomPhotos[roomKey] = [...existing, ...urls].slice(0, 6);

    setPortfolio(updated);
  };

  const removeRoomPhoto = (roomKey: "family" | "double" | "single", index: number) => {
    const updated = [...portfolio];
    const current = updated[selectedCampIndex] as any;
    current.roomPhotos[roomKey] = (current.roomPhotos?.[roomKey] ?? []).filter(
      (_: any, i: number) => i !== index
    );
    setPortfolio(updated);
  };

  // ✅ NEW: Photo preview modal (big window)
  const [photoModal, setPhotoModal] = useState<{ open: boolean; src: string; title?: string }>({
    open: false,
    src: "",
    title: "",
  });

  const openPhoto = (src: string, title?: string) => {
    setPhotoModal({ open: true, src, title });
  };

  const closePhoto = () => {
    setPhotoModal({ open: false, src: "", title: "" });
  };

  // ---- vCard for NFC/QR ----
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
        await navigator.share({
          title: camp.contactName,
          text: "Contact card",
          files: [file],
        });
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

  // ✅ NEW: Hero image chooser (double click OR right click)
  const heroFileRef = useRef<HTMLInputElement | null>(null);

  const setHeroFromFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return;

    const toDataUrl = (f: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(f);
      });

    const url = await toDataUrl(file);
    updateField("heroImage", url);
  };

  return (
    <div className="flex min-h-screen font-sans transition-all" style={{ backgroundColor: theme.pageBg }}>
      {/* PHOTO MODAL (big preview) */}
      {photoModal.open && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
          onMouseDown={(e) => {
            // click backdrop closes
            if (e.target === e.currentTarget) closePhoto();
          }}
        >
          <div
            className="w-full max-w-6xl rounded-3xl overflow-hidden border shadow-2xl"
            style={{ backgroundColor: theme.blockBg, borderColor: theme.borderColor }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b" style={borderStyle}>
              <div className="text-xs font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.6 }}>
                {photoModal.title || "Preview"}
              </div>
              <button
                onClick={closePhoto}
                className="p-2 rounded-xl border"
                style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg }}
              >
                <X size={16} style={accentText} />
              </button>
            </div>
            <div className="p-4">
              {/* Real-size friendly: no forced crop; scroll if huge */}
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
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.5 }}>
              Restoration Hub
            </span>
            <button
              onClick={() => setIsPreview(true)}
              className="p-2 rounded-lg border"
              style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg }}
            >
              <Eye size={14} style={accentText} />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-2">
            <div>
              <p className="text-[9px] font-bold uppercase mb-4 tracking-[0.2em]" style={{ color: theme.accent, opacity: 0.45 }}>
                View Toggles
              </p>
              <div className="space-y-1">
                {Object.keys(visibleBlocks).map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleBlock(key as any)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                    style={{ backgroundColor: "transparent" }}
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

            <div className="pt-6 border-t space-y-3" style={borderStyle}>
              <p className="text-[9px] font-bold uppercase" style={{ color: theme.accent, opacity: 0.45 }}>
                Accents
              </p>
              {Object.entries(theme).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-medium" style={{ color: theme.accent, opacity: 0.8 }}>
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
            className="mt-6 w-full py-4 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center"
            style={highlightBg}
          >
            <Save size={14} className="inline mr-2" /> Save Global
          </button>
        </aside>
      )}

      {/* MAIN */}
      <main className={`flex-1 transition-all ${!isPreview ? "ml-64" : "ml-0"}`}>
        {isPreview && (
          <button
            onClick={() => setIsPreview(false)}
            className="fixed top-6 right-6 z-[200] px-5 py-2.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-2xl border"
            style={{ backgroundColor: theme.accent, color: "#fff", borderColor: theme.accent }}
          >
            <Monitor size={14} /> Open Admin
          </button>
        )}

        {/* ABOVE HERO */}
        {visibleBlocks.heroHeaderStack && (
          <div className="max-w-6xl mx-auto px-6 pt-10">
            <div className="rounded-[3rem] border p-6 md:p-8 shadow-sm space-y-6" style={cardStyle}>
              {visibleBlocks.heroTopMeta && (
                <div className="rounded-[2.5rem] border p-8 shadow-sm" style={cardStyle}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: theme.accent, opacity: 0.5 }}>
                        Social proof
                      </p>
                      <div className="flex items-center gap-3">
                        {/* ✅ FIXED: use StarIcon */}
                        <StarIcon size={16} style={highlightText} />
                        <input
                          className="text-3xl font-black italic outline-none w-24 bg-transparent"
                          value={camp.rating}
                          onChange={(e) => updateField("rating", parseFloat(e.target.value))}
                          style={accentText}
                        />
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.45 }}>
                          / 5
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.25 }}>
                          Reviews
                        </span>
                        <input
                          className="text-sm font-black outline-none bg-transparent w-20"
                          value={camp.reviewCount}
                          onChange={(e) => updateField("reviewCount", parseInt(e.target.value))}
                          style={accentText}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Instagram size={14} style={{ color: theme.accent, opacity: 0.45 }} />
                        <input
                          className="text-xs font-bold uppercase tracking-wider outline-none bg-transparent w-full"
                          value={camp.instagramHandle}
                          onChange={(e) => updateField("instagramHandle", e.target.value)}
                          style={accentText}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe size={14} style={{ color: theme.accent, opacity: 0.45 }} />
                        <input
                          className="text-xs font-bold outline-none bg-transparent w-full"
                          value={camp.website}
                          onChange={(e) => updateField("website", e.target.value)}
                          style={accentText}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: theme.accent, opacity: 0.5 }}>
                        Location
                      </p>
                      <div className="flex items-start gap-3">
                        <MapPin size={16} style={highlightText} />
                        <textarea
                          className="text-sm font-black uppercase tracking-tight outline-none bg-transparent w-full resize-none leading-snug"
                          value={camp.locationLabel}
                          onChange={(e) => updateField("locationLabel", e.target.value)}
                          rows={2}
                          style={accentText}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Compass size={14} style={{ color: theme.accent, opacity: 0.45 }} />
                        <input
                          className="text-xs font-bold outline-none bg-transparent w-full"
                          value={camp.mapLink}
                          onChange={(e) => updateField("mapLink", e.target.value)}
                          style={accentText}
                        />
                      </div>
                      <p className="text-[10px] font-medium" style={{ color: theme.accent, opacity: 0.45 }}>
                        Tip: paste a Google Maps link for quick access.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: theme.accent, opacity: 0.5 }}>
                        Rooms & capacity
                      </p>
                      <div
                        className="flex items-center justify-between p-5 rounded-2xl border"
                        style={{ borderColor: theme.borderColor, backgroundColor: theme.pageBg }}
                      >
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.5 }}>
                            Total rooms
                          </p>
                          <input
                            className="text-4xl font-black italic outline-none bg-transparent w-24"
                            value={camp.rooms}
                            onChange={(e) => updateField("rooms", parseInt(e.target.value))}
                            style={accentText}
                          />
                        </div>
                        <div className="h-12 w-px" style={{ backgroundColor: theme.borderColor }} />
                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.5 }}>
                            Total units
                          </p>
                          <p className="text-4xl font-black italic" style={accentText}>
                            {totalUnits}
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] font-medium" style={{ color: theme.accent, opacity: 0.45 }}>
                        Units = family + double + single.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {visibleBlocks.heroTradeProfile && (
                <div className="rounded-[2.5rem] border p-10 shadow-sm" style={cardStyle}>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-6" style={{ color: theme.accent, opacity: 0.3 }}>
                    <input
                      className="outline-none bg-transparent w-full"
                      value={`${camp.tradeProfileLabel} ${camp.tradeProfileSub}`}
                      onChange={(e) => updateField("tradeProfileLabel", e.target.value)}
                      style={{ color: theme.accent, opacity: 0.9 }}
                    />
                  </p>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: theme.accent, opacity: 0.5 }}>
                          Property class
                        </p>
                        <input
                          className="text-sm font-black uppercase tracking-tight outline-none bg-transparent w-full border-b pb-2"
                          value={camp.class}
                          onChange={(e) => updateField("class", e.target.value)}
                          style={{ borderColor: theme.borderColor, color: theme.accent }}
                        />
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: theme.accent, opacity: 0.5 }}>
                          Camp name
                        </p>
                        <input
                          className="text-2xl md:text-3xl font-black italic tracking-tighter outline-none bg-transparent w-full border-b pb-2"
                          value={camp.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          style={{ borderColor: theme.borderColor, color: theme.accent }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: theme.accent, opacity: 0.5 }}>
                        Vibe
                      </p>
                      <textarea
                        className="text-sm font-medium outline-none bg-transparent w-full border rounded-2xl p-4 resize-none"
                        value={camp.vibe}
                        onChange={(e) => updateField("vibe", e.target.value)}
                        rows={3}
                        style={{ borderColor: theme.borderColor, color: theme.accent }}
                      />
                    </div>

                    <div className="pt-4 border-t" style={borderStyle}>
                      <p className="text-[9px] font-black uppercase tracking-widest mb-4" style={{ color: theme.accent, opacity: 0.5 }}>
                        Contact card (QR / NFC)
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          className="p-4 rounded-2xl border outline-none text-xs font-semibold bg-transparent"
                          style={{ borderColor: theme.borderColor, color: theme.accent }}
                          value={camp.contactName}
                          onChange={(e) => updateField("contactName", e.target.value)}
                          placeholder="Contact name"
                        />
                        <input
                          className="p-4 rounded-2xl border outline-none text-xs font-semibold bg-transparent"
                          style={{ borderColor: theme.borderColor, color: theme.accent }}
                          value={camp.contactTitle}
                          onChange={(e) => updateField("contactTitle", e.target.value)}
                          placeholder="Title"
                        />
                        <input
                          className="p-4 rounded-2xl border outline-none text-xs font-semibold bg-transparent"
                          style={{ borderColor: theme.borderColor, color: theme.accent }}
                          value={camp.contactCompany}
                          onChange={(e) => updateField("contactCompany", e.target.value)}
                          placeholder="Company"
                        />
                        <input
                          className="p-4 rounded-2xl border outline-none text-xs font-semibold bg-transparent"
                          style={{ borderColor: theme.borderColor, color: theme.accent }}
                          value={camp.contactPhone}
                          onChange={(e) => updateField("contactPhone", e.target.value)}
                          placeholder="Phone"
                        />
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
                </div>
              )}
            </div>
          </div>
        )}

        {/* HERO (double click / right click to change image) */}
        {visibleBlocks.hero && (
          <section
            className="relative h-[70vh] w-full overflow-hidden mt-8 select-none"
            style={{ backgroundColor: theme.accent }}
            onDoubleClick={() => heroFileRef.current?.click()}
            onContextMenu={(e) => {
              e.preventDefault(); // open picker instead of browser context menu
              heroFileRef.current?.click();
            }}
            title="Double-click or right-click to change hero image"
          >
            {/* hidden input that picks hero image */}
            <input
              ref={heroFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setHeroFromFiles(e.target.files)}
            />

            {/* hero image */}
            {camp.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={camp.heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl border px-6 py-4 text-[10px] font-black uppercase tracking-widest"
                  style={{ borderColor: theme.borderColor, color: "#fff", backgroundColor: "rgba(0,0,0,0.25)" }}
                >
                  Double-click / Right-click to upload hero image
                </div>
              </div>
            )}

            {/* overlay */}
            <div className="absolute inset-0 bg-black/40 z-10" />
          </section>
        )}

        <div className="max-w-5xl mx-auto py-16 px-6 space-y-20">
          {/* ROOM MATRIX + photo previews */}
          {visibleBlocks.matrix && (
            <div className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest opacity-30 italic border-b pb-4" style={{ borderColor: theme.borderColor }}>
                <span style={{ color: theme.accent, opacity: 0.5 }}>Room Orientation</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["family", "double", "single"] as const).map((type) => (
                  <div
                    key={type}
                    className="p-8 rounded-[2rem] border flex flex-col justify-between min-h-[22rem] group transition-all"
                    style={cardStyle}
                  >
                    <input
                      className="text-[10px] font-black uppercase outline-none bg-transparent"
                      value={camp.roomTypeLabels?.[type] ?? `${type} setup`}
                      onChange={(e) => {
                        const updated = [...portfolio];
                        const current = updated[selectedCampIndex] as any;
                        current.roomTypeLabels = current.roomTypeLabels || { family: "", double: "", single: "" };
                        current.roomTypeLabels[type] = e.target.value;
                        setPortfolio(updated);
                      }}
                      style={{ color: theme.accent, opacity: 0.55 }}
                    />

                    <div className="flex items-center gap-4 mt-6">
                      <input
                        className="text-5xl font-black italic outline-none w-16 bg-transparent"
                        value={camp[type] as number}
                        onChange={(e) => updateField(type, parseInt(e.target.value))}
                        style={accentText}
                      />
                      <div className="h-10 w-px" style={{ backgroundColor: theme.borderColor }} />
                      <span className="text-[10px] font-bold uppercase leading-tight" style={{ color: theme.accent, opacity: 0.4 }}>
                        Total
                        <br />
                        Units
                      </span>
                    </div>

                    <div className="mt-8 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.45 }}>
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
                        {(camp.roomPhotos?.[type] ?? []).map((src: string, i: number) => (
                          <button
                            key={i}
                            className="relative rounded-xl overflow-hidden border text-left"
                            style={borderStyle}
                            onClick={() => openPhoto(src, `${camp.roomTypeLabels?.[type] ?? type} photo ${i + 1}`)}
                            type="button"
                            title="Click to preview"
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

                      <p className="text-[10px] font-medium" style={{ color: theme.accent, opacity: 0.45 }}>
                        Click any thumbnail to open full-size preview.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INCLUSIONS & EXCLUSIONS */}
          <div className="grid md:grid-cols-2 gap-8">
            {visibleBlocks.inclusions && (
              <div className="p-10 rounded-[2.5rem] border space-y-6" style={cardStyle}>
                <div className="flex items-center justify-between border-b pb-4" style={borderStyle}>
                  <div className="flex items-center gap-2">
                    <Utensils size={14} style={accentText} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accent }}>
                      Included (Inclusions)
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
                        className="text-xs font-medium outline-none bg-transparent w-full"
                        value={item}
                        onChange={(e) => {
                          const updated = [...portfolio];
                          updated[selectedCampIndex].inclusions[i] = e.target.value;
                          setPortfolio(updated);
                        }}
                        style={accentText}
                      />
                      <button
                        onClick={() => deleteItem("inclusions", i)}
                        className="opacity-0 group-hover:opacity-100"
                        style={{ color: "#f87171" }}
                        type="button"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {visibleBlocks.exclusions && (
              <div className="p-10 rounded-[2.5rem] border space-y-6" style={mutedCardStyle}>
                <div className="flex items-center justify-between border-b pb-4" style={borderStyle}>
                  <div className="flex items-center gap-2">
                    <Ban size={14} style={{ color: "#f87171" }} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.9 }}>
                      Not Included (Exclusions)
                    </h3>
                  </div>
                  <button onClick={() => addItem("exclusions")} style={{ color: theme.accent, opacity: 0.5 }} type="button">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {camp.exclusions.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <X size={10} style={{ color: theme.accent, opacity: 0.35 }} />
                      <input
                        className="text-xs font-medium outline-none bg-transparent w-full italic"
                        value={item}
                        onChange={(e) => {
                          const updated = [...portfolio];
                          updated[selectedCampIndex].exclusions[i] = e.target.value;
                          setPortfolio(updated);
                        }}
                        style={{ color: theme.accent, opacity: 0.7 }}
                      />
                      <button
                        onClick={() => deleteItem("exclusions", i)}
                        className="opacity-0 group-hover:opacity-100"
                        style={{ color: "#f87171" }}
                        type="button"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* EXPERIENCES */}
          {visibleBlocks.experiences && (
            <div className="space-y-8">
              <h2 className="text-[10px] font-black uppercase tracking-widest opacity-30 italic border-b pb-4" style={{ borderColor: theme.borderColor, color: theme.accent }}>
                The Guest Experience
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black uppercase" style={{ color: theme.accent, opacity: 0.5 }}>
                      Included (Free)
                    </p>
                    <button onClick={() => addItem("freeActivities")} style={highlightText} type="button">
                      <Plus size={12} />
                    </button>
                  </div>
                  {camp.freeActivities.map((act: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border group" style={cardStyle}>
                      <Compass size={14} style={highlightText} />
                      <input
                        className="text-xs font-black uppercase tracking-tighter outline-none w-full bg-transparent"
                        value={act}
                        onChange={(e) => {
                          const updated = [...portfolio];
                          updated[selectedCampIndex].freeActivities[i] = e.target.value;
                          setPortfolio(updated);
                        }}
                        style={accentText}
                      />
                      <button
                        onClick={() => deleteItem("freeActivities", i)}
                        className="opacity-0 group-hover:opacity-100"
                        style={{ color: "#f87171" }}
                        type="button"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black uppercase" style={{ color: theme.accent, opacity: 0.5 }}>
                      Premium (Paid Add-ons)
                    </p>
                    <button onClick={() => addItem("paidActivities")} style={highlightText} type="button">
                      <Plus size={12} />
                    </button>
                  </div>
                  {camp.paidActivities.map((act: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-5 rounded-2xl group shadow-xl border"
                      style={{ backgroundColor: theme.accent, borderColor: theme.accent, color: "#fff" }}
                    >
                      <MapPin size={14} className="text-white/40" />
                      <input
                        className="text-xs font-black uppercase tracking-tighter outline-none w-full bg-transparent text-white"
                        value={act}
                        onChange={(e) => {
                          const updated = [...portfolio];
                          updated[selectedCampIndex].paidActivities[i] = e.target.value;
                          setPortfolio(updated);
                        }}
                      />
                      <button
                        onClick={() => deleteItem("paidActivities", i)}
                        className="opacity-0 group-hover:opacity-100 text-white/60"
                        type="button"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OFFERS */}
          {visibleBlocks.offers && (
            <div className="p-16 rounded-[4rem] text-white flex flex-col items-center text-center shadow-2xl" style={highlightBg}>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 mb-4">Trade Incentive</span>
              <textarea
                className="bg-transparent text-5xl font-black italic tracking-tighter outline-none w-full h-24 text-center resize-none leading-none"
                value={camp.offersText}
                onChange={(e) => updateField("offersText", e.target.value)}
              />
            </div>
          )}

          {/* LEAD CAPTURE with Share/Download/Save */}
          {visibleBlocks.leadCapture && (
            <div className="rounded-[3rem] border p-10 md:p-14 shadow-sm" style={cardStyle}>
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div className="space-y-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: theme.accent, opacity: 0.3 }}>
                    Lead capture
                  </p>

                  <textarea
                    className="text-3xl md:text-4xl font-black italic tracking-tighter outline-none w-full resize-none leading-tight bg-transparent"
                    value={camp.leadHeadline}
                    onChange={(e) => updateField("leadHeadline", e.target.value)}
                    rows={2}
                    style={accentText}
                  />
                  <textarea
                    className="text-sm font-medium outline-none w-full resize-none leading-relaxed bg-transparent"
                    value={camp.leadSubcopy}
                    onChange={(e) => updateField("leadSubcopy", e.target.value)}
                    rows={3}
                    style={{ color: theme.accent, opacity: 0.7 }}
                  />

                  <div className="space-y-3">
                    {["leadBullet1", "leadBullet2", "leadBullet3"].map((k) => (
                      <div key={k} className="flex items-center gap-3">
                        <Check size={14} className="text-green-500" />
                        <input
                          className="text-xs font-black uppercase tracking-tight outline-none bg-transparent w-full"
                          value={(camp as any)[k]}
                          onChange={(e) => updateField(k, e.target.value)}
                          style={accentText}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <ShieldAlert size={14} style={{ color: theme.accent, opacity: 0.25 }} />
                    <input
                      className="text-[10px] font-semibold outline-none bg-transparent w-full"
                      value={camp.leadDisclaimer}
                      onChange={(e) => updateField("leadDisclaimer", e.target.value)}
                      style={{ color: theme.accent, opacity: 0.6 }}
                    />
                  </div>
                </div>

                <div className="rounded-[2.5rem] border p-8 space-y-4" style={{ borderColor: theme.borderColor, backgroundColor: theme.pageBg }}>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accent, opacity: 0.5 }}>
                      Enquiry form
                    </p>
                    <button className="p-2 rounded-xl border" style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg }} type="button">
                      <Camera size={14} style={{ color: theme.accent, opacity: 0.5 }} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none"
                      style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg, color: theme.accent }}
                      placeholder="Full name"
                    />
                    <input
                      className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none"
                      style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg, color: theme.accent }}
                      placeholder="Agency"
                    />
                    <input
                      className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none md:col-span-2"
                      style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg, color: theme.accent }}
                      placeholder="Email"
                    />
                    <input
                      className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none md:col-span-2"
                      style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg, color: theme.accent }}
                      placeholder="WhatsApp / Phone"
                    />
                    <textarea
                      className="w-full p-4 rounded-2xl border text-xs font-semibold outline-none md:col-span-2 resize-none"
                      style={{ borderColor: theme.borderColor, backgroundColor: theme.blockBg, color: theme.accent }}
                      placeholder="Message (dates, pax, preferences...)"
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
                      <button
                        onClick={shareContact}
                        className="px-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={{ backgroundColor: theme.blockBg, borderColor: theme.borderColor, color: theme.accent }}
                        title="Share my contacts"
                        type="button"
                      >
                        <Share2 size={14} />
                        Share
                      </button>

                      <a
                        href={vcardUrl || "data:text/vcard;charset=utf-8," + encodeURIComponent(vcardText)}
                        download={`${(camp.contactName || "contact").replace(/\s+/g, "_")}.vcf`}
                        className="px-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={{ backgroundColor: theme.blockBg, borderColor: theme.borderColor, color: theme.accent }}
                        title="Downloadable"
                      >
                        <Download size={14} />
                        Download
                      </a>

                      <button
                        onClick={saveContact}
                        className="px-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={{ backgroundColor: theme.blockBg, borderColor: theme.borderColor, color: theme.accent }}
                        title="Save contacts"
                        type="button"
                      >
                        <Contact size={14} />
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold" style={{ color: theme.accent, opacity: 0.55 }}>
                    <Percent size={12} />
                    Trade-friendly response timing: <span style={{ color: theme.accent, opacity: 1 }}>same day</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
