"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Phase =
  | "typing"    // "Hi" is typing out
  | "blinking"  // cursor blinks after typed
  | "morphing"  // Hi moves to hero target
  | "done";     // overlay gone

type IntroOverlayProps = {
  /** Ref to the "Hi, I'm Hamza." element in HeroSection — morph target */
  targetRef: React.RefObject<HTMLElement | null>;
  /** Called when overlay is fully gone and hero should start its sequence */
  onComplete: () => void;
};

export default function IntroOverlay({ targetRef, onComplete }: IntroOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const hiRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<Phase>("typing");
  const [displayedText, setDisplayedText] = useState("");
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blinkTweenRef = useRef<gsap.core.Tween | null>(null);

  const TARGET_TEXT = "Hi";
  const TYPING_SPEED = 90; // ms per character — slow enough to feel deliberate
  const BLINK_DURATION = 1800; // how long cursor blinks after typing
  const MORPH_DURATION = 0.72; // seconds for the morph animation

  // Phase 1: type out "Hi"
  useEffect(() => {
    if (phase !== "typing") return;

    let charIndex = 0;

    const typeNext = () => {
      if (charIndex < TARGET_TEXT.length) {
        const char = TARGET_TEXT[charIndex];
        setDisplayedText((prev) => prev + char);
        charIndex++;
        typingRef.current = setTimeout(typeNext, TYPING_SPEED);
      } else {
        // Done typing — move to blink phase
        setPhase("blinking");
      }
    };

    // Small initial delay so the page doesn't immediately flash text
    typingRef.current = setTimeout(typeNext, 220);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [phase]);

  // Phase 2: blink cursor, then trigger morph
  useEffect(() => {
    if (phase !== "blinking" || !cursorRef.current) return;

    // Start cursor blink
    blinkTweenRef.current = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.45,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    const timer = setTimeout(() => {
      // Stop blinking, fade cursor out
      blinkTweenRef.current?.kill();
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.2 });
      setPhase("morphing");
    }, BLINK_DURATION);

    return () => {
      clearTimeout(timer);
      blinkTweenRef.current?.kill();
    };
  }, [phase]);

  // Phase 3: morph "Hi" from center to target position
  useEffect(() => {
    if (phase !== "morphing") return;
    if (!hiRef.current || !overlayRef.current || !targetRef.current) {
      // Fallback: if target not found, just fade out
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => setPhase("done"),
      });
      return;
    }

    const hiEl = hiRef.current;
    const overlayEl = overlayRef.current;
    const targetEl = targetRef.current;

    // Get current position of "Hi" (center of viewport)
    const hiRect = hiEl.getBoundingClientRect();
    // Get destination — top-left of the hero "Hi, I'm Hamza." element
    const targetRect = targetEl.getBoundingClientRect();

    // Calculate scale ratio: target font-size vs current big font-size
    // We read computed font sizes for accuracy
    const hiStyle = window.getComputedStyle(hiEl);
    const targetStyle = window.getComputedStyle(targetEl);
    const hiFontSize = parseFloat(hiStyle.fontSize);
    const targetFontSize = parseFloat(targetStyle.fontSize);
    const scaleRatio = targetFontSize / hiFontSize;

    // Calculate translation needed: from current center to target top-left
    // hiEl is centered via flex, so its origin is top-left of the element
    const translateX = targetRect.left - hiRect.left;
    const translateY = targetRect.top - hiRect.top;

    // Switch Hi to fixed positioning at its current location so it escapes the flex layout
    gsap.set(hiEl, {
      position: "fixed",
      top: hiRect.top,
      left: hiRect.left,
      margin: 0,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase("done");
        onComplete();
      },
    });

    tl
      // Morph Hi to target size and position
      .to(
        hiEl,
        {
          x: translateX,
          y: translateY,
          scale: scaleRatio,
          transformOrigin: "top left",
          duration: MORPH_DURATION,
          ease: "power3.inOut",
        },
        0
      )
      // Fade overlay background out slightly behind the Hi
      .to(
        overlayEl,
        {
          backgroundColor: "transparent",
          duration: MORPH_DURATION * 0.8,
          ease: "power2.inOut",
          delay: MORPH_DURATION * 0.2,
        },
        0
      )
      // Fade Hi itself out as it arrives (so it hands off cleanly)
      .to(
        hiEl,
        {
          opacity: 0,
          duration: 0.18,
          ease: "power1.in",
        },
        MORPH_DURATION - 0.18
      );
  }, [phase, targetRef, onComplete]);

  if (phase === "done") return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-core, #080808)",
        pointerEvents: phase === "morphing" ? "none" : "all",
      }}
      aria-hidden="true"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <span
          ref={hiRef}
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(120px, 18vw, 220px)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "var(--text-main, #F3F3F3)",
            display: "block",
          }}
        >
          {displayedText}
        </span>
        <span
          ref={cursorRef}
          style={{
            display: "inline-block",
            width: "clamp(12px, 1.8vw, 22px)",
            height: "clamp(88px, 13.5vw, 168px)",
            backgroundColor: "var(--accent-ambient, #C5A059)",
            marginLeft: "clamp(6px, 1vw, 14px)",
            verticalAlign: "middle",
            opacity: phase === "blinking" ? 1 : 1,
          }}
        />
      </div>
    </div>
  );
}
