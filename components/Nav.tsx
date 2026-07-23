"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site";

const navLinks = [
	{ label: "Work", href: "#work" },
	{ label: "Skills", href: "#skills" },
	{ label: "About", href: "#about" },
	{ label: "Contact", href: "#contact" },
];

export default function Nav() {
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const update = () => {
			setScrolled(window.scrollY > 80);
		};

		update();
		window.addEventListener("scroll", update, { passive: true });

		return () => window.removeEventListener("scroll", update);
	}, []);

	return (
		<nav className={`site-nav${scrolled ? " site-nav--scrolled" : ""}`} aria-label="Primary navigation">
			<div className="site-nav__shell">
				<a className="site-nav__identity" href="#top" aria-label={`${siteConfig.name} home`}>
					<span className="site-nav__avatar">
						<Image
							src="/images/hamza-portrait-cropped.jpeg"
							alt=""
							width={88}
							height={88}
							priority
						/>
					</span>
					<span className="site-nav__name">Hamza Khan</span>
				</a>

				<div className={`site-nav__links${open ? " site-nav__links--open" : ""}`}>
					{navLinks.map((link) => (
						<a key={link.href} href={link.href} onClick={() => setOpen(false)}>
							<span>{link.label}</span>
						</a>
					))}
				</div>

				<div className="site-nav__actions">
					<a className="site-nav__cta" href="#contact">
						HIRE ME
					</a>

					<button
						className="site-nav__menu"
						type="button"
						aria-label={open ? "Close menu" : "Open menu"}
						aria-expanded={open}
						onClick={() => setOpen((current) => !current)}
					>
						<span />
						<span />
						<span />
					</button>
				</div>
			</div>
		</nav>
	);
}
