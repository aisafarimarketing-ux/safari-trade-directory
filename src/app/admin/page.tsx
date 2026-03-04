"use client";
import React, { useState } from 'react';
import { 
  Save, Plus, Camera, Check, MapPin, Layout, Palette, 
  Download, Share2, Bookmark, UserPlus, Percent,
  Instagram, Facebook, Globe, Phone, LogIn,
  Utensils, ShieldAlert, Eye, EyeOff, Trash2, Star, X
} from 'lucide-react';

export default function ArchitecturalHub() {
  const [selectedCamp, setSelectedCamp] = useState(0);
  
  // GLOBAL THEME ENGINE
  const [theme, setTheme] = useState({
    pageBg: '#F8F8F6',
    blockBg: '#FFFFFF',
    accent: '#E67E22',
    text: '#0F172A',
    trustBar: '#0F172A'
  });

  const [visibleBlocks, setVisibleBlocks] = useState({
    trust: true, matrix: true, orientation: true, meals: true, activities: true, terms: true, offers: true
  });

  const [portfolio, setPortfolio] = useState([
    { 
      id: 1, 
      name: "Nyumbani Serengeti", 
      location: "Central Serengeti", 
      class: "Tented (Luxury)",
      rooms: 10, family: 2, double: 6, single: 2,
      vibe: "High-end canvas meets the raw heartbeat of the Serengeti. Experience unscripted luxury where the wild migration meets refined comfort.",
      mealFB: "Three gourmet meals, tea/coffee, and bottled water.",
      mealAI: "Premium spirits, cellar wines, and private bush dinners.",
      terms: "30% non-refundable deposit. Balance due 45 days prior.",
      offersText: "Stay 5 Pay 4 during Green Season.",
      freeActivities: ["Morning Game Drive", "Guided Nature Walk"],
      paidActivities: ["Hot Air Balloon", "Night Game Drive"]
    }
  ]);

  const toggleBlock = (key: keyof typeof visibleBlocks) => {
    setVisibleBlocks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateTheme = (key: keyof typeof theme, val: string) => {
    setTheme(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="flex min-h-screen font-sans transition-colors duration-500" style={{ backgroundColor: theme.pageBg, color: theme.text }}>
      
      {/* 1. ADVANCED CONTROL SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white p-6 flex flex-col fixed h-screen top-0 left-0 z-[100] border-r border-white/5 shadow-2xl">
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Theme Engine</p>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(theme).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <p className="text-[8px] font-black uppercase text-slate-600">{key.replace(/([A-Z])/g, ' $1')}</p>
                <input type="color" value={val} onChange={(e) => updateTheme(key as any, e.target.value)} className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-white/10" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 border-t border-slate-800 pt-6 space-y-6 overflow-y-auto">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Visibility</p>
            {Object.keys(visibleBlocks).map((key) => (
              <button key={key} onClick={() => toggleBlock(key as any)} className="w-full flex items-center justify-between py-2 text-[9px] font-black uppercase tracking-widest hover:text-white transition-all">
                <span className={visibleBlocks[key as keyof typeof visibleBlocks] ? "text-white" : "text-slate-700"}>{key}</span>
                {visibleBlocks[key as keyof typeof visibleBlocks] ? <Eye size={12} style={{color: theme.accent}}/> : <EyeOff size={12} className="text-slate-800"/>}
              </button>
            ))}
          </div>
        </div>
        
        <button className="mt-auto py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95" style={{ backgroundColor: theme.accent }}>
          <Save size={14} className="inline mr-2"/> Commit Changes
        </button>
      </aside>

      {/* 2. THE MAIN CANVAS */}
      <main className="flex-1 ml-72">
        
        {/* FULL BLEED HERO WITH OVERLAY TOP-BAR */}
        <section className="relative h-screen w-full bg-slate-200 group">
           {/* TRUST BAR - NOW AT TOP OF HERO */}
           {visibleBlocks.trust && (
             <div className="absolute top-0 left-0 right-0 z-50 p-8 flex justify-between items-start animate-in fade-in slide-in-from-top-4">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-6">
                   <div className="text-[10px] font-black text-white px-3 py-1 border border-white/20 rounded">BRAND LOGO</div>
                   <div className="flex gap-4 text-white/50">
                      <Instagram size={14} className="hover:text-white cursor-pointer" />
                      <Facebook size={14} className="hover:text-white cursor-pointer" />
                      <Globe size={14} className="hover:text-white cursor-pointer" />
                   </div>
                </div>
                
                <div className="flex gap-4">
                   <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl text-white flex gap-6 items-center">
                      <div className="text-right">
                         <p className="text-[7px] font-black uppercase text-white/40">TripAdvisor</p>
                         <div className="flex gap-0.5"><Star size={8} fill={theme.accent} stroke={theme.accent}/></div>
                      </div>
                      <input className="bg-transparent text-xs font-black w-6 outline-none" defaultValue="5.0"/>
                   </div>
                   <button className="bg-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 transition-all text-slate-900"><LogIn size={14}/> Owner Access</button>
                </div>
             </div>
           )}

           <div className="absolute inset-0 bg-black/30 z-10"></div>
           
           {/* MINIMALIST CENTER TAG */}
           <div className="absolute inset-0 flex flex-col items-center justify-center z-30 text-center px-10">
              <input className="text-[11px] font-black uppercase tracking-[0.6em] mb-4 outline-none bg-transparent text-white opacity-60" defaultValue={portfolio[selectedCamp].class} />
              <input className="text-8xl font-black uppercase italic tracking-tighter w-full outline-none leading-none mb-6 bg-transparent text-white text-center" defaultValue={portfolio[selectedCamp].name} />
              <textarea className="max-w-2xl text-white/80 italic text-lg font-serif outline-none bg-transparent h-20 resize-none leading-relaxed text-center" defaultValue={portfolio[selectedCamp].vibe} />
              <div className="mt-10 flex gap-4">
                 <button className="px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20 hover:bg-white/10 transition-all">Explore Experience</button>
                 <button className="px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: theme.accent }}>Book The Wild</button>
              </div>
           </div>
        </section>

        {/* CONTENT STACK (LIST VIEW) */}
        <div className="max-w-5xl mx-auto space-y-12 py-32 px-10">
           
           {/* ROOM MATRIX (VERTICAL LIST) */}
           {visibleBlocks.matrix && (
             <div className="space-y-6">
                <h2 className="text-[12px] font-black uppercase tracking-[0.5em] opacity-30">Accommodation Breakdown</h2>
                <div className="space-y-4">
                   {['rooms', 'family', 'double', 'single'].map((key) => (
                     <div key={key} className="group flex items-center justify-between p-10 rounded-[2.5rem] shadow-sm border border-slate-200/50 transition-all hover:shadow-2xl" style={{ backgroundColor: theme.blockBg }}>
                        <div className="flex items-center gap-8">
                           <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl font-black italic tracking-tighter" style={{ color: theme.accent, backgroundColor: `${theme.accent}10` }}>
                             {portfolio[selectedCamp][key as keyof typeof portfolio[0]] as number}
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{key} Category</p>
                              <input className="text-2xl font-black uppercase tracking-tighter outline-none bg-transparent" defaultValue={`Luxury ${key.charAt(0).toUpperCase() + key.slice(1)} Suite`} />
                           </div>
                        </div>
                        
                        {/* ORIENTATION PHOTOS (LISTED HORIZONTALLY WITHIN THE LIST ITEM) */}
                        <div className="flex gap-4">
                           <div className="w-32 aspect-video bg-slate-100 rounded-xl border border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group/img cursor-pointer">
                              <Camera size={16} className="opacity-20 group-hover/img:opacity-100 transition-all" />
                           </div>
                           <div className="w-32 aspect-video bg-slate-100 rounded-xl border border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group/img cursor-pointer">
                              <Camera size={16} className="opacity-20 group-hover/img:opacity-100 transition-all" />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* ACTIVITIES (LIST VIEW) */}
           {visibleBlocks.activities && (
             <div className="space-y-6">
                <h2 className="text-[12px] font-black uppercase tracking-[0.5em] opacity-30 text-right">Activity & Experience Matrix</h2>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="p-12 rounded-[3rem] shadow-sm border border-slate-200/50 space-y-8" style={{ backgroundColor: theme.blockBg }}>
                      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accent }}>Included In Stay</p>
                      <div className="space-y-4">
                         {portfolio[selectedCamp].freeActivities.map((a, i) => (
                           <div key={i} className="flex items-center gap-4 group">
                              <div className="w-2 h-2 rounded-full transition-transform group-hover:scale-150" style={{ backgroundColor: theme.accent }} />
                              <input className="text-sm font-bold bg-transparent outline-none w-full" defaultValue={a} />
                           </div>
                         ))}
                         <button className="text-[9px] font-black uppercase opacity-30 hover:opacity-100">+ New Activity</button>
                      </div>
                   </div>
                   <div className="p-12 rounded-[3rem] shadow-sm border border-slate-200/50 space-y-8" style={{ backgroundColor: theme.blockBg }}>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Additional Add-ons</p>
                      <div className="space-y-4">
                         {portfolio[selectedCamp].paidActivities.map((a, i) => (
                           <div key={i} className="flex items-center gap-4 group">
                              <div className="w-2 h-2 rounded-full border-2 border-slate-200 group-hover:border-slate-400" />
                              <input className="text-sm font-bold bg-transparent outline-none w-full" defaultValue={a} />
                           </div>
                         ))}
                         <button className="text-[9px] font-black uppercase opacity-30 hover:opacity-100">+ New Add-on</button>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* MEAL PLANS & TERMS (LIST VIEW) */}
           <div className="space-y-4">
              {visibleBlocks.meals && (
                <div className="p-12 rounded-[3rem] border border-slate-200/50 space-y-6 flex items-start gap-12" style={{ backgroundColor: theme.blockBg }}>
                   <div className="bg-slate-50 p-6 rounded-3xl"><Utensils size={32} style={{ color: theme.accent }}/></div>
                   <div className="grid md:grid-cols-2 gap-12 flex-1">
                      <div className="space-y-2">
                         <p className="text-[9px] font-black uppercase tracking-widest opacity-40 italic">Full Board Provisions</p>
                         <textarea className="w-full text-xs font-bold leading-relaxed bg-transparent outline-none h-16 resize-none" defaultValue={portfolio[selectedCamp].mealFB} />
                      </div>
                      <div className="space-y-2">
                         <p className="text-[9px] font-black uppercase tracking-widest opacity-40 italic">All Inclusive Provisions</p>
                         <textarea className="w-full text-xs font-bold leading-relaxed bg-transparent outline-none h-16 resize-none" defaultValue={portfolio[selectedCamp].mealAI} />
                      </div>
                   </div>
                </div>
              )}
           </div>

           {/* OFFERS BAR (LIST ITEM) */}
           {visibleBlocks.offers && (
             <div className="p-16 rounded-[4rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group" style={{ backgroundColor: theme.trustBar }}>
                <div className="z-20 flex-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4 flex items-center gap-2 animate-pulse"><Check size={14} style={{color: theme.accent}}/> Trade Offers Active</p>
                   <textarea className="bg-transparent text-4xl font-black italic tracking-tighter outline-none w-full resize-none h-20 leading-none" defaultValue={portfolio[selectedCamp].offersText} />
                </div>
                <div className="z-20 p-10 bg-white/5 rounded-full border border-white/10 group-hover:scale-110 transition-transform duration-700"><Percent size={48} style={{ color: theme.accent }}/></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
             </div>
           )}

           {/* TERMS (BOTTOM LIST ITEM) */}
           {visibleBlocks.terms && (
             <div className="p-12 rounded-[3rem] border border-slate-200/50 flex items-center gap-10" style={{ backgroundColor: theme.blockBg }}>
                <div className="text-red-900 bg-red-50 p-5 rounded-full"><ShieldAlert size={24}/></div>
                <div className="flex-1">
                   <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-50 italic">Reservation Policy & Cancellation Terms</p>
                   <textarea className="bg-transparent text-[11px] font-bold outline-none w-full h-12 resize-none" defaultValue={portfolio[selectedCamp].terms} />
                </div>
             </div>
           )}
        </div>

        {/* FLOATING ACTION BAR */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 ml-36 flex gap-4 bg-slate-900/95 backdrop-blur-3xl p-4 rounded-[2.5rem] shadow-2xl border border-white/10 z-[150]">
           {['Shortlist', 'Request STO', 'Contacts', 'Downloads'].map((label, i) => (
             <button key={label} className={`px-10 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'text-white shadow-xl' : 'text-slate-500 hover:text-white'}`} style={i === 0 ? {backgroundColor: theme.accent} : {}}>{label}</button>
           ))}
        </div>

      </main>
    </div>
  );
}
