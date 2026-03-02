"use client";

import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ShaderBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-white dark:bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 opacity-20">
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
          <ShaderGradient
            control="props"
            animate="on"
            type="waterPlane"  //determines shape. options are: 'plane', 'sphere', 'torus', 'waterPlane'
            uSpeed={0.03}  // How fast the gradient morphs/flows. Increase for faster movement.
            uStrength={0.8} // Intensity of deformation. Higher → blobs more pronounced. Lower → subtle motion.
            uDensity={0.2}  // How many “blobs/waves” appear. Higher → more blobs(busier). Lower → fewer blobs(emptier, minimal).
            uFrequency={1.5}  // How wavy/oscillatory the motion is. Higher → sharper peaks, more energetic. Lower → smoother, flowing.
            uAmplitude={1.5}  // Maximum “height” of waves/blobs.Increase → taller waves. Lower → flatter, calmer effect.
            uTime={0.15}
            // Blue gradient colors - sparse blobs
            color1={isDark ? "#3B82F6" : "#2563eb"}
            color2={isDark ? "#60A5FA" : "#3B82F6"}
            color3={isDark ? "#93C5FD" : "#60A5FA"}
            // White background so only colored parts show
            bgColor1="#ffffff"
            bgColor2="#ffffff"
            brightness={isDark ? 1.3 : 0.7}  // higher value for dark so that the background is more vibrant and not snuffed out by black
            grain="off"
            lightType="3d"   //Simulated lighting style."2d" → flatter, less depth. "3d" → volumetric feel.
            reflection={0.1}  // Increase → more glossy, metallic. Lower → matte feel.
            cameraZoom={1.2}  // Lower → wider view, blobs smaller. Higher → closer, more immersive.
            cameraPositionX={1.5} // Move around to angle scene differently.
            cameraPositionY={1}
            cameraPositionZ={10}
            rotationX={0.5}  // Rotation of the shader plane.Tilt the scene for diagonal movement or more organic look.
            rotationY={0}
            rotationZ={10}
            positionX={1}
            positionY={-0.9}
            positionZ={-2}
            range="disabled"  // Enables object motion limits."disabled" → unrestricted movement.
            rangeStart={10}  // Min/max movement distance.Increase → larger motion span. Decrease → confined motion.
            rangeEnd={50}
            envPreset="lobby"  // Preset environment lighting. Options: 'studio', 'city', 'park', 'lobby', 'apartment'
            wireframe={false}  // Shows the mesh lines instead of smooth gradient.true → technical wireframe look.
          />
        </ShaderGradientCanvas>
      </div>
    </div>
  );
}



/*
 🔹 How to achieve specific effects
1️⃣ Subtle “uiw.tf”-like flow

uSpeed: 0.05–0.12

uStrength: 1.0–2.0

uDensity: 0.25–0.5

brightness: 0.6–0.9

2️⃣ More dynamic, “alive” background

uSpeed: 0.15–0.25

uStrength: 3–5

uDensity: 0.5–0.7

rotationZ: 90–180 for diagonal movement

reflection: 0.1–0.2

3️⃣ Minimal / calm blobs

uSpeed: 0.05

uStrength: 0.5–1

uDensity: 0.2–0.3

brightness: 0.5–0.7

Keep rotation minimal (0–15 degrees)

💡 Tips for smooth performance

pixelDensity={1} keeps GPU cost low. Avoid 2 or 3 on mobile.

opacity on parent div (you currently have 0.2) can soften brightness without affecting GPU.

Avoid too high uDensity + uStrength together — can lag on lower-end devices.
 */


//uiw.tf blue background style
/*
"use client";

import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ShaderBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
      <div className="absolute inset-0 opacity-25">
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
          <ShaderGradient
            control="props"
            animate="on"
            type="waterPlane"
            uSpeed={0.08}
            uStrength={1.5}
            uDensity={0.35}
            uFrequency={2.0}
            uAmplitude={3.0}
            uTime={0.1}
            color1={isDark ? "#3B82F6" : "#60A5FA"}
            color2={isDark ? "#60A5FA" : "#93C5FD"}
            color3={isDark ? "#93C5FD" : "#BFDBFE"}
            bgColor1={isDark ? "#0a0a0a" : "#ffffff"}
            bgColor2={isDark ? "#0a0a0a" : "#ffffff"}
            brightness={isDark ? 0.85 : 0.6}
            grain="off"
            lightType="3d"
            reflection={0.05}
            cameraZoom={1.5}
            cameraPositionX={0}
            cameraPositionY={0}
            cameraPositionZ={10}
            rotationX={0}
            rotationY={0}
            rotationZ={10}
            positionX={0}
            positionY={0}
            positionZ={-5}
            range="enabled"
            rangeStart={10}
            rangeEnd={30}
            envPreset="city"
            wireframe={false}
          />
        </ShaderGradientCanvas>
      </div>
    </div>
  );
}
*/
