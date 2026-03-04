"use client";
import React, { useState } from 'react';
import { Save, Eye, Palette, Type, Camera, Zap, ShoppingBag } from 'lucide-react';

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('edit');
  const [isSaving, setIsSaving] = useState(false);

  // Compact Form Styles
  const labelStyle = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block";
  const inputStyle = "w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all";

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Compact Tab Navigation */}
        <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl w-fit border border-slate-200 shadow-sm">
          <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'edit' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
            PROFILE EDITOR
          </button>
          <button onClick={() => setActiveTab('shop')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'shop' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
            HARDWARE STORE
          </button>
        </div>

        {activeTab === 'edit' ? (
          <div className="grid md:grid-cols-12 gap-6">
            {/* Form Column */}
            <aside className="md:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-sm font-black uppercase mb-6 flex items-center gap-2 tracking-tighter">
                  <Type size={18} className="text-orange-500" /> Brand Voice
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelStyle}>Camp Name</label>
                    <input className={inputStyle} defaultValue="Nyumbani Serengeti" />
                  </div>
                  <div>
                    <label className={labelStyle}>The Vibe (Express Your Soul)</label>
                    <textarea 
                      className={`${inputStyle} h-24 resize-none`} 
                      placeholder="e.g. High-end canvas meets the raw heartbeat of the Serengeti..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-sm font-black uppercase mb-4 flex items-center gap-2 tracking-tighter">
                  <Zap size={18} className="text-orange-500" /> Special Offers
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  {['10% Circuit Discount', 'Stay 5 Pay 4', 'Group 10+ Pax'].map(offer => (
                    <div key={offer} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold">{offer}</span>
                      <input type="checkbox" defaultChecked className="accent-orange-500 w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Preview Column */}
            <main className="md:col-span-7">
              <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 sticky top-8">
                <div className="aspect-video bg-slate-200 relative group cursor-pointer flex items-center justify-center">
                  <Camera size={40} className="text-slate-400 opacity-20" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-1 rounded">ACTIVE: 10% OFF</span>
                  </div>
                </div>
                <div className="p-10">
                  <p className="text-[10px] font-black text-orange-500 tracking-[0.2em] mb-2 uppercase">Live Preview</p>
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">Nyumbani Serengeti</h3>
                  <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-orange-500">
                    <p className="text-sm text-slate-600 italic">"High-end canvas meets the raw heartbeat of the Serengeti."</p>
                  </div>
                </div>
                <div className="p-6 bg-slate-900 flex justify-between items-center">
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest">Changes Sync Live</p>
                  <button 
                    onClick={() => {setIsSaving(true); setTimeout(() => setIsSaving(false), 2000)}}
                    className="bg-orange-500 text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg hover:scale-105 transition-all"
                  >
                    {isSaving ? 'PUBLISHING...' : 'SAVE & PUBLISH'}
                  </button>
                </div>
              </div>
            </main>
          </div>
        ) : (
          /* The Private Hardware Store */
          <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm min-h-[500px]">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">The Marketing Hardware</h2>
              <p className="text-slate-400 text-sm mb-12">Order premium physical tools to link your camp's digital voice to the hands of Tour Operators.</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-orange-500 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <ShoppingBag size={20} />
                  </div>
                  <h4 className="font-black text-sm uppercase mb-1 tracking-tighter">NFC Desk Plaque</h4>
                  <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase tracking-widest">$85.00 / Unit</p>
                  <button className="w-full py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-orange-500 transition-colors">ADD TO ORDER</button>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-orange-500 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <ShoppingBag size={20} />
                  </div>
                  <h4 className="font-black text-sm uppercase mb-1 tracking-tighter">Trade Show QR Stand</h4>
                  <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase tracking-widest">$120.00 / Unit</p>
                  <button className="w-full py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-orange-500 transition-colors">ADD TO ORDER</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
