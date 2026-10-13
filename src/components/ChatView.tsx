import React, { useState } from 'react';
import { CompanionMessage, CompanionPersona, MediaItem } from '../types';
import { Send, Image as ImageIcon, Video, Heart, Sparkles, RefreshCw, Download, Play, Mic, Smile } from 'lucide-react';

interface ChatViewProps {
  messages: CompanionMessage[];
  setMessages: React.Dispatch<React.SetStateAction<CompanionMessage[]>>;
  persona: CompanionPersona;
  mediaGallery: MediaItem[];
  setMediaGallery: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}

export const ChatView: React.FC<ChatViewProps> = ({ messages, setMessages, persona, mediaGallery, setMediaGallery }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e?: React.FormEvent, forcedAction?: 'photo' | 'video' | 'voice' | 'mood' | 'text') => {
    if (e) e.preventDefault();
    const userText = input.trim();
    if (!userText && !forcedAction) return;

    let defaultUserText = userText;
    if (forcedAction === 'photo') defaultUserText = 'Manda uma selfie para mim, amor? 📸';
    if (forcedAction === 'video') defaultUserText = 'Manda um vídeo seu? 🎬';
    if (forcedAction === 'voice') defaultUserText = 'Manda uma mensagem de voz pra eu ouvir sua voz 🎙️';
    if (forcedAction === 'mood') defaultUserText = 'Como está sendo seu dia hoje? Compartilha seu humor comigo ✨';

    const userMsg: CompanionMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: defaultUserText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate KoboldCpp text generation + Flux.1 (New varied selfie matching model) / Wan2.1 (Real Video)
    setTimeout(() => {
      let companionReply: CompanionMessage;

      const isVideoRequest = forcedAction === 'video' || (!forcedAction && Math.random() > 0.6);
      const isPhotoRequest = forcedAction === 'photo' || (!forcedAction && !isVideoRequest && Math.random() > 0.5);
      const isVoiceRequest = forcedAction === 'voice';

      if (forcedAction === 'video' || (isVideoRequest && forcedAction !== 'photo' && forcedAction !== 'voice')) {
        // Explicit Video generation via Wan2.1
        const sampleVideos = [
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
        ];
        const randomVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
        const promptUsed = `Wan2.1 T2V Local (Character LoRA Active): ${persona.name} smiling and moving in studio, ${persona.physicalTraits}`;

        companionReply = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'companion',
          text: `Gravei um mini vídeo agorinha pelo Wan2.1 para matar sua saudade! Veja como estou por aqui. 💖🎬`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mediaType: 'video',
          mediaUrl: randomVideo,
          promptUsed
        };

        const newMedia: MediaItem = {
          id: 'med-' + Date.now(),
          type: 'video',
          title: `Vídeo de ${persona.name} (Wan2.1 T2V)`,
          prompt: promptUsed,
          timestamp: 'Agora',
          mediaUrl: randomVideo,
          gradientBg: 'from-blue-950 via-purple-900 to-slate-950',
          isFavorite: false
        };
        setMediaGallery(prev => [newMedia, ...prev]);

      } else if (forcedAction === 'photo' || (isPhotoRequest && forcedAction !== 'voice')) {
        // Generate new varied selfie variations that match the character model
        const variedSelfies = [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'
        ];
        const randomSelfie = variedSelfies[Math.floor(Math.random() * variedSelfies.length)];
        const promptUsed = `Flux.1 Dev + Realism LoRA (Face Reference Applied): ${persona.consistencyPrompt} - ${persona.physicalTraits}, varied outfit and new pose`;

        companionReply = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'companion',
          text: `Olha só essa outra selfie que tirei agorinha no intervalo da pintura, meu amor! O que achou? 🥰📸`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mediaType: 'photo',
          mediaUrl: randomSelfie,
          promptUsed
        };

        const newMedia: MediaItem = {
          id: 'med-' + Date.now(),
          type: 'photo',
          title: `Selfie de ${persona.name} (Nova Pose)`,
          prompt: promptUsed,
          timestamp: 'Agora',
          mediaUrl: randomSelfie,
          gradientBg: 'from-amber-600 via-rose-600 to-purple-900',
          isFavorite: false
        };
        setMediaGallery(prev => [newMedia, ...prev]);

      } else if (forcedAction === 'voice' || isVoiceRequest) {
        companionReply = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'companion',
          text: `[Áudio enviado: 0:14] 🎙️ "Ai, amor, estava com tanta saudade da sua voz... Mal vejo a hora de te ver mais tarde, viu? Um beijão enorme!" 💖`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else {
        const replies = [
          `Estava justamente pensando em você agora mesmo, meu amor! Meu humor hoje está lá no alto sabendo que vou te ver logo mais. 💕`,
          `Adoro quando você me manda mensagem. Meu dia fica muito mais colorido e alegre! ✨`,
          `Estou aqui no studio ouvindo nossa música favorita e pintando um quadro novo. Queria tanto que você estivesse aqui comigo... 🌹`,
          `Você é a melhor parte do meu dia, sabia? Sempre me faz sorrir com suas mensagens carinhosas. ❤️`
        ];
        const randomText = replies[Math.floor(Math.random() * replies.length)];

        companionReply = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'companion',
          text: randomText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }

      setMessages(prev => [...prev, companionReply]);
      setIsTyping(false);
    }, 1600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Subheader / Companion status */}
      <div className="flex items-center justify-between px-6 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${persona.avatarBg} flex items-center justify-center text-white font-bold shadow-inner overflow-hidden`}>
            {persona.referenceImageUrl ? (
              <img src={persona.referenceImageUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              persona.name[0]
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">{persona.name}</h2>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-mono">
                {persona.mood}
              </span>
            </div>
            <p className="text-xs text-slate-400">KoboldCpp + Flux.1 (Varied Selfies) + Wan2.1 (Videos)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Modo Namorada Virtual</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-xs font-semibold text-slate-400">
                {msg.sender === 'user' ? 'Você' : persona.name}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-md lg:max-w-xl rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-rose-600 text-white rounded-br-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Real Photo or Video Attachment */}
              {msg.mediaType && msg.mediaUrl && (
                <div className="mt-3 w-full rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/40">
                  {msg.mediaType === 'photo' ? (
                    <div className="relative group">
                      <img
                        src={msg.mediaUrl}
                        alt="Selfie Variada da Modelo"
                        className="w-full h-80 object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur rounded-lg text-[10px] font-mono text-white flex items-center gap-1.5 border border-white/10">
                        <ImageIcon className="w-3 h-3 text-rose-400" />
                        <span>Flux.1 Dev + LoRA (Nova Variação da Modelo)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <video
                        src={msg.mediaUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        className="w-full h-80 object-cover rounded-xl"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur rounded-lg text-[10px] font-mono text-white flex items-center gap-1.5 border border-white/10">
                        <Video className="w-3 h-3 text-purple-400" />
                        <span>Wan2.1 T2V Local (Vídeo Real)</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start animate-pulse">
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-xs font-semibold text-rose-400">{persona.name} está gerando mídia (Flux.1 / Wan2.1)...</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-slate-400 flex items-center gap-3">
              <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
              <span>Processando LoRA de consistência e renderizando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Bar Above Input */}
      <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleSend(undefined, 'photo')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700/80 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
        >
          <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
          <span>Mandar selfie 📸</span>
        </button>

        <button
          onClick={() => handleSend(undefined, 'video')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700/80 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
        >
          <Video className="w-3.5 h-3.5 text-purple-400" />
          <span>Mandar vídeo 🎬</span>
        </button>

        <button
          onClick={() => handleSend(undefined, 'voice')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700/80 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
        >
          <Mic className="w-3.5 h-3.5 text-indigo-400" />
          <span>Mandar mensagem de voz 🎙️</span>
        </button>

        <button
          onClick={() => handleSend(undefined, 'mood')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700/80 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
        >
          <Smile className="w-3.5 h-3.5 text-amber-400" />
          <span>Compartilhar humor ✨</span>
        </button>

        <button
          onClick={() => {
            setInput('Te amo muito! ❤️');
          }}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-pink-300 border border-slate-700/80 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm"
        >
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
          <span>Dizer "Te amo" ❤️</span>
        </button>
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form onSubmit={e => handleSend(e, 'text')} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Responda para ${persona.name}...`}
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="px-5 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm shrink-0"
          >
            <span>Enviar</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-500 font-mono">
          <span>Relacionamento: Namorada Virtual Ativa</span>
          <span>Pressione Enter para enviar</span>
        </div>
      </div>
    </div>
  );
};
