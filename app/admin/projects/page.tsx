import { prisma } from "../../../lib/prisma";
import { AdminProjectTable } from "../../../components/AdminProjectTable";
import { EmptyState } from "../../../components/EmptyState";
import Link from "next/link";
import { Plus } from "lucide-react";

type AdminProjectsPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function AdminProjectsPage({ searchParams }: AdminProjectsPageProps) {
  const query = searchParams?.q?.toString().trim();

  const projects = await prisma.project.findMany({
    where: query
      ? {
          title: {
            contains: query,
            mode: "insensitive"
          }
        }
      : undefined,
    include: {
      tags: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const serialisedProjects = projects.map((project) => ({
    ...project,
    createdAt: project.createdAt.toISOString()
  }));

  if (!projects.length) {
    return (
      <EmptyState
        title="No projects yet"
        description="Create your first project to populate the portfolio."
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:bg-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <Plus className="h-4 w-4" aria-hidden />
            New project
          </Link>
        }
      />
    );
  }

  return <AdminProjectTable projects={serialisedProjects} initialQuery={query ?? ""} />;
}
