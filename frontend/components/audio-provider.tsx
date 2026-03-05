"use client";

import { createContext, useContext, useCallback } from "react";

type AudioContextType = {
  playSound: (soundName: string) => void;
};

const AudioContext = createContext<AudioContextType>({
  playSound: () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const playSound = useCallback((soundName: string) => {
    // Simple audio feedback using Web Audio API
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (soundName === "click") {
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.1;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.05);
    } else if (soundName === "hover") {
      oscillator.frequency.value = 600;
      gainNode.gain.value = 0.05;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.03);
    }
  }, []);

  return (
    <AudioContext.Provider value={{ playSound }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
