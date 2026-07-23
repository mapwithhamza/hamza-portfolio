export type SiteConfig = {
  name: string;
  title: string;
  email: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  availableForWork: boolean;
  cv: string;
  social: {
    github: string;
    linkedin: string;
    upwork: string;
  };
  hero: {
    eyebrow: string;
    bracketedName: string;
    headlineStart: string;
    headlineEnd: string;
    subheadline: string;
    proofLine: string;
    tags: string[];
    buttons: {
      primary: string;
      secondary: string;
    };
    hud: {
      nodesLabel: string;
      syncPrefix: string;
      orbitLabel: string;
    };
    cursorTemplate: string;
  };
  stats: {
    eyebrow: string;
    items: Array<{
      value: string;
      label: string;
    }>;
  };
  about: {
    sectionLabel: string;
    sectionTitle: string;
    initials: string;
    photoCaption: string;
    headingStart: string;
    headingHighlight: string;
    headingEnd: string;
    bio: string;
    meta: Array<{
      label: string;
      value: string;
    }>;
    challenge: {
      label: string;
      text: string;
    };
  };
  globe: {
    heightDesktop: number;
    heightMobile: number;
    isb: {
      lat: number;
      lng: number;
      label: string;
    };
    nodes: Array<{
      name: string;
      lat: number;
      lng: number;
    }>;
  };
};

export const siteConfig: SiteConfig = {
  name: "Muhammad Hamza Khan",
  title: "Software Developer",
  email: "hamzakhan.gis.dev@gmail.com",
  location: "Islamabad, Pakistan",
  coordinates: {
    lat: 33.6844,
    lng: 73.0479,
  },
  availableForWork: true,
  cv: "/cv/hamza-khan-cv.pdf",
  hero: {
    eyebrow: "GEOSPATIAL SYSTEMS DEVELOPER",
    bracketedName: "MUHAMMAD HAMZA KHAN",
    headlineStart: "I build software that solves real problems,",
    headlineEnd: "from spatial systems to full-stack apps.",
    subheadline: "",
    proofLine: "",
    tags: [
      "REACT",
      "NEXT.JS",
      "PYTHON",
      "POSTGIS",
      "MAPBOX",
      "QGIS",
      "GDAL",
      "REST APIS",
    ],
    buttons: { primary: "VIEW PROJECTS", secondary: "DOWNLOAD RESUME" },
    hud: {
      nodesLabel: "NODES: 6 / STATUS: LIVE",
      syncPrefix: "SYNC:",
      orbitLabel: "ORBIT ALT: 408km / ISB LOCK: CONFIRMED",
    },
    cursorTemplate: "SCAN {lat}N {lng}E",
  },
  stats: {
    eyebrow: "WHERE I'M AT",
    items: [
      { value: "NUST IGIS", label: "BE GEOINFORMATICS ENG." },
      { value: "AI Intern", label: "SPS TECHNOLOGIES" },
      { value: "10+ Builds", label: "APPS, DASHBOARDS, TOOLS" },
      { value: "3 Hackathons", label: "TEAM-BASED BUILDS" },
    ],
  },
  about: {
    sectionLabel: "// ABOUT",
    sectionTitle: "About",
    initials: "MHK",
    photoCaption: "Muhammad Hamza Khan",
    headingStart: "From maps",
    headingHighlight: "to working software.",
    headingEnd: "",
    bio: "I started with geoinformatics: maps, coordinates, satellite imagery, and the way real places turn into usable data.\n\nAt NUST IGIS, that moved into software. I began building dashboards, routing tools, AI-assisted systems, and map-based interfaces instead of only analyzing data inside GIS software.\n\nMy work now sits between full-stack development, GIS, remote sensing, and practical automation. Some projects are deeply spatial; others are normal web apps. The point is to choose what the problem needs.\n\nI work well in teams. I ask questions early, communicate clearly, and keep collaborators in the loop without being asked. Good process matters to me as much as the output.",
    meta: [
      { label: "PROGRAM", value: "Geoinformatics Engineering - NUST IGIS" },
      { label: "FOCUS", value: "Software + GIS + Remote Sensing" },
      { label: "BASED IN", value: "Islamabad, Pakistan" },
      { label: "EXPERIENCE", value: "Completed AI Internship - SPS Technologies" },
    ],
    challenge: {
      label: "",
      text: "",
    },
  },
  globe: {
    heightDesktop: 560,
    heightMobile: 360,
    isb: {
      lat: 33.6844,
      lng: 73.0479,
      label: "ISLAMABAD",
    },
    nodes: [
      { name: "NEW ZEALAND", lat: -40, lng: 174 },
      { name: "UAE", lat: 24, lng: 54 },
      { name: "USA", lat: 38, lng: -97 },
      { name: "WEST AFRICA", lat: 9, lng: -4 },
      { name: "INDIA", lat: 22, lng: 78 },
    ],
  },
  social: {
    github: "https://github.com/mapwithhamza",
    linkedin: "https://www.linkedin.com/in/mhamzakhan007/",
    upwork: "https://www.upwork.com/freelancers/~01d691fcc7381c6645",
  },
};
