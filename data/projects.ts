export type ProjectDomainClass = "domain-hazard" | "domain-flood" | "default";

export type ProjectLinkSet = {
  live?: string;
  github?: string;
  api?: string;
};

export type ProjectCaseStudy = {
  heroImage?: string;
  summary: string;
  role: string;
  outcome: string;
  highlights: string[];
  architecture: string[];
  gallery?: string[];
};

export type ProjectData = {
  slug: string;
  domain: string;
  domainClass: ProjectDomainClass;
  coordinates: {
    lat: number;
    lng: number;
  };
  place: string;
  name: string;
  description: string;
  tech: string[];
  miniMap: string;
  links?: ProjectLinkSet;
  team?: string;
  caseStudy?: ProjectCaseStudy;
};

export const projects: ProjectData[] = [
  {
    slug: "hazardmind",
    domain: "DISASTER / AI / MULTI-AGENT",
    domainClass: "domain-hazard",
    coordinates: { lat: 30.1798, lng: 66.975 },
    place: "GLOBAL HAZARD SYSTEM",
    name: "HazardMind AI",
    description:
      "5-agent disaster response pipeline built for the Band of Agents Hackathon. Real Sentinel-1/2 satellite imagery. A system honest enough to say I don't know.",
    tech: ["CLAUDE API", "POSTGIS", "FASTAPI", "SENTINEL-1/2", "BAND PROTOCOL"],
    miniMap: "Radial pulse rings in amber",
    links: {
      live: "https://www.hazardmindai.online/",
      github: "https://lnkd.in/dJ-V24wH",
    },
    team:
      "Built with Team GridForce. Hamza: Hazard Agent, geospatial risk logic, and satellite-informed hazard interpretation.",
    caseStudy: {
      heroImage: "/images/projects/hazardmind/hero.png",
      summary:
        "A multi-agent disaster intelligence system that turns a city-level hazard prompt into satellite-informed risk analysis, exposed-area estimates, and executive reporting.",
      role: "Hazard Agent engineering, geospatial risk logic, satellite-derived hazard interpretation, and system integration.",
      outcome:
        "Produced a complete disaster-response analysis pipeline in hackathon conditions, with live agent logs and downloadable outputs.",
      highlights: ["Multi-agent AI workflow", "Satellite and hazard analysis", "Executive risk report generation"],
      architecture: ["User prompt", "Satellite analysis", "Hazard scoring", "Impact estimation", "Report generation"],
    },
  },
  {
    slug: "routeiq",
    domain: "LOGISTICS / DSA / FULL-STACK GIS",
    domainClass: "default",
    coordinates: { lat: 33.6844, lng: 73.0479 },
    place: "GLOBAL ROUTING SYSTEM",
    name: "RouteIQ",
    description:
      "Full-stack GIS logistics dashboard simulating a delivery network with riders, deliveries, route assignment, and seven custom graph and sorting algorithms implemented from scratch in Python.",
    tech: ["REACT", "TYPESCRIPT", "FASTAPI", "POSTGRESQL", "MAPLIBRE GL", "PYTHON DSA"],
    miniMap: "Route optimization graph preview",
    links: {
      live: "https://routeiq-eight.vercel.app",
    },
    caseStudy: {
      heroImage: "/images/projects/routeiq/hero.png",
      summary:
        "A real-world logistics interface built to demonstrate Data Structures and Algorithms through GIS route optimization, rider dispatch, and algorithm benchmarking.",
      role: "Full-stack engineering across React, FastAPI, database models, API architecture, and pure-Python graph algorithm implementations.",
      outcome:
        "Implemented BFS, DFS, Dijkstra, A*, Greedy Nearest Neighbor, Held-Karp TSP DP, and Merge Sort without NetworkX or SciPy.",
      highlights: ["Seven algorithms from scratch", "MapLibre delivery dashboard", "FastAPI + PostgreSQL backend"],
      architecture: ["React dashboard", "FastAPI REST API", "PostgreSQL data layer", "Pure Python DSA engine", "Benchmark metrics"],
    },
  },
  {
    slug: "ipws",
    domain: "FLOOD / REALTIME / WMS",
    domainClass: "domain-flood",
    coordinates: { lat: 27.7052, lng: 68.8574 },
    place: "INDUS RIVER - SUKKUR, PK",
    name: "Indus Pulse Warning System",
    description:
      "Real-time flood early warning covering the 3,180km Indus River basin across 4 countries. Live WMS layers, WebGL visualisation, and sub-second map render performance.",
    tech: ["MAPBOX GL JS", "NODE.JS", "WMS", "REST APIs", "WEBGL"],
    miniMap: "Animated waveform in blue",
    links: {
      live: "https://ipws.netlify.app/",
    },
    caseStudy: {
      heroImage: "/images/projects/ipws/hero.png",
      summary:
        "A real-time flood monitoring dashboard for the Indus River basin, combining map layers, basin boundaries, alert views, and operational flood context.",
      role: "Frontend GIS implementation, map visualization, dashboard UI, and real-time geospatial workflow design.",
      outcome:
        "Created a basin-scale flood intelligence interface covering 3,180km of river network across four countries.",
      highlights: ["Real-time basin view", "Interactive flood layers", "Operational dashboard controls"],
      architecture: ["Map interface", "Basin overlays", "Alert panels", "Analytics views", "Admin controls"],
    },
  },
  {
    slug: "micro-flood-predictor",
    domain: "ML / FLOOD / WEBGL",
    domainClass: "domain-flood",
    coordinates: { lat: 30.3753, lng: 69.3451 },
    place: "PAKISTAN - MULTI-BASIN",
    name: "Micro Flood Predictor",
    description:
      "ML-powered flood risk prediction trained on 15 years of rainfall data. Animated WebGL heatmaps for hyperlocal coordinate-level spatial risk analysis and early warning.",
    tech: ["DECK.GL", "WEBGL", "TENSORFLOW", "PYTHON", "AUTOMATED ML"],
    miniMap: "Animated waveform in blue",
    caseStudy: {
      heroImage: "/images/projects/micro-flood-predictor/hero.png",
      summary:
        "A machine-learning flood risk interface that lets users inspect hyperlocal flood probability over mapped regions.",
      role: "ML-backed geospatial interface, map overlays, risk visualization, and dashboard interaction design.",
      outcome:
        "Presented coordinate-level flood risk through a map-first interface combining prediction markers, routes, and risk categories.",
      highlights: ["Automated ML workflow", "Flood-risk map layers", "Hyperlocal prediction UI"],
      architecture: ["Rainfall history", "ML model", "Risk scoring", "Map overlay", "User selection"],
    },
  },
  {
    slug: "solarvision-ai",
    domain: "ENERGY / DEEP LEARNING / SATELLITE",
    domainClass: "default",
    coordinates: { lat: 29.3544, lng: 71.7297 },
    place: "GLOBAL SOLAR ANALYSIS",
    name: "SolarVision AI",
    description:
      "Deep learning plus high-resolution satellite imagery for automated solar potential assessment and multi-criteria spatial site evaluation.",
    tech: ["TENSORFLOW", "ERDAS IMAGINE", "RASTERIO", "PYTHON", "QGIS"],
    miniMap: "Gradient sweep solar analysis",
    links: {
      live: "https://gisdeveloper-nust.github.io/solarvision-ai-/",
    },
    caseStudy: {
      heroImage: "/images/projects/solarvision-ai/hero.png",
      summary:
        "A solar analysis interface combining satellite imagery, location search, and configurable assumptions for site potential evaluation.",
      role: "Satellite map interface, analysis controls, location workflow, and solar-potential visualization.",
      outcome:
        "Created a client-friendly solar assessment surface that translates remote-sensing context into site-evaluation decisions.",
      highlights: ["Satellite-based assessment", "Search and quick locations", "Configurable solar assumptions"],
      architecture: ["Location search", "Satellite scene", "Panel assumptions", "Potential analysis", "Report-ready UI"],
    },
  },
  {
    slug: "kamchatka-earthquake",
    domain: "SEISMIC / REALTIME / GLOBAL",
    domainClass: "domain-hazard",
    coordinates: { lat: 56, lng: 160 },
    place: "KAMCHATKA, RUSSIA",
    name: "Kamchatka M8.8 Dashboard",
    description:
      "Real-time seismic damage assessment dashboard for the M8.8 event. Interactive fault layers, tsunami impact zones, and live USGS API integration.",
    tech: ["MAPBOX GL JS", "USGS API", "LIVE WFS", "WEBGL"],
    miniMap: "Expanding seismic impact rings",
    links: {
      live: "https://kodeezabdullah.github.io/kamchatka-earthquake/",
    },
    caseStudy: {
      heroImage: "/images/projects/kamchatka-earthquake/hero.png",
      summary:
        "A real-time seismic dashboard for the Kamchatka M8.8 earthquake, showing epicenter, impact rings, fault overlays, and emergency context.",
      role: "Map layer design, emergency dashboard UI, hazard overlays, and real-time event visualization.",
      outcome:
        "Converted seismic event data into an interactive response dashboard with damage and tsunami-impact context.",
      highlights: ["M8.8 event dashboard", "Impact zone overlays", "USGS-driven monitoring"],
      architecture: ["USGS event feed", "Fault layers", "Impact rings", "Damage panel", "Map controls"],
    },
  },
  {
    slug: "islamabad-market-analysis",
    domain: "BUSINESS / GIS / MARKET INTELLIGENCE",
    domainClass: "default",
    coordinates: { lat: 33.6844, lng: 73.0479 },
    place: "ISLAMABAD, PK",
    name: "Islamabad Market Analysis",
    description:
      "Business intelligence and market penetration dashboard for Islamabad, combining satellite map views, sector filters, support categories, and report-style summaries.",
    tech: ["GIS DASHBOARD", "SATELLITE VIEW", "BUSINESS ANALYSIS", "MAP UI"],
    miniMap: "Business POI analysis layer",
    links: {
      live: "https://business-analysis-islamabad.netlify.app/",
    },
    caseStudy: {
      heroImage: "/images/projects/islamabad-market-analysis/hero.png",
      summary:
        "A commercial GIS dashboard for market analysis, designed around business filters, satellite context, category summaries, and exportable insights.",
      role: "Dashboard design, map styling, filter logic, business category visualization, and client-facing analysis flow.",
      outcome:
        "Turned city-level business geography into an interactive decision interface for market and support analysis.",
      highlights: ["Satellite business map", "Market filters", "Export/share actions"],
      architecture: ["Business dataset", "Map styles", "Filter controls", "Category summaries", "Report export"],
    },
  },
  {
    slug: "weather-gis-dashboard",
    domain: "WEATHER / GIS / LIVE MAPPING",
    domainClass: "default",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    place: "GLOBAL CITY SEARCH",
    name: "Weather GIS Dashboard",
    description:
      "Live weather mapping interface with city search, map markers, current conditions, and forecast visualization.",
    tech: ["LEAFLET", "OPENWEATHER", "JAVASCRIPT", "CHARTS"],
    miniMap: "Weather marker dashboard",
    links: {
      live: "https://kodeezabdullah.github.io/Interactive-Weather-App-with-Live-Data-Mapping/",
    },
    caseStudy: {
      heroImage: "/images/projects/weather-gis-dashboard/hero.png",
      summary:
        "A lightweight GIS weather dashboard that combines live weather data, geocoded city search, map markers, and forecast charts.",
      role: "Map UI, weather data integration, forecast visualization, and dashboard layout.",
      outcome:
        "Built a practical live-data map application for exploring current weather and short-range forecasts by location.",
      highlights: ["Live weather data", "Searchable map", "Forecast chart"],
      architecture: ["City search", "Weather API", "Map marker", "Current weather panel", "Forecast chart"],
    },
  },
  {
    slug: "caregrid",
    domain: "HEALTH / AI / HACKATHON",
    domainClass: "default",
    coordinates: { lat: 28.6139, lng: 77.209 },
    place: "NEW DELHI - 34-STATE COVERAGE",
    name: "CareGrid India",
    description:
      "Agentic RAG intelligence over 10,000+ verified healthcare facility records across 34 Indian states. Shipped in 21 hours and placed 6th globally.",
    tech: ["FASTAPI", "REACT", "RAG PIPELINE", "POSTGIS", "MAPBOX"],
    miniMap: "Scattered health facility pattern",
    links: {
      live: "https://caregrid-frontend.vercel.app",
    },
    team: "Built with Team GridForce. Placed 6th globally.",
    caseStudy: {
      heroImage: "/images/projects/caregrid/hero.png",
      summary:
        "A healthcare-access intelligence system over verified facility data, built under hackathon constraints with agentic retrieval and geospatial querying.",
      role: "Geospatial data modeling, RAG workflow support, testing, and map-backed facility intelligence.",
      outcome:
        "Placed 6th globally with a system spanning 10,000+ healthcare facility records across 34 Indian states.",
      highlights: ["10,000+ facility records", "Agentic RAG workflow", "470+ automated tests"],
      architecture: ["Facility records", "Spatial search", "RAG pipeline", "API layer", "Frontend map"],
    },
  },
];

const featuredProjectSlugs = [
  "hazardmind",
  "caregrid",
  "routeiq",
  "ipws",
  "micro-flood-predictor",
  "solarvision-ai",
] as const;

export const featuredProjects = featuredProjectSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is ProjectData => Boolean(project));
