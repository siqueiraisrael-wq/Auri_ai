import React from 'react';
import { TabType, CompanionPersona } from '../types';
import { MessageSquare, Image as ImageIcon, Sliders, Cpu, Heart, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  persona: CompanionPersona;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, persona }) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Zone 1: Companion Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('chat')}>
        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${persona.avatarBg} flex items-center justify-center shadow-lg`}>
          <Heart className="w-5 h-5 text-white fill-white/20 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white whitespace-nowrap">{persona.name} 💖</h1>
            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-[10px] font-mono">
              Amor: {persona.affection}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">{persona.statusText}</p>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-300 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/50">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'chat' ? 'bg-rose-600 text-white shadow-sm' : 'hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat com {persona.name}</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'gallery' ? 'bg-rose-600 text-white shadow-sm' : 'hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Galeria de Mídia</span>
        </button>

        <button
          onClick={() => setActiveTab('persona')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'persona' ? 'bg-rose-600 text-white shadow-sm' : 'hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Personalidade & Afeto</span>
        </button>

        <button
          onClick={() => setActiveTab('hardware')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'hardware' ? 'bg-rose-600 text-white shadow-sm' : 'hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Hardware & VRAM</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>KoboldCpp + Flux + Wan</span>
        </div>
        <button
          onClick={() => setActiveTab('hardware')}
          className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-sm whitespace-nowrap shrink-0"
        >
          Status dos Modelos
        </button>
      </div>
    </header>
  );
};
