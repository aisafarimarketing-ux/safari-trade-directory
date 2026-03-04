"use client";
import React, { useState } from 'react';
import { 
  Save, Plus, Camera, Check, MapPin, Layout, Palette, 
  Download, Share2, Bookmark, UserPlus, Percent,
  Instagram, Facebook, Star, Globe, Phone, Mail, LogIn,
  Coffee, ShieldAlert, ListChecks, Utensils
} from 'lucide-react';

export default function RobustBrandHub() {
  const [selectedCamp, setSelectedCamp] = useState(0);
  const [skinColor, setSkinColor] = useState('#E67E22');
  
  const [portfolio, setPortfolio] = useState([
    { 
      id: 1, 
      name: "Nyumbani Serengeti", 
      location: "Central Serengeti", 
      class: "Tented (Luxury)",
      rooms: 10, family: 2, double: 6, single: 2,
      vibe: "High-end canvas meets the raw heartbeat of the Serengeti...",
      freeActivities: ["Morning Game Drive", "Bush Breakfast", "Guided Nature Walk"],
      paidActivities: ["Hot Air Balloon", "Private Cellar Dinner", "Night Game Drive"],
      mealFB: "Three gourmet meals daily, tea/coffee, and bottled water.",
      mealAI: "Premium spirits, cellar wines, local beers, and private bush dinners included.",
      terms: "30% non-refundable deposit to confirm. Balance due 45 days prior. No-show: 100% charge.",
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
          {portfolio.map((camp, i) => (
            <button key={camp.id} onClick={() => setSelectedCamp(i)} className={`w-full text-left p-3 rounded-lg text-[11px] font-bold flex justify-between items-center ${selectedCamp === i ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
              {camp.name}
              {selectedCamp === i && <div className="w-1.5 h-1.5 rounded-full" style={themedBg} />}
            </button>
          ))}
          <button className="w-full p-3 mt-2 rounded-lg border border-dashed border-slate-700 text-slate-500 text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:border-slate-400">
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
             <button className="flex items-center gap-2"><Phone size={12} style={themedText}/> Contacts</button>
             <button className="flex items-center gap-2"><Layout size={12} style={themedText}/> Properties</button>
             <button className="flex items-center gap-2"><Percent size={12} style={themedText}/> Offers</button>
           </div>
           <button className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg text-slate-500"><LogIn size={12}/> Owner Login</button>
        </nav>

        {/* TRUST BAR */}
        <div className="max-w-5xl mx-auto mb-6 bg-slate-900 text-white px-8 py-4 rounded-2xl flex justify-between items-center">
           <div className="flex items-center gap-6">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center italic font-black text-xs">LOGO</div>
              <div className="flex gap-4 ml-4">
                 <Instagram size={14} className="text-slate-500" />
                 <Facebook size={14} className="text-slate-500" />
                 <Globe size={14} className="text-slate-500" />
              </div>
           </div>
           <div className="flex gap-8 items-center">
              <div className="flex items-center gap-2 border-r border-white/10 pr-8">
                 <div className="text-right">
                    <p className="text-[7px] font-black uppercase text-slate-500">TripAdvisor</p>
                    <div className="flex gap-0.5 text-orange-400"><Star size={8} fill="currentColor" /></div>
                 </div>
                 <input className="bg-transparent border-none text-xs font-bold w-6" defaultValue={portfolio[selectedCamp].ratingTrip} />
              </div>
              <div className="flex items-center gap-2">
                 <div className="text-right">
                    <p className="text-[7px] font-black uppercase text-slate-500">Google</p>
                    <div className="flex gap-0.5 text-orange-400"><Star size={8} fill="currentColor" /></div>
                 </div>
                 <input className="bg-transparent border-none text-xs font-bold w-6" defaultValue={portfolio[selectedCamp].ratingGoogle} />
              </div>
           </div>
        </div>

        {/* MAIN UNIT */}
        <div className="max-w-5xl mx-auto bg-white border border-slate-200 shadow-2xl rounded-[2.5rem] overflow-hidden">
          
          {/* Identity */}
          <div className="grid md:grid-cols-2 border-b border-slate-100">
            <div className="aspect-[16/10] bg-slate-50 border-r border-slate-100 flex items-center justify-center relative group">
               <Camera size={24} className="opacity-20 group-hover:opacity-100 transition-all" />
               <div className="absolute top-6 left-6 bg-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm" style={themedText}>{portfolio[selectedCamp].class}</div>
            </div>
            <div className="p-10 space-y-4">
               <input className="text-5xl font-black uppercase italic tracking-tighter w-full outline-none" defaultValue={portfolio[selectedCamp].name} />
               <textarea className="w-full text-slate-500 italic text-sm leading-relaxed h-24 resize-none font-serif outline-none" defaultValue={portfolio[selectedCamp].vibe} />
            </div>
          </div>

          {/* Room Matrix */}
          <div className="grid grid-cols-4 bg-white border-b border-slate-100 divide-x divide-slate-100">
            {['Rooms', 'Family', 'Double', 'Single'].map((l) => (
              <div key={l} className="p-4 text-center">
                <p className="text-[7px] font-black text-slate-300 uppercase mb-1">{l}</p>
                <input type="number" className="text-lg font-black bg-transparent w-full text-center outline-none" defaultValue={portfolio[selectedCamp][l.toLowerCase() as keyof typeof portfolio[0]] as number} />
              </div>
            ))}
          </div>

          {/* NEW: MEAL PLANS CATEGORY */}
          <div className="bg-slate-50/50 border-b border-slate-100 p-8 grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <h3 className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2" style={themedText}><Utensils size={12}/> Full Board Included</h3>
               <textarea className="text-xs text-slate-600 bg-transparent w-full resize-none h-12 border-none outline-none leading-relaxed" defaultValue={portfolio[selectedCamp].mealFB} placeholder="What does FB include?" />
            </div>
            <div className="space-y-2">
               <h3 className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-slate-400"><Utensils size={12}/> All Inclusive Option</h3>
               <textarea className="text-xs text-slate-600 bg-transparent w-full resize-none h-12 border-none outline-none leading-relaxed" defaultValue={portfolio[selectedCamp].mealAI} placeholder="AI drinks & spirits list..." />
            </div>
          </div>

          {/* ACTIVITIES SECTION (Corrected Header) */}
          <div className="p-8 border-b border-slate-100">
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-center opacity-30">Activities & Experiences</h2>
             <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                   <h3 className="text-[8px] font-black uppercase tracking-widest text-slate-400">Included (Free)</h3>
                   <div className="space-y-2">
                     {portfolio[selectedCamp].freeActivities.map(a => <div key={a} className="flex items-center gap-3"><div className="w-1 h-1 rounded-full" style={themedBg} /><input className="text-[11px] font-bold bg-transparent outline-none w-full" defaultValue={a} /></div>)}
                   </div>
                </div>
                <div className="space-y-4">
                   <h3 className="text-[8px] font-black uppercase tracking-widest text-slate-400">Non-Inclusive (Paid)</h3>
                   <div className="space-y-2">
                     {portfolio[selectedCamp].paidActivities.map(a => <div key={a} className="flex items-center gap-3"><div className="w-1 h-1 rounded-full border border-slate-300" /><input className="text-[11px] font-bold bg-transparent outline-none w-full" defaultValue={a} /></div>)}
                   </div>
                </div>
             </div>
          </div>

          {/* NEW: TERMS & CONDITIONS */}
          <div className="p-8 bg-white border-b border-slate-100">
             <h3 className="text-[9px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-red-800"><ShieldAlert size={12}/> Terms & Conditions</h3>
             <textarea className="text-[10px] text-slate-400 leading-relaxed bg-slate-50 p-4 rounded-xl w-full h-20 resize-none outline-none border-none" defaultValue={portfolio[selectedCamp].terms} />
          </div>

          {/* Offers Bar */}
          <div className="p-8 text-white flex justify-between items-center gap-8" style={themedBg}>
             <div className="flex items-center gap-4 flex-1">
               <div className="p-3 bg-white/20 rounded-xl"><Percent size={20} /></div>
               <div className="flex-1">
                 <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Trade Offers Active</p>
                 <input className="text-sm font-bold bg-transparent w-full outline-none" defaultValue={portfolio[selectedCamp].offersText} />
               </div>
             </div>
             <button className="bg-slate-900/20 px-4 py-2 rounded-lg text-[9px] font-black uppercase border border-white/10 flex items-center gap-2"><Check size={12}/> Opt-In</button>
          </div>
        </div>

        {/* FLOATING ACTION BAR */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 ml-32 flex gap-2 bg-slate-900/90 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/10">
           {['Shortlist', 'Request STO', 'Contacts', 'Downloads'].map((label, i) => (
             <button key={label} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${i === 0 ? 'text-white' : 'text-slate-400 hover:text-white'}`} style={i === 0 ? themedBg : {}}>{label}</button>
           ))}
        </div>

      </main>
    </div>
  );
}
