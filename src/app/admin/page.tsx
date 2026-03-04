"use client";
import React, { useState } from 'react';
import { 
  Save, Camera, Check, Percent, Instagram, Globe, 
  Utensils, ShieldAlert, Eye, EyeOff, Star, Compass, MapPin,
  Trash2, Plus, X, Monitor, Ban
} from 'lucide-react';

export default function RestorationSafariAdmin() {
  const [isPreview, setIsPreview] = useState(false);
  const [selectedCampIndex, setSelectedCampIndex] = useState(0);
  
  const [theme, setTheme] = useState({
    pageBg: '#F4F2EE', 
    blockBg: '#FFFFFF',
    accent: '#2D3436', 
    highlight: '#9E5A24', 
    borderColor: '#E2E8F0'
  });

  // RESTORED: Toggle State for every block
  const [visibleBlocks, setVisibleBlocks] = useState({
    hero: true, matrix: true, inclusions: true, exclusions: true, experiences: true, offers: true, terms: true
  });

  const [portfolio, setPortfolio] = useState([
    { 
      name: "Nyumbani Serengeti", 
      class: "Tented (Luxury)",
      rooms: 10, family: 2, double: 6, single: 2,
      vibe: "High-end canvas meets the raw heartbeat of the Serengeti.",
      inclusions: ["Three gourmet meals", "Bottled water", "Laundry"],
      exclusions: ["Park Fees", "Premium Spirits", "Flights"],
      freeActivities: ["Morning Game Drive", "Nature Walk"],
      paidActivities: ["Hot Air Balloon", "Night Drive"],
      offersText: "Stay 5 Pay 4 during Green Season.",
      terms: "30% non-refundable deposit."
    }
  ]);

  const toggleBlock = (key: keyof typeof visibleBlocks) => {
    setVisibleBlocks(prev => ({ ...prev, [key]: !prev[key] }));
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
    (updated[selectedCampIndex] as any)[listKey] = (updated[selectedCampIndex] as any)[listKey].filter((_: any, i: number) => i !== index);
    setPortfolio(updated);
  };

  const camp = portfolio[selectedCampIndex];

  return (
    <div className="flex min-h-screen font-sans transition-all" style={{ backgroundColor: theme.pageBg }}>
      
      {/* 1. RESTORED SIDEBAR WITH TOGGLES */}
      {!isPreview && (
        <aside className="w-64 bg-white border-r border-slate-200 fixed h-screen top-0 left-0 z-[100] p-5 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Restoration Hub</span>
            <button onClick={() => setIsPreview(true)} className="p-2 bg-slate-100 rounded-lg"><Eye size={14}/></button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-2">
            {/* TOGGLE SECTION */}
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-400 mb-4 tracking-[0.2em]">View Toggles</p>
              <div className="space-y-1">
                {Object.keys(visibleBlocks).map((key) => (
                  <button 
                    key={key} 
                    onClick={() => toggleBlock(key as any)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-slate-50"
                  >
                    <span className={visibleBlocks[key as keyof typeof visibleBlocks] ? "text-slate-900" : "text-slate-300"}>{key}</span>
                    {visibleBlocks[key as keyof typeof visibleBlocks] ? <Eye size={12} className="text-slate-900"/> : <EyeOff size={12} className="text-slate-300"/>}
                  </button>
                ))}
              </div>
            </div>

            {/* THEME SECTION */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <p className="text-[9px] font-bold uppercase text-slate-400">Accents</p>
              {Object.entries(theme).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center"><span className="text-[9px] uppercase font-medium">{k}</span><input type="color" value={v} onChange={(e) => setTheme(t => ({...t, [k]: e.target.value}))} className="w-4 h-4 rounded-full cursor-pointer border-none" /></div>
              ))}
            </div>
          </div>

          <button className="mt-6 w-full py-4 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg" style={{ backgroundColor: theme.highlight }}>
            <Save size={14} className="inline mr-2"/> Save Global
          </button>
        </aside>
      )}

      {/* 2. MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all ${!isPreview ? 'ml-64' : 'ml-0'}`}>
        
        {isPreview && (
          <button onClick={() => setIsPreview(false)} className="fixed top-6 right-6 z-[200] bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-2xl">
            <Monitor size={14}/> Open Admin
          </button>
        )}

        {/* HERO */}
        {visibleBlocks.hero && (
          <section className="relative h-[70vh] w-full bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <div className="absolute bottom-12 left-10 z-30 max-w-4xl">
              <input className="bg-transparent text-white/50 text-[10px] font-black uppercase tracking-[0.4em] mb-2 outline-none w-full" value={camp.class} onChange={(e) => updateField('class', e.target.value)} />
              <input className="bg-transparent text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-none mb-6 outline-none w-full" value={camp.name} onChange={(e) => updateField('name', e.target.value)} />
            </div>
          </section>
        )}

        <div className="max-w-5xl mx-auto py-16 px-6 space-y-20">
          
          {/* ACCOMMODATION MATRIX */}
          {visibleBlocks.matrix && (
            <div className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest opacity-30 italic border-b pb-4">Room Orientation</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['family', 'double', 'single'].map(type => (
                  <div key={type} className="p-8 bg-white rounded-[2rem] border border-slate-100 flex flex-col justify-between h-48 group hover:border-slate-400 transition-all">
                    <p className="text-[8px] font-black uppercase text-slate-400">{type} setup</p>
                    <div className="flex items-center gap-4">
                      <input className="text-5xl font-black italic outline-none w-16 bg-transparent" value={camp[type as keyof typeof camp] as number} onChange={(e) => updateField(type, parseInt(e.target.value))} />
                      <div className="h-10 w-px bg-slate-100" />
                      <span className="text-[10px] font-bold uppercase leading-tight opacity-40">Total<br/>Units</span>
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
                  <div className="flex items-center gap-2"><Utensils size={14}/> <h3 className="text-[10px] font-black uppercase tracking-widest">Included (Inclusions)</h3></div>
                  <button onClick={() => addItem('inclusions')} className="text-blue-500"><Plus size={14}/></button>
                </div>
                <div className="space-y-3">
                  {camp.inclusions.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <Check size={12} className="text-green-500" />
                      <input className="text-xs font-medium outline-none bg-transparent w-full" value={item} onChange={(e) => {
                        const updated = [...portfolio];
                        updated[selectedCampIndex].inclusions[i] = e.target.value;
                        setPortfolio(updated);
                      }} />
                      <button onClick={() => deleteItem('inclusions', i)} className="opacity-0 group-hover:opacity-100 text-red-400"><X size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {visibleBlocks.exclusions && (
              <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200 space-y-6 opacity-80">
                <div className="flex items-center justify-between border-b pb-4 border-slate-200">
                  <div className="flex items-center gap-2"><Ban size={14} className="text-red-400"/> <h3 className="text-[10px] font-black uppercase tracking-widest">Not Included (Exclusions)</h3></div>
                  <button onClick={() => addItem('exclusions')} className="text-slate-400"><Plus size={14}/></button>
                </div>
                <div className="space-y-3">
                  {camp.exclusions.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                      <X size={10} className="text-slate-400" />
                      <input className="text-xs font-medium outline-none bg-transparent w-full italic text-slate-500" value={item} onChange={(e) => {
                        const updated = [...portfolio];
                        updated[selectedCampIndex].exclusions[i] = e.target.value;
                        setPortfolio(updated);
                      }} />
                      <button onClick={() => deleteItem('exclusions', i)} className="opacity-0 group-hover:opacity-100 text-red-400"><X size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RESTORED: CLASSIFIED EXPERIENCES (FREE VS PAID) */}
          {visibleBlocks.experiences && (
            <div className="space-y-8">
              <h2 className="text-[10px] font-black uppercase tracking-widest opacity-30 italic border-b pb-4">The Guest Experience</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {/* FREE */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><p className="text-[9px] font-black uppercase text-slate-400">Included (Free)</p><button onClick={() => addItem('freeActivities')}><Plus size={12}/></button></div>
                  {camp.freeActivities.map((act, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 group">
                      <Compass size={14} style={{ color: theme.highlight }} />
                      <input className="text-xs font-black uppercase tracking-tighter outline-none w-full" value={act} onChange={(e) => {
                         const updated = [...portfolio];
                         updated[selectedCampIndex].freeActivities[i] = e.target.value;
                         setPortfolio(updated);
                      }} />
                      <button onClick={() => deleteItem('freeActivities', i)} className="opacity-0 group-hover:opacity-100 text-red-400"><Trash2 size={12}/></button>
                    </div>
                  ))}
                </div>
                {/* PAID */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><p className="text-[9px] font-black uppercase text-slate-400">Premium (Paid Add-ons)</p><button onClick={() => addItem('paidActivities')}><Plus size={12}/></button></div>
                  {camp.paidActivities.map((act, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900 text-white group shadow-xl">
                      <MapPin size={14} className="text-white/40" />
                      <input className="text-xs font-black uppercase tracking-tighter outline-none w-full bg-transparent" value={act} onChange={(e) => {
                         const updated = [...portfolio];
                         updated[selectedCampIndex].paidActivities[i] = e.target.value;
                         setPortfolio(updated);
                      }} />
                      <button onClick={() => deleteItem('paidActivities', i)} className="opacity-0 group-hover:opacity-100 text-white/50"><Trash2 size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OFFERS & TERMS */}
          {visibleBlocks.offers && (
            <div className="p-16 rounded-[4rem] text-white flex flex-col items-center text-center shadow-2xl" style={{ backgroundColor: theme.highlight }}>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 mb-4">Trade Incentive</span>
              <textarea className="bg-transparent text-5xl font-black italic tracking-tighter outline-none w-full h-24 text-center resize-none leading-none" value={camp.offersText} onChange={(e) => updateField('offersText', e.target.value)} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
