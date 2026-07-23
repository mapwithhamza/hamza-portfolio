const fs = require("fs");
const path = require("path");
const icons = require("simple-icons");

const out = path.join(process.cwd(), "public", "logos", "stack");

const iconMap = {
	"mapbox.svg": "siMapbox",
	"qgis.svg": "siQgis",
	"postgis.svg": "siPostgresql",
	"deck-webgl.svg": "siWebgl",
	"arcgis.svg": "siArcgis",
	"leaflet.svg": "siLeaflet",
	"remote-sensing.svg": "siOsgeo",
	"geoserver.svg": "siOsgeo",
	"gdal-rasterio.svg": "siGdal",
	"ogc-standards.svg": "siMaplibre",
	"fastapi-python.svg": "siFastapi",
	"react-next.svg": "siReact",
	"node-express.svg": "siNodedotjs",
	"postgresql.svg": "siPostgresql",
	"javascript.svg": "siJavascript",
	"rest-apis.svg": "siOpenapiinitiative",
	"git-github.svg": "siGithub",
	"docker.svg": "siDocker",
	"ci-cd.svg": "siGithubactions",
	"tensorflow.svg": "siTensorflow",
	"claude.svg": "siClaude",
	"agentic-ai.svg": "siAnthropic",
	"geopandas.svg": "siGeopandas",
	"automated-ml.svg": "siTensorflow",
	"spatial-data-pipelines.svg": "siApacheairflow",
	"llm-integration.svg": "siAnthropic",
	"vercel.svg": "siVercel",
	"firebase.svg": "siFirebase",
	"mongodb.svg": "siMongodb",
	"netlify.svg": "siNetlify",
};

const fallbackHex = {
	siAmazonwebservices: "FF9900",
	siApacheairflow: "017CEE",
	siOpenai: "FFFFFF",
};

const escapeText = (value) =>
	value.replace(/[&<>"]/g, (char) => {
		const entities = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
		};
		return entities[char];
	});

fs.mkdirSync(out, { recursive: true });

for (const [file, key] of Object.entries(iconMap)) {
	const icon = icons[key];

	if (!icon) {
		console.log(`missing ${file} ${key}`);
		continue;
	}

	const hex = icon.hex || fallbackHex[key] || "C5A059";
	const svg = `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>${escapeText(
		icon.title,
	)}</title><path fill="#${hex}" d="${icon.path}"/></svg>\n`;

	fs.writeFileSync(path.join(out, file), svg, "utf8");
	console.log(`${file}\t${icon.title}\t#${hex}`);
}

const customIcons = {
	"aws.svg": `<svg role="img" viewBox="0 0 120 72" xmlns="http://www.w3.org/2000/svg"><title>AWS</title><path fill="#FF9900" d="M85.2 52.8c-13.4 8.9-32.8 13.6-49.5 7.4-2.4-.9-1.3-4.4 1.2-3.8 15.4 3.7 31.7.7 45.8-7.9 2.2-1.3 4.7 2.8 2.5 4.3Z"/><path fill="#FF9900" d="M88.7 48.8c-1.7-2.2-11.3-1-15.6-.5-1.3.2-1.5-1-.3-1.8 7.8-5.5 20.6-3.9 22.1-2.1 1.5 1.9-.4 14.7-7.7 20.8-1.1.9-2.2.4-1.7-.8 1.6-4.1 4.8-13.4 3.2-15.6Z"/><text x="16" y="40" fill="#FFFFFF" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="800" letter-spacing="-2">AWS</text></svg>\n`,
	"rag-pipelines.svg": `<svg role="img" viewBox="0 0 120 72" xmlns="http://www.w3.org/2000/svg"><title>RAG Pipelines</title><circle cx="39" cy="34" r="17" fill="none" stroke="#C5A059" stroke-width="7"/><path d="M52 47l18 15" stroke="#C5A059" stroke-width="8" stroke-linecap="round"/><path d="M72 18h24M72 34h18M72 50h14" stroke="#FFFFFF" stroke-opacity=".86" stroke-width="6" stroke-linecap="round"/></svg>\n`,
};

for (const [file, svg] of Object.entries(customIcons)) {
	fs.writeFileSync(path.join(out, file), svg, "utf8");
	console.log(`${file}\tcustom`);
}

const iconPath = (icon, x, y, size, fill) =>
	`<path fill="${fill}" transform="translate(${x} ${y}) scale(${size / 24})" d="${icon.path}"/>`;

const compositeIcons = {
	"fastapi-python.svg": [icons.siFastapi, icons.siPython],
	"react-next.svg": [icons.siReact, icons.siNextdotjs],
	"node-express.svg": [icons.siNodedotjs, icons.siExpress],
	"git-github.svg": [icons.siGit, icons.siGithub],
};

for (const [file, pair] of Object.entries(compositeIcons)) {
	const [left, right] = pair;

	if (!left || !right) {
		continue;
	}

	const svg = `<svg role="img" viewBox="0 0 54 28" xmlns="http://www.w3.org/2000/svg"><title>${escapeText(
		`${left.title} / ${right.title}`,
	)}</title>${iconPath(left, 2, 2, 24, `#${left.hex}`)}${iconPath(
		right,
		28,
		2,
		24,
		`#${right.hex}`,
	)}</svg>\n`;

	fs.writeFileSync(path.join(out, file), svg, "utf8");
	console.log(`${file}\tcomposite`);
}
