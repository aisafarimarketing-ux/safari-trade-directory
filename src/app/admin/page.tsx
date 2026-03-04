"use client";
import React, { useState } from 'react';
import { 
  Save, Camera, Check, Percent, Instagram, Globe, LogIn, 
  Utensils, ShieldAlert, Eye, EyeOff, Star, Compass, MapPin,
  Trash2, Plus, X, ChevronRight, LayoutTemplate, Monitor
} from 'lucide-react';

export default function MobileFirstSafariAdmin() {
  const [isPreview, setIsPreview] = useState(false);
  const [selectedCampIndex, setSelectedCampIndex] = useState(0);
  
  // 1. COMPLEMENTARY SAFARI PALETTE
  const [theme, setTheme] = useState({
    pageBg: '#F4F2EE', // Bone / Sand
    blockBg: '#FFFFFF',
    accent: '#2D3436', // Charcoal
    text: '#2D3436',
    highlight: '#D35400', // Burnt Orange
    borderColor: '#E2E8F0'
  });

  const [visibleBlocks, setVisibleBlocks] = useState({
    trust: true, matrix: true, meals: true, activities: true, terms: true, offers: true
  });

  // 2. MULTI-CAMP STATE ENGINE
  const [portfolio, setPortfolio] = useState([
    { 
      name: "Nyumbani Serengeti", 
      class: "Tented (Luxury)",
      rooms: 10, family: 2, double: 6, single: 2,
      vibe: "High-end canvas meets the raw heartbeat of the Serengeti.",
      mealFB: ["Three gourmet meals daily", "Bush breakfast included"],
      mealAI: ["Premium spirits & cellar wines", "Private bush dinners"],
      freeActivities: ["Morning Game Drive", "Sundowners"],
      paidActivities: ["Hot Air Balloon Safari"],
      offersText: "Stay 5 Pay 4 during Green Season.",
      terms: "30% non-refundable deposit."
    }
  ]);

  // --- CRUD FUNCTIONS ---
  const addCamp = () => {
    const newCamp = { ...portfolio[0], name: "New Safari Camp", rooms: 0 };
    setPortfolio([...portfolio, newCamp]);
    setSelectedCampIndex(portfolio.length);
  };

  const deleteCamp = (index: number) => {
    if (portfolio.length > 1) {
      const updated = portfolio.filter((_, i) => i !== index);
      setPortfolio(updated);
      setSelectedCampIndex(0);
    }
  };

  const updateCampField = (field: string, value: any) => {
    const updated = [...portfolio];
    (updated[selectedCampIndex] as any)[field] = value;
    setPortfolio(updated);
  };

  const addItem = (listKey: 'mealFB' | 'mealAI' | 'freeActivities' | 'paidActivities') => {
    const updated = [...portfolio];
    updated[selectedCampIndex][listKey].push("New Item");
    setPortfolio(updated);
  };

  const deleteItem = (listKey: 'mealFB' | 'mealAI' | 'freeActivities' | 'paidActivities', itemIndex: number) => {
    const updated = [...portfolio];
    updated[selectedCampIndex][listKey] = updated[selectedCampIndex][listKey].filter((_, i) => i !== itemIndex);
    setPortfolio(updated);
  };

  const updateItemText = (listKey: 'mealFB' | 'mealAI' | 'freeActivities' | 'paidActivities', itemIndex: number, text: string) => {
    const updated = [...portfolio];
    updated[selectedCampIndex][listKey][itemIndex] = text;
    setPortfolio(updated);
  };

  const camp = portfolio[selectedCampIndex];

  return (
    <div className="flex min-h-screen font-sans transition-all overflow-x-hidden" style={{ backgroundColor: theme.pageBg, color: theme.text }}>
      
      {/* SIDEBAR - HIDDEN IN PREVIEW */}
      {!isPreview && (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-screen top-0 left-0 z-[100] p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Panel</span>
            <button onClick={() => setIsPreview(true)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"><Eye size={14}/></button>
          </div>

          <div className="space-y-6">
            {/* CAMP SELECTION */}
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-400 mb-2">My Portfolio</p>
              {portfolio.map((c, i) => (
                <div key={i} className="flex items-center group mb-1">
                  <button onClick={() => setSelectedCampIndex(i)} className={`flex-1 text-left p-2 rounded-lg text-xs font-bold truncate ${selectedCampIndex === i ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}>
                    {c.name}
                  </button>
                  <button onClick={() => deleteCamp(i)} className="opacity-0 group-hover:opacity-100 p-2 text-red-500"><Trash2 size={12}/></button>
                </div>
              ))}
              <button onClick={addCamp} className="w-full mt-2 p-2 border-2 border-dashed border-slate-200 rounded-lg text-[9px] font-bold uppercase text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all">
                + Add Camp
              </button>
            </div>

            {/* THEME CONFIG */}
            <div className="space-y-3">
              <p className="text-[9px] font-bold uppercase text-slate-400">Theme Colors</p>
              {Object.entries(theme).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between text-[10px] uppercase font-bold">
                  <span>{key}</span>
                  <input type="color" value={val} onChange={(e) => setTheme(t => ({...t, [key]: e.target.value}))} className="w-4 h-4 rounded cursor-pointer" />
                </div>
              ))}
            </div>
          </div>

          <button className="mt-auto w-full py-3 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest shadow-lg" style={{ backgroundColor: theme.highlight }}>
            <Save size={12} className="inline mr-2"/> Sync Cloud
          </button>
        </aside>
      )}

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all ${!isPreview ? 'ml-64' : 'ml-0'}`}>
        
        {/* PREVIEW FLOATER */}
        {isPreview && (
          <button onClick={() => setIsPreview(false)} className="fixed top-6 right-6 z-[200] bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-2xl">
            <Monitor size={14}/> Back to Editor
          </button>
        )}

        {/* HERO SECTION - TIGHTER */}
        <section className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-black/40 z-10" />
          
          <div className="absolute top-0 left-0 right-0 z-50 p-6 md:p-10 flex justify-between items-center">
             <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 p-1.5 pl-4 rounded-full text-white">
                <span className="text-[9px] font-black tracking-widest uppercase italic">Safari.Hub</span>
             </div>
             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/10 text-white px-4">
                <Star size={10} fill="#FFC107" stroke="#FFC107"/>
                <span className="text-xs font-black">5.0</span>
             </div>
          </div>

          <div className="absolute bottom-12 left-6 md:left-20 z-30 max-w-4xl">
             <input 
              className="bg-transparent border-none text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-2 outline-none w-full"
              value={camp.class} onChange={(e) => updateCampField('class', e.target.value)} 
             />
             <input 
              className="bg-transparent border-none text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-none mb-4 outline-none w-full"
              value={camp.name} onChange={(e) => updateCampField('name', e.target.value)}
             />
             <textarea 
              className="bg-transparent border-none text-sm md:text-lg text-white/70 font-serif italic max-w-xl outline-none w-full h-12 resize-none"
              value={camp.vibe} onChange={(e) => updateCampField('vibe', e.target.value)}
             />
          </div>
        </section>

        {/* COMPACT BLOCKS */}
        <div className="max-w-5xl mx-auto py-12 px-6 md:px-12 space-y-12">
           
           {/* ROOM MATRIX - MOBILE TIGHT */}
           {visibleBlocks.matrix && (
             <div className="space-y-6">
                <div className="flex justify-between items-end border-b pb-4" style={{ borderColor: theme.borderColor }}>
                   <h2 className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Accommodations</h2>
                   <div className="flex items-center gap-2">
                      <input className="bg-transparent text-xl font-black italic w-10 text-right outline-none" value={camp.rooms} onChange={(e) => updateCampField('rooms', parseInt(e.target.value))} />
                      <span className="text-[8px] font-bold uppercase opacity-30">Total Keys</span>
                   </div>
                </div>
                
                <div className="space-y-3">
                   {['family', 'double', 'single'].map((type) => (
                     <div key={type} className="flex flex-col md:flex-row gap-4 p-6 rounded-3xl border border-slate-100 hover:border-slate-300 transition-all bg-white">
                        <div className="flex-1">
                           <p className="text-[8px] font-bold uppercase text-slate-400">{type} Category</p>
                           <h3 className="text-lg font-black uppercase italic italic tracking-tight">Luxury {type} Suite</h3>
                           <div className="flex items-center gap-2 mt-4">
                              <input className="text-3xl font-black italic outline-none w-12 bg-transparent" value={camp[type as keyof typeof camp] as number} onChange={(e) => updateCampField(type, parseInt(e.target.value))} />
                              <span className="text-[8px] font-bold uppercase opacity-20 tracking-tighter">Inventory Units</span>
                           </div>
                        </div>
                        <div className="flex gap-2 h-20 md:h-24">
                           <div className="flex-1 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center relative group/img overflow-hidden min-w-[100px]">
                              <Camera className="opacity-10 group-hover/img:opacity-100" size={16} />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* MEAL PLANS & ACTIVITIES - CRUD ENABLED */}
           <div className="grid md:grid-cols-2 gap-6">
              {/* MEALS */}
              <div className="p-8 rounded-[2.5rem] border border-slate-100 bg-white space-y-6">
                 <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: theme.borderColor }}>
                    <div className="flex items-center gap-2"><Utensils size={14}/> <h3 className="text-[9px] font-black uppercase tracking-widest">Inclusions</h3></div>
                    <button onClick={() => addItem('mealFB')} className="text-[8px] font-bold uppercase bg-slate-100 px-2 py-1 rounded">+ Add</button>
                 </div>
                 <div className="space-y-3">
                    {camp.mealFB.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                        <input className="text-[11px] font-medium bg-transparent outline-none w-full" value={item} onChange={(e) => updateItemText('mealFB', i, e.target.value)} />
                        <button onClick={() => deleteItem('mealFB', i)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500"><X size={12}/></button>
                      </div>
                    ))}
                 </div>
              </div>

              {/* ACTIVITIES */}
              <div className="p-8 rounded-[2.5rem] border border-slate-100 bg-white space-y-6">
                 <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: theme.borderColor }}>
                    <div className="flex items-center gap-2"><Compass size={14}/> <h3 className="text-[9px] font-black uppercase tracking-widest">Experiences</h3></div>
                    <button onClick={() => addItem('freeActivities')} className="text-[8px] font-bold uppercase bg-slate-100 px-2 py-1 rounded">+ Add</button>
                 </div>
                 <div className="space-y-3">
                    {camp.freeActivities.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <Check size={10} style={{ color: theme.highlight }} />
                        <input className="text-[11px] font-bold bg-transparent outline-none w-full uppercase tracking-tighter" value={item} onChange={(e) => updateItemText('freeActivities', i, e.target.value)} />
                        <button onClick={() => deleteItem('freeActivities', i)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500"><X size={12}/></button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* PROMOTION BLOCK - FLAT & BEAUTIFUL */}
           {visibleBlocks.offers && (
             <div className="p-10 md:p-16 rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center shadow-lg relative overflow-hidden" style={{ backgroundColor: theme.highlight }}>
                <div className="z-20 w-full text-center md:text-left">
                   <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">Current Trade Offer</div>
                   <textarea 
                    className="bg-transparent text-3xl md:text-6xl font-black italic tracking-tighter outline-none w-full h-20 md:h-28 resize-none leading-none text-center md:text-left" 
                    value={camp.offersText} onChange={(e) => updateCampField('offersText', e.target.value)} 
                   />
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-black/5 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none" />
             </div>
           )}

           {/* TERMS */}
           {visibleBlocks.terms && (
             <div className="p-8 rounded-[2rem] border border-slate-100 bg-white flex items-start gap-6">
                <ShieldAlert size={16} className="text-slate-300 mt-1" />
                <div className="flex-1">
                   <p className="text-[8px] font-black uppercase opacity-30 mb-2">Terms & Conditions</p>
                   <textarea className="bg-transparent text-[10px] font-bold outline-none w-full h-10 resize-none text-slate-400" value={camp.terms} onChange={(e) => updateCampField('terms', e.target.value)} />
                </div>
             </div>
           )}
        </div>

        {/* COMPACT FOOTER ACTIONS */}
        <div className="sticky bottom-4 mx-auto w-fit flex gap-2 bg-slate-900/90 backdrop-blur-xl p-2 rounded-2xl shadow-2xl z-[150] mb-8">
           {['Shortlist', 'Request STO', 'Contacts', 'Downloads'].map((label, i) => (
             <button key={label} className={`px-4 md:px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'text-white' : 'text-slate-500 hover:text-white'}`} style={i === 0 ? {backgroundColor: theme.highlight} : {}}>{label}</button>
           ))}
        </div>

      </main>
    </div>
  );
}
