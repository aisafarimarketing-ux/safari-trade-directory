"use client";
import React, { useState } from 'react';
import { 
  Save, Plus, Camera, Check, MapPin, Layout, Palette, 
  Download, Share2, Bookmark, UserPlus, Percent,
  Instagram, Facebook, Twitter, Star, Globe, Phone, Mail, LogIn
} from 'lucide-react';

export default function BrandHubAdmin() {
  const [selectedCamp, setSelectedCamp] = useState(0);
  const [skinColor, setSkinColor] = useState('#E67E22');
  
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
      offersText: "Stay 5 Pay 4 during Green Season. Circuit discount applies.",
      ratingGoogle: "4.9",
      ratingTrip: "5.0"
    }
  ]);

  const themedText = { color: skinColor };
  const themedBg = { backgroundColor: skinColor };
  const themedBorder = { borderColor: skinColor };

  return (
    <div className="flex min-h-screen bg-[#F4F4F2] font-sans text-slate-900">
      
      {/* 1. SIDEBAR (Internal Management) */}
      <aside className="w-64 bg-slate-900 text-white p-5 flex flex-col fixed h-screen top-0 left-0 z-50">
        <div className="mb-8 p-3 bg-white/5 rounded-xl border border-white/10">
           <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2 italic">Brand Skin</p>
           <div className="flex items-center gap-3">
             <input type="color" value={skinColor} onChange={(e) => setSkinColor(e.target.value)} className="w-8 h-8 rounded-lg border-none cursor-pointer bg-transparent" />
             <span className="text-[10px] font-mono opacity-50 uppercase">{skinColor}</span>
           </div>
        </div>
        <div className="space-y-1 flex-1 overflow-y-auto">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2 ml-2">My Properties</p>
          {portfolio.map((camp, i) => (
            <button key={camp.id} onClick={() => setSelectedCamp(i)} className={`w-full text-left p-3 rounded-lg text-[11px] font-bold flex justify-between items-center ${selectedCamp === i ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
              {camp.name}
              {selectedCamp === i && <div className="w-1.5 h-1.5 rounded-full" style={themedBg} />}
            </button>
          ))}
          <button className="w-full p-3 mt-2 rounded-lg border border-dashed border-slate-700 text-slate-500 text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:border-slate-400 transition-all">
            <Plus size={12} /> Add Property
          </button>
        </div>
        <button className="mt-auto px-6 py-3 rounded-xl text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg" style={themedBg}>
          <Save size={14} /> Save Changes
        </button>
      </aside>

      {/* 2. THE BRAND HUB CANVAS */}
      <main className="flex-1 ml-64 p-6 overflow-y-auto">
        
        {/* TOP BRAND NAVIGATION */}
        <nav className="max-w-5xl mx-auto mb-4 bg-white px-8 py-3 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em]">
           <div className="flex gap-8">
             <button className="flex items-center gap-2 hover:opacity-60 transition-all"><Phone size={12} style={themedText}/> Contacts</button>
             <button className="flex items-center gap-2 hover:opacity-60 transition-all"><Layout size={12} style={themedText}/> Our Properties</button>
             <button className="flex items-center gap-2 hover:opacity-60 transition-all"><Percent size={12} style={themedText}/> Current Offers</button>
           </div>
           <button className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-all text-slate-500"><LogIn size={12}/> Owner Login</button>
        </nav>

        {/* SOCIAL PROOF & TRUST BAR */}
        <div className="max-w-5xl mx-auto mb-6 bg-slate-900 text-white px-8 py-4 rounded-2xl flex justify-between items-center">
           <div className="flex items-center gap-6">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center italic font-black text-xs">LOGO</div>
              <div className="h-6 w-px bg-white/10"></div>
              <div className="flex gap-4">
                 <Instagram size={14} className="text-slate-400 hover:text-white cursor-pointer" />
                 <Facebook size={14} className="text-slate-400 hover:text-white cursor-pointer" />
                 <Twitter size={14} className="text-slate-400 hover:text-white cursor-pointer" />
                 <Globe size={14} className="text-slate-400 hover:text-white cursor-pointer" />
              </div>
           </div>
           <div className="flex gap-8">
              <div className="flex items-center gap-3">
                 <div className="text-right">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">TripAdvisor</p>
                    <div className="flex gap-0.5 text-orange-400"><Star size={8} fill="currentColor"/><Star size={8} fill="currentColor"/><Star size={8} fill="currentColor"/><Star size={8} fill="currentColor"/><Star size={8} fill="currentColor"/></div>
                 </div>
                 <input className="bg-white/10 border-none outline-none w-8 text-center rounded text-xs font-bold" defaultValue={portfolio[selectedCamp].ratingTrip} />
              </div>
              <div className="flex items-center gap-3">
                 <div className="text-right">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Google Reviews</p>
                    <div className="flex gap-0.5 text-orange-400"><Star size={8} fill="currentColor"/><Star size={8} fill="currentColor"/><Star size={8} fill="currentColor"/><Star size={8} fill="currentColor"/><Star size={8} fill="currentColor"/></div>
                 </div>
                 <input className="bg-white/10 border-none outline-none w-8 text-center rounded text-xs font-bold" defaultValue={portfolio[selectedCamp].ratingGoogle} />
              </div>
           </div>
        </div>

        {/* MAIN COMPACT UNIT */}
        <div className="max-w-5xl mx-auto bg-white border border-slate-200 shadow-2xl rounded-[2.5rem] overflow-hidden">
          
          {/* Identity Section */}
          <div className="grid md:grid-cols-2 border-b border-slate-100">
            <div className="aspect-[16/10] bg-slate-50 border-r border-slate-100 flex items-center justify-center group cursor-pointer relative">
               <div className="text-center opacity-20 group-hover:opacity-100 transition-all">
                 <Camera size={24} className="mx-auto mb-2" />
                 <p className="text-[8px] font-black uppercase">Right-Click to Change Asset</p>
               </div>
               <div className="absolute top-6 left-6 bg-white/90 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm" style={themedText}>
                 {portfolio[selectedCamp].class}
               </div>
            </div>
            <div className="p-10 flex flex-col justify-center space-y-4">
               <div>
                 <div className="flex items-center gap-2 mb-2 opacity-40">
                    <MapPin size={10} />
                    <input className="text-[9px] font-black uppercase tracking-[0.2em] bg-transparent border-none outline-none" defaultValue={portfolio[selectedCamp].location} />
                 </div>
                 <input className="text-5xl font-black uppercase italic tracking-tighter bg-transparent border-none outline-none w-full leading-none mb-4" defaultValue={portfolio[selectedCamp].name} />
                 <textarea className="w-full bg-transparent border-none outline-none text-slate-500 italic text-sm leading-relaxed h-28 resize-none font-serif" defaultValue={portfolio[selectedCamp].vibe} />
               </div>
            </div>
          </div>

          {/* Data Row */}
          <div className="grid grid-cols-4 bg-white border-b border-slate-100 divide-x divide-slate-100">
            {[
              { label: 'Total Rooms', val: portfolio[selectedCamp].rooms },
              { label: 'Family', val: portfolio[selectedCamp].family },
              { label: 'Double', val: portfolio[selectedCamp].double },
              { label: 'Single', val: portfolio[selectedCamp].single }
            ].map((item, i) => (
              <div key={i} className="p-5 text-center">
                <p className="text-[8px] font-black text-slate-300 uppercase mb-1 tracking-widest">{item.label}</p>
                <input type="number" className="text-xl font-black bg-transparent border-none outline-none text-center w-full" defaultValue={item.val} />
              </div>
            ))}
          </div>

          {/* Activities Row */}
          <div className="grid md:grid-cols-2 divide-x divide-slate-100 bg-slate-50/20">
             <div className="p-10 space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex justify-between items-center opacity-30">Included Activities <Plus size={12}/></h3>
               <div className="space-y-3">
                 {portfolio[selectedCamp].freeActivities.map(a => (
                   <div key={a} className="flex items-center gap-3 group">
                     <div className="w-1.5 h-1.5 rounded-full" style={themedBg} />
                     <input className="text-[11px] font-bold bg-transparent border-none outline-none w-full" defaultValue={a} />
                   </div>
                 ))}
               </div>
             </div>
             <div className="p-10 space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex justify-between items-center opacity-30">Non-Inclusive <Plus size={12}/></h3>
               <div className="space-y-3">
                 {portfolio[selectedCamp].paidActivities.map(a => (
                   <div key={a} className="flex items-center gap-3 group">
                     <div className="w-1.5 h-1.5 rounded-full border border-slate-300" />
                     <input className="text-[11px] font-bold bg-transparent border-none outline-none w-full" defaultValue={a} />
                   </div>
                 ))}
               </div>
             </div>
          </div>

          {/* Offers Row */}
          <div className="p-10 text-white flex justify-between items-center gap-10" style={themedBg}>
             <div className="flex items-center gap-6 flex-1">
               <div className="p-4 bg-white/20 rounded-2xl shadow-inner"><Percent size={24} /></div>
               <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Current Trade Offers & Terms</p>
                 <textarea className="text-sm font-bold bg-transparent border-none outline-none w-full resize-none h-12 focus:h-24 transition-all" defaultValue={portfolio[selectedCamp].offersText} />
               </div>
             </div>
             <div className="flex items-center gap-2 bg-slate-900/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-white/10">
               <Check size={14}/> Opt-In Enabled
             </div>
          </div>
        </div>

        {/* FLOATING ACTION BAR */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 ml-32 flex gap-3 bg-slate-900/90 backdrop-blur-2xl p-3 rounded-[2rem] shadow-2xl border border-white/10">
           {[
             { label: 'Shortlist', icon: Bookmark, primary: true },
             { label: 'Request STO', icon: UserPlus },
             { label: 'Save Contact', icon: Share2 },
             { label: 'Downloads', icon: Download }
           ].map((btn, i) => (
             <button key={i} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${btn.primary ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`} style={btn.primary ? themedBg : {}}>
               <btn.icon size={12} /> {btn.label}
             </button>
           ))}
        </div>

      </main>
    </div>
  );
}
