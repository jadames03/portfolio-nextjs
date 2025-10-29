import { prisma } from "../lib/prisma";
import { ProjectCard } from "../components/ProjectCard";
import { Tabs } from "../components/Tabs";
import { EmptyState } from "../components/EmptyState";
import wordmark from "../public/icons/wordmark.svg";
import { Cursor } from "../components/BlinkingCursor";

const PROJECT_TABS = [
  { label: "All", value: "all" },
  { label: "Development", value: "development" },
  { label: "Design", value: "design" },
  { label: "AI", value: "ai" }
];

type HomePageProps = {
  searchParams?: {
    tag?: string;
  };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const activeTag = (searchParams?.tag ?? "all").toLowerCase();
  const currentYear = new Date().getFullYear();

  const projects = await prisma.project.findMany({
    where:
      activeTag === "all"
        ? {}
        : {
            tags: {
              some: {
                slug: activeTag
              }
            }
          },
    include: {
      tags: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="container space-y-10 py-16">
      <header className="space-y-4">
        <div className="flex justify-center sm:justify-start">
          <div className="inline-flex items-end gap-2 rounded-xl border border-slate-800 bg-panel px-5 py-5 shadow-lg shadow-slate-950/40 max-w-full">
            <img
              src={wordmark.src}
              alt="Wordmark"
              className="block w-52 h-8 sm:w-auto sm:h-12"
            />
            <Cursor />
          </div>
        </div>
        <h1 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
          Featured Projects
        </h1>
        <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
          Explore recent work across development, design, and AI. Use the filters to narrow the view.
        </p>
      </header>

      <Tabs tabs={PROJECT_TABS} paramKey="tag" />

      {projects.length ? (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No projects yet"
          description="Projects you add in the admin area will appear here."
        />
      )}
      <footer className="mt-16 border-t border-slate-900/60 pt-6 text-xs text-slate-400 sm:text-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-slate-200">
            &copy; {currentYear} madebyadames.dev
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="mailto:adamesj03@gmail.com"
              className="transition-colors hover:text-slate-100"
            >
              adamesj03@gmail.com
            </a>
            <div className="flex gap-4 text-slate-500">
              <a
                href="https://github.com/jadames03"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-slate-100"
                aria-label="GitHub"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 496 512"
                  aria-hidden="true"
                  focusable="false"
                  fill="currentColor"
                >
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244 8C106.8 8 0 114.6 0 251.6c0 107.5 69.8 198.7 166.4 231 12.1 2.3 16.6-5.2 16.6-11.6 0-5.6-.3-37.4-.3-57.1 0 0-67.7 14.6-81.9-29.3 0 0-10.8-27.4-26.3-34.6 0 0-21.7-14.9 1.6-14.6 0 0 23.5 1.6 36.6 24.6 20.8 36.6 55.6 26.1 69.2 19.9 2.3-15.2 8.2-26.1 14.9-32.1-53.9-6.2-110.5-13.5-110.5-104.5 0-26.1 7.2-39.3 22.6-55.9-2.6-6.9-11.6-35.2 2.6-73.4 21.7-6.9 71.4 27.4 71.4 27.4 20.8-5.9 43-8.9 65.2-8.9s44.4 3 65.2 8.9c0 0 49.7-34.3 71.4-27.4 14.2 38.1 5.2 66.4 2.6 73.4 15.4 16.6 24.6 29.8 24.6 55.9 0 91.4-56.9 98.4-110.8 104.5 8.5 7.5 15.9 21.7 15.9 43.7 0 31.7-.3 71.4-.3 81.4 0 6.4 4.3 13.9 16.6 11.6C426.2 450.3 496 359.1 496 251.6 496 114.6 383.2 8 244 8z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/justinadames/"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-slate-100"
                aria-label="LinkedIn"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 448 512"
                  aria-hidden="true"
                  focusable="false"
                  fill="currentColor"
                >
                  <path d="M100.28 448H7.4V148.9h92.88zm-46.44-341C24.09 107 0 82.7 0 53.5A53.5 53.5 0 0 1 53.79 0a53.5 53.5 0 1 1 0 107zm394.34 341h-92.68V302.4c0-34.7-.7-79.2-48.23-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.69V148.9h88.99v40.8h1.3c12.4-23.5 42.7-48.3 87.86-48.3 94 0 111.36 61.9 111.36 142.3z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

