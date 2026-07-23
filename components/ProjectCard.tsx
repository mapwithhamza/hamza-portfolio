"use client";

import { type CSSProperties, type MouseEvent, useRef } from "react";
import type { ProjectData } from "@/data/projects";

type ProjectCardProps = {
	project: ProjectData;
	index: number;
};

function projectTone(domainClass: ProjectData["domainClass"]) {
	if (domainClass === "domain-hazard") {
		return "hazard";
	}

	if (domainClass === "domain-flood") {
		return "flood";
	}

	return "systems";
}

function MapPreview({ tone, id }: { tone: string; id: string }) {
	const isFlood = tone === "flood";
	const isHazard = tone === "hazard";
	const gradientId = `project-glow-${id}`;

	return (
		<svg className="project-card__map-svg" viewBox="0 0 520 260" preserveAspectRatio="none" aria-hidden="true">
			<defs>
				<radialGradient id={gradientId} cx="50%" cy="52%" r="62%">
					<stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
					<stop offset="62%" stopColor="currentColor" stopOpacity="0.08" />
					<stop offset="100%" stopColor="currentColor" stopOpacity="0" />
				</radialGradient>
			</defs>

			<rect width="520" height="260" fill={`url(#${gradientId})`} />
			<g className="project-card__grid">
				{Array.from({ length: 9 }).map((_, index) => (
					<path key={`v-${index}`} d={`M${index * 65} 0V260`} />
				))}
				{Array.from({ length: 6 }).map((_, index) => (
					<path key={`h-${index}`} d={`M0 ${index * 52}H520`} />
				))}
			</g>

			<g className="project-card__contours">
				<path d="M-12 178C66 126 128 130 198 168C274 208 344 186 414 132C468 90 514 84 540 104" />
				<path d="M-6 208C78 164 142 170 212 202C290 238 358 220 432 174C486 140 520 136 542 148" />
				<path d="M34 132C96 84 164 90 224 132C288 176 352 150 416 96C466 54 506 50 542 66" />
			</g>

			{isFlood ? (
				<g className="project-card__waves">
					<path d="M12 164C68 132 124 132 180 164C236 196 292 196 348 164C404 132 458 132 512 164" />
					<path d="M28 198C86 168 144 168 202 198C260 228 318 228 376 198C434 168 472 166 526 190" />
				</g>
			) : null}

			{isHazard ? (
				<g className="project-card__rings">
					<circle cx="272" cy="132" r="28" />
					<circle cx="272" cy="132" r="58" />
					<circle cx="272" cy="132" r="92" />
				</g>
			) : null}

			<g className="project-card__route">
				<path d="M48 188C124 118 196 120 268 166C344 216 406 158 472 86" />
			</g>

			<g className="project-card__nodes">
				<circle cx="48" cy="188" r="5" />
				<circle cx="268" cy="166" r="5" />
				<circle cx="472" cy="86" r="5" />
			</g>
		</svg>
	);
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
	const cardRef = useRef<HTMLAnchorElement>(null);
	const frameRef = useRef<number | null>(null);
	const projectNumber = String(index + 1).padStart(2, "0");
	const tone = projectTone(project.domainClass);

	const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
		const card = cardRef.current;

		if (!card || window.matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)").matches) {
			return;
		}

		const bounds = card.getBoundingClientRect();
		const x = (event.clientX - bounds.left) / bounds.width;
		const y = (event.clientY - bounds.top) / bounds.height;
		const rotateX = (0.5 - y) * 7;
		const rotateY = (x - 0.5) * 9;

		if (frameRef.current !== null) {
			window.cancelAnimationFrame(frameRef.current);
		}

		frameRef.current = window.requestAnimationFrame(() => {
			card.style.setProperty("--mx", `${x * 100}%`);
			card.style.setProperty("--my", `${y * 100}%`);
			card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
			frameRef.current = null;
		});
	};

	const resetTilt = () => {
		const card = cardRef.current;

		if (!card) {
			return;
		}

		if (frameRef.current !== null) {
			window.cancelAnimationFrame(frameRef.current);
			frameRef.current = null;
		}

		card.style.setProperty("--mx", "50%");
		card.style.setProperty("--my", "50%");
		card.style.transform = "";
	};

	return (
		<a
			ref={cardRef}
			href={`/projects/${project.slug}`}
			className={`project-card project-card--${tone}`}
			onMouseMove={handleMouseMove}
			onMouseLeave={resetTilt}
			style={
				{
					"--mx": "50%",
					"--my": "50%",
				} as CSSProperties
			}
		>
			<div className="project-card__shine" />
			<div className="project-card__topline">
				<span>{projectNumber}</span>
				<span>{project.place}</span>
			</div>

			<div className="project-card__visual">
				<MapPreview tone={tone} id={project.slug} />
				<div className="project-card__visual-label">{project.domain}</div>
			</div>

			<div className="project-card__body">
				<h3 className="project-card__title">{project.name}</h3>
				<p className="project-card__description">{project.description}</p>
			</div>

			<div className="project-card__tech">
				{project.tech.slice(0, 5).map((tech) => (
					<span key={tech} className="project-card__pill">
						{tech}
					</span>
				))}
			</div>

			<div className="project-card__footer">
				<span>Case Study</span>
				<span>Open</span>
			</div>
		</a>
	);
}
