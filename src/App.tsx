/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, CompanionMessage, CompanionPersona, MediaItem, ModelConfig } from './types';
import { INITIAL_PERSONA, INITIAL_MESSAGES, INITIAL_MEDIA_GALLERY, INITIAL_MODELS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { ChatView } from './components/ChatView';
import { GalleryView } from './components/GalleryView';
import { PersonaView } from './components/PersonaView';
import { HardwareView } from './components/HardwareView';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [persona, setPersona] = useState<CompanionPersona>(INITIAL_PERSONA);
  const [messages, setMessages] = useState<CompanionMessage[]>(INITIAL_MESSAGES);
  const [mediaGallery, setMediaGallery] = useState<MediaItem[]>(INITIAL_MEDIA_GALLERY);
  const [models, setModels] = useState<ModelConfig[]>(INITIAL_MODELS);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        persona={persona}
      />

      <main className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            setMessages={setMessages}
            persona={persona}
            mediaGallery={mediaGallery}
            setMediaGallery={setMediaGallery}
          />
        )}
        {activeTab === 'gallery' && (
          <GalleryView
            mediaGallery={mediaGallery}
            setMediaGallery={setMediaGallery}
          />
        )}
        {activeTab === 'persona' && (
          <PersonaView
            persona={persona}
            setPersona={setPersona}
          />
        )}
        {activeTab === 'hardware' && (
          <HardwareView
            models={models}
            setModels={setModels}
          />
        )}
      </main>
    </div>
  );
}
