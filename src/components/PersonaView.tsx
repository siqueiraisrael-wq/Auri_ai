import React, { useState } from 'react';
import { CompanionPersona } from '../types';
import { Sparkles, Heart, Shield, Check, Save, Upload, User, Image as ImageIcon } from 'lucide-react';

interface PersonaViewProps {
  persona: CompanionPersona;
  setPersona: React.Dispatch<React.SetStateAction<CompanionPersona>>;
}

export const PersonaView: React.FC<PersonaViewProps> = ({ persona, setPersona }) => {
  const [name, setName] = useState(persona.name);
  const [age, setAge] = useState(persona.age);
  const [archetype, setArchetype] = useState(persona.archetype);
  const [mood, setMood] = useState(persona.mood);
  const [systemPrompt, setSystemPrompt] = useState(persona.systemPrompt);
  const [physicalTraits, setPhysicalTraits] = useState(persona.physicalTraits);
  const [referenceImageUrl, setReferenceImageUrl] = useState(persona.referenceImageUrl);
  const [consistencyPrompt, setConsistencyPrompt] = useState(persona.consistencyPrompt);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPersona(prev => ({
      ...prev,
      name,
      age,
      archetype,
      mood,
      systemPrompt,
      physicalTraits,
      referenceImageUrl,
      consistencyPrompt
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setReferenceImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] bg-slate-950 text-slate-100 overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-rose-400" />
            <span>Personalidade, Afeto & Consistência Física</span>
          </h2>
          <p className="text-sm text-slate-400">Armazene dados físicos persistentes, faça upload de imagens de referência e garanta que as fotos (Flux.1) e vídeos (Wan2.1) sejam sempre da mesma pessoa.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="max-w-4xl space-y-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm">
        {/* Section 1: Basic Personality */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-rose-400" />
            <span>Identidade & Comportamento</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Nome da Companheira</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Idade</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(parseInt(e.target.value) || 24)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Arquétipo / Estilo</label>
              <input
                type="text"
                value={archetype}
                onChange={e => setArchetype(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Estado de Humor Atual</label>
              <select
                value={mood}
                onChange={e => setMood(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Apaixonada">Apaixonada ❤️</option>
                <option value="Carinhosa">Carinhosa 🥰</option>
                <option value="Divertida">Divertida ✨</option>
                <option value="Inspiradora">Inspiradora 🌹</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">System Prompt (KoboldCpp)</label>
            <textarea
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono resize-none"
            />
          </div>
        </div>

        {/* Section 2: Persistent Physical Consistency & Reference Image Upload */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-400" />
            <span>Consistência Física & Referência (Flux.1 + Wan2.1 LoRA / IP-Adapter)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Faça upload de uma imagem de referência ou defina características físicas persistentes. O sistema injetará estes dados automaticamente em toda nova foto ou vídeo para garantir que seja sempre a mesma pessoa.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Reference Image Preview & Upload */}
            <div className="flex flex-col items-center space-y-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 relative shadow-md">
                <img
                  src={referenceImageUrl}
                  alt="Referência Física"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <label className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Foto Referência</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* Physical Traits & Prompt Consistency */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Características Físicas Persistentes</label>
                <textarea
                  value={physicalTraits}
                  onChange={e => setPhysicalTraits(e.target.value)}
                  rows={2}
                  placeholder="Ex: Cabelos castanhos longos, olhos verdes, sardas..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Prompt de Consistência (Injetado no Flux.1 / Wan2.1)</label>
                <input
                  type="text"
                  value={consistencyPrompt}
                  onChange={e => setConsistencyPrompt(e.target.value)}
                  placeholder="Ex: consistent face, same woman, long wavy brown hair..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Save */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Nível de Afeto: {persona.affection}% • Dados Persistidos com Sucesso</span>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Dados Salvos & Sincronizados!' : 'Salvar Dados Físicos'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
