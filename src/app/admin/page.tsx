"use client";
import React, { useState } from 'react';
import { 
  Save, Plus, Camera, Check, MapPin, Layout, Palette, 
  Download, Share2, Bookmark, UserPlus, Percent,
  Instagram, Facebook, Globe, Phone, LogIn,
  Utensils, ShieldAlert, Eye, EyeOff, Trash2, Star
} from 'lucide-react';

export default function FullBleedAdmin() {
  const [selectedCamp, setSelectedCamp] = useState(0);
  const [skinColor, setSkinColor] = useState('#E67E22');
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
      vibe: "High-end canvas meets the raw heartbeat of the Serengeti.",
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

  const themedText = { color: skinColor };
  const themedBg = { backgroundColor: skinColor };
  const themedBorder = { borderColor: skinColor };

  return (
    <div className="flex min-h-screen bg-[#F8F8F6] font-sans text-slate-900 overflow-x-hidden">
      
      {/* 1. MANAGEMENT SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white p-5 flex flex-col fixed h-screen top-0 left-0 z-[100]">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 italic">Control Panel</p>
        
        <div className="space-y-1 mb-8">
          <p className="text-[8px] font-black uppercase text-slate-600 mb-2">Toggle Visibility</p>
          {Object.keys(visibleBlocks).map((key) => (
            <button key={key} onClick={() => toggleBlock(key as any)} className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-all">
              <span className={visibleBlocks[key as keyof typeof visibleBlocks] ? "text-white" : "text-slate-600"}>{key}</span>
              {visibleBlocks[key as keyof typeof visibleBlocks] ? <Eye size={12}/> : <EyeOff size={12} className="text-slate-600"/>}
            </button>
          ))}
        </div>
        
        <div className="flex-1 border-t border-slate-800 pt-6 overflow-y-auto">
           <p className="text-[8px] font-black uppercase text-slate-600 mb-2">Skin Color</p>
           <input type="color" value={skinColor} onChange={(e) => setSkinColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer mb-6" />
           
           <p className="text-[8px] font-black uppercase text-slate-600 mb-2">Portfolio</p>
           {portfolio.map((camp, i) => (
             <button key={i} onClick={() => setSelectedCamp(i)} className={`w-full text-left p-3 rounded-xl text-[10px] font-black uppercase mb-1 ${selectedCamp === i ? 'bg-white/10' : 'text-slate-500'}`}>{camp.name}</button>
           ))}
        </div>
        
        <button className="mt-auto py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-2xl transition-transform active:scale-95" style={themedBg}>
          <Save size={14} className="inline mr-2"/> Save Changes
        </button>
      </aside>

      {/* 2. THE VISUAL HUB */}
      <main className="flex-1 ml-64 overflow-y-auto pb-40">
        
        {/* FULL BLEED HERO SECTION */}
        <section className="relative h-[85vh] w-full bg-slate-800 group">
           <div className="absolute inset-0 bg-black/20 z-10"></div>
           {/* Replace with your image upload logic */}
           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20">
             <button className="bg-white/90 backdrop-blur-xl px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest"><Camera className="inline mr-2" size={14}/> Replace Hero Asset</button>
           </div>
           
           {/* Minimalist Bottom-Left Tag */}
           <div className="absolute bottom-12 left-12 z-30 bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl max-w-xl border border-white">
              <input className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 outline-none w-full bg-transparent" style={themedText} defaultValue={portfolio[selectedCamp].class} />
              <input className="text-6xl font-black uppercase italic tracking-tighter w-full outline-none leading-none mb-4 bg-transparent" defaultValue={portfolio[selectedCamp].name} />
              <textarea className="w-full text-slate-500 italic text-sm font-serif outline-none bg-transparent h-14 resize-none leading-relaxed" defaultValue={portfolio[selectedCamp].vibe} />
           </div>
        </section>

        <div className="max-w-6xl mx-auto -mt-12 relative z-40 space-y-6 px-8">
           
           {/* TRUST & SOCIAL BAR */}
           {visibleBlocks.trust && (
             <div className="bg-slate-900 text-white rounded-[2rem] p-4 flex justify-between items-center px-10 shadow-2xl">
                <div className="flex gap-8 items-center">
                   <div className="text-[10px] font-black opacity-30">BRAND LOGO</div>
                   <div className="flex gap-4 border-l border-white/10 pl-8">
                      <Instagram size={14} className="text-slate-500 hover:text-white cursor-pointer" />
                      <Facebook size={14} className="text-slate-500 hover:text-white cursor-pointer" />
                      <Globe size={14} className="text-slate-500 hover:text-white cursor-pointer" />
                   </div>
                </div>
                <div className="flex gap-12">
                   <div className="flex items-center gap-3">
                      <div className="text-right"><p className="text-[7px] font-black uppercase text-slate-500">Google</p><div className="flex gap-0.5"><Star size={8} fill={skinColor} stroke={skinColor}/></div></div>
                      <input className="bg-white/5 text-xs font-black w-8 text-center rounded py-1 outline-none" defaultValue="4.9"/>
                   </div>
                   <div className="flex items-center gap-3 border-l border-white/10 pl-12">
                      <div className="text-right"><p className="text-[7px] font-black uppercase text-slate-500">TripAdvisor</p><div className="flex gap-0.5"><Star size={8} fill={skinColor} stroke={skinColor}/></div></div>
                      <input className="bg-white/5 text-xs font-black w-8 text-center rounded py-1 outline-none" defaultValue="5.0"/>
                   </div>
                </div>
             </div>
           )}

           {/* COMPACT ROOM MATRIX WITH ORIENTATION PHOTOS */}
           {visibleBlocks.matrix && (
             <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-4 divide-x divide-slate-100">
                   {[
                     { label: 'Total Rooms', key: 'rooms' },
                     { label: 'Family Setup', key: 'family' },
                     { label: 'Double / Twin', key: 'double' },
                     { label: 'Single / Solo', key: 'single' }
                   ].map((item) => (
                     <div key={item.key} className="p-8 group hover:bg-slate-50 transition-colors">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-300 text-center mb-2">{item.label}</p>
                        <input className="text-4xl font-black text-center w-full outline-none mb-6 bg-transparent" defaultValue={portfolio[selectedCamp][item.key as keyof typeof portfolio[0]] as number} />
                        
                        {/* ORIENTATION PHOTOS UNDER THE NUMBERS */}
                        <div className="space-y-2">
                           <div className="aspect-[4/3] bg-slate-100 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center group/img overflow-hidden relative">
                              <Camera size={14} className="opacity-10 group-hover/img:opacity-100 transition-all" />
                              <div className="absolute inset-0 hover:bg-black/5 cursor-pointer transition-all"></div>
                           </div>
                           <div className="aspect-[4/3] bg-slate-100 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center group/img overflow-hidden relative">
                              <Camera size={14} className="opacity-10 group-hover/img:opacity-100 transition-all" />
                              <div className="absolute inset-0 hover:bg-black/5 cursor-pointer transition-all"></div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* MEAL PLANS BREAKDOWN */}
           {visibleBlocks.meals && (
             <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-3">
                   <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={themedText}><Utensils size={14}/> Full Board (FB)</h3>
                   <textarea className="w-full text-xs text-slate-500 font-bold leading-relaxed bg-transparent outline-none h-16 resize-none" defaultValue={portfolio[selectedCamp].mealFB} />
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-3">
                   <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-400"><Utensils size={14}/> All Inclusive (AI)</h3>
                   <textarea className="w-full text-xs text-slate-500 font-bold leading-relaxed bg-transparent outline-none h-16 resize-none" defaultValue={portfolio[selectedCamp].mealAI} />
                </div>
             </div>
           )}

           {/* ACTIVITIES: TWO COLUMN ROBUST LIST */}
           {visibleBlocks.activities && (
             <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 p-12">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center opacity-20 mb-12">Activities & Experiences</p>
                <div className="grid md:grid-cols-2 gap-20 divide-x divide-slate-100">
                   <div className="space-y-6">
                      <p className="text-[10px] font-black uppercase tracking-widest" style={themedText}>Included in Stay</p>
                      <div className="space-y-3">
                        {portfolio[selectedCamp].freeActivities.map((a, i) => (
                          <div key={i} className="flex items-center gap-4"><div className="w-2 h-2 rounded-full" style={themedBg}/><input className="text-sm font-bold bg-transparent outline-none w-full" defaultValue={a}/></div>
                        ))}
                        <button className="text-[9px] font-black uppercase text-slate-300 hover:text-black">+ Add Activity</button>
                      </div>
                   </div>
                   <div className="pl-20 space-y-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Non-Inclusive (Paid)</p>
                      <div className="space-y-3">
                        {portfolio[selectedCamp].paidActivities.map((a, i) => (
                          <div key={i} className="flex items-center gap-4"><div className="w-2 h-2 rounded-full border-2 border-slate-200"/><input className="text-sm font-bold bg-transparent outline-none w-full" defaultValue={a}/></div>
                        ))}
                        <button className="text-[9px] font-black uppercase text-slate-300 hover:text-black">+ Add Paid Add-on</button>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* OFFERS & T&CS */}
           <div className="grid md:grid-cols-12 gap-4">
              {visibleBlocks.offers && (
                <div className="md:col-span-8 p-10 rounded-[3rem] text-white flex items-center justify-between" style={themedBg}>
                   <div className="flex-1">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Trade Offers & STO Logic</p>
                      <textarea className="bg-transparent text-xl font-black italic tracking-tighter outline-none w-full resize-none h-16 leading-tight" defaultValue={portfolio[selectedCamp].offersText} />
                   </div>
                   <div className="p-6 bg-white/10 rounded-3xl border border-white/20 ml-6"><Percent size={32}/></div>
                </div>
              )}
              {visibleBlocks.terms && (
                <div className="md:col-span-4 p-10 rounded-[3rem] bg-white border border-slate-200">
                   <p className="text-[9px] font-black uppercase tracking-widest text-red-900 mb-4 flex items-center gap-2"><ShieldAlert size={14}/> Terms & Conditions</p>
                   <textarea className="bg-transparent text-[10px] text-slate-400 font-bold outline-none w-full h-20 resize-none leading-relaxed" defaultValue={portfolio[selectedCamp].terms} />
                </div>
              )}
           </div>
        </div>

        {/* FLOATING ACTION BAR */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 ml-32 flex gap-3 bg-slate-900/95 backdrop-blur-2xl p-3 rounded-[2rem] shadow-2xl border border-white/10 z-[150]">
           {['Shortlist', 'Request STO', 'Contacts', 'Downloads'].map((label, i) => (
             <button key={label} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`} style={i === 0 ? themedBg : {}}>{label}</button>
           ))}
        </div>

      </main>
    </div>
  );
}
