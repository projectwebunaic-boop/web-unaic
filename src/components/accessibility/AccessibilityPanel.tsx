'use client';

import React, { useState, useEffect } from 'react';
import {
  X, RotateCcw, Accessibility, Monitor, Type, MousePointer2,
  Volume2, Play, Square, Pause, BookOpen
} from 'lucide-react';
import { useAccessibility, FEATURES_CONFIG } from './useAccessibility';

// Simplified categories for the sidebar
const sidebarCategories = [
  {
    title: 'Suara & Baca',
    icon: <Volume2 size={18} />,
    type: 'tts', // Special type for TTS controls
  },
  {
    title: 'Tampilan',
    icon: <Monitor size={18} />,
    features: ['contrast', 'saturation', 'hideImages', 'pauseAnimations'],
  },
  {
    title: 'Teks',
    icon: <Type size={18} />,
    features: ['textSize', 'textSpacing', 'lineHeight', 'dyslexiaFriendly'],
  },
  {
    title: 'Cursor & Fokus',
    icon: <MousePointer2 size={18} />,
    features: ['cursor', 'highlightLinks', 'showTooltips', 'readingMode'],
  },
];

const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const context = useAccessibility();
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');

  const {
    settings, cycleFeature, toggleFeature, resetAccessibility,
    isSpeaking, isPaused, speakText, stopSpeaking, pauseSpeaking, resumeSpeaking
  } = context;

  // Keyboard shortcut Ctrl+U
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'u') {
        event.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleReadPage = () => {
    // Attempt to find the most relevant content container
    // Prioritize main tag to avoid picking up small individual article components
    const contentElement =
      document.querySelector('main') ||
      document.querySelector('[role="main"]') ||
      document.querySelector('article') || // Fallback to article if main is missing
      document.body;

    if (!contentElement) return;

    // Get text and clean it up
    let textToRead = contentElement.innerText || "";

    // Remove excessive whitespace and clean up
    textToRead = textToRead.replace(/\s+/g, ' ').trim();

    // Limit length if it's too massive (browser limits vary, but safe side)
    if (textToRead.length > 0) {
      speakText(textToRead);
    } else {
      alert("Tidak ada teks yang dapat dibaca pada halaman ini.");
    }
  };

  return (
    <>
      {/* Floating Trigger Button 
          Positioned at BOTTOM-RIGHT (Middle position).
          Stacked above BackToTop (bottom-6).
      */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-16 z-[999] p-2 md:p-3 rounded-full bg-unaicNavy/80 backdrop-blur-sm text-white border border-unaicGold shadow-lg hover:scale-110 transition-all duration-300 md:bottom-24 md:right-6 md:border-2 md:bg-unaicNavy ${isOpen ? 'translate-x-[200%] opacity-0' : 'translate-x-0 opacity-100'}`}
        aria-label="Aksesibilitas"
        title="Menu Aksesibilitas (Ctrl+U)"
      >
        <Accessibility size={20} className="md:w-6 md:h-6" />
      </button>

      {/* Backdrop (Click to close) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1000] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md shadow-2xl z-[1001] transform transition-transform duration-300 ease-in-out border-l border-gray-200 overflow-hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-unaicNavy text-white">
          <div className="flex items-center gap-2">
            <Accessibility size={20} className="text-unaicGold" />
            <h2 className="font-bold text-lg tracking-wide">Aksesibilitas</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-300">

          <div className="space-y-8">
            {sidebarCategories.map((category, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-2 text-unaicNavy border-b border-gray-200 pb-2">
                  {category.icon}
                  <h3 className="font-semibold text-sm uppercase tracking-wider">{category.title}</h3>
                </div>

                {/* TTS Controls */}
                {category.type === 'tts' && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center gap-2">
                      {(!isSpeaking || isPaused) ? (
                        <button
                          onClick={isPaused ? resumeSpeaking : handleReadPage}
                          className="flex-1 flex items-center justify-center gap-2 bg-unaicNavy text-white py-2 rounded-md hover:bg-blue-800 transition-colors text-sm font-medium"
                        >
                          <Play size={16} /> {isPaused ? "Lanjut" : "Baca Halaman"}
                        </button>
                      ) : (
                        <button
                          onClick={pauseSpeaking}
                          className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors text-sm font-medium"
                        >
                          <Pause size={16} /> Jeda
                        </button>
                      )}

                      <button
                        onClick={stopSpeaking}
                        disabled={!isSpeaking && !isPaused}
                        className={`p-2 rounded-md bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors ${(!isSpeaking && !isPaused) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Berhenti Bicara"
                      >
                        <Square size={16} fill="currentColor" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      {isSpeaking ? (isPaused ? "Pembacaan dijeda" : "Sedang membacakan...") : "Klik untuk membaca konten halaman ini."}
                    </p>
                  </div>
                )}

                {/* Feature Grids */}
                {category.features && (
                  <div className="grid grid-cols-1 gap-3">
                    {category.features.map(key => {
                      const config = FEATURES_CONFIG[key];
                      const isActive = config.type === 'toggle' ? settings[key] : (settings[key] as number) > 0;

                      // Get display label
                      let label = key.replace(/([A-Z])/g, ' $1').trim(); // Fallback label
                      // Manual label mapping for better Indonesian
                      const labels: Record<string, string> = {
                        contrast: 'Kontras Warna',
                        saturation: 'Saturasi',
                        hideImages: 'Sembunyikan Gambar',
                        pauseAnimations: 'Hentikan Animasi',
                        textSize: 'Ukuran Teks',
                        textSpacing: 'Spasi Teks',
                        lineHeight: 'Jarak Baris',
                        dyslexiaFriendly: 'Font Disleksia',
                        cursor: 'Kursor Besar',
                        highlightLinks: 'Sorot Link',
                        showTooltips: 'Tampilkan Tooltip',
                        readingMode: 'Mode Baca (Fokus)',
                      };
                      if (labels[key]) label = labels[key];

                      return (
                        <div key={key} className="flex items-center justify-between group">
                          <span className="text-sm text-gray-700 font-medium group-hover:text-unaicNavy transition-colors">{label}</span>

                          {config.type === 'toggle' ? (
                            <button
                              onClick={() => toggleFeature(key)}
                              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${isActive ? 'bg-unaicGold' : 'bg-gray-300'}`}
                            >
                              <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                          ) : (
                            <button
                              onClick={() => cycleFeature(key)}
                              className={`px-3 py-1 rounded-md text-xs font-semibold border transition-all ${isActive
                                ? 'bg-unaicNavy text-white border-unaicNavy'
                                : 'bg-white text-gray-500 border-gray-300 hover:border-unaicNavy hover:text-unaicNavy'
                                }`}
                            >
                              {(settings[key] as number) === 0 ? 'Normal' : `Lv ${(settings[key] as number)}`}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 bg-gray-50">
          <button
            onClick={resetAccessibility}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-white hover:text-unaicNavy hover:border-unaicNavy transition-all text-sm font-semibold shadow-sm"
          >
            <RotateCcw size={16} />
            <span>Reset Pengaturan</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AccessibilityPanel;
