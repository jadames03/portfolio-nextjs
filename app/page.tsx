import { prisma } from "../lib/prisma";
import { ProjectCard } from "../components/ProjectCard";
import { Tabs } from "../components/Tabs";
import { EmptyState } from "../components/EmptyState";

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
    </div>
  );
}
