export type SkillEntry = {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
};

export type SkillCategory = {
  key: string;
  label: string;
  featured: SkillEntry[];
  standard: SkillEntry[];
};

export const skillCategories: SkillCategory[] = [
  {
    key: "geospatial",
    label: "GIS / REMOTE SENSING",
    featured: [
      { name: "Mapbox GL JS", rating: 5 },
      { name: "QGIS", rating: 5 },
      { name: "PostGIS", rating: 4 },
      { name: "Remote Sensing", rating: 4 },
    ],
    standard: [
      { name: "Deck.gl/WebGL", rating: 3 },
      { name: "ArcGIS Pro", rating: 3 },
      { name: "Leaflet.js", rating: 3 },
      { name: "GeoServer", rating: 3 },
      { name: "GDAL/Rasterio", rating: 3 },
      { name: "OGC Standards", rating: 3 },
    ],
  },
  {
    key: "development",
    label: "WEB DEVELOPMENT",
    featured: [
      { name: "FastAPI/Python", rating: 4 },
      { name: "React/Next.js", rating: 3 },
    ],
    standard: [
      { name: "Node.js/Express", rating: 3 },
      { name: "PostgreSQL", rating: 3 },
      { name: "JavaScript ES6+", rating: 3 },
      { name: "REST APIs", rating: 3 },
      { name: "Swift SDK", rating: 2 },
      { name: "Git/GitHub", rating: 3 },
      { name: "Docker", rating: 2 },
      { name: "CI/CD", rating: 2 },
    ],
  },
  {
    key: "ai-ml",
    label: "AI / DATA",
    featured: [
      { name: "TensorFlow", rating: 3 },
      { name: "Claude API", rating: 4 },
      { name: "Agentic AI", rating: 4 },
    ],
    standard: [
      { name: "RAG Pipelines", rating: 3 },
      { name: "GeoPandas", rating: 3 },
      { name: "OpenCV", rating: 3 },
      { name: "Automated ML", rating: 3 },
      { name: "Spatial Data Pipelines", rating: 3 },
      { name: "LLM Integration", rating: 3 },
    ],
  },
  {
    key: "cloud-tools",
    label: "CLOUD & TOOLS",
    featured: [],
    standard: [
      { name: "AWS", rating: 2 },
      { name: "Vercel", rating: 2 },
      { name: "Firebase", rating: 2 },
      { name: "MongoDB", rating: 2 },
      { name: "Netlify", rating: 2 },
    ],
  },
];
