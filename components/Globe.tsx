"use client";

import GlobeGL from "globe.gl";
import { useEffect, useRef } from "react";

type CountryFeature = {
	type: "Feature";
	properties: {
		ADMIN?: string;
		ISO_A2?: string;
		GDP_MD_EST?: number;
		POP_EST?: number;
	};
	geometry: unknown;
};

type CountriesGeoJson = {
	type: "FeatureCollection";
	features: CountryFeature[];
};

type GlobeInstance = InstanceType<typeof GlobeGL>;
type GlobeProgressEvent = CustomEvent<{ progress?: number }>;

function isMobileViewport() {
	return window.matchMedia("(max-width: 767px)").matches;
}

function clamp(value: number) {
	return Math.min(1, Math.max(0, value));
}

function lerp(from: number, to: number, progress: number) {
	return from + (to - from) * progress;
}

function smoothstep(progress: number) {
	return progress * progress * (3 - 2 * progress);
}

function getCountryValue(feature: CountryFeature) {
	const gdp = feature.properties.GDP_MD_EST ?? 0;
	const population = feature.properties.POP_EST ?? 1;

	return gdp / Math.max(100000, population);
}

function colorScale(value: number, maxValue: number) {
	const progress = Math.sqrt(Math.max(0, value) / Math.max(0.0001, maxValue));
	const stops = [
		{ at: 0, color: [255, 244, 180] },
		{ at: 0.42, color: [255, 190, 82] },
		{ at: 0.72, color: [255, 119, 55] },
		{ at: 1, color: [184, 32, 30] },
	];

	const upperIndex = stops.findIndex((stop) => progress <= stop.at);
	const upper = stops[Math.max(1, upperIndex === -1 ? stops.length - 1 : upperIndex)];
	const lower = stops[stops.indexOf(upper) - 1];
	const localProgress = (progress - lower.at) / Math.max(0.0001, upper.at - lower.at);
	const channel = (index: number) =>
		Math.round(lower.color[index] + (upper.color[index] - lower.color[index]) * localProgress);

	return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`;
}

export default function Globe() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const globeRef = useRef<GlobeInstance | null>(null);
	const resizeObserverRef = useRef<ResizeObserver | null>(null);
	const animationFrameRef = useRef<number | null>(null);
	const viewFrameRef = useRef<number | null>(null);
	const viewProgressRef = useRef(0);

	useEffect(() => {
		const container = containerRef.current;

		if (!container) {
			return;
		}

		let destroyed = false;
		let countryLoadTimer: number | null = null;
		let idleTimer: number | null = null;
		const mobile = isMobileViewport();
		const globe = new GlobeGL(container, {
			rendererConfig: {
				antialias: !mobile,
				alpha: true,
				powerPreference: "high-performance",
			},
		});

		const startView = { lat: 25, lng: 28, altitude: mobile ? 2.62 : 2.22 };
		const endView = { lat: 13, lng: -14, altitude: mobile ? 2.44 : 1.44 };
		const baseAutoRotateSpeed = mobile ? 0.18 : 0.28;

		globeRef.current = globe;
		globe
			.backgroundColor("rgba(0,0,0,0)")
			.globeImageUrl("/globe/earth-night.jpg")
			.lineHoverPrecision(0)
			.polygonAltitude(() => (mobile ? 0.035 : 0.055))
			.polygonSideColor(() => "rgba(0, 32, 22, 0.22)")
			.polygonStrokeColor(() => "#111111")
			.polygonsTransitionDuration(mobile ? 0 : 250)
			.enablePointerInteraction(!mobile)
			.pointOfView(startView, 0);

		const controls = globe.controls();
		controls.autoRotate = true;
		controls.autoRotateSpeed = baseAutoRotateSpeed;
		controls.enableZoom = false;
		controls.enablePan = false;
		controls.enableDamping = true;
		controls.dampingFactor = 0.04;
		controls.rotateSpeed = mobile ? 0.35 : 0.55;

		// Adaptive frame rate — pause after 2.2s of no activity, wake instantly on interaction
		const setIdle = () => {
			globe.pauseAnimation();
			idleTimer = null;
		};
		const wakeUp = () => {
			if (destroyed) return;
			globe.resumeAnimation();
			if (idleTimer !== null) window.clearTimeout(idleTimer);
			idleTimer = window.setTimeout(setIdle, 4000);
		};

		container.addEventListener("mouseenter", wakeUp);
		container.addEventListener("mousemove", wakeUp);
		wakeUp(); // start active on load

		const renderer = globe.renderer();
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 1.75));
		renderer.setClearColor(0x000000, 0);

		const applyViewProgress = () => {
			const progress = smoothstep(viewProgressRef.current);

			controls.autoRotateSpeed = lerp(baseAutoRotateSpeed, baseAutoRotateSpeed * 0.35, progress);
			globe.pointOfView(
				{
					lat: lerp(startView.lat, endView.lat, progress),
					lng: lerp(startView.lng, endView.lng, progress),
					altitude: lerp(startView.altitude, endView.altitude, progress),
				},
				0,
			);
		};

		const resize = () => {
			if (!container || destroyed) {
				return;
			}

			const bounds = container.getBoundingClientRect();
			const width = Math.max(1, Math.floor(bounds.width));
			const height = Math.max(1, Math.floor(bounds.height));

			globe.width(width).height(height);
			renderer.setSize(width, height, false);
		};

		resize();
		resizeObserverRef.current = new ResizeObserver(() => {
			if (animationFrameRef.current !== null) {
				window.cancelAnimationFrame(animationFrameRef.current);
			}

			animationFrameRef.current = window.requestAnimationFrame(resize);
		});
		resizeObserverRef.current.observe(container);

		const visibilityObserver = new IntersectionObserver(
			([entry]) => {
				if (document.hidden || !entry.isIntersecting) {
					globe.pauseAnimation();
					if (idleTimer !== null) {
						window.clearTimeout(idleTimer);
						idleTimer = null;
					}
				} else {
					wakeUp();
				}
			},
			{ threshold: 0.08 },
		);

		visibilityObserver.observe(container);

		const onVisibilityChange = () => {
			const bounds = container.getBoundingClientRect();
			const inViewport = bounds.bottom > 0 && bounds.top < window.innerHeight;

			if (document.hidden || !inViewport) {
				globe.pauseAnimation();
				if (idleTimer !== null) {
					window.clearTimeout(idleTimer);
					idleTimer = null;
				}
			} else {
				wakeUp();
			}
		};

		const onGlobeProgress = (event: Event) => {
			const progress = (event as GlobeProgressEvent).detail?.progress ?? 0;

			viewProgressRef.current = clamp(progress);
			wakeUp(); // wake globe during scroll transitions

			if (viewFrameRef.current !== null) {
				window.cancelAnimationFrame(viewFrameRef.current);
			}

			viewFrameRef.current = window.requestAnimationFrame(() => {
				viewFrameRef.current = null;

				if (!destroyed) {
					applyViewProgress();
				}
			});
		};

		document.addEventListener("visibilitychange", onVisibilityChange);
		window.addEventListener("portfolio:globe-progress", onGlobeProgress);

		const loadCountries = () => {
			fetch("/globe/countries.geojson")
				.then((response) => response.json() as Promise<CountriesGeoJson>)
				.then((countries) => {
					if (destroyed) {
						return;
					}

					const features = countries.features.filter((feature) => feature.properties.ISO_A2 !== "AQ");
					const maxValue = Math.max(...features.map(getCountryValue));

					globe
						.polygonsData(features)
						.polygonCapColor((feature) => colorScale(getCountryValue(feature as CountryFeature), maxValue))
						.polygonLabel((feature) => {
							if (mobile) {
								return "";
							}

							const { properties } = feature as CountryFeature;
							const name = properties.ADMIN ?? "Unknown";
							const iso = properties.ISO_A2 ?? "--";

							return `<div class="globe-tooltip"><strong>${name}</strong><span>${iso}</span></div>`;
						});

					if (!mobile) {
						globe.onPolygonHover((hovered) => {
							wakeUp(); // wake on hover interaction
							globe
								.polygonAltitude((feature) => (feature === hovered ? 0.11 : 0.055))
								.polygonCapColor((feature) =>
									feature === hovered
										? "rgb(226, 245, 255)"
										: colorScale(getCountryValue(feature as CountryFeature), maxValue),
								);
						});
					}
				})
				.catch(() => {
					// Keep the textured globe alive even if the local GeoJSON fails to load.
				});
		};

		countryLoadTimer = window.setTimeout(loadCountries, mobile ? 420 : 180);

		return () => {
			destroyed = true;
			document.removeEventListener("visibilitychange", onVisibilityChange);
			window.removeEventListener("portfolio:globe-progress", onGlobeProgress);
			container.removeEventListener("mouseenter", wakeUp);
			container.removeEventListener("mousemove", wakeUp);
			visibilityObserver.disconnect();

			if (idleTimer !== null) window.clearTimeout(idleTimer);

			if (countryLoadTimer !== null) {
				window.clearTimeout(countryLoadTimer);
			}

			if (animationFrameRef.current !== null) {
				window.cancelAnimationFrame(animationFrameRef.current);
			}

			if (viewFrameRef.current !== null) {
				window.cancelAnimationFrame(viewFrameRef.current);
			}

			resizeObserverRef.current?.disconnect();
			globe.pauseAnimation();

			try {
				globe._destructor();
			} catch {
				// globe.gl owns an imperative canvas inside React's tree. During route
				// changes the canvas can already be detached, so ignore duplicate DOM cleanup.
			}

			globeRef.current = null;
		};
	}, []);

	return <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />;
}
