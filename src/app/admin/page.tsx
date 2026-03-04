"use client";
import React, { useState } from 'react';
import { 
  Save, Plus, Camera, Check, MapPin, Layout, Palette, 
  Download, Share2, Bookmark, UserPlus, Percent,
  Instagram, Facebook, Globe, Phone, Mail, LogIn,
  Utensils, ShieldAlert, Eye, EyeOff, Trash2, ChevronDown
} from 'lucide-react';

export default function FullBleedAdmin() {
  const [selectedCamp, setSelectedCamp] = useState(0);
  const [skinColor, setSkinColor] = useState('#E67E22');
  const [visibleBlocks, setVisibleBlocks] = useState({
    trust: true, nav: true, matrix: true, rooms: true, meals: true, activities: true, terms: true, offers: true
  });

  const [portfolio, setPortfolio] = useState([
    { 
      id: 1, 
      name: "Nyumbani Serengeti", 
      location: "Central Serengeti", 
      class: "Tented (Luxury)",
      rooms: 10, family: 2, double: 6, single: 2,
      vibe: "High-end canvas meets the raw heartbeat of the Serengeti.",
      mealFB: "Three gourmet meals daily included.",
      mealAI: "Premium drinks and private dinners included.",
      terms: "30% non-refundable deposit. 100% at 45 days.",
      offersText: "Stay 5 Pay 4 during Green Season.",
      freeActivities: ["Game Drives"], paidActivities: ["Hot Air Balloon"]
    }
  ]);

  const toggleBlock = (key: keyof typeof visibleBlocks) => {
    setVisibleBlocks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const themedText = { color: skinColor };
  const themedBg = { backgroundColor: skinColor };
  const themedBorder = { borderColor: skinColor };

  return (
    <div className="flex min-h-screen bg-[#F8F8F6] font-sans text-slate-900">
      
      {/* 1. MANAGEMENT SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white p-5 flex flex-col fixed h-screen top-0 left-0 z-[100]">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Display Toggles</p>
        <div className="space-y-1 mb-8">
          {Object.keys(visibleBlocks).map((key) => (
            <button key={key} onClick={() => toggleBlock(key as any)} className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-all">
              <span className={visibleBlocks[key as keyof typeof visibleBlocks] ? "text-white" : "text-slate-600"}>{key}</span>
              {visibleBlocks[key as keyof typeof visibleBlocks] ? <Eye size={12}/> : <EyeOff size={12} className="text-slate-600"/>}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto border-t border-slate-800 pt-6">
           <input type="color" value={skinColor} onChange={(e) => setSkinColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer mb-4" />
           {portfolio.map((camp, i) => (
             <button key={i} onClick={() => setSelectedCamp(i)} className={`w-full text-left p-3 rounded-xl text-[11px] font-black uppercase mb-1 ${selectedCamp === i ? 'bg-white/10' : 'text-slate-500'}`}>{camp.name}</button>
           ))}
        </div>
        <button className="mt-auto py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-2xl" style={themedBg}><Save size={14} className="inline mr-2"/> Save Design</button>
      </aside>

      {/* 2. MAIN HUB CANVAS */}
      <main className="flex-1 ml-64 overflow-y-auto">
        
        {/* FULL BLEED HERO */}
        <section className="relative h-[85vh] w-full bg-slate-200 group overflow-hidden">
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 bg-black/20">
             <button className="bg-white/90 backdrop-blur-xl px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl"><Camera className="inline mr-2" size={16}/> Change Full-Bleed Image</button>
           </div>
           
           {/* Minimalist Floating Tag */}
           <div className="absolute bottom-12 left-12 z-30 bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl max-w-xl">
              <input className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 outline-none w-full" style={themedText} defaultValue={portfolio[selectedCamp].class} />
              <input className="text-6xl font-black uppercase italic tracking-tighter w-full outline-none leading-none mb-4" defaultValue={portfolio[selectedCamp].name} />
              <textarea className="w-full text-slate-500 italic text-sm font-serif outline-none bg-transparent h-12 resize-none leading-tight" defaultValue={portfolio[selectedCamp].vibe} />
           </div>
        </section>

        {/* BRAND NAV & SOCIAL PROOF (Combined) */}
        <div className="max-w-6xl mx-auto -mt-10 relative z-40 space-y-4 px-6 pb-20">
           
           {visibleBlocks.trust && (
             <div className="bg-slate-900 text-white rounded-[2rem] p-4 flex justify-between items-center px-10 shadow-2xl border border-white/5">
                <div className="flex gap-6 items-center">
                   <div className="text-[10px] font-black border border-white/20 px-3 py-1 rounded">LOGO</div>
                   <div className="flex gap-4 border-l border-white/10 pl-6">
                      <Instagram size={14} className="text-slate-500 cursor-pointer hover:text-white" />
                      <Facebook size={14} className="text-slate-500 cursor-pointer hover:text-white" />
                      <Globe size={14} className="text-slate-500 cursor-pointer hover:text-white" />
                   </div>
                </div>
                <div className="flex gap-10">
                   <div className="text-center">
                      <p className="text-[7px] font-black uppercase tracking-widest text-slate-500">Google</p>
                      <div className="flex items-center gap-2"><Star size={10} fill={skinColor} stroke={skinColor}/> <input className="bg-transparent text-xs font-black w-6" defaultValue="4.9"/></div>
                   </div>
                   <div className="text-center border-l border-white/10 pl-10">
                      <p className="text-[7px] font-black uppercase tracking-widest text-slate-500">TripAdvisor</p>
                      <div className="flex items-center gap-2"><Star size={10} fill={skinColor} stroke={skinColor}/> <input className="bg-transparent text-xs font-black w-6" defaultValue="5.0"/></div>
                   </div>
                </div>
             </div>
           )}

           {/* ROOM MATRIX & ORIENTATION GRID */}
           {visibleBlocks.matrix && (
             <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50 uppercase font-black tracking-widest text-[8px] text-slate-400">
                   <div className="p-4 text-center">Total Rooms</div>
                   <div className="p-4 text-center">Family Setup</div>
                   <div className="p-4 text-center">Double Setup</div>
                   <div className="p-4 text-center">Single Setup</div>
                </div>
                <div className="grid grid-cols-4 divide-x divide-slate-100">
                   {['rooms', 'family', 'double', 'single'].map((type) => (
                     <div key={type} className="p-6 group">
                        <input className="text-3xl font-black text-center w-full outline-none mb-4" defaultValue={portfolio[selectedCamp][type as keyof typeof portfolio[0]] as number} />
                        
                        {/* THE PHOTOS UNDER NUMBERS */}
                        <div className="space-y-2">
                           <div className="aspect-[4/3] bg-slate-100 rounded-xl border border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group/img">
                              <Camera size={14} className="opacity-20 group-hover/img:opacity-100" />
                              <div className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/5 transition-all"></div>
                           </div>
                           <div className="aspect-[4/3] bg-slate-100 rounded-xl border border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group/img">
                              <Camera size={14} className="opacity-20 group-hover/img:opacity-100" />
                           </div>
                           <p className="text-[8px] font-black uppercase text-center opacity-30 group-hover:opacity-100">Add Orientation Photo</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* DUAL COLUMN ACTIVITIES */}
           {visibleBlocks.activities && (
             <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 p-12">
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-center mb-12 opacity-30">Activities & Experiences</h2>
                <div className="grid md:grid-cols-2 gap-20">
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-widest mb-6" style={themedText}>Included (Free)</p>
                      <div className="space-y-4">
                         {portfolio[selectedCamp].freeActivities.map(a => (
                           <div key={a} className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full" style={themedBg}/><input className="text-xs font-bold outline-none w-full" defaultValue={a}/></div>
                         ))}
                         <button className="text-[9px] font-black uppercase text-slate-300 hover:text-slate-900">+ Add Row</button>
                      </div>
                   </div>
                   <div className="border-l border-slate-100 pl-20">
                      <p className="text-[9px] font-black uppercase tracking-widest mb-6 text-slate-400">Non-Inclusive (Paid)</p>
                      <div className="space-y-4">
                         {portfolio[selectedCamp].paidActivities.map(a => (
                           <div key={a} className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full border border-slate-300"/><input className="text-xs font-bold outline-none w-full" defaultValue={a}/></div>
                         ))}
                         <button className="text-[9px] font-black uppercase text-slate-300 hover:text-slate-900">+ Add Row</button>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* OFFERS & TERMS (Combined Tight) */}
           <div className="grid md:grid-cols-2 gap-4">
              {visibleBlocks.offers && (
                <div className="p-10 rounded-[2.5rem] text-white flex items-center justify-between" style={themedBg}>
                   <div className="flex-1">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-2">Trade Offers</p>
                      <textarea className="bg-transparent text-lg font-black italic tracking-tighter outline-none w-full resize-none h-12 leading-none" defaultValue={portfolio[selectedCamp].offersText} />
                   </div>
                   <div className="bg-white/10 p-4 rounded-2xl border border-white/20"><Percent size={24}/></div>
                </div>
              )}
              {visibleBlocks.terms && (
                <div className="p-10 rounded-[2.5rem] bg-white border border-slate-200">
                   <p className="text-[8px] font-black uppercase tracking-widest text-red-800 mb-2 flex items-center gap-2"><ShieldAlert size={12}/> Terms & Conditions</p>
                   <textarea className="bg-transparent text-[10px] text-slate-400 font-bold outline-none w-full h-12 resize-none" defaultValue={portfolio[selectedCamp].terms} />
                </div>
              )}
           </div>

        </div>

        {/* FLOATING ACTION BAR */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 ml-32 flex gap-2 bg-slate-900/90 backdrop-blur-2xl p-2 rounded-2xl shadow-2xl border border-white/10 z-[80]">
           {['Shortlist', 'Request STO', 'Contacts', 'Downloads'].map((l, i) => (
             <button key={l} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest ${i === 0 ? 'text-white shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`} style={i === 0 ? themedBg : {}}>{l}</button>
           ))}
        </div>

      </main>
    </div>
  );
}
