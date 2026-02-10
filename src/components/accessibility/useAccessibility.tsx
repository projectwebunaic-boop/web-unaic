"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

type CycleFeature = {
  type: 'cycle';
  states: { name: string; className: string }[];
};

type ToggleFeature = {
  type: 'toggle';
  className: string;
};

type FeatureConfig = CycleFeature | ToggleFeature;

export const FEATURES_CONFIG: Record<string, FeatureConfig> = {
  contrast: {
    type: 'cycle',
    states: [
      { name: 'Normal', className: '' },
      { name: 'Balikkan Warna', className: 'acc-contrast-invert' },
      { name: 'Kontras Gelap', className: 'acc-contrast-dark' },
      { name: 'Kontras Terang', className: 'acc-contrast-light' },
    ],
  },
  textSize: {
    type: 'cycle',
    states: [
      { name: 'Normal', className: '' },
      { name: 'Sedang', className: 'acc-text-size-medium' },
      { name: 'Besar', className: 'acc-text-size-large' },
      { name: 'Sangat Besar', className: 'acc-text-size-xlarge' },
    ],
  },
  textSpacing: {
    type: 'cycle',
    states: [
      { name: 'Normal', className: '' },
      { name: 'Sedang', className: 'acc-text-spacing-medium' },
      { name: 'Lebar', className: 'acc-text-spacing-large' },
      { name: 'Sangat Lebar', className: 'acc-text-spacing-xlarge' },
    ],
  },
  lineHeight: {
    type: 'cycle',
    states: [
      { name: 'Normal', className: '' },
      { name: 'Sedang', className: 'acc-line-height-medium' },
      { name: 'Lebar', className: 'acc-line-height-large' },
      { name: 'Sangat Lebar', className: 'acc-line-height-xlarge' },
    ],
  },
  textAlign: {
    type: 'cycle',
    states: [
      { name: 'Normal', className: '' },
      { name: 'Rata Kiri', className: 'acc-text-align-left' },
      { name: 'Rata Tengah', className: 'acc-text-align-center' },
      { name: 'Rata Kanan', className: 'acc-text-align-right' },
    ],
  },
  saturation: {
    type: 'cycle',
    states: [
      { name: 'Normal', className: '' },
      { name: 'Rendah', className: 'acc-saturation-low' },
      { name: 'Sedang', className: 'acc-saturation-medium' },
      { name: 'Tinggi', className: 'acc-saturation-high' },
    ],
  },
  cursor: {
    type: 'cycle',
    states: [
      { name: 'Normal', className: 'cursor-normal' },
      { name: 'Besar', className: 'cursor-large' },
      { name: 'Ekstra Besar', className: 'cursor-xlarge' },
    ],
  },
  highlightLinks: { type: 'toggle', className: 'acc-highlight-links' },
  pauseAnimations: { type: 'toggle', className: 'acc-pause-animations' },
  dyslexiaFriendly: { type: 'toggle', className: 'acc-dyslexia-font' },
  hideImages: { type: 'toggle', className: 'acc-hide-images' },
  showTooltips: { type: 'toggle', className: 'acc-show-tooltips' },
  readingMode: { type: 'toggle', className: 'acc-reading-mode' },
};

type FeatureKey = keyof typeof FEATURES_CONFIG;

interface AccessibilityState {
  [key: string]: number | boolean;
}

const getInitialState = (): AccessibilityState => {
  const initialState: AccessibilityState = {};
  for (const key in FEATURES_CONFIG) {
    const config = FEATURES_CONFIG[key as FeatureKey];
    initialState[key] = config.type === 'cycle' ? 0 : false;
  }
  return initialState;
};

interface AccessibilityContextType {
  settings: AccessibilityState;
  cycleFeature: (key: FeatureKey) => void;
  toggleFeature: (key: FeatureKey) => void;
  resetAccessibility: () => void;
  // TTS Features
  isSpeaking: boolean;
  isPaused: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  pauseSpeaking: () => void;
  resumeSpeaking: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AccessibilityState>(getInitialState());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const saved = JSON.parse(savedSettings);
        const filtered = Object.keys(saved).reduce((acc, key) => {
          if (key in FEATURES_CONFIG) {
            acc[key] = saved[key];
          }
          return acc;
        }, {} as AccessibilityState);
        setSettings(prev => ({ ...prev, ...filtered }));
      } catch (error) {
        console.warn('Error loading accessibility settings:', error);
        localStorage.removeItem('accessibility-settings');
      }
    }

    // Cleanup speech on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));

    const allClassNames = Object.values(FEATURES_CONFIG).flatMap(f => {
      if (f.type === 'cycle') {
        return f.states.map(s => s.className);
      } else {
        return f.className;
      }
    }).filter(Boolean);

    const bodyElement = document.body;
    const contentElement = document.querySelector('main') || document.body;

    bodyElement.classList.remove(...allClassNames);
    contentElement.classList.remove(...allClassNames);

    for (const key in settings) {
      const config = FEATURES_CONFIG[key as FeatureKey];
      if (!config) continue;
      const value = settings[key];
      if (config.type === 'cycle') {
        if (typeof value === 'number' && value > 0) {
          const className = config.states[value]?.className;
          if (className.includes('cursor')) {
            bodyElement.classList.add(className);
          } else {
            contentElement.classList.add(className);
          }
        }
      } else if (config.type === 'toggle' && value === true) {
        const className = config.className;
        if (className.includes('cursor')) {
          bodyElement.classList.add(className);
        } else {
          contentElement.classList.add(className);
        }
      }
    }
  }, [settings]);

  const cycleFeature = useCallback((key: FeatureKey) => {
    const config = FEATURES_CONFIG[key];
    if (config.type !== 'cycle') return;
    setSettings(prev => ({
      ...prev,
      [key]: ((prev[key] as number) + 1) % config.states.length,
    }));
  }, []);

  const toggleFeature = useCallback((key: FeatureKey) => {
    const config = FEATURES_CONFIG[key];
    if (config.type !== 'toggle') return;
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const resetAccessibility = useCallback(() => {
    setSettings(getInitialState());
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  // TTS Implementation
  // TTS Implementation
  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Browser Anda tidak mendukung fitur Text-to-Speech.");
      return;
    }

    if (!text || text.trim().length === 0) return;

    // Cancel existing speech
    window.speechSynthesis.cancel();

    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.lang = 'id-ID';
    newUtterance.rate = 1.0;
    newUtterance.pitch = 1.0;

    // Attempt to set a specific voice
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(v => v.lang === 'id-ID' || v.lang === 'id_ID');
    if (indonesianVoice) {
      newUtterance.voice = indonesianVoice;
    }

    newUtterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    newUtterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    newUtterance.onerror = (event) => {
      // Ignore errors caused by canceling/interrupting speech
      if (event.error === 'interrupted' || event.error === 'canceled') {
        setIsSpeaking(false);
        setIsPaused(false);
        return;
      }
      console.error("Speech synthesis error details:", event.error, event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    setUtterance(newUtterance);
    window.speechSynthesis.speak(newUtterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const pauseSpeaking = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeSpeaking = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const value = {
    settings,
    cycleFeature,
    toggleFeature,
    resetAccessibility,
    isSpeaking,
    isPaused,
    speakText,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking
  };

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};

export const useAccessibility = () => useContext(AccessibilityContext);