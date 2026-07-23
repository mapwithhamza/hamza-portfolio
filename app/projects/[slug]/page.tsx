import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);

  if (index === -1) {
    return projects[0];
  }

  return projects[(index + 1) % projects.length];
}

function getPreviousProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);

  if (index === -1) {
    return projects[projects.length - 1];
  }

  return projects[(index - 1 + projects.length) % projects.length];
}

function CaseStudyPlaceholder() {
  return (
    <div className="case-study-placeholder" aria-hidden="true">
      <svg viewBox="0 0 980 520" preserveAspectRatio="none">
        <g className="case-study-placeholder__grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <path key={`v-${index}`} d={`M${index * 90} 0V520`} />
          ))}
          {Array.from({ length: 8 }).map((_, index) => (
            <path key={`h-${index}`} d={`M0 ${index * 74}H980`} />
          ))}
        </g>
        <g className="case-study-placeholder__lines">
          <path d="M-20 362C118 276 250 282 382 354C536 438 650 388 782 282C882 202 960 188 1000 218" />
          <path d="M40 410C180 336 318 346 452 404C602 470 732 420 862 334C930 290 974 280 1000 292" />
          <path d="M90 278C210 186 344 194 466 274C604 364 718 304 844 202C918 142 970 136 1000 150" />
        </g>
        <g className="case-study-placeholder__route">
          <path d="M102 386C244 232 392 240 526 330C666 424 778 314 902 162" />
        </g>
        <g className="case-study-placeholder__nodes">
          <circle cx="102" cy="386" r="7" />
          <circle cx="526" cy="330" r="7" />
          <circle cx="902" cy="162" r="7" />
        </g>
      </svg>
    </div>
  );
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProject(params.slug);

  if (!project) {
    notFound();
  }

  const caseStudy = project.caseStudy;
  const nextProject = getNextProject(project.slug);
  const previousProject = getPreviousProject(project.slug);
  const hasProjectActions = Boolean(project.links?.live || project.links?.github);

  return (
    <main className="case-study">
      <section className="case-study-hero">
        <div className="case-study-shell">
          <div className="case-study-topbar">
            <Link href="/#work" className="case-study-back">
              <span aria-hidden="true">←</span>
              <span>Back to Work</span>
            </Link>

            <div className="case-study-topbar__nav" aria-label="Project navigation">
              <Link href={`/projects/${previousProject.slug}`}>Previous</Link>
              <Link href={`/projects/${nextProject.slug}`}>Next</Link>
            </div>
          </div>

          <div className="case-study-hero__grid">
            <div className="case-study-hero__copy">
              <div className="case-study-label">{project.domain}</div>
              <h1>{project.name}</h1>
              <p>{caseStudy?.summary ?? project.description}</p>
            </div>

            <div className="case-study-facts" aria-label="Project facts">
              <div>
                <span>Location</span>
                <strong>{project.place}</strong>
              </div>
              <div>
                <span>Role</span>
                <strong>{caseStudy?.role ?? "GIS systems engineering and interface design."}</strong>
              </div>
              <div>
                <span>Outcome</span>
                <strong>{caseStudy?.outcome ?? project.description}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="case-study-media">
        <div className="case-study-shell">
          <div className="case-study-screen">
            {caseStudy?.heroImage ? (
              <Image
                src={caseStudy.heroImage}
                alt={`${project.name} interface screenshot`}
                fill
                priority
                sizes="(max-width: 1100px) 94vw, 1120px"
              />
            ) : (
              <CaseStudyPlaceholder />
            )}
          </div>

          {hasProjectActions ? (
            <div className="case-study-actions" aria-label="Project links">
              {project.links?.live ? (
                <a className="case-study-action case-study-action--primary" href={project.links.live} target="_blank" rel="noreferrer">
                  Live Demo
                </a>
              ) : null}
              {project.links?.github ? (
                <a className="case-study-action" href={project.links.github} target="_blank" rel="noreferrer">
                  Source / Notes
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <section className="case-study-body">
        <div className="case-study-shell case-study-body__grid">
          <div className="case-study-panel">
            <h2>Project Brief</h2>
            <p>{project.description}</p>
            {project.team ? <p>{project.team}</p> : null}
          </div>

          <div className="case-study-panel">
            <h2>Highlights</h2>
            <ul>
              {(caseStudy?.highlights ?? project.tech.slice(0, 3)).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="case-study-panel">
            <h2>Architecture</h2>
            <div className="case-study-steps">
              {(caseStudy?.architecture ?? project.tech).map((item, index) => (
                <div key={item} className="case-study-step">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="case-study-panel">
            <h2>Stack</h2>
            <div className="case-study-tech">
              {project.tech.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>

          </div>
        </div>
      </section>

      <section className="case-study-next">
        <div className="case-study-shell case-study-next__grid">
          <Link href={`/projects/${previousProject.slug}`}>
            <span>Previous Project</span>
            <strong>{previousProject.name}</strong>
          </Link>
          <Link href="/#work" className="case-study-next__home">
            <span>Portfolio</span>
            <strong>Back to Work</strong>
          </Link>
          <Link href={`/projects/${nextProject.slug}`}>
            <span>Next Project</span>
            <strong>{nextProject.name}</strong>
          </Link>
        </div>
      </section>
    </main>
  );
}
