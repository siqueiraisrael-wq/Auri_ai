import React, { useState } from 'react';
import { MediaItem } from '../types';
import { Image as ImageIcon, Video, Heart, Download, Trash2, Filter, Play } from 'lucide-react';

interface GalleryViewProps {
  mediaGallery: MediaItem[];
  setMediaGallery: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ mediaGallery, setMediaGallery }) => {
  const [filter, setFilter] = useState<'all' | 'photo' | 'video' | 'favorite'>('all');

  const filteredMedia = mediaGallery.filter(item => {
    if (filter === 'photo') return item.type === 'photo';
    if (filter === 'video') return item.type === 'video';
    if (filter === 'favorite') return item.isFavorite;
    return true;
  });

  const toggleFavorite = (id: string) => {
    setMediaGallery(prev => prev.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
  };

  const deleteMedia = (id: string) => {
    setMediaGallery(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] bg-slate-950 text-slate-100 overflow-y-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-rose-400" />
            <span>Galeria de Mídia de Aura</span>
          </h2>
          <p className="text-sm text-slate-400">Todas as fotos reais e vídeos enviados por ela durante as conversas no KoboldCpp + Flux.1 + Wan2.1.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          {(['all', 'photo', 'video', 'favorite'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                filter === f ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'photo' ? 'Fotos' : f === 'video' ? 'Vídeos' : 'Favoritas ❤️'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map(item => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:border-slate-700 transition-all"
          >
            {/* Real Media Preview */}
            <div className="w-full h-64 relative bg-black/60 overflow-hidden">
              {item.type === 'photo' ? (
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <video
                  src={item.mediaUrl}
                  controls
                  loop
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

              {/* Top Badge */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur border border-white/10 rounded-lg text-[11px] font-mono text-white flex items-center gap-1.5">
                  {item.type === 'photo' ? <ImageIcon className="w-3.5 h-3.5 text-rose-400" /> : <Video className="w-3.5 h-3.5 text-purple-400" />}
                  <span>{item.type === 'photo' ? 'Flux.1 Dev' : 'Wan2.1'}</span>
                </span>
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg ${
                    item.isFavorite ? 'bg-rose-600 text-white' : 'bg-black/60 backdrop-blur text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Bottom Title inside image */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white">
                <span className="text-xs font-medium truncate max-w-[200px]">{item.title}</span>
                <span className="text-[10px] font-mono text-slate-300">{item.timestamp}</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 flex items-center justify-between bg-slate-900 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 font-mono truncate max-w-[180px]">{item.prompt}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Download do arquivo iniciado.')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </button>
                <button
                  onClick={() => deleteMedia(item.id)}
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
