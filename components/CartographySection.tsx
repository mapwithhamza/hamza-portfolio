"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const WORDS = [
	"SATELLITE IMAGERY",
	"SPECTRAL INDICES",
	"IMAGE CLASSIFICATION",
	"FLOOD MAPPING",
	"VECTOR DATA",
	"MAP PRODUCTION",
];

const MAPS = [
	{
		title: "Satellite Preprocessing",
		kicker: "Sentinel / Landsat",
		src: "/images/maps/satellite-scene.webp",
		alt: "Processed Sentinel satellite image layout",
		tags: ["Georeferencing", "Raster prep"],
	},
	{
		title: "Spectral Indices",
		kicker: "NDVI / SAVI / NDWI",
		src: "/images/maps/indices-vegetation.webp",
		alt: "Vegetation index classification map",
		tags: ["Vegetation", "Band ratios"],
	},
	{
		title: "Flood Extent Mapping",
		kicker: "Risk / Impact",
		src: "/images/maps/flood-extent.webp",
		alt: "Flood extent map layout",
		tags: ["SAR context", "Hazard map"],
	},
	{
		title: "Image Classification",
		kicker: "LULC / ISO-data",
		src: "/images/maps/classification-map.webp",
		alt: "ISO-data land cover classification map",
		tags: ["LULC", "Accuracy review"],
	},
	{
		title: "Vector & Boundaries",
		kicker: "GIS cartography",
		src: "/images/maps/admin-boundaries.webp",
		alt: "Administrative boundaries cartography layout",
		tags: ["Digitization", "Map layout"],
	},
	{
		title: "Image Processing",
		kicker: "ERDAS / ArcGIS",
		src: "/images/maps/processing-workflow.webp",
		alt: "Remote sensing image processing workflow",
		tags: ["Multiband", "False color"],
	},
];

export default function CartographySection() {
	const sectionRef = useRef<HTMLElement>(null);
	const atlasRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

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
			{ threshold: 0.2, rootMargin: "0px 0px -12% 0px" },
		);

		observer.observe(sectionRef.current);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const atlas = atlasRef.current;

		if (!atlas) {
			return;
		}

		let resumeTimer: number | null = null;
		let dragging = false;
		let dragStartX = 0;
		let dragStartScroll = 0;

		const pauseManual = () => {
			atlas.classList.add("cartography-atlas--manual");

			if (resumeTimer !== null) {
				window.clearTimeout(resumeTimer);
			}

			resumeTimer = window.setTimeout(() => {
				if (!dragging) {
					atlas.classList.remove("cartography-atlas--manual");
				}
			}, 4000);
		};

		const onPointerDown = (event: PointerEvent) => {
			if (event.pointerType === "mouse" && event.button !== 0) {
				return;
			}

			dragging = true;
			dragStartX = event.clientX;
			dragStartScroll = atlas.scrollLeft;
			atlas.classList.add("cartography-atlas--dragging");
			pauseManual();
			atlas.setPointerCapture(event.pointerId);
		};

		const onPointerMove = (event: PointerEvent) => {
			if (!dragging) {
				return;
			}

			atlas.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
		};

		const endDrag = (event: PointerEvent) => {
			if (!dragging) {
				return;
			}

			dragging = false;
			atlas.classList.remove("cartography-atlas--dragging");

			if (atlas.hasPointerCapture(event.pointerId)) {
				atlas.releasePointerCapture(event.pointerId);
			}

			pauseManual();
		};

		atlas.addEventListener("wheel", pauseManual, { passive: true });
		atlas.addEventListener("touchstart", pauseManual, { passive: true });
		atlas.addEventListener("pointerdown", onPointerDown);
		atlas.addEventListener("pointermove", onPointerMove);
		atlas.addEventListener("pointerup", endDrag);
		atlas.addEventListener("pointercancel", endDrag);

		return () => {
			atlas.removeEventListener("wheel", pauseManual);
			atlas.removeEventListener("touchstart", pauseManual);
			atlas.removeEventListener("pointerdown", onPointerDown);
			atlas.removeEventListener("pointermove", onPointerMove);
			atlas.removeEventListener("pointerup", endDrag);
			atlas.removeEventListener("pointercancel", endDrag);

			if (resumeTimer !== null) {
				window.clearTimeout(resumeTimer);
			}
		};
	}, []);

	return (
		<section
			ref={sectionRef}
			className={`cartography-section${visible ? " cartography-section--visible" : ""}`}
			aria-labelledby="cartography-title"
		>
			<div className="cartography-paper" aria-hidden="true">
				<svg className="cartography-map" viewBox="0 0 1200 620" preserveAspectRatio="none">
					<g className="cartography-contours">
						<path d="M-40 388C112 306 216 306 360 376C512 450 662 424 810 324C946 232 1080 218 1240 280" />
						<path d="M-24 428C132 360 256 368 392 424C534 482 692 462 840 376C978 296 1106 286 1240 344" />
						<path d="M-18 470C146 422 278 428 414 474C566 526 720 510 878 430C1010 364 1128 354 1240 398" />
						<path d="M84 340C210 250 354 244 486 320C632 402 764 346 908 250C1038 164 1142 164 1244 222" />
						<path d="M180 286C322 204 448 214 580 292C724 376 830 318 966 220C1068 146 1164 132 1242 174" />
						<path d="M260 236C382 170 500 184 624 254C758 330 864 276 986 190C1076 126 1162 106 1240 138" />
					</g>
					<g className="cartography-routes">
						<path d="M114 430C252 310 390 306 528 394C670 484 808 406 934 298C1040 208 1146 190 1240 226" />
						<path d="M184 502C336 418 492 422 640 488C782 552 932 482 1058 394C1122 350 1182 332 1240 334" />
					</g>
					<g className="cartography-points">
						<circle cx="360" cy="376" r="5" />
						<circle cx="810" cy="324" r="5" />
						<circle cx="934" cy="298" r="5" />
						<circle cx="640" cy="488" r="5" />
					</g>
				</svg>
			</div>

			<div className="cartography-shell">
				<div className="cartography-copy">
					<div className="cartography-label">Geospatial Evidence Layer</div>
					<h2 id="cartography-title" className="cartography-title">
						Geospatial & remote sensing lab.
					</h2>
					<p>
						Beyond interfaces, I work with satellite imagery, vector data, image
						classification, flood mapping, spectral indices, and publication-ready map
						outputs.
					</p>
				</div>

				<div className="cartography-word-grid" aria-hidden="true">
					{WORDS.map((word) => (
						<span key={word}>{word}</span>
					))}
				</div>
			</div>

			<div className="cartography-rail" aria-label="Selected geospatial and remote sensing outputs">
				<div ref={atlasRef} className="cartography-atlas">
					<div className="cartography-atlas__track">
						{[...MAPS, ...MAPS].map((map, index) => (
							<article className="cartography-card" key={`${map.title}-${index}`}>
								<div className="cartography-card__index">{String((index % MAPS.length) + 1).padStart(2, "0")}</div>
								<div className="cartography-card__image">
									<Image
										src={map.src}
										alt={map.alt}
										fill
										sizes="(max-width: 900px) 78vw, 360px"
									/>
								</div>
								<div className="cartography-card__meta">
									<span>{map.kicker}</span>
									<strong>{map.title}</strong>
									<div className="cartography-card__tags">
										{map.tags.map((tag) => (
											<em key={tag}>{tag}</em>
										))}
									</div>
								</div>
							</article>
						))}
					</div>
				</div>

				<div className="cartography-rail__footer" aria-hidden="true">
					<span>06 outputs - slow auto scan</span>
					<div className="cartography-rail__track">
						<span />
					</div>
				</div>
			</div>
		</section>
	);
}
