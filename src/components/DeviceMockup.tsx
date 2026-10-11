import { type ReactNode, type CSSProperties } from "react";
import Phone, { type PhoneScreen } from "../Phone";

export type DevicePerspective = "hero" | "perspective-left" | "perspective-right" | "floating" | "flat";

export type FloatingChip = {
  id: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  content: ReactNode;
  delayMs?: number;
};

type Props = {
  screen: PhoneScreen;
  src?: string;
  alt: string;
  w?: string;
  perspective?: DevicePerspective;
  className?: string;
  children?: ReactNode;
  floatingChips?: FloatingChip[];
  ambientGlow?: "vermilion" | "gold" | "none";
  interactive?: boolean;
};

const positionClasses: Record<FloatingChip["position"], string> = {
  "top-left": "-top-6 -left-6 md:-left-12",
  "top-right": "-top-6 -right-6 md:-right-12",
  "bottom-left": "-bottom-6 -left-6 md:-left-12",
  "bottom-right": "-bottom-6 -right-6 md:-right-12",
};

export default function DeviceMockup({
  screen,
  src = "/media/screenshots/mockup.png",
  alt,
  w = "clamp(240px, 26vw, 320px)",
  perspective = "hero",
  className = "",
  children,
  floatingChips = [],
  ambientGlow = "vermilion",
}: Props) {
  return (
    <div className={`device-stage group relative ${className}`} data-perspective={perspective}>
      {/* Ambient background glow */}
      {ambientGlow === "vermilion" && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-vermilion/15 blur-[60px] transition-opacity duration-700 group-hover:bg-vermilion/25"
          aria-hidden
        />
      )}
      {ambientGlow === "gold" && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-[60px] transition-opacity duration-700 group-hover:bg-gold/25"
          aria-hidden
        />
      )}

      {/* 3D Transform Wrapper */}
      <div className={`device-transform-wrap device-${perspective}`}>
        <Phone src={src} screen={screen} alt={alt} w={w}>
          {children}
        </Phone>

        {/* Dynamic perspective ground shadow */}
        <div className={`device-ground-shadow shadow-${perspective}`} aria-hidden />

        {/* Layered floating UI chips */}
        {floatingChips.map((chip, idx) => (
          <div
            key={chip.id}
            className={`floating-chip absolute z-20 ${positionClasses[chip.position]} transition-all duration-500`}
            style={{
              animationDelay: `${chip.delayMs ?? idx * 150}ms`,
            } as CSSProperties}
          >
            {chip.content}
          </div>
        ))}
      </div>
    </div>
  );
}
