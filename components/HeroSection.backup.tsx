"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/data/site";

const Globe = dynamic(() => import("@/components/Globe"), {
    ssr: false,
    loading: () => <div className="hero-globe-fallback" />,
});

function useReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduced(mediaQuery.matches);

        update();
        mediaQuery.addEventListener("change", update);
        return () => mediaQuery.removeEventListener("change", update);
    }, []);

    return reduced;
}

export default function HeroSection() {
    const reducedMotion = useReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);
    const copyRef = useRef<HTMLDivElement>(null);
    const globeRef = useRef<HTMLDivElement>(null);
    const washRef = useRef<HTMLDivElement>(null);
    const hero = siteConfig.hero;

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current || !copyRef.current || !globeRef.current || !washRef.current) {
            return;
        }

        const section = sectionRef.current;
        const copy = copyRef.current;
        const globe = globeRef.current;
        const wash = washRef.current;
        const revealItems = copy.querySelectorAll("[data-hero-reveal]");
        const media = gsap.matchMedia();
        const updateGlobeProgress = (progress: number) => {
            window.dispatchEvent(
                new CustomEvent("portfolio:globe-progress", {
                    detail: { progress },
                }),
            );
        };

        const context = gsap.context(() => {
            if (reducedMotion) {
                gsap.fromTo(
                    revealItems,
                    { opacity: 0, y: 16 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.05 },
                );
                return;
            }

            gsap.fromTo(
                revealItems,
                { opacity: 0, y: 28 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    stagger: 0.075,
                    delay: 0.12,
                },
            );
        }, section);

        if (!reducedMotion) {
            media.add("(min-width: 768px)", () => {
                const mediaContext = gsap.context(() => {
                    gsap.set(globe, { clearProps: "transform" });
                    gsap.set(copy, { clearProps: "transform,opacity" });
                    gsap.set(wash, { opacity: 0 });

                    const timeline = gsap.timeline({
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

                    timeline
                        .to(copy, { opacity: 0, y: -72, duration: 0.48 }, 0)
                        .to(globe, { scaleX: 1.22, scaleY: 1.22, x: "-6vw", y: "2vh", opacity: 0.92, duration: 1 }, 0)
                        .to(wash, { opacity: 0.38, duration: 0.72 }, 0.22);
                }, section);

                return () => mediaContext.revert();
            });

            media.add("(max-width: 767px)", () => {
                const mediaContext = gsap.context(() => {
                    gsap.set(globe, { clearProps: "transform" });
                    gsap.set(copy, { clearProps: "transform,opacity" });
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
                        .to(copy, { opacity: 0, y: -18, duration: 0.6 }, 0)
                        .to(globe, { scaleX: 1.12, scaleY: 1.12, y: 6, duration: 0.8 }, 0)
                        .to(wash, { opacity: 0.18, duration: 0.5 }, 0.16);
                }, section);

                return () => mediaContext.revert();
            });
        }

        return () => {
            updateGlobeProgress(0);
            media.revert();
            context.revert();
        };
    }, [reducedMotion]);

    return (
        <section ref={sectionRef} className="hero-section" aria-labelledby="hero-title">
            <div ref={washRef} className="hero-eclipse-wash" aria-hidden="true" />
            <div className="hero-shell">
                <div className="hero-grid">
                    <div className="hero-globe-slot" aria-hidden="true">
                        <div ref={globeRef} className="hero-globe-stage origin-center">
                            <Globe />
                        </div>
                    </div>

                    <div ref={copyRef} className="hero-copy-slot">
                        <p data-hero-reveal className="hero-intro">
                            Hi, I&apos;m Hamza.
                        </p>

                        <div data-hero-reveal className="hero-kicker">
                            {hero.eyebrow.replace("// ", "")}
                        </div>

                        <h1 id="hero-title" data-hero-reveal className="hero-title">
                            {hero.bracketedName}
                        </h1>

                        <p data-hero-reveal className="hero-subtitle">
                            {hero.headlineStart} {hero.headlineEnd}
                        </p>

                        {hero.subheadline ? (
                            <p data-hero-reveal className="hero-proof">
                                {hero.subheadline}
                            </p>
                        ) : null}

                        <div data-hero-reveal className="hero-tags" aria-label="Core technologies">
                            {hero.tags.map((tag) => (
                                <span key={tag} className="hero-tag">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div data-hero-reveal className="hero-actions">
                            <Link href="#work" className="hero-button hero-button--primary">
                                {hero.buttons.primary}
                            </Link>
                            <Link href={siteConfig.cv} className="hero-button hero-button--secondary">
                                {hero.buttons.secondary}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}