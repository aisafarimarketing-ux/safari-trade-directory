"use client";
import React, { useState } from 'react';
import { 
  Save, Plus, Camera, Check, MapPin, 
  ChevronRight, Layout, Eye, Palette, 
  Download, Share2, Bookmark, UserPlus, Percent
} from 'lucide-react';

export default function CompactRobust() {
  const [selectedCamp, setSelectedCamp] = useState(0);
  const [skinColor, setSkinColor] = useState('#E67E22');
  const [activeLayout, setActiveLayout] = useState('A');
  
  const [portfolio, setPortfolio] = useState([
    { 
      id: 1, 
      name: "Nyumbani Serengeti", 
      location: "Central Serengeti", 
      class: "Tented (Luxury)",
      rooms: 10, family: 2, double: 6, single: 2,
      vibe: "High-end canvas meets the raw heartbeat of the Serengeti. Experience unscripted luxury where the wild migration meets refined comfort.",
      freeActivities: ["Morning Game Drive", "Bush Breakfast"],
      paidActivities: ["Hot Air Balloon", "Private Cellar Dinner"],
      offersText: "Stay 5 Pay 4 during Green Season. Circuit discount applies."
    }
  ]);

  const themedText = { color: skinColor };
  const themedBg = { backgroundColor: skinColor };
  const themedBorder = { borderColor: skinColor };

  return (
    <div className="flex min-h-screen bg-[#F4F4F2] font-sans text-slate-900 overflow-hidden">
      
      {/* 1. TIGHT SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white p-5 flex flex-col fixed h-screen top-0 left-0 z-50">
        <div className="flex items-center gap-2 mb-8 opacity-40">
          <Layout size={16} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Portfolio Manager</span>
        </div>
        
        <div className="space-y-1 flex-1 overflow-y-auto">
          {portfolio.map((camp, i) => (
            <button key={camp.id} onClick={() => setSelectedCamp(i)} className={`w-full text-left p-3 rounded-lg text-[11px] font-bold flex justify-between items-center transition-all ${selectedCamp === i ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              {camp.name}
              {selectedCamp === i && <div className="w-1.5 h-1.5 rounded-full" style={themedBg} />}
            </button>
          ))}
          <button className="w-full p-3 mt-2 rounded-lg border border-dashed border-slate-700 text-slate-500 text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:border-slate-500">
            <Plus size={12} /> Add Property
          </button>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
             <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2 italic">Global Skin</p>
             <div className="flex items-center gap-3">
               <input type="color" value={skinColor} onChange={(e) => setSkinColor(e.target.value)} className="w-8 h-8 rounded-lg border-none cursor-pointer bg-transparent" />
               <span className="text-[10px] font-mono opacity-50 uppercase">{skinColor}</span>
             </div>
          </div>
        </div>
      </aside>

      {/* 2. THE COMPACT CANVAS */}
      <main className="flex-1 ml-64 p-6 overflow-y-auto">
        
        {/* TOP COMPACT NAV */}
        <header className="flex justify-between items-center mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-40">
          <div className="flex gap-1">
            {['A', 'B', 'C'].map(l => (
              <button key={l} onClick={() => setActiveLayout(l)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all ${activeLayout === l ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>
                LAYOUT {l}
              </button>
            ))}
          </div>
          <button className="px-6 py-2 rounded-xl text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all" style={themedBg}>
            <Save size={14} /> Save Changes
          </button>
        </header>

        {/* THE UNIT (Everything in one modular sheet) */}
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-2xl rounded-[2rem] overflow-hidden flex flex-col min-h-[80vh]">
          
          {/* Top Hero: Compact Split */}
          <div className="grid md:grid-cols-2 border-b border-slate-100">
            <div className="aspect-[4/3] bg-slate-50 border-r border-slate-100 flex items-center justify-center group cursor-pointer relative overflow-hidden">
               <div className="text-center p-4 opacity-20 group-hover:opacity-100 transition-all z-10">
                 <Camera size={24} className="mx-auto mb-2" />
                 <p className="text-[8px] font-black uppercase tracking-tighter italic">Right-Click to Change Asset</p>
               </div>
               <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-2 py-1 rounded-md text-[8px] font-black uppercase" style={themedText}>
                 {portfolio[selectedCamp].class}
               </div>
            </div>
            
            <div className="p-8 flex flex-col justify-center space-y-3 bg-slate-50/30">
               <input className="text-4xl font-black uppercase italic tracking-tighter bg-transparent border-none outline-none w-full leading-none" defaultValue={portfolio[selectedCamp].name} />
               <div className="flex items-center gap-2 opacity-40">
                  <MapPin size={10} />
                  <input className="text-[10px] font-bold uppercase tracking-widest bg-transparent border-none outline-none" defaultValue={portfolio[selectedCamp].location} />
               </div>
               <textarea className="w-full bg-transparent border-none outline-none text-slate-500 italic text-sm leading-relaxed h-24 resize-none font-serif" defaultValue={portfolio[selectedCamp].vibe} />
            </div>
          </div>

          {/* Matrix Row: Tight Grid */}
          <div className="grid grid-cols-4 bg-white border-b border-slate-100 divide-x divide-slate-100">
            {[
              { label: 'Total Rooms', val: portfolio[selectedCamp].rooms },
              { label: 'Family', val: portfolio[selectedCamp].family },
              { label: 'Double', val: portfolio[selectedCamp].double },
              { label: 'Single', val: portfolio[selectedCamp].single }
            ].map((item, i) => (
              <div key={i} className="p-4 text-center group">
                <p className="text-[8px] font-black text-slate-300 uppercase mb-1 group-hover:text-orange-500 transition-colors">{item.label}</p>
                <input type="number" className="text-xl font-black bg-transparent border-none outline-none text-center w-full" defaultValue={item.val} />
              </div>
            ))}
          </div>

          {/* Activities: Compact Columns */}
          <div className="grid md:grid-cols-2 divide-x divide-slate-100 flex-1">
             <div className="p-8 space-y-4">
               <h3 className="text-[9px] font-black uppercase tracking-widest flex justify-between items-center opacity-40">
                 Included <Plus size={12} className="cursor-pointer hover:text-black" />
               </h3>
               <div className="space-y-2">
                 {portfolio[selectedCamp].freeActivities.map(a => (
                   <div key={a} className="flex items-center gap-3 group">
                     <div className="w-1 h-1 rounded-full" style={themedBg} />
                     <input className="text-[11px] font-bold bg-transparent border-none outline-none w-full" defaultValue={a} />
                   </div>
                 ))}
               </div>
             </div>
             <div className="p-8 space-y-4">
               <h3 className="text-[9px] font-black uppercase tracking-widest flex justify-between items-center opacity-40">
                 Non-Inclusive <Plus size={12} className="cursor-pointer hover:text-black" />
               </h3>
               <div className="space-y-2">
                 {portfolio[selectedCamp].paidActivities.map(a => (
                   <div key={a} className="flex items-center gap-3 group">
                     <div className="w-1 h-1 rounded-full border border-slate-300" />
                     <input className="text-[11px] font-bold bg-transparent border-none outline-none w-full" defaultValue={a} />
                   </div>
                 ))}
               </div>
             </div>
          </div>

          {/* Offer Bar: Solid & Compact */}
          <div className="p-8 text-white flex justify-between items-center gap-8" style={themedBg}>
             <div className="flex items-center gap-4">
               <div className="p-3 bg-white/20 rounded-xl"><Percent size={20} /></div>
               <div>
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70">Active Trade Offers</p>
                 <textarea className="text-sm font-bold bg-transparent border-none outline-none w-full resize-none h-6 focus:h-20 transition-all placeholder:text-white/50" defaultValue={portfolio[selectedCamp].offersText} />
               </div>
             </div>
             <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border border-white/10">
               <Check size={12}/> Opt-In Active
             </div>
          </div>
        </div>

        {/* FLOATING FOOTER: Action Bar */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 ml-32 flex gap-2 bg-slate-900/90 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/10 z-50">
           {[
             { label: 'Shortlist', icon: Bookmark },
             { label: 'Request STO', icon: UserPlus },
             { label: 'Save Contact', icon: Share2 },
             { label: 'Downloads', icon: Download }
           ].map((btn, i) => (
             <button key={i} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}`}>
               <btn.icon size={12} /> {btn.label}
             </button>
           ))}
        </div>

      </main>
    </div>
  );
}
