"use client";

// This provider is not needed for horizontal scroll as we're using Lenis directly in page.tsx
// Keep it for backwards compatibility but it won't affect horizontal scroll

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
