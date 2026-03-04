"use client";
import React, { useState } from 'react';
import { 
  Save, Camera, Check, Utensils, ShieldAlert, Eye, EyeOff, 
  Star, Compass, MapPin, Trash2, Plus, X, Monitor, Ban,
  Globe, Instagram, LogIn, MessageSquare, Download, Bookmark, UserPlus
} from 'lucide-react';

export default function SafariTradeV8() {
  const [isPreview, setIsPreview] = useState(false);
  const [selectedCampIndex, setSelectedCampIndex] = useState(0);
  
  const [theme, setTheme] = useState({
    pageBg: '#F4F2EE', 
    blockBg: '#FFFFFF',
    accent: '#2D3436', 
    highlight: '#9E5A24', 
    borderColor: '#E2E8F0'
  });

  // COMPREHENSIVE TOGGLES (Including new sections)
  const [visibleBlocks, setVisibleBlocks] = useState({
    brandHeader: true,
    socialProof: true,
    heroGallery: true,
    matrix: true,
    inclusions: true,
    exclusions: true,
    experiences: true,
    offers: true,
    leadCapture: true
  });

  const [portfolio, setPortfolio] = useState([
    { 
      name: "Nyumbani Serengeti", 
      collection: "Nyumbani Collections",
      location: "Central Serengeti, Tanzania",
      class: "Tented (Luxury)",
      rating: "4.9",
      reviews: "128",
      rooms: 10, family: 2, double: 6, single: 2,
      vibe: "High-end canvas meets the raw heartbeat of the Serengeti. Experience unscripted luxury where the wild migration meets refined comfort.",
      inclusions: ["Three gourmet meals", "Bottled water", "Laundry"],
      exclusions: ["Park Fees", "Premium Spirits", "Flights"],
      freeActivities: ["Morning Game Drive", "Nature Walk"],
      paidActivities: ["Hot Air Balloon", "Night Drive"],
      offersText: "Stay 5 Pay 4 during Green Season.",
    }
  ]);

  const toggleBlock = (key: keyof typeof visibleBlocks) => {
    setVisibleBlocks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateField = (field: string, value: any) => {
    const updated = [...portfolio];
    (updated[selectedCampIndex] as any)[field] = value;
    setPortfolio(updated);
  };

  const addItem = (listKey: 'inclusions' | 'exclusions' | 'freeActivities' | 'paidActivities') => {
    const updated = [...portfolio];
    updated[selectedCampIndex][listKey].push("New Item");
    setPortfolio(updated);
  };

  const deleteItem = (listKey: 'inclusions' | 'exclusions' | 'freeActivities' | 'paidActivities', index: number) => {
    const updated = [...portfolio];
    updated[selectedCampIndex][listKey] = updated[selectedCampIndex][listKey].filter((_, i) => i !== index);
    setPortfolio(updated);
  };

  const camp = portfolio[selectedCampIndex];

  return (
    <div className="flex min-h-screen font-sans transition-all" style={{ backgroundColor: theme.pageBg }}>
      
      {/* SIDEBAR WITH ALL TOGGLES */}
      {!isPreview && (
        <aside className="w-64 bg-white border-r border-slate-200 fixed h-screen top-0 left-0 z-[100] p-5 flex flex-col shadow-xl overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Layout Master</span>
            <button onClick={() => setIsPreview(true)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-900 hover:text-white transition-all"><Eye size={14}/></button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-400 mb-4 tracking-widest">Visibility Toggles</p>
              <div className="space-y-1">
                {Object.keys(visibleBlocks).map((key) => (
                  <button key={key} onClick={() => toggleBlock(key as any)} className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-50">
                    <span className={visibleBlocks[key as keyof typeof visibleBlocks] ? "text-slate-900" : "text-slate-300"}>{key.replace(/([A-Z])/g, ' $1')}</span>
                    {visibleBlocks[key as keyof typeof visibleBlocks] ? <Eye size={12} className="text-slate-900"/> : <EyeOff size={12} className="text-slate-300"/>}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100">
               <p className="text-[9px] font-bold uppercase text-slate-400 mb-4">Branding</p>
               <input type="color" value={theme.highlight} onChange={(e) => setTheme({...theme, highlight: e.target.value})} className="w-full h-8 rounded-lg cursor-pointer border-none" />
            </div>
          </div>

          <button className="mt-auto w-full py-4 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg" style={{ backgroundColor: theme.highlight }}>
            <Save size={14} className="inline mr-2"/> Push to Live
          </button>
        </aside>
      )}

      {/* MAIN VIEWPORT */}
      <main className={`flex-1 transition-all duration-500 ${!isPreview ? 'ml-64' : 'ml-0'}`}>
        
        {isPreview && (
          <button onClick={() => setIsPreview(false)} className="fixed top-6 right-6 z-[200] bg-slate-900 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-2xl"><Monitor size={14}/> Back to Editor</button>
        )}

        {/* 1. BRAND HEADER (Restored Above Hero) */}
        {visibleBlocks.brandHeader && (
          <section className="bg-white border-b border-slate-100 p-8 md:p-16">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2 flex-1">
                  <input className="bg-transparent text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 outline-none w-full" value={camp.collection + " TRADE PROFILE"} onChange={(e) => updateField('collection', e.target.value)} />
                  <input className="bg-transparent text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter leading-none outline-none w-full" value={camp.name} onChange={(e) => updateField('name', e.target.value)} />
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1 text-slate-500"><MapPin size={14}/> <input className="bg-transparent text-xs font-bold outline-none" value={camp.location} onChange={(e) => updateField('location', e.target.value)} /></div>
                    {visibleBlocks.socialProof && (
                      <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                        <Star size={12} fill="#F1C40F" className="text-yellow-500"/>
                        <span className="text-xs font-black text-yellow-700">{camp.rating} <span className="opacity-40 font-bold ml-1">({camp.reviews} reviews)</span></span>
                      </div>
                    )}
                  </div>
                </div>
                <textarea className="text-sm md:text-lg text-slate-500 font-serif italic max-w-md outline-none border-none bg-transparent resize-none h-20" value={camp.vibe} onChange={(e) => updateField('vibe', e.target.value)} />
              </div>
            </div>
          </section>
        )}

        {/* 2. HERO GALLERY (Clean - No writing on top) */}
        {visibleBlocks.heroGallery && (
          <section className="h-[50vh] md:h-[70vh] w-full bg-slate-200 relative group">
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera size={40} className="text-slate-400 opacity-20" />
              <p className="absolute bottom-10 text-[10px] font-black uppercase text-slate-400 tracking-widest">Image Gallery / Hero Portrait</p>
            </div>
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all pointer-events-none" />
          </section>
        )}

        <div className="max-w-6xl mx-auto py-16 px-6 space-y-24">
          
          {/* ROOM MATRIX + GLOBAL COUNT */}
          {visibleBlocks.matrix && (
            <div className="space-y-8">
              <div className="flex justify-between items-end border-b pb-4">
                <h2 className="text-[10px] font-black uppercase tracking-widest opacity-30 italic">Capacity Orientation</h2>
                <div className="flex items-center gap-2">
                  <input className="bg-transparent text-3xl font-black italic w-12 text-right outline-none" value={camp.rooms} onChange={(e) => updateField('rooms', parseInt(e.target.value) || 0)} />
                  <span className="text-[10px] font-bold uppercase opacity-30">Total Inventory Keys</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['family', 'double', 'single'].map(type => (
                  <div key={type} className="p-10 bg-white rounded-[3rem] border border-slate-100 flex flex-col justify-between h-48 shadow-sm">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{type} setup</p>
                    <div className="flex items-center gap-4">
                      <input className="text-6xl font-black italic outline-none w-20 bg-transparent" value={camp[type as keyof typeof camp] as number} onChange={(e) => updateField(type, parseInt(e.target.value) || 0)} />
                      <span className="text-[10px] font-bold uppercase opacity-30 leading-tight">Suites</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DYNAMIC LISTS (Inclusions/Exclusions/Activities) */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* INCLUSIONS & EXCLUSIONS Block */}
            <div className="space-y-8">
               {visibleBlocks.inclusions && (
                 <div className="p-10 rounded-[3rem] bg-white border border-slate-100 space-y-6 shadow-sm">
                   <div className="flex items-center justify-between border-b pb-4"><div className="flex items-center gap-2"><Utensils size={14}/> <h3 className="text-[10px] font-black uppercase tracking-widest">Inclusions</h3></div><button onClick={() => addItem('inclusions')}><Plus size={16}/></button></div>
                   {camp.inclusions.map((item, i) => (
                     <div key={i} className="flex items-center gap-3 group"><Check size={12} className="text-green-500" /><input className="text-xs font-medium outline-none bg-transparent w-full" value={item} onChange={(e) => {const updated = [...portfolio]; updated[selectedCampIndex].inclusions[i] = e.target.value; setPortfolio(updated);}} /><button onClick={() => deleteItem('inclusions', i)} className="opacity-0 group-hover:opacity-100 text-red-400"><X size={12}/></button></div>
                   ))}
                 </div>
               )}
               {visibleBlocks.exclusions && (
                 <div className="p-10 rounded-[3rem] bg-slate-100 border border-slate-200 space-y-6">
                   <div className="flex items-center justify-between border-b pb-4"><div className="flex items-center gap-2"><Ban size={14} className="text-red-400"/> <h3 className="text-[10px] font-black uppercase tracking-widest">Exclusions</h3></div><button onClick={() => addItem('exclusions')}><Plus size={16}/></button></div>
                   {camp.exclusions.map((item, i) => (
                     <div key={i} className="flex items-center gap-3 group"><X size={10} className="text-slate-400" /><input className="text-xs font-medium outline-none bg-transparent w-full italic text-slate-500" value={item} onChange={(e) => {const updated = [...portfolio]; updated[selectedCampIndex].exclusions[i] = e.target.value; setPortfolio(updated);}} /><button onClick={() => deleteItem('exclusions', i)} className="opacity-0 group-hover:opacity-100 text-red-400"><X size={12}/></button></div>
                   ))}
                 </div>
               )}
            </div>

            {/* EXPERIENCES BLOCK (Classified) */}
            {visibleBlocks.experiences && (
              <div className="space-y-8">
                 <div className="space-y-4">
                    <div className="flex justify-between items-center px-2"><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Included (Free)</p><button onClick={() => addItem('freeActivities')}><Plus size={14}/></button></div>
                    {camp.freeActivities.map((act, i) => (
                      <div key={i} className="flex items-center gap-4 p-6 rounded-3xl bg-white border border-slate-100 group">
                        <Compass size={18} style={{ color: theme.highlight }} /><input className="text-xs font-bold uppercase outline-none w-full" value={act} onChange={(e) => {const updated = [...portfolio]; updated[selectedCampIndex].freeActivities[i] = e.target.value; setPortfolio(updated);}} /><button onClick={() => deleteItem('freeActivities', i)} className="opacity-0 group-hover:opacity-100 text-red-400"><Trash2 size={14}/></button>
                      </div>
                    ))}
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center px-2"><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Premium (Paid)</p><button onClick={() => addItem('paidActivities')}><Plus size={14}/></button></div>
                    {camp.paidActivities.map((act, i) => (
                      <div key={i} className="flex items-center gap-4 p-6 rounded-3xl bg-slate-900 text-white group shadow-xl transition-all hover:scale-[1.02]">
                        <MapPin size={18} className="text-white/40" /><input className="text-xs font-bold uppercase outline-none w-full bg-transparent" value={act} onChange={(e) => {const updated = [...portfolio]; updated[selectedCampIndex].paidActivities[i] = e.target.value; setPortfolio(updated);}} /><button onClick={() => deleteItem('paidActivities', i)} className="opacity-0 group-hover:opacity-100 text-white/40"><Trash2 size={14}/></button>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>

          {/* OFFERS BLOCK */}
          {visibleBlocks.offers && (
            <div className="p-20 rounded-[4rem] text-white flex flex-col items-center text-center shadow-2xl overflow-hidden relative" style={{ backgroundColor: theme.highlight }}>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-6">Active Trade Incentive</span>
              <textarea className="bg-transparent text-5xl md:text-7xl font-black italic tracking-tighter outline-none w-full h-24 text-center resize-none leading-none z-20" value={camp.offersText} onChange={(e) => updateField('offersText', e.target.value)} />
              <div className="absolute top-0 left-0 w-full h-full bg-black/10 z-10 pointer-events-none" />
            </div>
          )}
        </div>

        {/* 3. RESTORED LEAD CAPTURE FOOTER (Toggleable) */}
        {visibleBlocks.leadCapture && (
          <footer className="bg-white border-t border-slate-100 p-8 md:p-12 mt-20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-3xl font-black italic tracking-tighter">Ready for the Serengeti?</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Connect directly with our Trade Team</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                 <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"><Bookmark size={14}/> Shortlist</button>
                 <button className="flex items-center gap-2 px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-200"><UserPlus size={14}/> Request STO</button>
                 <button className="flex items-center gap-2 px-8 py-4 border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-50"><Download size={14}/> Trade Deck</button>
                 <button className="p-4 bg-slate-100 rounded-2xl text-slate-900 transition-all hover:bg-slate-900 hover:text-white"><Instagram size={18}/></button>
              </div>
            </div>
          </footer>
        )}

      </main>
    </div>
  );
}
