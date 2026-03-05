"use client";

import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ShaderBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const ShaderGradientAny = ShaderGradient as any;

  return (
    <div className="fixed inset-0 z-0 w-full h-full overflow-hidden">
      {/* Base background color that matches the theme */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark ? "bg-[#0a0a0a]" : "bg-[#fafafa]"
        }`}
      />
      {/* Animated shader gradient overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark ? "opacity-60" : "opacity-35"
        }`}
      >
        <ShaderGradientCanvas
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          pixelDensity={1}
        >
          <ShaderGradientAny
            control="props"
            animate="on"
            type="waterPlane"
            uSpeed={0.04}
            uStrength={1.2}
            uDensity={0.5}
            uFrequency={3.5}
            uAmplitude={2.0}
            uTime={0.2}
            color1={isDark ? "#1e3a8a" : "#93c5fd"}
            color2={isDark ? "#5b21b6" : "#c4b5fd"}
            color3={isDark ? "#134e4a" : "#a5f3fc"}
            brightness={isDark ? 1.4 : 0.8}
            grain="off"
            lightType="3d"
            reflection={0.08}
            cameraZoom={1.0}
            cameraPositionX={0}
            cameraPositionY={0}
            cameraPositionZ={10}
            rotationX={0}
            rotationY={0}
            rotationZ={225}
            positionX={0}
            positionY={-0.5}
            positionZ={-1}
            range="disabled"
            rangeStart={10}
            rangeEnd={50}
            envPreset="city"
            wireframe={false}
          />
        </ShaderGradientCanvas>
      </div>
    </div>
  );
}

