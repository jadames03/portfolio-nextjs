"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { dispatchToast, formatDate } from "../lib/utils";

type AdminProject = {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  createdAt: string;
  projectUrl: string | null;
  tags: { id: string; name: string; slug: string }[];
};

type AdminProjectTableProps = {
  projects: AdminProject[];
  initialQuery?: string;
};

export function AdminProjectTable({ projects, initialQuery = "" }: AdminProjectTableProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredProjects = useMemo(() => {
    if (!query) {
      return projects;
    }
    const lower = query.toLowerCase();
    return projects.filter((project) => project.title.toLowerCase().includes(lower));
  }, [projects, query]);

  const handleDelete = async (id: string) => {
    const target = projects.find((project) => project.id === id);
    if (!target) {
      return;
    }
    const confirmed = window.confirm(
      `Delete "${target.title}"? This action cannot be undone.`
    );
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to delete project.");
      }
      dispatchToast({ message: "Project deleted.", tone: "success" });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      dispatchToast({
        message: error instanceof Error ? error.message : "Unable to delete project.",
        tone: "error"
      });
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    const url = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 py-2 pl-9 pr-3 text-sm text-slate-100 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            aria-label="Search projects"
          />
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:bg-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <Plus className="h-4 w-4" aria-hidden />
          New project
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Title
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Tags
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Created
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {filteredProjects.length ? (
              filteredProjects.map((project) => (
                <tr key={project.id} className="transition hover:bg-slate-900/60">
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-100">{project.title}</div>
                    <div className="text-xs text-slate-500">{project.shortDesc}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.length ? (
                        project.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-2 py-0.5 text-xs text-slate-300"
                          >
                            {tag.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">No tags</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-400">
                    {formatDate(new Date(project.createdAt))}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-sky-400 hover:text-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                  {isPending ? "Updating..." : "No projects found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
