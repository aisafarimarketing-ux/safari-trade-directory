"use client";
import React, { useState } from "react";
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
  Star,
  Compass,
  MapPin,
  Trash2,
  Plus,
  X,
  Monitor,
  Ban,
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

  // RESTORED + EXPANDED: Toggle State for every block (NEW blocks added, none removed)
  const [visibleBlocks, setVisibleBlocks] = useState({
    hero: true,
    heroTopMeta: true, // social proof + location + rooms
    heroTradeProfile: true, // "Nyumbani-Collections Trade profile." + class/name/vibe
    heroHeaderStack: true, // NEW: wrapper container for above-hero area
    matrix: true,
    inclusions: true,
    exclusions: true,
    experiences: true,
    offers: true,
    terms: true,
    leadCapture: true, // Lead capture section (bottom)
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

      // Meta + Social Proof + Trade profile headline text
      tradeProfileLabel: "Nyumbani-Collections",
      tradeProfileSub: "Trade profile.",
      locationLabel: "Serengeti National Park, Tanzania",
      mapLink: "https://maps.google.com",
      rating: 4.9,
      reviewCount: 128,
      instagramHandle: "@nyumbani.collections",
      website: "https://example.com",

      // Lead capture content (editable)
      leadHeadline: "Get rates, availability & trade support in one reply.",
      leadSubcopy:
        "Leave your details and we’ll send a trade-ready fact sheet, inclusions, and a quick quote.",
      leadBullet1: "Agent-ready proposal + net rates",
      leadBullet2: "Seasonality guidance + offers",
      leadBullet3: "Fast response from reservations",
      leadCta: "Request Trade Pack",
      leadDisclaimer:
        "By submitting, you agree to be contacted by our reservations team.",
    },
  ]);

  const toggleBlock = (key: keyof typeof visibleBlocks) => {
    setVisibleBlocks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // CRUD Helpers
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

  return (
    <div
      className="flex min-h-screen font-sans transition-all"
      style={{ backgroundColor: theme.pageBg }}
    >
      {/* 1. RESTORED SIDEBAR WITH TOGGLES */}
      {!isPreview && (
        <aside className="w-64 bg-white border-r border-slate-200 fixed h-screen top-0 left-0 z-[100] p-5 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Restoration Hub
            </span>
            <button
              onClick={() => setIsPreview(true)}
              className="p-2 bg-slate-100 rounded-lg"
            >
              <Eye size={14} />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-2">
            {/* TOGGLE SECTION */}
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-400 mb-4 tracking-[0.2em]">
                View Toggles
              </p>
              <div className="space-y-1">
                {Object.keys(visibleBlocks).map((key) => (
                  <button
                    key={key}
                    onClick={() => toggleBlock(key as any)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-slate-50"
                  >
                    <span
                      className={
                        visibleBlocks[key as keyof typeof visibleBlocks]
                          ? "text-slate-900"
                          : "text-slate-300"
                      }
                    >
                      {key}
                    </span>
                    {visibleBlocks[key as keyof typeof visibleBlocks] ? (
                      <Eye size={12} className="text-slate-900" />
                    ) : (
                      <EyeOff size={12} className="text-slate-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* THEME SECTION */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <p className="text-[9px] font-bold uppercase text-slate-400">
                Accents
              </p>
              {Object.entries(theme).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-medium">{k}</span>
                  <input
                    type="color"
                    value={v}
                    onChange={(e) =>
                      setTheme((t) => ({ ...t, [k]: e.target.value }))
                    }
                    className="w-4 h-4 rounded-full cursor-pointer border-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className="mt-6 w-full py-4 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
            style={{ backgroundColor: theme.highlight }}
          >
            <Save size={14} className="inline mr-2" /> Save Global
          </button>
        </aside>
      )}

      {/* 2. MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all ${!isPreview ? "ml-64" : "ml-0"}`}>
        {isPreview && (
          <button
            onClick={() => setIsPreview(false)}
            className="fixed top-6 right-6 z-[200] bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-2xl"
          >
            <Monitor size={14} /> Open Admin
          </button>
        )}

        {/* ✅ NEW: ONE COMBINED "ABOVE HERO" CONTAINER */}
        {visibleBlocks.heroHeaderStack && (
          <div className="max-w-6xl mx-auto px-6 pt-10">
            <div className="rounded-[3rem] border border-slate-100 bg-white/60 backdrop-blur p-6 md:p-8 shadow-sm space-y-6">
              {/* Social proof + location + rooms */}
              {visibleBlocks.heroTopMeta && (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Social Proof */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Social proof
                      </p>
                      <div className="flex items-center gap-3">
                        <Star size={16} style={{ color: theme.highlight }} />
                        <input
                          className="text-3xl font-black italic outline-none w-24 bg-transparent"
                          value={camp.rating}
                          onChange={(e) =>
                            updateField("rating", parseFloat(e.target.value))
                          }
                        />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          / 5
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                          Reviews
                        </span>
                        <input
                          className="text-sm font-black outline-none bg-transparent w-20"
                          value={camp.reviewCount}
                          onChange={(e) =>
                            updateField("reviewCount", parseInt(e.target.value))
                          }
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Instagram size={14} className="text-slate-400" />
                        <input
                          className="text-xs font-bold uppercase tracking-wider outline-none bg-transparent w-full"
                          value={camp.instagramHandle}
                          onChange={(e) =>
                            updateField("instagramHandle", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe size={14} className="text-slate-400" />
                        <input
                          className="text-xs font-bold outline-none bg-transparent w-full"
                          value={camp.website}
                          onChange={(e) => updateField("website", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Location
                      </p>
                      <div className="flex items-start gap-3">
                        <MapPin size={16} style={{ color: theme.highlight }} />
                        <textarea
                          className="text-sm font-black uppercase tracking-tight outline-none bg-transparent w-full resize-none leading-snug"
                          value={camp.locationLabel}
                          onChange={(e) =>
                            updateField("locationLabel", e.target.value)
                          }
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Compass size={14} className="text-slate-400" />
                        <input
                          className="text-xs font-bold outline-none bg-transparent w-full"
                          value={camp.mapLink}
                          onChange={(e) => updateField("mapLink", e.target.value)}
                        />
                      </div>
                      <p className="text-[10px] font-medium text-slate-400">
                        Tip: paste a Google Maps link for quick access.
                      </p>
                    </div>

                    {/* Rooms */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Rooms & capacity
                      </p>
                      <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                            Total rooms
                          </p>
                          <input
                            className="text-4xl font-black italic outline-none bg-transparent w-24"
                            value={camp.rooms}
                            onChange={(e) =>
                              updateField("rooms", parseInt(e.target.value))
                            }
                          />
                        </div>
                        <div className="h-12 w-px bg-slate-200" />
                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                            Total units
                          </p>
                          <p className="text-4xl font-black italic">{totalUnits}</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400">
                        Units = family + double + single.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Trade Profile box */}
              {visibleBlocks.heroTradeProfile && (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6">
                    <input
                      className="outline-none bg-transparent w-full"
                      value={`${camp.tradeProfileLabel} ${camp.tradeProfileSub}`}
                      onChange={(e) => {
                        updateField("tradeProfileLabel", e.target.value);
                      }}
                    />
                  </p>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                          Property class
                        </p>
                        <input
                          className="text-sm font-black uppercase tracking-tight outline-none bg-transparent w-full border-b border-slate-100 pb-2"
                          value={camp.class}
                          onChange={(e) => updateField("class", e.target.value)}
                        />
                      </div>

                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                          Camp name
                        </p>
                        <input
                          className="text-2xl md:text-3xl font-black italic tracking-tighter outline-none bg-transparent w-full border-b border-slate-100 pb-2"
                          value={camp.name}
                          onChange={(e) => updateField("name", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        Vibe
                      </p>
                      <textarea
                        className="text-sm font-medium outline-none bg-transparent w-full border border-slate-100 rounded-2xl p-4 resize-none"
                        value={camp.vibe}
                        onChange={(e) => updateField("vibe", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HERO (image-only: nothing on top of it) */}
        {visibleBlocks.hero && (
          <section className="relative h-[70vh] w-full bg-slate-900 overflow-hidden mt-8">
            <div className="absolute inset-0 bg-black/40 z-10" />
            {/* Intentionally empty hero content area (no writings here). */}
          </section>
        )}

        <div className="max-w-5xl mx-auto py-16 px-6 space-y-20">
          {/* ACCOMMODATION MATRIX */}
          {visibleBlocks.matrix && (
            <div className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest opacity-30 italic border-b pb-4">
                Room Orientation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["family", "double", "single"].map((type) => (
                  <div
                    key={type}
                    className="p-8 bg-white rounded-[2rem] border border-slate-100 flex flex-col justify-between h-48 group hover:border-slate-400 transition-all"
                  >
                    <p className="text-[8px] font-black uppercase text-slate-400">
                      {type} setup
                    </p>
                    <div className="flex items-center gap-4">
                      <input
                        className="text-5xl font-black italic outline-none w-16 bg-transparent"
                        value={camp[type as keyof typeof camp] as number}
                        onChange={(e) =>
                          updateField(type, parseInt(e.target.value))
                        }
                      />
                      <div className="h-10 w-px bg-slate-100" />
                      <span className="text-[10px] font-bold uppercase leading-tight opacity-40">
                        Total
                        <br />
                        Units
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESTORED: INCLUSIONS & EXCLUSIONS */}
          <div className="grid md:grid-cols-2 gap-8">
            {visibleBlocks.inclusions && (
              <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-2">
                    <Utensils size={14} />{" "}
                    <h3 className="text-[10px] font-black uppercase tracking-widest">
                      Included (Inclusions)
                    </h3>
                  </div>
                  <button
                    onClick={() => addItem("inclusions")}
                    className="text-blue-500"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {camp.inclusions.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <Check size={12} className="text-green-500" />
                      <input
                        className="text-xs font-medium outline-none bg-transparent w-full"
                        value={item}
                        onChange={(e) => {
                          const updated = [...portfolio];
                          updated[selectedCampIndex].inclusions[i] =
                            e.target.value;
                          setPortfolio(updated);
                        }}
                      />
                      <button
                        onClick={() => deleteItem("inclusions", i)}
                        className="opacity-0 group-hover:opacity-100 text-red-400"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {visibleBlocks.exclusions && (
              <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 space-y-6 opacity-80">
                <div className="flex items-center justify-between border-b pb-4 border-slate-200">
                  <div className="flex items-center gap-2">
                    <Ban size={14} className="text-red-400" />{" "}
                    <h3 className="text-[10px] font-black uppercase tracking-widest">
                      Not Included (Exclusions)
                    </h3>
                  </div>
                  <button
                    onClick={() => addItem("exclusions")}
                    className="text-slate-400"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {camp.exclusions.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <X size={10} className="text-slate-400" />
                      <input
                        className="text-xs font-medium outline-none bg-transparent w-full italic text-slate-500"
                        value={item}
                        onChange={(e) => {
                          const updated = [...portfolio];
                          updated[selectedCampIndex].exclusions[i] =
                            e.target.value;
                          setPortfolio(updated);
                        }}
                      />
                      <button
                        onClick={() => deleteItem("exclusions", i)}
                        className="opacity-0 group-hover:opacity-100 text-red-400"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RESTORED: CLASSIFIED EXPERIENCES (FREE VS PAID) */}
          {visibleBlocks.experiences && (
            <div className="space-y-8">
              <h2 className="text-[10px] font-black uppercase tracking-widest opacity-30 italic border-b pb-4">
                The Guest Experience
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {/* FREE */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black uppercase text-slate-400">
                      Included (Free)
                    </p>
                    <button onClick={() => addItem("freeActivities")}>
                      <Plus size={12} />
                    </button>
                  </div>
                  {camp.freeActivities.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 group"
                    >
                      <Compass size={14} style={{ color: theme.highlight }} />
                      <input
                        className="text-xs font-black uppercase tracking-tighter outline-none w-full"
                        value={act}
                        onChange={(e) => {
                          const updated = [...portfolio];
                          updated[selectedCampIndex].freeActivities[i] =
                            e.target.value;
                          setPortfolio(updated);
                        }}
                      />
                      <button
                        onClick={() => deleteItem("freeActivities", i)}
                        className="opacity-0 group-hover:opacity-100 text-red-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* PAID */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black uppercase text-slate-400">
                      Premium (Paid Add-ons)
                    </p>
                    <button onClick={() => addItem("paidActivities")}>
                      <Plus size={12} />
                    </button>
                  </div>
                  {camp.paidActivities.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900 text-white group shadow-xl"
                    >
                      <MapPin size={14} className="text-white/40" />
                      <input
                        className="text-xs font-black uppercase tracking-tighter outline-none w-full bg-transparent"
                        value={act}
                        onChange={(e) => {
                          const updated = [...portfolio];
                          updated[selectedCampIndex].paidActivities[i] =
                            e.target.value;
                          setPortfolio(updated);
                        }}
                      />
                      <button
                        onClick={() => deleteItem("paidActivities", i)}
                        className="opacity-0 group-hover:opacity-100 text-white/50"
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
            <div
              className="p-16 rounded-[4rem] text-white flex flex-col items-center text-center shadow-2xl"
              style={{ backgroundColor: theme.highlight }}
            >
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 mb-4">
                Trade Incentive
              </span>
              <textarea
                className="bg-transparent text-5xl font-black italic tracking-tighter outline-none w-full h-24 text-center resize-none leading-none"
                value={camp.offersText}
                onChange={(e) => updateField("offersText", e.target.value)}
              />
            </div>
          )}

          {/* LEAD CAPTURE */}
          {visibleBlocks.leadCapture && (
            <div className="rounded-[3rem] border border-slate-100 bg-white p-10 md:p-14 shadow-sm">
              <div className="grid md:grid-cols-2 gap-10 items-start">
                <div className="space-y-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
                    Lead capture
                  </p>

                  <textarea
                    className="text-3xl md:text-4xl font-black italic tracking-tighter outline-none w-full resize-none leading-tight bg-transparent"
                    value={camp.leadHeadline}
                    onChange={(e) => updateField("leadHeadline", e.target.value)}
                    rows={2}
                  />
                  <textarea
                    className="text-sm font-medium outline-none w-full resize-none leading-relaxed bg-transparent text-slate-500"
                    value={camp.leadSubcopy}
                    onChange={(e) => updateField("leadSubcopy", e.target.value)}
                    rows={3}
                  />

                  <div className="space-y-3">
                    {["leadBullet1", "leadBullet2", "leadBullet3"].map((k) => (
                      <div key={k} className="flex items-center gap-3">
                        <Check size={14} className="text-green-500" />
                        <input
                          className="text-xs font-black uppercase tracking-tight outline-none bg-transparent w-full"
                          value={(camp as any)[k]}
                          onChange={(e) => updateField(k, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <ShieldAlert size={14} className="text-slate-300" />
                    <input
                      className="text-[10px] font-semibold text-slate-400 outline-none bg-transparent w-full"
                      value={camp.leadDisclaimer}
                      onChange={(e) =>
                        updateField("leadDisclaimer", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="rounded-[2.5rem] border border-slate-100 bg-slate-50 p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Enquiry form
                    </p>
                    <button className="p-2 rounded-xl bg-white border border-slate-100">
                      <Camera size={14} className="text-slate-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-xs font-semibold outline-none"
                      placeholder="Full name"
                    />
                    <input
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-xs font-semibold outline-none"
                      placeholder="Agency"
                    />
                    <input
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-xs font-semibold outline-none md:col-span-2"
                      placeholder="Email"
                    />
                    <input
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-xs font-semibold outline-none md:col-span-2"
                      placeholder="WhatsApp / Phone"
                    />
                    <textarea
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-xs font-semibold outline-none md:col-span-2 resize-none"
                      placeholder="Message (dates, pax, preferences...)"
                      rows={4}
                    />
                  </div>

                  <button
                    className="w-full py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
                    style={{ backgroundColor: theme.highlight }}
                  >
                    <input
                      className="bg-transparent outline-none text-center w-full cursor-text"
                      value={camp.leadCta}
                      onChange={(e) => updateField("leadCta", e.target.value)}
                    />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
                    <Percent size={12} />
                    Trade-friendly response timing:{" "}
                    <span className="text-slate-700">same day</span>
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
