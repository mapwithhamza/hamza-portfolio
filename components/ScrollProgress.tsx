"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const update = () => {
			const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
			const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
			setProgress(Math.min(100, Math.max(0, ratio * 100)));
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);

		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	return (
		<div
			aria-hidden="true"
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "1px",
				zIndex: 55,
				background: "rgba(255, 255, 255, 0.04)",
				opacity: 0.6,
			}}
		>
			<div
				style={{
					width: `${progress}%`,
					height: "100%",
					background: "var(--accent-ambient)",
					boxShadow: "0 0 8px color-mix(in srgb, var(--accent-ambient) 20%, transparent)",
				}}
			/>
		</div>
	);
}
