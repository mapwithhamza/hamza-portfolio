"use client";

import { type CSSProperties, type FormEvent, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/site";

const contourPaths = [
	"M-24 322 C78 260 178 246 292 284 C400 320 482 318 592 260 C704 202 824 184 956 222 C1066 254 1162 238 1304 154",
	"M-8 356 C104 288 210 278 320 312 C428 346 514 338 622 286 C732 234 852 218 974 250 C1088 280 1180 264 1308 188",
	"M12 390 C128 326 238 312 350 340 C458 366 546 358 652 312 C764 266 872 250 994 278 C1110 304 1190 292 1308 228",
	"M40 424 C156 366 270 346 382 366 C492 386 584 382 688 344 C794 306 900 288 1014 310 C1124 332 1204 326 1310 270",
	"M76 456 C188 408 304 382 420 396 C528 408 622 410 724 380 C828 350 928 332 1034 348 C1138 364 1218 366 1308 314",
	"M118 486 C226 448 342 418 456 424 C566 430 658 438 760 414 C862 390 956 374 1052 382 C1150 390 1226 410 1306 358",
	"M170 512 C270 488 386 456 494 456 C600 456 694 466 794 450 C888 434 982 424 1070 430 C1162 436 1236 454 1302 404",
	"M228 536 C318 526 428 496 532 490 C636 484 732 496 826 486 C914 476 1006 472 1088 478 C1172 484 1240 494 1298 452",
];

const ridgePaths = [
	"M162 464 C242 428 328 424 424 448 C512 470 594 462 682 424 C762 388 846 382 944 408",
	"M392 382 C482 338 574 336 662 366 C744 394 818 380 910 338 C1000 298 1088 300 1200 332",
	"M260 528 C354 492 456 486 548 508 C632 528 712 520 804 492 C884 468 960 466 1046 482",
];

const dataColumns = Array.from({ length: 18 }, (_, index) => ({
	left: `${5 + index * 5.4}%`,
	delay: `${index * -0.42}s`,
	height: `${84 + (index % 5) * 22}px`,
}));

type FormState = {
	name: string;
	email: string;
	subject: string;
	message: string;
	website: string;
};

type SubmitState =
	| { status: "idle" }
	| { status: "sending" }
	| { status: "success"; timestamp: string }
	| { status: "error" };

const initialForm: FormState = {
	name: "",
	email: "",
	subject: "",
	message: "",
	website: "",
};

export default function ContactSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const [form, setForm] = useState<FormState>(initialForm);
	const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => el.classList.toggle("is-visible", entry.isIntersecting),
			{ threshold: 0.05 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const updateField = (field: keyof FormState, value: string) => {
		setForm((current) => ({ ...current, [field]: value }));
		if (submitState.status !== "idle" && submitState.status !== "sending") {
			setSubmitState({ status: "idle" });
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitState({ status: "sending" });

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			if (!response.ok) throw new Error("Contact request failed");

			const timestamp = new Date().toISOString();
			setForm(initialForm);
			setSubmitState({ status: "success", timestamp });
		} catch {
			setSubmitState({ status: "error" });
		}
	};

	return (
		<section ref={sectionRef} id="contact" className="contact-section" aria-labelledby="contact-title">
			<div className="contact-section__terrain" aria-hidden="true">
				<div className="contact-section__grid" />
				<div className="contact-section__data-rain">
					{dataColumns.map((column, index) => (
						<span
							key={column.left}
							style={
								{
									"--x": column.left,
									"--delay": column.delay,
									"--h": column.height,
								} as CSSProperties
							}
						>
							{index % 3 === 0 ? "0101" : index % 3 === 1 ? "GIS" : "MHK"}
						</span>
					))}
				</div>
				<svg className="contact-section__contours" viewBox="0 0 1280 620" preserveAspectRatio="none">
					<g>
						{contourPaths.map((path, index) => (
							<path key={path} d={path} style={{ animationDelay: `${index * -0.32}s` }} />
						))}
					</g>
					<g className="contact-section__ridges">
						{ridgePaths.map((path, index) => (
							<path key={path} d={path} style={{ animationDelay: `${index * -0.62}s` }} />
						))}
					</g>
				</svg>
				<div className="contact-section__beacon contact-section__beacon--one" />
				<div className="contact-section__beacon contact-section__beacon--two" />
				<div className="contact-section__scanline" />
			</div>

			<div className="contact-section__shell">
				<div className="contact-section__copy">
					<p className="section-label">CONTACT</p>
					<h2 id="contact-title">Interested in working together?</h2>
					<p>
						I&apos;m open to freelance projects, internships, and full-time opportunities
						across web development and GIS. Reach out and I&apos;ll respond quickly.
					</p>
				</div>

				<div className="contact-console">
					<div className="contact-console__topbar">
						<span>MESSAGE FORM</span>
					</div>

					<form className="contact-form" onSubmit={handleSubmit}>
						<label>
							<span>Name</span>
							<input
								type="text"
								name="name"
								autoComplete="name"
								value={form.name}
								onChange={(event) => updateField("name", event.target.value)}
								placeholder="Your name"
								required
							/>
						</label>

						<label>
							<span>Email</span>
							<input
								type="email"
								name="email"
								autoComplete="email"
								value={form.email}
								onChange={(event) => updateField("email", event.target.value)}
								placeholder="you@example.com"
								required
							/>
						</label>

						<label className="contact-form__subject">
							<span>Subject</span>
							<input
								type="text"
								name="subject"
								value={form.subject}
								onChange={(event) => updateField("subject", event.target.value)}
								placeholder="Project type or idea"
								required
							/>
						</label>

						<label className="contact-form__message">
							<span>Message</span>
							<textarea
								name="message"
								value={form.message}
								onChange={(event) => updateField("message", event.target.value)}
								placeholder="Tell me what you want to build."
								rows={6}
								required
							/>
						</label>

						<label className="contact-form__trap" aria-hidden="true">
							<span>Website</span>
							<input
								type="text"
								name="website"
								tabIndex={-1}
								autoComplete="off"
								value={form.website}
								onChange={(event) => updateField("website", event.target.value)}
							/>
						</label>

						<div className={`contact-terminal contact-terminal--${submitState.status}`} aria-live="polite">
							{submitState.status === "success" ? (
								<>
									<span>Message sent successfully.</span>
								</>
							) : submitState.status === "error" ? (
								<>
									<span>Message could not be sent.</span>
									<span>Please try again or use the email below.</span>
								</>
							) : submitState.status === "sending" ? (
								<span>Sending message...</span>
							) : (
								<span>Share a project, role, internship, or collaboration idea.</span>
							)}
						</div>

						<div className="contact-form__actions">
							<button type="submit" disabled={submitState.status === "sending"}>
								<span>{submitState.status === "sending" ? "Sending" : "Send Message"}</span>
								<span aria-hidden="true">+</span>
							</button>
							<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
						</div>
					</form>

					<div className="contact-console__channels" aria-label="Social channels">
						<a href={siteConfig.social.github} target="_blank" rel="noreferrer">GitHub</a>
						<a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
						<a href={siteConfig.social.upwork} target="_blank" rel="noreferrer">Upwork</a>
					</div>
				</div>
			</div>
		</section>
	);
}
