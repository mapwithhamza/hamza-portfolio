"use client";

import { useEffect, useRef, useState } from "react";
import SkillTile from "@/components/SkillTile";
import { skillCategories } from "@/data/skills";

export default function MissionControl() {
	const groupRefs = useRef<Array<HTMLDivElement | null>>([]);
	const [visibleGroups, setVisibleGroups] = useState<Set<string>>(new Set());

	useEffect(() => {
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		if (reduceMotion) {
			setVisibleGroups(new Set(skillCategories.map((category) => category.key)));
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) {
						return;
					}

					const key = (entry.target as HTMLElement).dataset.skillCategory;

					if (key) {
						setVisibleGroups((current) => {
							const next = new Set(current);
							next.add(key);
							return next;
						});
					}

					observer.unobserve(entry.target);
				});
			},
			{ threshold: 0.24, rootMargin: "0px 0px -14% 0px" },
		);

		groupRefs.current.forEach((node) => {
			if (node) {
				observer.observe(node);
			}
		});

		return () => observer.disconnect();
	}, []);

	return (
		<section id="skills" className="mission-control" aria-labelledby="mission-control-title">
			<div className="mission-control__shell">
				<div className="mission-control__heading">
					<div className="mission-control__label">CAPABILITY STUDIO</div>
					<h2 id="mission-control-title" className="mission-control__title">
						The tools behind the builds.
					</h2>
					<p className="mission-control__intro">
						The stack I use across web apps, dashboards, GIS tools, AI-assisted
						workflows, and the services that hold them together.
					</p>
					<div className="mission-control__meta" aria-label="Stack focus areas">
						<span>Geospatial engines</span>
						<span>Production APIs</span>
						<span>AI workflows</span>
						<span>Cloud delivery</span>
					</div>
				</div>

				<div className="mission-control__groups">
					{skillCategories.map((category, index) => {
						const isVisible = visibleGroups.has(category.key);
						const skills = [...category.featured, ...category.standard];

						return (
							<div
								key={category.key}
								ref={(node) => {
									groupRefs.current[index] = node;
								}}
								data-skill-category={category.key}
								className={`skill-category${isVisible ? " skill-category--visible" : ""}`}
							>
								<div className="skill-category__header">
									<div className="skill-category__label">{category.label}</div>
									<div className="skill-category__count">
										{category.featured.length + category.standard.length} tools
									</div>
								</div>

								<div className="skill-category__tiles">
									{skills.map((skill, skillIndex) => (
										<SkillTile
											key={skill.name}
											skill={skill}
											featured={skillIndex < category.featured.length}
										/>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
