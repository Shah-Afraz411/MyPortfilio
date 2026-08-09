"use client";

import { createContext, useContext, useCallback, useRef } from "react";

type SoundName =
  | "hover"        // Gentle warm tone on card/button hover
  | "click"        // Satisfying tap on card open or button press
  | "navigate"     // Soft whoosh when opening a detail view
  | "back"         // Reverse whoosh when going back
  | "send"         // Upward chime when sending a chat message
  | "receive"      // Gentle bell when AI responds
  | "toggle"       // Crisp switch for theme toggle
  | "swoosh"       // Phase transition swipe sound
  | "tag";         // Tiny tick on hovering a skill tag

type AudioContextType = {
  playSound: (soundName: SoundName) => void;
};

const SoundContext = createContext<AudioContextType>({
  playSound: () => {},
});

// Respect user's reduced-motion preference
function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastHoverTime = useRef(0);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playSound = useCallback((soundName: SoundName) => {
    if (prefersReducedMotion()) return;

    // Throttle hover sounds to avoid auditory clutter
    if (soundName === "hover" || soundName === "tag") {
      const now = Date.now();
      if (now - lastHoverTime.current < 80) return;
      lastHoverTime.current = now;
    }

    try {
      const ctx = getCtx();
      const t = ctx.currentTime;

      switch (soundName) {
        case "hover": {
          // Warm, soft sine — like a gentle breath
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(520, t);
          osc.frequency.exponentialRampToValueAtTime(480, t + 0.08);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.04, t + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.09);
          break;
        }

        case "click": {
          // Two-tone tap: a quick major third, satisfying and clear
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = "sine";
          osc2.type = "triangle";
          osc1.frequency.value = 660;
          osc2.frequency.value = 830;
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(t);
          osc2.start(t + 0.02);
          osc1.stop(t + 0.1);
          osc2.stop(t + 0.12);
          break;
        }

        case "navigate": {
          // Rising arpeggio — three quick ascending notes
          const notes = [440, 554, 659]; // A4, C#5, E5
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            const offset = i * 0.045;
            gain.gain.setValueAtTime(0, t + offset);
            gain.gain.linearRampToValueAtTime(0.05, t + offset + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.15);
            osc.connect(gain).connect(ctx.destination);
            osc.start(t + offset);
            osc.stop(t + offset + 0.16);
          });
          break;
        }

        case "back": {
          // Descending two-note — gentle resolution
          const notes = [554, 440]; // C#5 → A4
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            const offset = i * 0.05;
            gain.gain.setValueAtTime(0, t + offset);
            gain.gain.linearRampToValueAtTime(0.045, t + offset + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.12);
            osc.connect(gain).connect(ctx.destination);
            osc.start(t + offset);
            osc.stop(t + offset + 0.13);
          });
          break;
        }

        case "send": {
          // Quick upward sweep — message dispatched
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(400, t);
          osc.frequency.exponentialRampToValueAtTime(900, t + 0.12);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.16);
          break;
        }

        case "receive": {
          // Soft bell — two harmonics creating a warm ping
          [523, 784].forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.035, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
            osc.connect(gain).connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.32);
          });
          break;
        }

        case "toggle": {
          // Crisp switch — snappy click with a harmonic tail
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(1200, t);
          osc.frequency.exponentialRampToValueAtTime(600, t + 0.06);
          gain.gain.setValueAtTime(0.04, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.08);
          break;
        }

        case "swoosh": {
          // White-noise whoosh filtered through a bandpass sweep
          const bufferSize = ctx.sampleRate * 0.15;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(2000, t);
          filter.frequency.exponentialRampToValueAtTime(500, t + 0.12);
          filter.Q.value = 1.5;
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
          noise.connect(filter).connect(gain).connect(ctx.destination);
          noise.start(t);
          noise.stop(t + 0.15);
          break;
        }

        case "tag": {
          // Tiny crystalline tick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = 1400;
          gain.gain.setValueAtTime(0.025, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.04);
          break;
        }
      }
    } catch {
      // Silently fail — audio is an enhancement, not critical
    }
  }, [getCtx]);

  return (
    <SoundContext.Provider value={{ playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useAudio = () => useContext(SoundContext);
 