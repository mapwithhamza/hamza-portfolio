"use client";

import Image from "next/image";
import { type CSSProperties, type MouseEvent, useEffect, useRef, useState } from "react";
import type { SkillEntry } from "@/data/skills";

type SkillTileProps = {
	skill: SkillEntry;
	featured?: boolean;
};

const LOGOS: Record<string, string> = {
	"Mapbox GL JS": "mapbox.svg",
	QGIS: "qgis.svg",
	PostGIS: "postgis.svg",
	"Deck.gl/WebGL": "deck-webgl.svg",
	"ArcGIS Pro": "arcgis.svg",
	"Leaflet.js": "leaflet.svg",
	"Remote Sensing": "remote-sensing.svg",
	GeoServer: "geoserver.svg",
	"GDAL/Rasterio": "gdal-rasterio.svg",
	"OGC Standards": "ogc-standards.svg",
	"FastAPI/Python": "fastapi-python.svg",
	"React/Next.js": "react-next.svg",
	"Node.js/Express": "node-express.svg",
	PostgreSQL: "postgresql.svg",
	"JavaScript ES6+": "javascript.svg",
	"REST APIs": "rest-apis.svg",
	"Git/GitHub": "git-github.svg",
	Docker: "docker.svg",
	"CI/CD": "ci-cd.svg",
	TensorFlow: "tensorflow.svg",
	"Claude API": "claude.svg",
	"Agentic AI": "agentic-ai.svg",
	"RAG Pipelines": "rag-pipelines.svg",
	GeoPandas: "geopandas.svg",
	"Automated ML": "automated-ml.svg",
	"Spatial Data Pipelines": "spatial-data-pipelines.svg",
	"LLM Integration": "llm-integration.svg",
	AWS: "aws.svg",
	Vercel: "vercel.svg",
	Firebase: "firebase.svg",
	MongoDB: "mongodb.svg",
	Netlify: "netlify.svg",
};

const ACCENTS: Record<string, string> = {
	"Mapbox GL JS": "#ffffff",
	QGIS: "#7fba43",
	PostGIS: "#4169e1",
	"Deck.gl/WebGL": "#d94b4b",
	"ArcGIS Pro": "#2c7ac3",
	"Leaflet.js": "#72b845",
	"Remote Sensing": "#4cb05b",
	GeoServer: "#4cb05b",
	"GDAL/Rasterio": "#5cae58",
	"OGC Standards": "#396cb2",
	"FastAPI/Python": "#009688",
	"React/Next.js": "#61dafb",
	"Node.js/Express": "#5fa04e",
	PostgreSQL: "#4169e1",
	"JavaScript ES6+": "#f7df1e",
	"REST APIs": "#6ba539",
	"Swift SDK": "#fa7343",
	"Git/GitHub": "#ffffff",
	Docker: "#2496ed",
	"CI/CD": "#2088ff",
	TensorFlow: "#ff6f00",
	"Claude API": "#d97757",
	"Agentic AI": "#ffffff",
	"RAG Pipelines": "#c5a059",
	GeoPandas: "#139c5a",
	OpenCV: "#5c3ee8",
	"Automated ML": "#ff6f00",
	"Spatial Data Pipelines": "#017cee",
	"LLM Integration": "#ffffff",
	AWS: "#ff9900",
	Vercel: "#ffffff",
	Firebase: "#ffca28",
	MongoDB: "#47a248",
	Netlify: "#00c7b7",
};

export default function SkillTile({ skill, featured = false }: SkillTileProps) {
	const logo = LOGOS[skill.name];
	const accent = ACCENTS[skill.name] ?? "#c5a059";
	const tileRef = useRef<HTMLElement>(null);
	const frameRef = useRef<number | null>(null);
	const [canTilt, setCanTilt] = useState(false);

	useEffect(() => {
		const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setCanTilt(hoverQuery.matches && !motionQuery.matches);

		update();
		hoverQuery.addEventListener("change", update);
		motionQuery.addEventListener("change", update);

		return () => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}
			hoverQuery.removeEventListener("change", update);
			motionQuery.removeEventListener("change", update);
		};
	}, []);

	const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
		if (!canTilt || !tileRef.current) {
			return;
		}

		const target = tileRef.current;
		const bounds = target.getBoundingClientRect();
		const x = (event.clientX - bounds.left) / bounds.width;
		const y = (event.clientY - bounds.top) / bounds.height;
		const rotateX = (0.5 - y) * 8;
		const rotateY = (x - 0.5) * 10;

		if (frameRef.current) {
			cancelAnimationFrame(frameRef.current);
		}

		frameRef.current = requestAnimationFrame(() => {
			target.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
		});
	};

	const resetTilt = () => {
		if (!tileRef.current) {
			return;
		}

		if (frameRef.current) {
			cancelAnimationFrame(frameRef.current);
		}

		tileRef.current.style.transform = "";
	};

	return (
		<article
			ref={tileRef}
			className={`skill-tile${featured ? " skill-tile--featured" : ""}`}
			onMouseMove={handleMouseMove}
			onMouseLeave={resetTilt}
			style={
				{
					"--skill-accent": accent,
				} as CSSProperties
			}
			aria-label={skill.name}
		>
			<div className="skill-tile__glow" aria-hidden="true" />
			<div className="skill-tile__logo-plate">
				{logo ? (
					<Image
						className="skill-tile__logo"
						src={`/logos/stack/${logo}`}
						alt=""
						width={44}
						height={44}
						loading="lazy"
					/>
				) : (
					<span className="skill-tile__fallback" aria-hidden="true">
						{skill.name.slice(0, 2)}
					</span>
				)}
			</div>
			<div className="skill-tile__name">{skill.name}</div>
		</article>
	);
}
