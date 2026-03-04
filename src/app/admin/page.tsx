"use client";
import React, { useState } from 'react';
import { 
  Save, Camera, Check, Percent, Instagram, Globe, LogIn, 
  Utensils, ShieldAlert, Eye, EyeOff, Star, Compass, MapPin
} from 'lucide-react';

export default function ShadcnArchitecturalHub() {
  const [selectedCamp, setSelectedCamp] = useState(0);
  
  const [theme, setTheme] = useState({
    pageBg: '#FBFBFA',
    blockBg: '#FFFFFF',
    accent: '#0F172A', 
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
      freeActivities: ["Morning Game Drive", "Guided Nature Walk", "Sundowners"],
      paidActivities: ["Hot Air Balloon Safari", "Night Game Drive", "Walking Safari Add-on"]
    }
  ]);

  const toggleBlock = (key: keyof typeof visibleBlocks) => {
    setVisibleBlocks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex min-h-screen font-sans transition-all duration-300" style={{ backgroundColor: theme.pageBg, color: theme.text }}>
      
      {/* 1. SHARP SIDEBAR */}
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
        
        <div className="flex-1 space-y-1">
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
        
        {/* HERO SECTION */}
        <section className="relative h-[85vh] w-full overflow-hidden bg-slate-900 group">
           {visibleBlocks.trust && (
             <div className="absolute top-0 left-0 right-0 z-50 p-10 flex justify-between items-center">
                <div className="flex items-center gap-8 bg-black/10 backdrop-blur-md border border-white/10 p-2 pl-6 rounded-full text-white">
                   <span className="text-[10px] font-black tracking-tighter uppercase italic">Safari.Engine</span>
                   <div className="flex gap-4 pr-4 border-l border-white/20 pl-6 text-white/50">
                      <Instagram size={14} className="hover:text-white cursor-pointer" />
                      <Globe size={14} className="hover:text-white cursor-pointer" />
                   </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10 text-white px-6">
                   <div className="flex items-center gap-2 border-r border-white/20 pr-6">
                      <Star size={10} fill="#FFC107" stroke="#FFC107"/>
                      <span className="text-xs font-black">5.0</span>
                   </div>
                   <button className="text-[9px] font-bold uppercase tracking-widest">Login</button>
                </div>
             </div>
           )}

           <div className="absolute inset-0 bg-black/30" />
           
           <div className="absolute bottom-20 left-20 z-30 max-w-4xl">
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-6">
                {portfolio[selectedCamp].class}
              </span>
              <h1 className="text-9xl font-black text-white italic tracking-tighter leading-[0.85] mb-8">
                {portfolio[selectedCamp].name}
              </h1>
              <p className="text-xl text-white/70 font-serif italic max-w-xl">
                {portfolio[selectedCamp].vibe}
              </p>
           </div>
        </section>

        {/* LIST VIEW CONTENT */}
        <div className="max-w-6xl mx-auto py-32 px-20 space-y-32">
           
           {/* ROOM MATRIX */}
           {visibleBlocks.matrix && (
             <div className="space-y-12">
                <div className="flex justify-between items-end border-b pb-6" style={{ borderColor: theme.borderColor }}>
                   <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 italic">Room Allocation</h2>
                   <div className="flex items-center gap-2">
                      <span className="text-2xl font-black italic">{portfolio[selectedCamp].rooms}</span>
                      <span className="text-[9px] font-bold uppercase opacity-30">Keys Total</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                   {['family', 'double', 'single'].map((type) => (
                     <div key={type} className="flex gap-12 p-10 rounded-[2.5rem] border border-slate-100 hover:border-slate-300 transition-all" style={{ backgroundColor: theme.blockBg }}>
                        <div className="w-1/3 flex flex-col justify-between">
                           <div>
                             <p className="text-[9px] font-bold uppercase text-slate-400 mb-1">{type} setup</p>
                             <h3 className="text-2xl font-black uppercase tracking-tight italic">Luxury {type} Suite</h3>
                           </div>
                           <div className="flex items-baseline gap-2 mt-8">
                              <span className="text-5xl font-black italic tracking-tighter" style={{ color: theme.accent }}>{portfolio[selectedCamp][type as keyof typeof portfolio[0]] as number}</span>
                              <span className="text-[10px] font-bold uppercase opacity-20">Units</span>
                           </div>
                        </div>
                        
                        {/* PHOTOS ONLY FOR SETUP TYPES */}
                        <div className="flex-1 grid grid-cols-2 gap-4">
                           <div className="aspect-video bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200 flex items-center justify-center relative group/img overflow-hidden">
                              <Camera className="opacity-10 group-hover/img:opacity-100 transition-all" size={20} />
                           </div>
                           <div className="aspect-video bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200 flex items-center justify-center relative group/img overflow-hidden">
                              <Camera className="opacity-10 group-hover/img:opacity-100 transition-all" size={20} />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* MEAL PLANS */}
           {visibleBlocks.meals && (
             <div className="grid md:grid-cols-2 gap-6">
                <div className="p-12 rounded-[3rem] border border-slate-100 space-y-8" style={{ backgroundColor: theme.blockBg }}>
                   <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: theme.borderColor }}>
                      <Utensils size={14} />
                      <h3 className="text-[10px] font-black uppercase tracking-widest">Full Board (FB)</h3>
                   </div>
                   <ul className="space-y-4">
                      {portfolio[selectedCamp].mealFB.map((item, i) => (
                        <li key={i} className="text-xs text-slate-500 flex items-start gap-4">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300" />
                          <input className="bg-transparent outline-none w-full font-medium" defaultValue={item} />
                        </li>
                      ))}
                      <button className="text-[9px] font-bold uppercase opacity-20 hover:opacity-100 pt-2">+ Add Item</button>
                   </ul>
                </div>
                <div className="p-12 rounded-[3rem] border border-slate-100 space-y-8" style={{ backgroundColor: theme.blockBg }}>
                   <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: theme.borderColor }}>
                      <Star size={14} fill={theme.accent} stroke={theme.accent} />
                      <h3 className="text-[10px] font-black uppercase tracking-widest">All Inclusive (AI)</h3>
                   </div>
                   <ul className="space-y-4">
                      {portfolio[selectedCamp].mealAI.map((item, i) => (
                        <li key={i} className="text-xs text-slate-500 flex items-start gap-4">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                          <input className="bg-transparent outline-none w-full font-bold" defaultValue={item} />
                        </li>
                      ))}
                      <button className="text-[9px] font-bold uppercase opacity-20 hover:opacity-100 pt-2">+ Add Item</button>
                   </ul>
                </div>
             </div>
           )}

           {/* ACTIVITIES - RESTORED AND FIXED */}
           {visibleBlocks.activities && (
             <div className="space-y-12">
                <div className="flex justify-between items-end border-b pb-6" style={{ borderColor: theme.borderColor }}>
                   <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 italic">Experiences</h2>
                   <Compass size={16} className="opacity-20" />
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Included Experiences</p>
                      <div className="grid grid-cols-1 gap-3">
                         {portfolio[selectedCamp].freeActivities.map((a, i) => (
                           <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100">
                              <Check size={12} style={{ color: theme.accent }} />
                              <input className="text-xs font-bold outline-none bg-transparent w-full" defaultValue={a} />
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Premium Add-ons</p>
                      <div className="grid grid-cols-1 gap-3">
                         {portfolio[selectedCamp].paidActivities.map((a, i) => (
                           <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                              <MapPin size={12} className="text-slate-300" />
                              <input className="text-xs font-bold outline-none bg-transparent w-full" defaultValue={a} />
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* OFFERS */}
           {visibleBlocks.offers && (
             <div className="p-20 rounded-[4rem] text-white flex justify-between items-center shadow-2xl relative overflow-hidden" style={{ backgroundColor: theme.accent }}>
                <div className="z-20 flex-1">
                   <div className="flex items-center gap-2 text-white/30 text-[9px] font-bold uppercase tracking-[0.3em] mb-6">
                      <Percent size={14}/> Trade Incentives
                   </div>
                   <textarea className="bg-transparent text-6xl font-black italic tracking-tighter outline-none w-full h-24 resize-none leading-[0.9]" defaultValue={portfolio[selectedCamp].offersText} />
                </div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-48 -mt-48 blur-[100px]" />
             </div>
           )}

           {/* TERMS */}
           {visibleBlocks.terms && (
             <div className="p-12 rounded-[3rem] border border-slate-100 flex items-start gap-10" style={{ backgroundColor: theme.blockBg }}>
                <div className="p-4 bg-slate-50 rounded-2xl"><ShieldAlert size={20} className="text-slate-400" /></div>
                <div className="flex-1">
                   <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-2 italic">Standard Reservation Policy</p>
                   <textarea className="bg-transparent text-[11px] font-bold outline-none w-full h-12 resize-none text-slate-500 leading-relaxed" defaultValue={portfolio[selectedCamp].terms} />
                </div>
             </div>
           )}
        </div>

        {/* FIXED FOOTER BAR */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 ml-32 flex gap-3 bg-slate-900/95 backdrop-blur-3xl p-3 rounded-[2rem] shadow-2xl border border-white/10 z-[150]">
           {['Shortlist', 'Request STO', 'Contacts', 'Downloads'].map((label, i) => (
             <button key={label} className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`} style={i === 0 ? {backgroundColor: theme.accent} : {}}>{label}</button>
           ))}
        </div>

      </main>
    </div>
  );
}
