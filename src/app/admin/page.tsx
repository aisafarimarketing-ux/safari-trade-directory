"use client";
import React, { useState, useRef } from 'react';
import { 
  Save, Plus, Camera, Settings, Check, Percent, Star, MapPin, 
  ChevronRight, Trash2, Image as ImageIcon, Layout, Eye, EyeOff, 
  Download, Share2, Bookmark, UserPlus, Palette, Type
} from 'lucide-react';

export default function RobustCreator() {
  const [selectedCamp, setSelectedCamp] = useState(0);
  const [skinColor, setSkinColor] = useState('#E67E22'); // The Global Color Wheel
  const [activeLayout, setActiveLayout] = useState('A'); // A: Brochure, B: Grid, C: Minimal
  const [visibleSections, setVisibleSections] = useState({
    matrix: true,
    rooms: true,
    activities: true,
    offers: true
  });

  const [portfolio, setPortfolio] = useState([
    { 
      id: 1, 
      name: "Nyumbani Serengeti", 
      location: "Central Serengeti", 
      class: "Tented (Luxury)",
      rooms: 10,
      family: 2, double: 6, single: 2,
      vibe: "High-end canvas meets the raw heartbeat of the Serengeti...",
      freeActivities: ["Morning Game Drive", "Bush Breakfast"],
      paidActivities: ["Hot Air Balloon", "Private Cellar Dinner"],
      offersText: "Stay 5 Pay 4 during Green Season. Circuit discount applies."
    }
  ]);

  // Toggle Visibility Logic
  const toggleSection = (section: string) => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Inline Style Generator
  const themedText = { color: skinColor };
  const themedBg = { backgroundColor: skinColor };
  const themedBorder = { borderColor: skinColor };

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] font-sans text-slate-900">
      
      {/* 1. TOP CONTROL BAR */}
      <header className="fixed top-0 right-0 left-72 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 flex justify-between items-center px-8 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border-r pr-6 border-slate-200">
            <Palette size={16} style={themedText} />
            <input 
              type="color" 
              value={skinColor} 
              onChange={(e) => setSkinColor(e.target.value)}
              className="w-6 h-6 rounded-full overflow-hidden border-none cursor-pointer"
            />
          </div>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            {['A', 'B', 'C'].map(l => (
              <button 
                key={l}
                onClick={() => setActiveLayout(l)}
                className={`px-3 py-1 rounded text-[10px] font-black ${activeLayout === l ? 'bg-white shadow-sm' : 'opacity-40'}`}
              >
                LAYOUT {l}
              </button>
            ))}
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105" style={themedBg}>
          <Save size={14} /> Save Portfolio
        </button>
      </header>

      {/* 2. PORTFOLIO SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white p-6 flex flex-col fixed h-screen top-0 left-0 z-[60]">
        <div className="flex items-center gap-2 mb-10 opacity-50">
          <Layout size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Directory Admin</span>
        </div>
        
        <div className="space-y-2 flex-1 overflow-y-auto">
          {portfolio.map((camp, i) => (
            <button key={camp.id} onClick={() => setSelectedCamp(i)} className={`w-full text-left p-4 rounded-xl text-xs font-bold flex justify-between items-center ${selectedCamp === i ? 'bg-white/10 text-white' : 'text-slate-500'}`}>
              {camp.name} {selectedCamp === i && <div className="w-1.5 h-1.5 rounded-full" style={themedBg} />}
            </button>
          ))}
          <button className="w-full p-4 rounded-xl border border-dashed border-slate-700 text-slate-500 text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:border-slate-500 transition-all">
            <Plus size={14} /> Add Property
          </button>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4">Display Toggles</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(visibleSections).map(sec => (
              <button key={sec} onClick={() => toggleSection(sec)} className={`p-2 rounded-lg text-[8px] font-black uppercase flex items-center gap-2 border ${visibleSections[sec] ? 'border-white/20 text-white' : 'border-transparent text-slate-600'}`}>
                {visibleSections[sec] ? <Eye size={10} /> : <EyeOff size={10} />} {sec}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* 3. THE CREATIVE CANVAS */}
      <main className="flex-1 ml-72 pt-24 pb-40 px-16 max-w-6xl mx-auto">
        
        {/* SECTION: Identity & Right-Click Hero */}
        <section className={`grid gap-16 mb-24 ${activeLayout === 'B' ? 'md:grid-cols-2' : 'md:grid-cols-12'}`}>
          <div className={`${activeLayout === 'B' ? '' : 'md:col-span-7'}`}>
            <div 
              className="relative aspect-video bg-slate-100 rounded-sm overflow-hidden border-2 border-dashed border-slate-200 group cursor-pointer"
              onContextMenu={(e) => { e.preventDefault(); alert("Image Upload Triggered"); }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity">
                <Camera size={32} />
                <p className="text-[10px] font-black uppercase mt-2">Right-Click to Replace Hero</p>
              </div>
            </div>
          </div>
          
          <div className={`${activeLayout === 'B' ? '' : 'md:col-span-5'} flex flex-col justify-center`}>
             <select className="bg-transparent border-none text-[10px] font-black uppercase tracking-[0.3em] mb-4 outline-none cursor-pointer" style={themedText}>
               <option>Tented (Luxury)</option>
               <option>Tented (Mid-Range)</option>
               <option>Lodge</option>
               <option>Hotel</option>
               <option>Airbnb (Luxury)</option>
             </select>
             <input className="text-6xl font-black uppercase italic tracking-tighter bg-transparent border-none outline-none w-full mb-4 leading-tight" defaultValue={portfolio[selectedCamp].name} />
             <textarea className="w-full bg-transparent border-none outline-none text-slate-500 italic text-lg leading-relaxed h-32 resize-none font-serif" defaultValue={portfolio[selectedCamp].vibe} />
          </div>
        </section>

        {/* SECTION: Robust Matrix */}
        {visibleSections.matrix && (
          <section className="mb-24 p-8 border border-slate-100 rounded-2xl bg-white shadow-sm grid grid-cols-4 gap-8">
            <div>
              <p className="text-[9px] font-black text-slate-300 uppercase mb-2">Total Inventory</p>
              <input type="number" className="text-2xl font-black bg-transparent border-none outline-none" defaultValue={portfolio[selectedCamp].rooms} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-300 uppercase mb-2">Family Suites</p>
              <input type="number" className="text-2xl font-black bg-transparent border-none outline-none" defaultValue={portfolio[selectedCamp].family} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-300 uppercase mb-2">Double/Twin</p>
              <input type="number" className="text-2xl font-black bg-transparent border-none outline-none" defaultValue={portfolio[selectedCamp].double} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-300 uppercase mb-2">Singles</p>
              <input type="number" className="text-2xl font-black bg-transparent border-none outline-none" defaultValue={portfolio[selectedCamp].single} />
            </div>
          </section>
        )}

        {/* SECTION: Activities (Robust Dual Column) */}
        {visibleSections.activities && (
          <section className="mb-24 grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest border-b pb-2 flex justify-between" style={themedBorder}>
                Included Activities <Plus size={14} className="cursor-pointer" />
              </h3>
              <div className="space-y-3">
                {portfolio[selectedCamp].freeActivities.map((act, i) => (
                  <input key={i} className="block w-full text-sm font-bold bg-transparent border-none outline-none hover:pl-2 transition-all border-l-2 border-transparent focus:border-orange-500" defaultValue={act} />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest border-b pb-2 flex justify-between" style={themedBorder}>
                Paid Add-ons <Plus size={14} className="cursor-pointer" />
              </h3>
              <div className="space-y-3">
                {portfolio[selectedCamp].paidActivities.map((act, i) => (
                  <input key={i} className="block w-full text-sm font-bold bg-transparent border-none outline-none hover:pl-2 transition-all border-l-2 border-transparent focus:border-orange-500" defaultValue={act} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION: Manual Offers */}
        {visibleSections.offers && (
          <section className="mb-32 p-12 rounded-[2.5rem] text-white overflow-hidden relative" style={themedBg}>
            <div className="relative z-10 space-y-4">
              <h4 className="text-3xl font-black italic uppercase tracking-tighter">Current Offers & STO Logic</h4>
              <textarea className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-sm font-bold placeholder:text-white/50 min-h-[150px] outline-none" defaultValue={portfolio[selectedCamp].offersText} />
            </div>
            <Percent size={140} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
          </section>
        )}

        {/* SECTION: Lead Capture Footer (The Business End) */}
        <footer className="fixed bottom-0 left-72 right-0 bg-white border-t border-slate-100 p-6 flex justify-center gap-4 z-40">
           <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">
             <Bookmark size={14} /> Shortlist
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
             <UserPlus size={14} /> Request STO
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
             <Share2 size={14} /> Share
           </button>
           <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all" style={themedBorder}>
             <Download size={14} /> Downloads
           </button>
        </footer>

      </main>
    </div>
  );
}
