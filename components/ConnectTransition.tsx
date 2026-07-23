"use client";

import { useEffect, useRef } from "react";

const contourPaths = [
	"M18 270 C116 210 214 194 320 224 C424 254 500 254 610 204 C708 158 806 142 924 172 C1028 198 1110 188 1260 112",
	"M32 296 C138 226 238 214 342 242 C442 270 520 268 626 222 C730 178 824 162 936 190 C1042 216 1124 202 1266 136",
	"M48 322 C158 248 260 236 364 264 C462 290 542 288 646 244 C746 202 842 186 952 210 C1054 234 1136 222 1272 164",
	"M64 348 C180 272 284 260 388 286 C486 310 562 306 668 266 C768 226 858 210 970 234 C1068 254 1148 244 1274 194",
	"M82 374 C202 300 306 284 414 308 C510 330 588 326 692 286 C790 250 878 236 990 258 C1088 276 1164 268 1276 224",
	"M104 400 C224 328 330 310 440 330 C538 348 616 344 716 310 C814 276 904 260 1010 282 C1102 300 1176 294 1278 256",
	"M132 424 C248 354 354 338 468 352 C566 366 642 364 742 334 C838 304 928 286 1030 306 C1118 322 1192 320 1278 288",
	"M164 448 C274 384 382 366 500 374 C596 382 672 382 772 358 C864 334 954 316 1050 330 C1134 344 1206 350 1278 322",
	"M202 470 C310 416 414 396 532 400 C628 404 708 406 804 384 C890 364 982 348 1070 356 C1152 364 1220 382 1278 358",
	"M246 490 C350 448 456 424 568 424 C664 424 742 430 836 412 C922 396 1010 382 1092 388 C1168 394 1232 412 1278 394",
	"M294 508 C390 478 500 452 606 450 C700 448 778 456 870 442 C954 430 1036 420 1114 424 C1182 428 1238 444 1278 430",
	"M348 524 C436 506 542 480 642 478 C734 476 812 486 902 474 C982 464 1058 460 1132 464 C1196 468 1248 480 1278 468",
	"M270 372 C334 338 426 330 508 352 C590 374 646 364 722 324 C792 288 878 282 960 300",
	"M420 442 C506 408 594 404 680 428 C760 450 844 436 930 398 C1008 364 1090 360 1188 386",
	"M176 506 C260 468 346 462 442 482 C526 500 604 492 696 462 C784 434 864 430 946 448",
];

export default function ConnectTransition() {
	const sectionRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => el.classList.toggle("is-visible", entry.isIntersecting),
			{ threshold: 0.1 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<section ref={sectionRef} className="connect-transition" aria-labelledby="connect-transition-title">
			<div className="connect-transition__scene" aria-hidden="true">
				<svg viewBox="0 0 1280 620" preserveAspectRatio="none">
					{contourPaths.map((path, index) => (
						<path
							key={path}
							className={index > 11 ? "connect-transition__ridge" : undefined}
							d={path}
							style={{ animationDelay: `${index * 90}ms` }}
						/>
					))}
				</svg>
				<div className="connect-transition__node connect-transition__node--one" />
				<div className="connect-transition__node connect-transition__node--two" />
				<div className="connect-transition__node connect-transition__node--three" />
			</div>

			<h2 id="connect-transition-title" className="connect-transition__title">
				Let&apos;s connect.
			</h2>
		</section>
	);
}