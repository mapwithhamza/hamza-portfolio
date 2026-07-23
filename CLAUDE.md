# CLAUDE.md — Muhammad Hamza Khan Geospatial Portfolio
**Single source of truth. Read this at the start of every session. Update the PROGRESS section as tasks complete.**

---

## 0. HOW TO USE THIS FILE

- Read this entire file before writing a single line of code
- Every decision in here is locked — do not redesign, do not simplify for convenience
- If you identify a better implementation that strengthens the original vision without changing its identity, state why before implementing it
- After completing any task, update the PROGRESS TRACKER at the bottom of this file
- Test everything before marking complete — no untested checkboxes

---

## 1. PROJECT IDENTITY

**Owner:** Muhammad Hamza Khan  
**Title:** Geospatial Systems Developer · WebGIS Engineer · Spatial AI  
**Email:** mhamzakhan.be24igis@gmail.com  
**Location:** Islamabad, Pakistan  
**University:** NUST — Institute of Geoinformatics (IGIS), 4th Semester, CGPA 3.48/4.00  

**Live URL (Vercel):** TBD — deploy to Vercel, no custom domain yet  
**Framework:** Next.js 14 (App Router)  
**Styling:** Tailwind CSS + CSS custom properties (no CSS-in-JS)  
**Animation:** GSAP + ScrollTrigger  
**Globe:** React Three Fiber (R3F) + Three.js — NOT canvas 2D, NOT Cesium  
**Contact Backend:** Resend API  
**Deployment:** Vercel  

---

## 2. CORE IMPRESSION

A recruiter opens this site and thinks:
> "A high-end, mature Lead Geospatial Engineer. The visual language relies on lit sculptural 3D objects, warm cinematic nighttime lighting, deep shadows, and buttery smooth GSAP transitions."

Every decision maps back to this. Premium engineering. Cinematic spatial intelligence. Mature restraint. High-end polish through lighting, motion, depth, and composition.

**Aesthetic references:** Lusion, Apple, Premium Architectural Visualization, Cinematic 3D.  
**NOT:** Terminal themes, hacker aesthetic, glowing green wireframes, monospace terminal text.

---

## 3. COLOR SYSTEM — DO NOT CHANGE

```css
:root {
  --bg-core: #080808; /* Deep cinematic void */
  --surface: #121212; /* Subtly elevated cards/plinths */
  --text-main: #F3F3F3; /* Crisp off-white */
  --text-muted: #8A8A8A; /* Elegant editorial gray */
  --accent-ambient: #C5A059; /* Warm cinematic street-light gold */
  --accent-sharp: #8B1A1A; /* Deep ruby/crimson for striking, minimal highlights */
  --ui-border: rgba(255, 255, 255, 0.06);
}
```

---

## 4. TYPOGRAPHY — DO NOT CHANGE

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display | Space Grotesk | 700/800 | All major headings, massive hero title, section titles |
| Body/UI | Inter | 300/400/500 | Bio text, project descriptions, all UI labels, navigation, tags, contact |

**Type rule:** NO monospace terminal fonts. For UI labels, tags, and data points, use Inter at 11px/12px, uppercase, with 2px letter-spacing, colored in `--text-muted`. This creates a sleek, high-end software look (like Linear or Vercel), not a command-line aesthetic. Display owns the big moments.

---

## 5. SITE ARCHITECTURE

```
/                          → Hero + Stats + About + Projects + Cartography + Mission Control + Contact + Footer
/projects/hazardmind       → HazardMind AI case study page
/projects/ipws             → IPWS case study page
/projects/caregrid         → CareGrid India case study page
/projects/kamchatka        → Kamchatka Earthquake Dashboard case study page
/projects/flood-predictor  → Micro Flood Predictor case study page
/projects/solar            → Solar Site Assessment case study page
/404                       → Custom 404 page
```

**Data files (required):**
```
/data/projects.ts          → All project data, typed
/data/skills.ts            → All skills data, typed
/data/site.ts              → Site config (name, URLs, availability toggle)
```

No hardcoded content in components. All content comes from data files.

---

## 6. GLOBAL CHROME (appears on every page)

- **Coordinate HUD** (fixed, bottom-center): A clean, minimalist frosted-glass pill (`backdrop-blur: 12px`, 1px solid `var(--ui-border)`, soft rounded edges, padding `8px 16px`). Displays `LAT 33.6844°N   LNG 73.0479°E`. Updates via smooth number scrubbing (no terminal character scrambling) as user scrolls through project cards.
- **Status Indicator** (integrated into nav): Subtle glowing gold dot (`var(--accent-ambient)`) + `Live Sync`. No aggressive terminal text.
- **Custom Cursor** (desktop only): Fluid, inverted-color magnetic dot. No green rings. The dot relies on smooth lerping (GSAP) and seamlessly snaps to/expands over interactable DOM elements to create a premium feel.
- **NO Brackets / NO Scanlines:** Keep the viewport completely free of "hacker" visual noise. The visual depth must come entirely from 3D lighting, shadows, and frosted glass overlays, not flat retro overlays.

---

## 7. NAVIGATION

**Structure:** Logo left | Nav links center | Status + CTA right  
**Logo:** `MH` + `K` (K in green) — Space Grotesk 800  
**Nav links:** WORK · SKILLS · ABOUT · CONTACT — JetBrains Mono, 11px, letter-spacing 2px  
**Status:** pulsing green dot + `AVAILABLE FOR FREELANCE`  
**CTA:** `HIRE ME →` — border button, green fill on hover  

**Mini globe in nav:**
- Hidden on load (width: 0, opacity: 0)
- Activates (slides in, 30×30px) after the hero scroll descent completes
- Same R3F renderer as hero globe, drastically simplified geometry
- Shows ISB pulse beacon
- Shares rotation direction with hero globe

**Nav behaviour:** Shrinks + gains backdrop blur after 80px scroll

---

## 8. CALIBRATION OVERLAY

Shown once per session (sessionStorage flag). Skip on `prefers-reduced-motion`.

Sequence:
1. `ESTABLISHING UPLINK...` fades in (150ms)
2. `LOCK: 33.6844°N  73.0479°E` fades in (650ms)
3. Progress bar fills over 1.6s (starts at 900ms)
4. `SYSTEMS ONLINE` fades in (2300ms)
5. Overlay fades out (2900ms)

Skip button always visible. Also skips on: any scroll, any keydown.

---

## 9. HERO SECTION

**Layout:** Two-column grid, 1fr / 1fr desktop. Stack on mobile (globe first, text below).

**Left column — text hierarchy:**
```
// GEOSPATIAL SYSTEMS DEVELOPER          ← mono, muted green
[ MUHAMMAD HAMZA KHAN ]                  ← mono, green, brackets in rgba(green, .3)
Building spatial                         ← Space Grotesk 800, 64px, white
systems that think.                      ← "think." in --green
WebGIS · GIS Analysis · AI-Powered Mapping  ← Inter, 15px, muted
```

**Proof line** (border-left treatment):
> "Top Rated on Upwork · 10+ GIS systems shipped · disaster-response AI to flood prediction · PostGIS, Mapbox & TensorFlow"

**Tags row:** MAPBOX GL JS · DECK.GL · POSTGIS · TENSORFLOW · QGIS · ARCGIS PRO · PYTHON · FASTAPI

**Buttons:**
- `VIEW WORK` → primary (green fill, dark text)
- `DOWNLOAD CV` → secondary (border, links to `/cv/hamza-khan-cv.pdf`)

**Right column — globe:** R3F globe, 560px height desktop, 360px mobile

**Globe HUD overlays:**
- Top left: `NODES: 6 / STATUS: LIVE`
- Top right: `SYNC: 0.3s` (updates randomly every 2.4s)
- Bottom right: `ORBIT ALT: 408km / ISB LOCK: CONFIRMED`

**Cursor coordinate:** On hero mousemove (desktop only), show `SCAN {lat}°N {lng}°E` next to cursor. Coordinate updates accurately based on mouse position relative to globe center.

**Scroll behaviour:** Hero text elements reveal staggered on load (GSAP, not scroll-triggered).

---

## 10. THE GLOBE — R3F SPECIFICATION

**Renderer:** React Three Fiber + Three.js. Dynamic import (`next/dynamic`, `ssr: false`). Show CSS spinner until canvas ready. Must not block LCP.

**Visual spec:**
- Custom GLSL atmosphere shader (thin green glow around sphere edge)
- Lat/lng grid lines — subtle, `rgba(74,222,128,.1)`
- NO country textures — too political
- ISB pulse beacon: 3 animated expanding rings at Islamabad coordinates (33.6844°N, 73.0479°E)
- Arc lines from ISB to 5 global nodes: New Zealand, UAE, USA, West Africa, India
- 4 orbiting satellites with trail particles (reduce to 2 on mobile)
- Mouse tilt parallax (desktop only): globe tilts slightly toward mouse position
- Continuous slow rotation

**Mobile optimisation:**
- Reduce satellite count to 2
- Disable arc animations (static lines only)
- Reduce grid density
- Globe stays visible — never hide it, it is the identity

**Nav mini globe:** Same R3F renderer, separate simplified scene. 30×30px canvas. Grid lines only + ISB beacon. Activates after hero descent.

---

## 11. HERO → STATS DESCENT (Cinematic Transition)

This is the single most important animation on the site. It happens ONCE on first scroll past the hero.

**GSAP ScrollTrigger sequence (pin hero):**
1. Globe scales up (scale: 2.4) + fades out
2. Hero text fades + moves up
3. Atmosphere flash: radial green/white gradient flashes at 0.32 → fades by 0.46
4. Background terrain brightens briefly
5. Stats section fades in, scales from 0.94 → 1

**After this transition:** Every section below behaves like a GIS layer loading. Subtle fade-up on scroll entry. No dramatic animations. No pinning. Smooth, professional, continuous.

**Reduced motion fallback:** No pinning, no cinematic transition. Sections simply appear on scroll. Globe renders but does not rotate.

---

## 12. STATS SECTION

**Eyebrow:** `GROUND TRUTH — ISLAMABAD LOCK CONFIRMED`

**4 stats with animated ring + counter:**

| Number | Label |
|--------|-------|
| 10+ | PROJECTS BUILT |
| 4 | DOMAINS |
| 3 | HACKATHONS |
| 2 | YRS BUILDING GIS |

SVG ring animates stroke-dashoffset from full to 0 when scrolled into view. Number counts up simultaneously.

---

## 13. ABOUT SECTION

**Section label:** `// OPERATOR PROFILE`  
**Section title:** `About`

**Layout:** Two column — photo left (0.85fr), text right (1.15fr)

**Photo (placeholder until real photo provided):**
- 3:4 aspect ratio
- CSS avatar: initials `MHK`, duotone green treatment
- Corner bracket SVGs (top-left, bottom-right)
- 1px border `rgba(green, .15)`
- Scanline texture overlay at low opacity
- No drop shadow
- Caption below: `SWAP PLACEHOLDER WITH REAL PHOTO →`
- When real photo is provided: apply CSS duotone filter (green tones), hover reveals full colour

**Heading:**
```
Student by semester.
Systems engineer by obsession.
```
("Systems engineer" in --green)

**Bio (use exactly this text):**
> I'm a Geoinformatics Engineering student at NUST IGIS, currently in my 4th semester, spending more time in QGIS and PostGIS than most people spend on their phones. My focus sits at the intersection of geospatial systems and AI — using satellite data, sensor feeds, and spatial databases to build tools that make sense of the physical world in real time. Ten-plus projects in, from disaster response pipelines to flood prediction systems, I care less about tutorials and more about systems that hold up under real data.

**Meta rows:**
- PROGRAM → Geoinformatics Engineering — NUST IGIS
- FOCUS → AI + GIS Systems
- BASED IN → Islamabad, Pakistan
- UPWORK → Top Rated

**Challenge note (amber border, amber label):**
```
// KNOWN LIMITATION
```
> "Mid-run on a live Sentinel-1 pass over Quetta, the Satellite Agent flagged 97.3% water coverage in an arid city — physically implausible. Nobody told it to doubt itself. Confidence dropped from 0.85 to 0.42 autonomously. Building a system honest enough to say 'I don't know' turned out to be harder than building one that's always confident."

---

## 14. PROJECTS SECTION

**Section label:** `FLIGHT LOG — SELECTED WORK`  
**Section title:** `Projects`  
**Layout:** 3-column grid desktop, 1-column mobile  

**Card behaviour:**
- 3D tilt on mousemove (perspective 1000px, rotateX/Y)
- Shine gradient follows mouse position (CSS custom property --mx, --my)
- Corner brackets appear on hover
- `VIEW PROJECT →` overlay slides up from bottom on hover
- Arrow (↗) in top-right translates on hover
- Click navigates to `/projects/[slug]`

**HUD continuity:** As user scrolls through cards, the coordinate HUD (bottom-left) updates to show each project's lat/lng with a brief scramble/flicker animation (GPS recalibrating effect). Transitions use a character-scramble effect, not a hard snap.

**Scroll progress indicator:** 1px green line across top of viewport fills as user scrolls down the page.

---

### PROJECT DATA

#### 01 — HazardMind AI
```
slug: hazardmind
domain: DISASTER · AI · MULTI-AGENT
domain-class: domain-hazard (amber)
coordinates: 30.1798°N, 66.9750°E
place: QUETTA, PK
name: HazardMind AI
description: 5-agent disaster response pipeline built for the Band of Agents Hackathon. Real Sentinel-1/2 satellite imagery. A system honest enough to say "I don't know." 142 seconds from city name to full executive risk report.
tech: CLAUDE API · POSTGIS · FASTAPI · SENTINEL-1/2 · BAND PROTOCOL
mini-map: Radial pulse rings in amber
links:
  live: https://hazardmindai.online
  github: https://lnkd.in/dJ-V24wH
team: Built with Team GridForce — Abdul Hanan (Impact Agent), Zohair Abidi (Report Agent + Frontend). Hamza: Hazard Agent.
```

#### 02 — Indus Pulse Warning System (IPWS)
```
slug: ipws
domain: FLOOD · REALTIME · WMS
domain-class: domain-flood (blue)
coordinates: 27.7052°N, 68.8574°E
place: INDUS RIVER — SUKKUR, PK
name: Indus Pulse Warning System
description: Real-time flood early warning covering the 3,180km Indus River basin across 4 countries. Live WMS layers, WebGL visualisation, sub-second map render performance.
tech: MAPBOX GL JS · NODE.JS · WMS · REST APIs · WEBGL
mini-map: Animated waveform in blue
```

#### 03 — CareGrid India
```
slug: caregrid
domain: HEALTH · AI · HACKATHON
domain-class: default (green)
coordinates: 28.6139°N, 77.2090°E
place: NEW DELHI — 34-STATE COVERAGE
name: CareGrid India
description: Agentic RAG intelligence over 10,000+ verified healthcare facility records across 34 Indian states. 470+ automated tests. Shipped in 21 hours at the Global Nation Hackathon. Placed 6th globally.
tech: FASTAPI · REACT · RAG PIPELINE · POSTGIS · MAPBOX
mini-map: Scattered dots pattern (health facilities)
team: Built with Team GridForce. Placed 6th globally.
```

#### 04 — Kamchatka Earthquake M8.8 Dashboard
```
slug: kamchatka
domain: SEISMIC · REALTIME · GLOBAL
domain-class: default (green)
coordinates: 56.0°N, 160.0°E
place: KAMCHATKA, RUSSIA
name: Kamchatka M8.8 Dashboard
description: Real-time seismic damage assessment dashboard for the M8.8 event. Interactive WFS fault layers, tsunami impact zones, live USGS API integration for emergency response.
tech: MAPBOX GL JS · USGS API · LIVE WFS · WEBGL
mini-map: Expanding rings (seismic)
```

#### 05 — Micro Flood Predictor
```
slug: flood-predictor
domain: ML · FLOOD · WEBGL
domain-class: domain-flood (blue)
coordinates: 30.3753°N, 69.3451°E
place: PAKISTAN — MULTI-BASIN
name: Micro Flood Predictor
description: ML-powered flood risk prediction trained on 15 years of rainfall data. Animated WebGL heatmaps for hyperlocal coordinate-level spatial risk analysis and early warning.
tech: DECK.GL · WEBGL · TENSORFLOW · PYTHON · AUTOMATED ML
mini-map: Animated waveform in blue
```

#### 06 — Solar Site Assessment
```
slug: solar
domain: ENERGY · DEEP LEARNING · SATELLITE
domain-class: default (green)
coordinates: 29.3544°N, 71.7297°E
place: BAHAWALPUR, PK
name: Solar Site Assessment
description: Deep learning + high-resolution satellite imagery for automated solar potential assessment. Multi-criteria spatial analysis for optimal site evaluation across southern Punjab.
tech: TENSORFLOW · ERDAS IMAGINE · RASTERIO · PYTHON · QGIS
mini-map: Gradient sweep (solar)
```

---

## 15. CARTOGRAPHY SECTION

**Section label:** `CARTOGRAPHY — STATIC WORK`  
**Section title:** `Maps`

**Layout:** Horizontal scroll strip of map thumbnails  
**Interaction:** Click opens lightbox (full-screen overlay, close on click or Escape)  
**State:** All placeholders for now — 4 placeholder cards with label `MAP COMING SOON`  
**Note:** When real map images are provided, drop them in `/public/maps/` and update `/data/maps.ts`

---

## 16. MISSION CONTROL — TECH STACK

**Section label:** `MISSION CONTROL`  
**Section title:** `Tech Stack`

**Layout:** Category groups with monospace category labels. Featured tiles (larger) for primary skills. Standard tiles for secondary.

**Tile behaviour:**
- Hover: border brightens to `rgba(green, .4)`, icon colour shifts to full green, glow pulse from bottom
- 3D tilt on mouse (same as project cards)
- Proficiency dots below name: `●●●○○` scale (never a percentage number)

**Categories and skills (from `/data/skills.ts`):**

```
// GEOSPATIAL
Featured: Mapbox GL JS (●●●●●), QGIS (●●●●●), PostGIS (●●●●○)
Standard: Deck.gl/WebGL, ArcGIS Pro, Leaflet.js, Remote Sensing, GeoServer, GDAL/Rasterio, OGC Standards

// DEVELOPMENT  
Featured: FastAPI/Python (●●●●○), React/Next.js (●●●○○)
Standard: Node.js/Express, PostgreSQL, JavaScript ES6+, REST APIs, Git/GitHub, Docker, CI/CD

// AI & ML
Featured: TensorFlow (●●●○○), Claude API (●●●●○), Agentic AI (●●●●○)
Standard: RAG Pipelines, GeoPandas, Automated ML, Spatial Data Pipelines, LLM Integration

// CLOUD & TOOLS
Standard: AWS, Vercel, Firebase, MongoDB, Netlify
```

Icons: SVG only. No emoji. No unicode characters.

---

## 17. CONTACT SECTION

**Section label:** `RETURNING TO BASE — ISLAMABAD`  
**Headline:** `Got a spatial problem?`  
**Sub:** `WebGIS platforms, GIS analysis, custom maps, AI-powered geospatial systems — let's build it.`

**Links (left column):**
- Upwork: https://www.upwork.com/freelancers/~01d691fcc7381c6645
- LinkedIn: https://www.linkedin.com/in/mhamzakhan007/
- GitHub: https://github.com/mapwithhamza
- Email: mhamzakhan.be24igis@gmail.com

All links must be real `<a href="">` tags. Not divs. Not spans.

**Terminal form (right column):**
```
// operator identity     → Name input
// signal endpoint       → Email input  
// transmission subject  → Subject input
// payload               → Message textarea
SEND_MESSAGE.execute() → Submit button
```

**Honeypot field:** Hidden input `name="website"` — if filled, silently discard submission.

**Backend:** Resend API. On submit → POST to `/api/contact` → Resend → mhamzakhan.be24igis@gmail.com

**Success state:** After send, terminal shows:
```
> TRANSMISSION COMPLETE
> MESSAGE DELIVERED — 2026-07-15T[timestamp]Z
> SIGNAL STRENGTH: OPTIMAL
```
Form fields clear. No page reload. Green text.

**Error state:** 
```
> ERROR: TRANSMISSION FAILED
> RETRY OR USE DIRECT SIGNAL BELOW
```

---

## 18. FOOTER

**Left:** `© 2026 MUHAMMAD HAMZA KHAN — GEOSPATIAL SYSTEMS DEVELOPER`  
**Right:** `ISLAMABAD, PK · NUST IGIS`  
**Social icons:** GitHub · LinkedIn · Upwork (all real hrefs)  
**Status:** pulsing dot + `Currently available for freelance work`  
**Border top:** `1px solid rgba(74,222,128,.08)`

---

## 19. CASE STUDY PAGES (`/projects/[slug]`)

Each case study page follows this structure:

```
1. Back link → ← BACK TO WORK
2. Project header (name, domain tag, coordinates, tech pills)
3. Problem — What problem does this solve?
4. Challenge — The real technical difficulty
5. Architecture — How it's built (diagram or text)
6. Tech Stack — Pills/tags
7. Results — Outcomes, numbers, impact
8. Lessons — What you learned
9. Gallery — Screenshots / map images (placeholder until provided)
10. Links — Live demo + GitHub (where available)
```

Same aesthetic as main site — dark background, monospace labels, green accents.

---

## 20. 404 PAGE

**Message:** `SIGNAL LOST — RETURNING TO BASE`  
**Sub:** Mono label + a link home  
**Aesthetic:** Same dark background, maybe a simplified globe or just the coordinate HUD  

---

## 21. PERFORMANCE REQUIREMENTS

- Three.js globe: dynamic import (`next/dynamic`, `ssr: false`). CSS spinner shown until canvas ready. Must not block LCP.
- Target LCP: under 2.5s on 4G
- Images: Next.js `<Image>` component for all images
- Fonts: `next/font` for Space Grotesk, Inter, JetBrains Mono — no external Google Fonts requests
- No layout shift from globe loading

---

## 22. SEO

```typescript
// app/layout.tsx metadata
export const metadata = {
  title: 'Muhammad Hamza Khan — Geospatial Systems Developer',
  description: 'WebGIS developer building AI-powered GIS platforms — disaster response, flood prediction, remote sensing. Based in Islamabad, Pakistan.',
  openGraph: {
    title: 'Muhammad Hamza Khan — Geospatial Systems Developer',
    description: 'WebGIS developer building AI-powered GIS platforms.',
    url: 'https://[vercel-url]',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
}
```

JSON-LD schema: Person type. Name, jobTitle, url, sameAs (GitHub, LinkedIn).  
OG image: Static 1200×630px. Generate with Satori or export from design. Shows globe + name + title.

---

## 23. ACCESSIBILITY

- All interactive elements keyboard-reachable (Tab order logical)
- Focus states: 2px solid `--green` outline, 3px offset — visible everywhere
- `prefers-reduced-motion`: all animations disabled, globe renders but does not rotate, no scroll pinning
- Touch devices: cursor hidden, tilt disabled, globe simplified
- Alt text on all images
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<footer>`, `<h1>`–`<h3>` hierarchy

---

## 24. SITE CONFIG FILE

```typescript
// data/site.ts
export const siteConfig = {
  name: 'Muhammad Hamza Khan',
  title: 'Geospatial Systems Developer',
  email: 'mhamzakhan.be24igis@gmail.com',
  location: 'Islamabad, Pakistan',
  coordinates: { lat: 33.6844, lng: 73.0479 },
  availableForWork: true, // flip this false when not available — redeploy to update
  cv: '/cv/hamza-khan-cv.pdf', // drop PDF into /public/cv/ folder
  social: {
    github: 'https://github.com/mapwithhamza',
    linkedin: 'https://www.linkedin.com/in/mhamzakhan007/',
    upwork: 'https://www.upwork.com/freelancers/~01d691fcc7381c6645',
  },
}
```

---

## 25. FOLDER STRUCTURE

```
/
├── app/
│   ├── layout.tsx              ← Root layout, metadata, fonts
│   ├── page.tsx                ← Home page (all sections)
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx        ← Case study page (dynamic)
│   ├── api/
│   │   └── contact/
│   │       └── route.ts        ← Resend email handler
│   └── not-found.tsx           ← 404 page
├── components/
│   ├── Globe.tsx               ← R3F globe (dynamic import)
│   ├── NavMiniGlobe.tsx        ← Simplified R3F nav globe
│   ├── CalibrationOverlay.tsx
│   ├── CustomCursor.tsx
│   ├── HeroSection.tsx
│   ├── StatsSection.tsx
│   ├── AboutSection.tsx
│   ├── ProjectsSection.tsx
│   ├── ProjectCard.tsx
│   ├── CartographySection.tsx
│   ├── MissionControl.tsx
│   ├── SkillTile.tsx
│   ├── ContactSection.tsx
│   ├── Footer.tsx
│   ├── CoordinateHUD.tsx
│   └── ScrollProgress.tsx
├── data/
│   ├── projects.ts
│   ├── skills.ts
│   ├── maps.ts
│   └── site.ts
├── public/
│   ├── cv/
│   │   └── hamza-khan-cv.pdf   ← DROP YOUR CV PDF HERE
│   ├── maps/                   ← Drop static map images here when ready
│   └── og-image.png
├── styles/
│   └── globals.css             ← CSS custom properties + base styles
└── CLAUDE.md                   ← This file
```

---

## 26. TESTING CHECKLIST (run before marking any task complete)

- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] No console errors in browser
- [ ] Globe loads without blocking page (check Network tab — LCP not blocked)
- [ ] All links are real `<a href="">` tags, not divs
- [ ] Mobile layout correct at 375px width
- [ ] Desktop layout correct at 1440px width
- [ ] Keyboard navigation works (tab through everything)
- [ ] `prefers-reduced-motion` respected (test in browser DevTools)
- [ ] Contact form submits and shows success state
- [ ] Coordinate HUD updates on project card scroll with scramble effect
- [ ] Calibration overlay shows once, not again on refresh (sessionStorage)
- [ ] CV download link works (file exists at `/public/cv/hamza-khan-cv.pdf`)
- [ ] No hardcoded content in components (all from data files)
- [ ] 404 page exists and renders correctly

---

## 27. PROGRESS TRACKER

Update this section as tasks are completed. Format: `[x] Task — completed DATE`

### Phase 1 — Project Setup
- [x] Next.js 14 project initialised with App Router — completed 2026-07-15
- [x] Tailwind CSS configured with CSS custom properties — completed 2026-07-15
- [x] Fonts configured (Space Grotesk, Inter, JetBrains Mono via next/font) — completed 2026-07-15
- [x] CSS custom properties (color system) in globals.css — completed 2026-07-15
- [x] Folder structure created — completed 2026-07-15
- [x] Data files created (projects.ts, skills.ts, site.ts, maps.ts) — completed 2026-07-15
- [x] CLAUDE.md copied into project root — completed 2026-07-15

### Phase 2 — Global Chrome
- [x] Calibration overlay component — completed 2026-07-15
- [x] Custom cursor component (desktop only) — completed 2026-07-15
- [x] Corner brackets (fixed, 4 corners) — completed 2026-07-15
- [x] Scanline overlay — completed 2026-07-15
- [x] Coordinate HUD with scramble transition — completed 2026-07-15
- [x] Status bar (bottom right) — completed 2026-07-15
- [x] Scroll progress indicator (1px top line) — completed 2026-07-15
- [x] Navigation bar (with shrink behaviour) — completed 2026-07-15

### Phase 3 — Hero Section
- [x] R3F Globe component (dynamic import, no SSR) — completed 2026-07-15
- [x] Globe: atmosphere shader — completed 2026-07-15
- [x] Globe: grid lines — completed 2026-07-15
- [x] Globe: ISB pulse beacon — completed 2026-07-15
- [x] Globe: arc lines to 5 nodes — completed 2026-07-15
- [x] Globe: satellite trails (4 desktop, 2 mobile) — completed 2026-07-15
- [x] Globe: mouse tilt parallax — completed 2026-07-15
- [ ] Nav mini globe component
- [x] Hero layout (two column) — completed 2026-07-15
- [x] Hero text with staggered GSAP reveal — completed 2026-07-15
- [x] Cursor coordinate display on hero hover — completed 2026-07-15
- [ ] Hero → Stats cinematic descent (GSAP ScrollTrigger)

### Phase 4 — Stats Section
- [x] 4 stat cards with SVG rings â€” completed 2026-07-16
- [x] Animated ring + counter on scroll into view â€” completed 2026-07-16

### Phase 5 — About Section
- [x] Photo placeholder (CSS avatar, corner brackets, scanline) â€” completed 2026-07-16
- [x] Bio text â€” completed 2026-07-16
- [x] Meta rows â€” completed 2026-07-16
- [x] Challenge note (amber styling) â€” completed 2026-07-16

### Phase 6 — Projects Section
- [x] 6 project cards from data file â€” completed 2026-07-16
- [x] Card tilt + shine effect â€” completed 2026-07-16
- [x] Mini-map canvas animations (domain-specific) â€” completed 2026-07-16
- [x] Coordinate HUD update on scroll â€” completed 2026-07-16
- [x] Card links to case study pages â€” completed 2026-07-16

### Phase 7 — Cartography Section
- [ ] Horizontal scroll strip
- [ ] 4 placeholder cards
- [ ] Lightbox component

### Phase 8 — Mission Control
- [x] Skill tiles from data file — completed 2026-07-16
- [x] Featured + standard tile sizes — completed 2026-07-16
- [x] Tile hover (glow, tilt, icon colour) — completed 2026-07-16
- [x] Proficiency dots — completed 2026-07-16

### Phase 9 — Contact Section
- [ ] Terminal UI layout
- [ ] Form inputs + textarea
- [ ] Resend API route (`/api/contact`)
- [ ] Honeypot field
- [ ] Success state
- [ ] Error state
- [ ] Real social links

### Phase 10 — Footer + SEO
- [ ] Footer layout
- [ ] JSON-LD schema
- [ ] Next.js metadata API
- [ ] OG image

### Phase 11 — Case Study Pages
- [ ] Dynamic route `/projects/[slug]`
- [ ] Case study layout component
- [ ] All 6 projects populated

### Phase 12 — 404 + Polish
- [ ] Custom 404 page
- [ ] Full accessibility audit
- [ ] Performance audit (LCP, no layout shift)
- [ ] prefers-reduced-motion audit
- [ ] Final cross-browser check (Chrome, Firefox, Safari)

### Phase 13 — Deployment
- [ ] Vercel project created
- [ ] Environment variables set (RESEND_API_KEY)
- [ ] Production deploy
- [ ] All links tested on live URL

---

*Last updated: 2026-07-15 — Phase 1 foundation completed*
*Next session: Start with Phase 3 — Hero Section*
