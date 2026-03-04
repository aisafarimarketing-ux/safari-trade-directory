"use client";
import React, { useState } from 'react';
import { 
  Save, Plus, Camera, Check, Percent, Instagram, Facebook, 
  Globe, Phone, LogIn, Utensils, ShieldAlert, Eye, EyeOff, 
  Trash2, Star, X, ChevronRight, List
} from 'lucide-react';

export default function ShadcnArchitecturalHub() {
  const [selectedCamp, setSelectedCamp] = useState(0);
  
  const [theme, setTheme] = useState({
    pageBg: '#FBFBFA',
    blockBg: '#FFFFFF',
    accent: '#0F172A', // Slate 900 for a sharper look
    text: '#0F172A',
    borderColor: '#E2E8F0'
  });

  const [visibleBlocks, setVisibleBlocks] = useState({
    trust: true, matrix: true, meals: true, activities: true, terms: true, offers: true
  });

  const [portfolio, setPortfolio] = useState([
    { 
      id: 1, 
      name: "Nyumbani Serengeti", 
      class: "Tented (Luxury)",
      rooms: 10, family: 2, double: 6, single: 2,
      vibe: "High-end canvas meets the raw heartbeat of the Serengeti.",
      mealFB: ["Three gourmet meals daily", "Tea, coffee & bottled water", "Bush breakfast included"],
      mealAI: ["Premium spirits & cellar wines", "Private bush dinners", "All laundry services", "Private guide option"],
      terms: "30% non-refundable deposit. Balance due 45 days prior.",
      offersText: "Stay 5 Pay 4 during Green Season.",
      freeActivities: ["Morning Game Drive", "Guided Nature Walk"],
      paidActivities: ["Hot Air Balloon", "Night Game Drive"]
    }
  ]);

  const toggleBlock = (key: keyof typeof visibleBlocks) => {
    setVisibleBlocks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex min-h-screen font-sans transition-all duration-300" style={{ backgroundColor: theme.pageBg, color: theme.text }}>
      
      {/* 1. SHARP CONTROL SIDEBAR (Left) */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col fixed h-screen top-0 left-0 z-[100]">
        <div className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">Theme Config</p>
          <div className="space-y-4">
            {Object.entries(theme).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase text-slate-600">{key}</span>
                <input type="color" value={val} onChange={(e) => setTheme(t => ({...t, [key]: e.target.value}))} className="w-5 h-5 rounded-full cursor-pointer border-none shadow-sm" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">View Blocks</p>
          {Object.keys(visibleBlocks).map((key) => (
            <button key={key} onClick={() => toggleBlock(key as any)} className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest transition-all">
              <span className={visibleBlocks[key as keyof typeof visibleBlocks] ? "text-slate-900" : "text-slate-300"}>{key}</span>
              {visibleBlocks[key as keyof typeof visibleBlocks] ? <Eye size={12}/> : <EyeOff size={12}/>}
            </button>
          ))}
        </div>

        <button className="mt-auto w-full py-4 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all" style={{ backgroundColor: theme.accent }}>
          <Save size={14} className="inline mr-2"/> Save Changes
        </button>
      </aside>

      {/* 2. THE CANVAS */}
      <main className="flex-1 ml-64">
        
        {/* FULL BLEED HERO WITH INTEGRATED TOP BAR */}
        <section className="relative h-[90vh] w-full overflow-hidden bg-slate-900 group">
           {visibleBlocks.trust && (
             <div className="absolute top-0 left-0 right-0 z-50 p-10 flex justify-between items-center">
                <div className="flex items-center gap-8 bg-black/10 backdrop-blur-md border border-white/10 p-2 pl-6 rounded-full text-white">
                   <span className="text-[10px] font-black tracking-tighter">BRAND.IDENTITY</span>
                   <div className="flex gap-4 pr-4 border-l border-white/20 pl-6 text-white/50">
                      <Instagram size={14} className="hover:text-white cursor-pointer" />
                      <Globe size={14} className="hover:text-white cursor-pointer" />
                   </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10 text-white px-6">
                   <div className="flex items-center gap-2 border-r border-white/20 pr-6">
                      <span className="text-[8px] font-bold uppercase opacity-50">TripAdvisor</span>
                      <span className="text-xs font-black">5.0</span>
                   </div>
                   <button className="text-[9px] font-bold uppercase tracking-widest">Login</button>
                </div>
             </div>
           )}

           <div className="absolute inset-0 bg-black/40" />
           
           <div className="absolute bottom-20 left-20 z-30 max-w-3xl">
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-6">
                {portfolio[selectedCamp].class}
              </span>
              <h1 className="text-9xl font-black text-white italic tracking-tighter leading-[0.85] mb-8">
                {portfolio[selectedCamp].name}
              </h1>
              <p className="text-xl text-white/60 font-serif italic max-w-xl">
                {portfolio[selectedCamp].vibe}
              </p>
           </div>
        </section>

        {/* ARCHITECTURAL LIST VIEW */}
        <div className="max-w-6xl mx-auto py-24 px-20 space-y-24">
           
           {/* ROOM MATRIX - SHARP LIST VIEW */}
           {visibleBlocks.matrix && (
             <div className="space-y-12">
                <div className="flex justify-between items-end border-b pb-6" style={{ borderColor: theme.borderColor }}>
                   <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] opacity-40">Accommodations</h2>
                   <span className="text-[10px] font-black uppercase">{portfolio[selectedCamp].rooms} Total Keys</span>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                   {['family', 'double', 'single'].map((type) => (
                     <div key={type} className="flex gap-12 p-8 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all group" style={{ backgroundColor: theme.blockBg }}>
                        <div className="w-1/3 flex flex-col justify-between">
                           <div>
                             <p className="text-[9px] font-bold uppercase text-slate-400 mb-1">{type} category</p>
                             <h3 className="text-2xl font-black uppercase tracking-tight">{type} Luxury Suite</h3>
                             <p className="text-xs text-slate-500 mt-2 italic font-serif">Tailored for {type} occupancy with bespoke linen.</p>
                           </div>
                           <div className="flex items-center gap-4 mt-8">
                              <span className="text-4xl font-black italic" style={{ color: theme.accent }}>0{portfolio[selectedCamp][type as keyof typeof portfolio[0]] as number}</span>
                              <span className="text-[9px] font-bold uppercase opacity-30">Keys Available</span>
                           </div>
                        </div>
                        
                        {/* PHOTOS ONLY UNDER SPECIFIC TYPES */}
                        <div className="flex-1 grid grid-cols-2 gap-4">
                           <div className="aspect-video bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center relative group/img overflow-hidden">
                              <Camera className="opacity-10 group-hover/img:opacity-100 transition-all" size={20} />
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/5 cursor-pointer" />
                           </div>
                           <div className="aspect-video bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center relative group/img overflow-hidden">
                              <Camera className="opacity-10 group-hover/img:opacity-100 transition-all" size={20} />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* MEAL PLANS - POINT FORM */}
           {visibleBlocks.meals && (
             <div className="grid md:grid-cols-2 gap-8">
                <div className="p-10 rounded-3xl border border-slate-100 space-y-6" style={{ backgroundColor: theme.blockBg }}>
                   <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: theme.borderColor }}>
                      <Utensils size={16} />
                      <h3 className="text-[10px] font-black uppercase tracking-widest">Full Board Stay</h3>
                   </div>
                   <ul className="space-y-3">
                      {portfolio[selectedCamp].mealFB.map((item, i) => (
                        <li key={i} className="text-xs text-slate-500 flex items-start gap-3">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300" />
                          <input className="bg-transparent outline-none w-full" defaultValue={item} />
                        </li>
                      ))}
                      <button className="text-[9px] font-bold uppercase opacity-30 hover:opacity-100 pt-4">+ Add Provision</button>
                   </ul>
                </div>
                <div className="p-10 rounded-3xl border border-slate-100 space-y-6" style={{ backgroundColor: theme.blockBg }}>
                   <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: theme.borderColor }}>
                      <Star size={16} fill={theme.accent} />
                      <h3 className="text-[10px] font-black uppercase tracking-widest">All Inclusive</h3>
                   </div>
                   <ul className="space-y-3">
                      {portfolio[selectedCamp].mealAI.map((item, i) => (
                        <li key={i} className="text-xs text-slate-500 flex items-start gap-3">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                          <input className="bg-transparent outline-none w-full" defaultValue={item} />
                        </li>
                      ))}
                      <button className="text-[9px] font-bold uppercase opacity-30 hover:opacity-100 pt-4">+ Add Provision</button>
                   </ul>
                </div>
             </div>
           )}

           {/* TRADE OFFERS - ULTRA SHARP */}
           {visibleBlocks.offers && (
             <div className="p-16 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl relative overflow-hidden" style={{ backgroundColor: theme.accent }}>
                <div className="z-20 flex-1">
                   <div className="flex items-center gap-2 text-white/40 text-[9px] font-bold uppercase tracking-widest mb-4">
                      <Percent size={12}/> Trade Incentives Active
                   </div>
                   <textarea className="bg-transparent text-5xl font-black italic tracking-tighter outline-none w-full h-24 resize-none leading-[1]" defaultValue={portfolio[selectedCamp].offersText} />
                </div>
                <div className="z-20 w-32 h-32 rounded-full border border-white/10 flex items-center justify-center text-4xl font-black">%</div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
             </div>
           )}

           {/* TERMS - MINIMALIST FOOTER ITEM */}
           {visibleBlocks.terms && (
             <div className="p-10 rounded-3xl border border-slate-100 flex items-start gap-8" style={{ backgroundColor: theme.blockBg }}>
                <ShieldAlert size={20} className="text-slate-300" />
                <div className="flex-1">
                   <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Terms of Reservation</p>
                   <textarea className="bg-transparent text-[11px] font-bold outline-none w-full h-12 resize-none text-slate-500" defaultValue={portfolio[selectedCamp].terms} />
                </div>
             </div>
           )}
        </div>

        {/* FLOATING ACTION BAR */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 ml-32 flex gap-2 bg-slate-900/95 backdrop-blur-3xl p-2 rounded-2xl shadow-2xl border border-white/10 z-[150]">
           {['Shortlist', 'Request STO', 'Contacts', 'Downloads'].map((label, i) => (
             <button key={label} className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${i === 0 ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`} style={i === 0 ? {backgroundColor: theme.accent} : {}}>{label}</button>
           ))}
        </div>

      </main>
    </div>
  );
}
