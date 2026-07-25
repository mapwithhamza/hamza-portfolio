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

type HeroPhase = "waiting" | "name" | "subtitle" | "reveal" | "complete";

export default function HeroSection() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const hiLineRef = useRef<HTMLHeadingElement>(null);
  const tagsActionsRef = useRef<HTMLDivElement>(null);

  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<HeroPhase>("waiting");
  const [nameWords, setNameWords] = useState<string[]>(() => NAME_WORDS.map(() => ""));

  useEffect(() => {
    if (reducedMotion) {
      setShowIntro(false);
      setPhase("complete");
      setNameWords(NAME_WORDS);
      return;
    }

    const seen = sessionStorage.getItem("intro-seen");

    if (seen) {
      setShowIntro(false);
      setPhase("complete");
      setNameWords(NAME_WORDS);
    } else {
      setShowIntro(true);
    }
  }, [reducedMotion]);

  const handleIntroComplete = () => {
    sessionStorage.setItem("intro-seen", "1");
    setNameWords(NAME_WORDS.map(() => ""));
    setPhase("name");
  };

  const handleSubtitleDone = () => setPhase("reveal");

  useEffect(() => {
    if (phase !== "name") return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;
    let wordIndex = 0;
    let charIndex = 0;

    const typeNext = () => {
      if (cancelled) return;

      if (wordIndex >= NAME_WORDS.length) {
        timeout = setTimeout(() => {
          if (!cancelled) setPhase("subtitle");
        }, 320);
        return;
      }

      const word = NAME_WORDS[wordIndex];

      if (charIndex < word.length) {
        charIndex += 1;
        setNameWords((prev) => {
          const next = [...prev];
          next[wordIndex] = word.slice(0, charIndex);
          return next;
        });
        timeout = setTimeout(typeNext, 45);
        return;
      }

      wordIndex += 1;
      charIndex = 0;
      timeout = setTimeout(typeNext, 125);
    };

    timeout = setTimeout(typeNext, 90);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [phase]);

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
      },
    );
  }, [phase]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current || !globeRef.current || !washRef.current) return;

    const section = sectionRef.current;
    const globe = globeRef.current;
    const wash = washRef.current;
    const media = gsap.matchMedia();

    const updateGlobeProgress = (progress: number) => {
      window.dispatchEvent(
        new CustomEvent("portfolio:globe-progress", { detail: { progress } }),
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

          tl.to(
            globe,
            { scaleX: 1.22, scaleY: 1.22, x: "-6vw", y: "2vh", opacity: 0.92, duration: 1 },
            0,
          ).to(wash, { opacity: 0.38, duration: 0.72 }, 0.22);
        }, section);

        return () => ctx.revert();
      });

      media.add("(max-width: 767px)", () => {
        const ctx = gsap.context(() => {
          gsap.set(globe, { clearProps: "transform" });
          gsap.set(wash, { opacity: 0 });

          gsap
            .timeline({
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
  const showStaticName = isComplete || phase === "reveal" || phase === "subtitle";

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
      {showIntro && <IntroOverlay targetRef={hiLineRef} onComplete={handleIntroComplete} />}

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
              <h1
                ref={hiLineRef}
                id="hero-title"
                className="hero-title"
                aria-label={siteConfig.hero.bracketedName}
              >
                {NAME_WORDS.map((word, index) => {
                  const typed = showStaticName ? word : nameWords[index];
                  const hidden = isWaiting || (!typed && phase === "name");

                  return (
                    <span
                      key={word}
                      style={{ display: "block", opacity: hidden ? 0 : 1 }}
                      aria-hidden={hidden}
                    >
                      {typed || word}
                    </span>
                  );
                })}
              </h1>

              <div
                className="hero-kicker"
                style={{
                  opacity: isWaiting || phase === "name" ? 0 : 1,
                  transition: "opacity 0.4s ease 0.1s",
                }}
              >
                WEBGIS DEVELOPER · GIS ANALYST
              </div>

              <p className="hero-subtitle" style={{ minHeight: "3em" }}>
                {phase === "subtitle" && (
                  <TextType
                    text={SUBTITLE}
                    typingSpeed={16}
                    loop={false}
                    showCursor={false}
                    pauseDuration={0}
                    onDone={handleSubtitleDone}
                  />
                )}
                {(phase === "reveal" || isComplete) && SUBTITLE}
              </p>

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
