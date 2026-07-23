"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { siteConfig } from "@/data/site";

export default function StatsSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const stats = useMemo(() => siteConfig.stats.items, []);
	const [hasEntered, setHasEntered] = useState(false);

	useEffect(() => {
		if (!sectionRef.current) {
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setHasEntered(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.35 },
		);

		observer.observe(sectionRef.current);
		return () => observer.disconnect();
	}, []);

	return (
		<section
			ref={sectionRef}
			className={`stats-section${hasEntered ? " stats-section--visible" : ""}`}
			aria-labelledby="stats-heading"
		>
			<p id="stats-heading" className="stats-eyebrow">
				{siteConfig.stats.eyebrow}
			</p>

			<div className="stats-grid">
				{stats.map((stat, index) => (
					<article
						className="stats-card"
						key={stat.label}
						style={{ transitionDelay: `${index * 80}ms` }}
					>
						<div className="stats-card__marker" aria-hidden="true">
							{String(index + 1).padStart(2, "0")}
						</div>
						<div className="stats-number">{stat.value}</div>
						<div className="stats-label">{stat.label}</div>
					</article>
				))}
			</div>
		</section>
	);
}
