"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "mhk_cal";

type Phase = "idle" | "prepare" | "lock" | "progress" | "ready" | "done";

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

export default function CalibrationOverlay() {
	const reducedMotion = useReducedMotion();
	const [visible, setVisible] = useState(false);
	const [phase, setPhase] = useState<Phase>("idle");
	const [progress, setProgress] = useState(0);

	const textOpacity = useMemo(() => {
		return {
			prepare: phase === "prepare" ? 1 : 0,
			lock: phase === "lock" ? 1 : 0,
			ready: phase === "ready" || phase === "done" ? 1 : 0,
		};
	}, [phase]);

	useEffect(() => {
		if (reducedMotion) {
			return;
		}

		try {
			if (window.sessionStorage.getItem(STORAGE_KEY) === "1") {
				return;
			}
		} catch {
			return;
		}

		setVisible(true);

		const timers = [
			window.setTimeout(() => setPhase("prepare"), 150),
			window.setTimeout(() => setPhase("lock"), 650),
			window.setTimeout(() => {
				setPhase("progress");
				const start = window.setTimeout(() => {
					setProgress(100);
				}, 0);
				return () => window.clearTimeout(start);
			}, 900),
			window.setTimeout(() => setPhase("ready"), 2300),
			window.setTimeout(() => {
				setPhase("done");
				setVisible(false);
				try {
					window.sessionStorage.setItem(STORAGE_KEY, "1");
				} catch {
					// ignore storage failures
				}
			}, 2900),
		];

		const stop = () => {
			timers.forEach((timer) => window.clearTimeout(timer));
			setPhase("done");
			setVisible(false);
			setProgress(0);
			try {
				window.sessionStorage.setItem(STORAGE_KEY, "1");
			} catch {
				// ignore storage failures
			}
		};

		const onScroll = () => stop();
		const onKeyDown = () => stop();

		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("keydown", onKeyDown);

		return () => {
			timers.forEach((timer) => window.clearTimeout(timer));
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [reducedMotion]);

	if (!visible || reducedMotion) {
		return null;
	}

	return (
		<div
			aria-hidden="true"
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 60,
				display: "grid",
				placeItems: "center",
				background:
					"linear-gradient(180deg, color-mix(in srgb, var(--bg-core) 88%, transparent), color-mix(in srgb, var(--surface) 92%, transparent))",
				color: "var(--text-main)",
				fontFamily: "var(--font-body), sans-serif",
				transition: "opacity 280ms ease",
				opacity: phase === "done" ? 0 : 1,
				pointerEvents: "auto",
			}}
		>
			<div
				style={{
					width: "min(520px, calc(100vw - 32px))",
					border: "1px solid var(--ui-border)",
					borderRadius: "18px",
					background: "color-mix(in srgb, var(--surface) 82%, transparent)",
					padding: "22px",
					boxShadow:
						"0 24px 80px rgba(0, 0, 0, 0.46), 0 0 0 1px rgba(255, 255, 255, 0.03) inset",
					backdropFilter: "blur(18px)",
				}}
			>
				<div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
					<div style={{ display: "grid", gap: "10px" }}>
						<div
							style={{
								opacity: textOpacity.prepare,
								transition: "opacity 150ms ease",
								color: "var(--accent-ambient)",
								fontSize: "11px",
								fontWeight: 500,
								letterSpacing: "0.2em",
								textTransform: "uppercase",
							}}
						>
							Preparing spatial context
						</div>
						<div
							style={{
								opacity: textOpacity.lock,
								transition: "opacity 220ms ease",
								color: "var(--text-main)",
								fontSize: "13px",
								letterSpacing: "0.08em",
								textTransform: "uppercase",
							}}
						>
							Islamabad context locked
						</div>
					</div>
					<button
						type="button"
						onClick={() => {
							setPhase("done");
							setVisible(false);
							try {
								window.sessionStorage.setItem(STORAGE_KEY, "1");
							} catch {
								// ignore storage failures
							}
						}}
						style={{
							border: "1px solid var(--ui-border)",
							borderRadius: "999px",
							background: "rgba(255, 255, 255, 0.04)",
							color: "var(--text-main)",
							fontFamily: "var(--font-body), sans-serif",
							fontSize: "11px",
							letterSpacing: "0.14em",
							textTransform: "uppercase",
							padding: "8px 12px",
							cursor: "pointer",
						}}
					>
						Continue
					</button>
				</div>

				<div
					style={{
						marginTop: "18px",
						height: "1px",
						background: "rgba(255, 255, 255, 0.08)",
						overflow: "hidden",
					}}
				>
					<div
						style={{
							width: `${progress}%`,
							height: "100%",
							background: "var(--accent-ambient)",
							boxShadow: "0 0 18px rgba(197, 160, 89, 0.34)",
							transition: "width 1.6s ease",
						}}
					/>
				</div>

				<div
					style={{
						marginTop: "16px",
						color: "var(--text-muted)",
						fontSize: "11px",
						fontWeight: 500,
						letterSpacing: "0.2em",
						textTransform: "uppercase",
						opacity: textOpacity.ready,
						transition: "opacity 250ms ease",
					}}
				>
					Interface ready
				</div>
			</div>
		</div>
	);
}
