"use client";

import Image from "next/image";
import { type CSSProperties, type MouseEvent, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/site";

const PORTRAIT_SRC = "/images/hamza-portrait-cropped.jpeg";
const STORY_LABELS = ["Where it started", "What changed", "What I build now", "How I work"];

export default function AboutSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const [visible, setVisible] = useState(false);
	const [tilt, setTilt] = useState({ x: 0, y: 0 });
	const about = siteConfig.about;
	const bioParagraphs = about.bio.split("\n\n");

	useEffect(() => {
		if (!sectionRef.current) {
			return;
		}

		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (reduceMotion) {
			setVisible(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.22, rootMargin: "0px 0px -12% 0px" },
		);

		observer.observe(sectionRef.current);
		return () => observer.disconnect();
	}, []);

	const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
		if (window.matchMedia("(max-width: 767px)").matches) {
			return;
		}

		const bounds = event.currentTarget.getBoundingClientRect();
		const x = (event.clientX - bounds.left) / bounds.width;
		const y = (event.clientY - bounds.top) / bounds.height;

		setTilt({
			x: (0.5 - y) * 5,
			y: (x - 0.5) * 7,
		});
	};

	const resetTilt = () => setTilt({ x: 0, y: 0 });

	return (
		<section
			ref={sectionRef}
			id="about"
			className={`about-section${visible ? " about-section--visible" : ""}`}
			aria-labelledby="about-title"
		>
			<div className="about-ambient" aria-hidden="true" />

			<div className="about-shell">
				<div
					className="about-portrait-wrap"
					onMouseMove={handleMouseMove}
					onMouseLeave={resetTilt}
					style={
						{
							"--tilt-x": `${tilt.x}deg`,
							"--tilt-y": `${tilt.y}deg`,
						} as CSSProperties
					}
				>
					<div className="about-terrain" aria-hidden="true">
						<div className="about-terrain__rain" />
						<div className="about-terrain__sweep" />
						<svg className="about-terrain__map" viewBox="0 0 720 300" preserveAspectRatio="none">
							<g className="about-terrain__ridges">
								<path d="M18 214C86 190 144 188 206 212C280 242 344 238 416 204C492 168 574 158 702 186" />
								<path d="M34 234C100 216 160 216 220 236C292 260 366 258 440 226C520 194 596 190 704 210" />
								<path d="M54 252C122 238 178 240 238 256C320 276 396 270 470 244C548 218 620 218 688 236" />
								<path d="M76 194C142 166 198 170 260 198C328 230 394 216 464 176C540 134 614 136 710 162" />
								<path d="M112 168C170 140 226 146 286 176C352 210 414 192 482 148C552 104 624 104 704 132" />
								<path d="M154 142C210 116 260 122 318 152C382 186 438 166 504 122C574 76 640 76 704 102" />
							</g>
							<g className="about-terrain__traces">
								<path d="M112 220C188 174 262 178 332 214C408 254 486 220 564 168C612 136 662 132 708 146" />
								<path d="M166 184C236 148 300 156 360 190C432 230 500 190 558 144C610 102 660 100 704 118" />
							</g>
							<g className="about-terrain__nodes">
								<circle cx="206" cy="212" r="3" />
								<circle cx="416" cy="204" r="3" />
								<circle cx="564" cy="168" r="3" />
							</g>
						</svg>
					</div>

					<div className="about-portrait-plinth">
						<div className="about-portrait-frame">
							<Image
								src={PORTRAIT_SRC}
								alt="Portrait of Muhammad Hamza Khan"
								fill
								sizes="(max-width: 760px) 84vw, 360px"
								className="about-portrait"
								priority={false}
							/>
							<div className="about-portrait-shade" aria-hidden="true" />
							<div className="about-map-lines" aria-hidden="true" />
						</div>

						<div className="about-portrait-meta">
							<span>Islamabad, Pakistan</span>
							<span>33.6844N / 73.0479E</span>
						</div>
					</div>
				</div>

				<div className="about-copy">
					<div className="about-label">{about.sectionTitle}</div>

					<div className="about-lede">
						{bioParagraphs.map((paragraph, index) => (
							<div className="about-story-block" key={paragraph}>
								<span>{STORY_LABELS[index]}</span>
								<p>{paragraph}</p>
							</div>
						))}
					</div>

					<div className="about-meta-grid" aria-label="Profile details">
						{about.meta.map((row) => (
							<div className="about-meta-row" key={row.label}>
								<span>{row.label}</span>
								<strong>{row.value}</strong>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
