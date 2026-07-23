"use client";

import { useEffect, useRef } from "react";
import ProjectCard from "@/components/ProjectCard";
import { updateHUDCoords } from "@/components/CoordinateHUD";
import { featuredProjects } from "@/data/projects";

export default function ProjectsSection() {
	const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const active = entries
					.filter((entry) => entry.isIntersecting)
					.sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

				if (!active) {
					return;
				}

				const index = Number((active.target as HTMLElement).dataset.projectIndex);
				const project = featuredProjects[index];

				if (project) {
					updateHUDCoords(project.coordinates.lat, project.coordinates.lng, project.place);
				}
			},
			{ threshold: [0.35, 0.55, 0.75], rootMargin: "-12% 0px -28% 0px" },
		);

		cardRefs.current.forEach((node) => {
			if (node) {
				observer.observe(node);
			}
		});

		return () => observer.disconnect();
	}, []);

	return (
		<section id="work" className="projects-section">
			<div className="projects-shell">
				<div className="projects-heading">
					<div className="projects-label">Selected Builds</div>
					<h2 className="projects-title">Projects</h2>
					<p className="projects-intro">
						A curated set of apps, dashboards, GIS tools, and AI-assisted systems built around
						specific problems.
					</p>
				</div>

				<div className="projects-grid">
					{featuredProjects.map((project, index) => (
						<div
							key={project.slug}
							ref={(node) => {
								cardRefs.current[index] = node;
							}}
							data-project-index={index}
						>
							<ProjectCard project={project} index={index} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
