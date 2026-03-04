"use client";
import React, { useState } from 'react';
import { 
  Save, Plus, Camera, Settings, Check, 
  Percent, Star, MapPin, ChevronRight, 
  Trash2, Image as ImageIcon, Layout 
} from 'lucide-react';

export default function PortfolioAdmin() {
  const [selectedCamp, setSelectedCamp] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  // Portfolio state - can easily scale to 10+ camps
  const [portfolio, setPortfolio] = useState([
    { 
      id: 1, 
      name: "Nyumbani Serengeti", 
      location: "Central Serengeti (Ngarenanyuki 2)", 
      rooms: "10", 
      room_type: "Luxury Tented Suites",
      vibe: "High-end canvas meets the raw heartbeat of the Serengeti. Experience unscripted luxury where the wild migration meets refined comfort.",
      circuitDiscount: true,
      stayPay: true
    },
    { 
      id: 2, 
      name: "Hilala Camp", 
      location: "Northern Serengeti", 
      rooms: "8", 
      room_type: "Wilderness Tents",
      vibe: "Secluded luxury in the heart of the wild, offering intimate encounters with nature.",
      circuitDiscount: true,
      stayPay: false
    }
  ]);

  const addCamp = () => {
    const newCamp = { 
      id: Date.now(), 
      name: "New Property Name", 
      location: "Enter Location", 
      rooms: "0", 
      room_type: "Room Category",
      vibe: "Click here to express the soul of this camp...",
      circuitDiscount: false,
      stayPay: false
    };
    setPortfolio([...portfolio, newCamp]);
    setSelectedCamp(portfolio.length);
  };

  const updateCamp = (field: string, value: any) => {
    const updated = [...portfolio];
    updated[selectedCamp] = { ...updated[selectedCamp], [field]: value };
    setPortfolio(updated);
  };

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] font-sans text-slate-900">
      
      {/* SIDEBAR: Portfolio & Management */}
      <aside className="w-72 bg-slate-900 text-white p-6 flex flex-col border-r border-slate-800 sticky h-screen top-0">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-8">
            <Layout className="text-orange-500" size={20} />
            <p className="text-[10px] font-black tracking-[0.3em] uppercase">My Directory</p>
          </div>
          
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {portfolio.map((camp, index) => (
              <button 
                key={camp.id}
                onClick={() => setSelectedCamp(index)}
                className={`w-full text-left p-4 rounded-xl text-xs font-bold transition-all flex justify-between items-center group ${selectedCamp === index ? 'bg-orange-500 text-white shadow-lg' : 'hover:bg-white/5 text-slate-400'}`}
              >
                <span className="truncate">{camp.name}</span>
                {selectedCamp === index ? <Check size={14}/> : <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />}
              </button>
            ))}
          </div>

          <button 
            onClick={addCamp}
            className="w-full mt-4 p-4 rounded-xl border border-dashed border-slate-700 text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:border-slate-500 hover:text-slate-300 transition-all"
          >
            <Plus size={14}/> Add New Camp
          </button>
        </div>
        
        <div className="mt-auto pt-6 border-t border-slate-800 space-y-4">
          <button className="w-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
            <Settings size={16}/> Hardware Store
          </button>
        </div>
      </aside>

      {/* MAIN: The Live-Edit Interface */}
      <main className="flex-1">
        <header className="px-10 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Editor: {portfolio[selectedCamp].name}</p>
          </div>
          <button 
            onClick={() => { setIsSaving(true); setTimeout(() => setIsSaving(false), 1500); }}
            className="bg-slate-900 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl hover:bg-orange-600 transition-all active:scale-95"
          >
            <Save size={16} /> {isSaving ? 'Synchronizing...' : 'Save Changes'}
          </button>
        </header>

        <div className="max-w-5xl mx-auto p-16">
          
          {/* HERO EDIT: Portrait Image & Large Type */}
          <div className="grid md:grid-cols-12 gap-16 items-start mb-32">
            <div className="md:col-span-6">
              <div className="aspect-[4/5] bg-slate-50 rounded-sm border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group cursor-pointer hover:border-orange-400 hover:bg-white transition-all relative">
                <div className="text-center p-8">
                  <Camera size={40} className="mx-auto mb-4 opacity-20 group-hover:text-orange-500 group-hover:opacity-100 transition-all" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Upload Hero Portrait</p>
                  <p className="text-[9px] mt-2 italic opacity-50 text-slate-500 leading-tight">Recommended: High-res vertical shot showing camp soul.</p>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-6 pt-12 space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-600">
                  <MapPin size={14} />
                  <input 
                    className="bg-transparent border-none outline-none font-bold text-[10px] uppercase tracking-[0.3em] w-full"
                    value={portfolio[selectedCamp].location}
                    onChange={(e) => updateCamp('location', e.target.value)}
                  />
                </div>
                <input 
                  className="text-7xl font-black uppercase italic tracking-tighter bg-transparent border-none outline-none w-full leading-[0.85] focus:text-orange-500 transition-colors"
                  value={portfolio[selectedCamp].name}
                  onChange={(e) => updateCamp('name', e.target.value)}
                />
              </div>
              
              <div className="p-8 bg-white border border-slate-100 shadow-sm rounded-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4 italic">The Voice / Taste</p>
                <textarea 
                  className="w-full bg-transparent border-none outline-none text-slate-600 italic leading-relaxed resize-none h-40 text-lg font-serif"
                  value={portfolio[selectedCamp].vibe}
                  onChange={(e) => updateCamp('vibe', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ROOM ORIENTATIONS: Clean Modular Grid */}
          <section className="mb-32">
            <div className="flex justify-between items-end mb-12 border-b border-slate-100 pb-4">
              <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">Room Orientation & Setup</h3>
              <p className="text-[9px] font-bold text-slate-300 uppercase italic">Max 6 Categories</p>
            </div>
            <div className="grid grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group space-y-4">
                  <div className="aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-300 border border-slate-100 group-hover:border-orange-300 group-hover:bg-white transition-all cursor-pointer">
                    <ImageIcon size={24} className="opacity-20 group-hover:opacity-100 group-hover:text-orange-500 mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Add Photo</span>
                  </div>
                  <div className="px-2">
                    <input className="font-bold text-sm w-full bg-transparent border-none outline-none mb-1 uppercase tracking-tighter" defaultValue={i === 1 ? portfolio[selectedCamp].room_type : "New Category"} />
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest italic leading-tight">Click to describe setup...</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TRADE OFFERS: Itinerary Style Toggles */}
          <section className="p-12 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Percent size={180} />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="max-w-md">
                <h4 className="text-3xl font-black italic uppercase tracking-tighter mb-3">2026 Season Offers</h4>
                <p className="text-slate-400 text-xs font-serif leading-relaxed">Activate these incentives to be automatically highlighted on the public trade directory for Tour Operators.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 w-full md:w-auto min-w-[300px]">
                <button 
                  onClick={() => updateCamp('circuitDiscount', !portfolio[selectedCamp].circuitDiscount)}
                  className={`flex items-center justify-between p-5 rounded-2xl transition-all border ${portfolio[selectedCamp].circuitDiscount ? 'bg-orange-500 border-orange-400 shadow-xl' : 'bg-white/5 border-white/10 opacity-50 hover:opacity-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <Percent size={18} />
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest">10% Circuit Discount</p>
                      <p className="text-[9px] opacity-70">5+ Nights Portfolio Stay</p>
                    </div>
                  </div>
                  {portfolio[selectedCamp].circuitDiscount && <Check size={16} />}
                </button>

                <button 
                  onClick={() => updateCamp('stayPay', !portfolio[selectedCamp].stayPay)}
                  className={`flex items-center justify-between p-5 rounded-2xl transition-all border ${portfolio[selectedCamp].stayPay ? 'bg-green-600 border-green-500 shadow-xl' : 'bg-white/5 border-white/10 opacity-50 hover:opacity-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <Star size={18} />
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest">Stay 5 Pay 4</p>
                      <p className="text-[9px] opacity-70">Green Season Incentive</p>
                    </div>
                  </div>
                  {portfolio[selectedCamp].stayPay && <Check size={16} />}
                </button>
              </div>
            </div>
          </section>

          {/* DANGER ZONE: Remove Property */}
          <div className="mt-40 pt-10 border-t border-slate-100 flex justify-center">
             <button className="flex items-center gap-2 text-slate-300 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest">
               <Trash2 size={14} /> Remove Property from Portfolio
             </button>
          </div>

        </div>
      </main>
    </div>
  );
}
