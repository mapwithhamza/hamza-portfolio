"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

function isCoarsePointer() {
	if (typeof window === "undefined") {
		return true;
	}

	return (
		window.matchMedia("(pointer: coarse)").matches ||
		window.matchMedia("(hover: none)").matches ||
		navigator.maxTouchPoints > 0
	);
}

export default function CustomCursor() {
	const cursorRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isCoarsePointer() || !cursorRef.current) {
			return;
		}

		const cursor = cursorRef.current;
		gsap.set(cursor, { xPercent: -50, yPercent: -50 });
		const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
		const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });
		const scaleTo = gsap.quickTo(cursor, "scale", { duration: 0.24, ease: "power3.out" });

		const onPointerMove = (event: PointerEvent) => {
			gsap.to(cursor, { opacity: 1, duration: 0.18, overwrite: "auto" });
			xTo(event.clientX);
			yTo(event.clientY);

			const interactive = (event.target as Element | null)?.closest(
				"a, button, input, textarea, select, [role='button'], .project-card, .skill-tile",
			);

			scaleTo(interactive ? 3.25 : 1);
		};

		const onPointerLeave = () => {
			gsap.to(cursor, { opacity: 0, duration: 0.18 });
		};

		const onPointerEnter = () => {
			gsap.to(cursor, { opacity: 1, duration: 0.18 });
		};

		document.addEventListener("pointermove", onPointerMove, { passive: true });
		document.addEventListener("pointerleave", onPointerLeave);
		document.addEventListener("pointerenter", onPointerEnter);

		return () => {
			document.removeEventListener("pointermove", onPointerMove);
			document.removeEventListener("pointerleave", onPointerLeave);
			document.removeEventListener("pointerenter", onPointerEnter);
		};
	}, []);

	return (
		<div
			ref={cursorRef}
			aria-hidden="true"
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "10px",
				height: "10px",
				borderRadius: "999px",
				background: "var(--text-main)",
				mixBlendMode: "difference",
				pointerEvents: "none",
				zIndex: 70,
				opacity: 0,
				transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
				transformOrigin: "center",
			}}
		/>
	);
}
