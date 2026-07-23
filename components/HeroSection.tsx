"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/data/site";
import IntroOverlay from "@/components/IntroOverlay";
import TextType from "@/components/TextType";

const Globe = dynamic(() => import("@/components/Globe"), {
  ssr: false,
  loading: () => <div className="hero-globe-fallback" />,
});

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

const NAME_WORDS = ["MUHAMMAD", "HAMZA", "KHAN"];
const SUBTITLE = `${siteConfig.hero.headlineStart} ${siteConfig.hero.headlineEnd}`;

// Phase order:
// waiting   — before intro finishes (hero content hidden)
// name      — typing name word by word
// subtitle  — typing subtitle
// reveal    — fade up tags + buttons
// complete  — everything visible, no more animation
type HeroPhase = "waiting" | "name" | "subtitle" | "reveal" | "complete";

export default function HeroSection() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  // This ref is passed to IntroOverlay so "Hi." morphs into the name block
  const hiLineRef = useRef<HTMLHeadingElement>(null);
  const tagsActionsRef = useRef<HTMLDivElement>(null);

  // null = not yet determined (SSR-safe), true = show intro, false = skip
  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<HeroPhase>("waiting");

  // How many name words have finished typing
  const [doneCount, setDoneCount] = useState(0);
  // Which word index is currently typing
  const [nameIndex, setNameIndex] = useState(0);

  // Only runs on client — safe to read sessionStorage
  useEffect(() => {
    if (reducedMotion) {
      setShowIntro(false);
      setPhase("complete");
      setDoneCount(NAME_WORDS.length);
      return;
    }
    const seen = sessionStorage.getItem("intro-seen");
    if (seen) {
      setShowIntro(false);
      setPhase("complete");
      setDoneCount(NAME_WORDS.length);
    } else {
      setShowIntro(true);
    }
  }, [reducedMotion]);

  // IntroOverlay calls this when the morph is done
  const handleIntroComplete = () => {
    sessionStorage.setItem("intro-seen", "1");
    setPhase("name");
    setNameIndex(0);
    setDoneCount(0);
  };

  // TextType calls this when each name word finishes typing
  const handleWordDone = () => {
    // Move word from "typing" to "done" — use functional updater so we
    // read the committed state, not a stale closure value
    setDoneCount((prev) => {
      const next = prev + 1;
      if (next < NAME_WORDS.length) {
        // Small gap then start next word
        setTimeout(() => setNameIndex(next), 180);
      } else {
        // All words done — move to subtitle
        setTimeout(() => setPhase("subtitle"), 600);
      }
      return next;
    });
  };

  const handleSubtitleDone = () => setPhase("reveal");

  // Fade up tags + buttons once subtitle is done
  useEffect(() => {
    if (phase !== "reveal" || !tagsActionsRef.current) return;
    gsap.fromTo(
      tagsActionsRef.current,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power2.out",
        onComplete: () => setPhase("complete"),
      }
    );
  }, [phase]);

  // Scroll animation (unchanged from backup — no bugs here)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current || !globeRef.current || !washRef.current) return;

    const section = sectionRef.current;
    const globe = globeRef.current;
    const wash = washRef.current;
    const media = gsap.matchMedia();

    const updateGlobeProgress = (progress: number) => {
      window.dispatchEvent(
        new CustomEvent("portfolio:globe-progress", { detail: { progress } })
      );
    };

    if (!reducedMotion) {
      media.add("(min-width: 768px)", () => {
        const ctx = gsap.context(() => {
          gsap.set(globe, { clearProps: "transform" });
          gsap.set(wash, { opacity: 0 });
          const tl = gsap.timeline({
            defaults: { ease: "power3.inOut" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=115%",
              pin: true,
              scrub: 1.15,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              fastScrollEnd: true,
              onUpdate: (self) => updateGlobeProgress(self.progress),
              onLeaveBack: () => updateGlobeProgress(0),
            },
          });
          tl.to(globe, { scaleX: 1.22, scaleY: 1.22, x: "-6vw", y: "2vh", opacity: 0.92, duration: 1 }, 0)
            .to(wash, { opacity: 0.38, duration: 0.72 }, 0.22);
        }, section);
        return () => ctx.revert();
      });

      media.add("(max-width: 767px)", () => {
        const ctx = gsap.context(() => {
          gsap.set(globe, { clearProps: "transform" });
          gsap.set(wash, { opacity: 0 });
          gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=70%",
              scrub: 0.8,
              pin: false,
              invalidateOnRefresh: true,
              fastScrollEnd: true,
              onUpdate: (self) => updateGlobeProgress(self.progress),
              onLeaveBack: () => updateGlobeProgress(0),
            },
          })
            .to(globe, { scaleX: 1.12, scaleY: 1.12, y: 6, duration: 0.8 }, 0)
            .to(wash, { opacity: 0.18, duration: 0.5 }, 0.16);
        }, section);
        return () => ctx.revert();
      });
    }

    return () => {
      updateGlobeProgress(0);
      media.revert();
    };
  }, [reducedMotion]);

  const isWaiting = phase === "waiting";
  const isComplete = phase === "complete";

  // Hold a black screen until client decides whether to show intro
  // Prevents SSR/hydration flash
  if (showIntro === null) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          backgroundColor: "var(--bg-core, #080808)",
        }}
      />
    );
  }

  return (
    <>
      {showIntro && (
        <IntroOverlay
          targetRef={hiLineRef}
          onComplete={handleIntroComplete}
        />
      )}

      <section ref={sectionRef} className="hero-section" aria-labelledby="hero-title">
        <div ref={washRef} className="hero-eclipse-wash" aria-hidden="true" />
        <div className="hero-shell">
          <div className="hero-grid">
            <div className="hero-globe-slot" aria-hidden="true">
              <div ref={globeRef} className="hero-globe-stage origin-center">
                <Globe />
              </div>
            </div>

            <div className="hero-copy-slot">
              {/* "Hi, I'm Hamza." — morph target for IntroOverlay */}
              {/* Name — rendered differently depending on phase */}
              <h1
                ref={hiLineRef}
                id="hero-title"
                className="hero-title"
                aria-label={siteConfig.hero.bracketedName}
              >
                {isComplete || phase === "reveal" ? (
                  // Phase complete: render all words as plain spans (no flicker risk)
                  NAME_WORDS.map((word) => (
                    <span key={word} style={{ display: "block" }}>
                      {word}
                    </span>
                  ))
                ) : (
                  // During typing: render completed words + one typing word + invisible placeholders
                  <>
                    {/* Words already finished typing */}
                    {NAME_WORDS.slice(0, doneCount).map((word) => (
                      <span key={word} style={{ display: "block" }}>
                        {word}
                      </span>
                    ))}

                    {/* Currently typing word */}
                    {phase === "name" && nameIndex < NAME_WORDS.length && (
                      <span style={{ display: "block" }}>
                        <TextType
                          key={`typing-${nameIndex}`}
                          text={NAME_WORDS[nameIndex]}
                          typingSpeed={55}
                          loop={false}
                          showCursor={true}
                          cursorCharacter="▌"
                          cursorClassName="hero-name-cursor"
                          pauseDuration={0}
                          onDone={handleWordDone}
                        />
                      </span>
                    )}

                    {/* Invisible placeholders to hold layout height for remaining words */}
                    {phase === "name" &&
                      NAME_WORDS.slice(nameIndex + 1).map((word) => (
                        <span
                          key={`ph-${word}`}
                          style={{ display: "block", opacity: 0 }}
                          aria-hidden="true"
                        >
                          {word}
                        </span>
                      ))}
                  </>
                )}
              </h1>

              <div className="hero-kicker" style={{ opacity: isWaiting || phase === "name" ? 0 : 1, transition: "opacity 0.4s ease 0.1s" }}>
                WEBGIS DEVELOPER · GIS ANALYST
              </div>

              {/* Subtitle */}
              <p className="hero-subtitle" style={{ minHeight: "3em" }}>
                {phase === "subtitle" && (
                  <TextType
                    text={SUBTITLE}
                    typingSpeed={22}
                    loop={false}
                    showCursor={false}
                    pauseDuration={0}
                    onDone={handleSubtitleDone}
                  />
                )}
                {(phase === "reveal" || isComplete) && SUBTITLE}
              </p>

              {/* Tags + buttons — fade up as a group after subtitle */}
              <div
                ref={tagsActionsRef}
                style={{
                  display: "grid",
                  gap: 22,
                  opacity: isWaiting || phase === "name" || phase === "subtitle" ? 0 : 1,
                }}
              >
                <div className="hero-tags" aria-label="Core technologies">
                  {siteConfig.hero.tags.map((tag) => (
                    <span key={tag} className="hero-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="hero-actions">
                  <Link href="#work" className="hero-button hero-button--primary">
                    {siteConfig.hero.buttons.primary}
                  </Link>
                  <Link href={siteConfig.cv} className="hero-button hero-button--secondary">
                    {siteConfig.hero.buttons.secondary}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


