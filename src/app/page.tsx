"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Home, Utensils, Zap, Download, Star, Percent, MousePointer2 } from 'lucide-react';
import data from '../lib/data.json';

export default function TradeProfile() {
  const [property] = useState(data.properties[0]);
  const [primaryColor, setPrimaryColor] = useState('#E67E22'); // Default Safari Orange

  // Right-click handler to change "Skin" (The color wheel/hex prompt)
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newColor = prompt("Enter a Hex Color Code or Color Name (e.g., #2D5A27 or Green):", primaryColor);
    if (newColor) setPrimaryColor(newColor);
  };

  return (
    <div 
      onContextMenu={handleRightClick}
      className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 transition-colors duration-500"
    >
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold tracking-tighter text-xl">SAFARI DIRECTORY</h1>
        <div className="flex gap-6 text-sm font-medium">
          <button className="hover:opacity-70">DIRECTORY</button>
          <button className="flex gap-1 items-center">
            SHORTLIST <span className="text-white px-2 rounded-full text-[10px]" style={{backgroundColor: primaryColor}}>0</span>
          </button>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs">OWNER LOGIN</button>
        </div>
      </nav>

      <main className="pt-24 pb-32 max-w-4xl mx-auto px-6">
        
        {/* Intro Slider Placeholder */}
        <section className="aspect-video bg-slate-100 rounded-3xl overflow-hidden mb-12 relative border border-slate-200 shadow-xl group">
           <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 font-medium">
             <MousePointer2 className="mb-2 opacity-20" size={48} />
             <p>[ PROPERTY VIDEO / PHOTO SLIDER ]</p>
             <p className="text-[10px] mt-4 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Double click to replace images (Coming in Step 5)</p>
           </div>
           <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full">
             Right-click anywhere to change theme color
           </div>
        </section>

        {/* Property Header & Dynamic Special Offers */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2 uppercase">{property.name}</h2>
            <p className="flex items-center gap-2 text-slate-500">
              <MapPin size={18} style={{color: primaryColor}} /> {property.location}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-2 rounded-xl text-orange-700 text-xs font-bold shadow-sm">
              <Percent size={14} /> 10% CIRCUIT DISCOUNT
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-2 rounded-xl text-green-700 text-xs font-bold shadow-sm">
              <Star size={14} /> GREEN SEASON OFFERS
            </div>
          </div>
        </div>

        {/* Property Specs Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
            <Home className="mb-4" style={{color: primaryColor}} />
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Accommodation</p>
            <p className="font-bold text-sm">{property.rooms} {property.room_type}</p>
            <p className="text-xs text-slate-500">{property.orientation}</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
            <Utensils className="mb-4" style={{color: primaryColor}} />
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Meal Plans</p>
            <p className="font-bold text-sm">Full Board Included</p>
            <p className="text-xs text-slate-500">All-Inclusive: +$35 pppn</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
            <Zap className="mb-4" style={{color: primaryColor}} />
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Experiences</p>
            <p className="font-bold text-sm">Night Drives & Walking</p>
            <p className="text-xs text-slate-500">Available at Hilala Camp</p>
          </div>
        </div>

        {/* 2025-2026 Special Offers Detail Section */}
        <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Percent size={120} />
          </div>
          <h3 className="text-2xl font-bold mb-8 relative z-10">2025 - 2026 Special Offers</h3>
          <div className="grid md:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-4">
              <div className="pb-4 border-b border-white/10">
                <p className="text-orange-400 font-bold text-sm uppercase tracking-widest">10% Circuit Discount</p>
                <p className="text-slate-300 text-sm mt-2">Book 5+ nights combined across Nyumbani & Hilala[cite: 3, 4].</p>
              </div>
              <div>
                <p className="text-orange-400 font-bold text-sm uppercase tracking-widest">Group Discount</p>
                <p className="text-slate-300 text-sm mt-2">Extra 10% off for bookings of 10+ pax[cite: 5, 6].</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="pb-4 border-b border-white/10">
                <p className="text-green-400 font-bold text-sm uppercase tracking-widest">Green Season (Stay 3 Pay 2.5)</p>
                <p className="text-slate-300 text-sm mt-2">Book 3 nights, and the 3rd night is 50% off[cite: 8].</p>
              </div>
              <div>
                <p className="text-green-400 font-bold text-sm uppercase tracking-widest">Green Season (Stay 5 Pay 4)</p>
                <p className="text-slate-300 text-sm mt-2">Book 5 nights and receive the 4th night free[cite: 8].</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Sticky Conversion Footer */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl bg-white/90 backdrop-blur-xl border border-slate-200 p-4 rounded-3xl shadow-2xl flex justify-between items-center z-50">
        <button className="flex flex-col items-center px-4 border-r border-slate-100 group">
          <Star size={20} className="group-hover:fill-orange-400 group-hover:text-orange-400 transition-all" />
          <span className="text-[10px] mt-1 font-bold">SHORTLIST</span>
        </button>
        <button className="font-bold text-xs tracking-tighter uppercase px-4 hover:opacity-70 transition-opacity">
          Share My Contacts
        </button>
        <button 
          className="text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-transform active:scale-95"
          style={{backgroundColor: primaryColor}}
        >
          <Download size={18} /> 2026 STO PDF
        </button>
      </footer>
    </div>
  );
}
