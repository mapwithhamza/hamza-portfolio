"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/site";

type HUDCoords = {
	lat: number;
	lng: number;
	place: string;
};

const DEFAULT_COORDS: HUDCoords = {
	lat: siteConfig.coordinates.lat,
	lng: siteConfig.coordinates.lng,
	place: siteConfig.location,
};

let hudSubscriber: ((coords: HUDCoords) => void) | null = null;

function formatCoordinate(value: number, positiveSuffix: "N" | "E", negativeSuffix: "S" | "W") {
	const suffix = value >= 0 ? positiveSuffix : negativeSuffix;
	return `${Math.abs(value).toFixed(4)}°${suffix}`;
}

function lerp(start: number, end: number, progress: number) {
	return start + (end - start) * progress;
}

function easeOutCubic(value: number) {
	return 1 - (1 - value) ** 3;
}

export function updateHUDCoords(lat: number, lng: number, place: string) {
	hudSubscriber?.({ lat, lng, place });
}

export default function CoordinateHUD() {
	const animationRef = useRef<number | null>(null);
	const currentRef = useRef<HUDCoords>(DEFAULT_COORDS);
	const [display, setDisplay] = useState(DEFAULT_COORDS);

	useEffect(() => {
		hudSubscriber = (nextCoords) => {
			if (animationRef.current !== null) {
				window.cancelAnimationFrame(animationRef.current);
			}

			const startCoords = currentRef.current;
			const startedAt = performance.now();
			const duration = 900;

			const tick = (now: number) => {
				const rawProgress = Math.min((now - startedAt) / duration, 1);
				const progress = easeOutCubic(rawProgress);
				const nextDisplay = {
					lat: lerp(startCoords.lat, nextCoords.lat, progress),
					lng: lerp(startCoords.lng, nextCoords.lng, progress),
					place: nextCoords.place,
				};

				currentRef.current = nextDisplay;
				setDisplay(nextDisplay);

				if (rawProgress < 1) {
					animationRef.current = window.requestAnimationFrame(tick);
				}
			};

			animationRef.current = window.requestAnimationFrame(tick);
		};

		return () => {
			hudSubscriber = null;

			if (animationRef.current !== null) {
				window.cancelAnimationFrame(animationRef.current);
			}
		};
	}, []);

	return (
		<div
			aria-live="polite"
			className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-[11px] uppercase tracking-widest text-[#8A8A8A] backdrop-blur-md font-inter"
			style={{ fontFamily: "var(--font-body), sans-serif" }}
		>
			LAT {formatCoordinate(display.lat, "N", "S")}{"   "}LNG{" "}
			{formatCoordinate(display.lng, "E", "W")}
		</div>
	);
}
