import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon, Tag } from "lucide-react";
import { TagPill } from "./TagPill";

type ProjectCardProps = {
  project: {
    id: string;
    title: string;
    slug: string;
    shortDesc: string;
    coverUrl: string | null;
    projectUrl: string | null;
    tags: { id: string; name: string; slug: string }[];
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 shadow-sm transition hover:border-sky-500/70 hover:shadow-lg">
      <Link href={`/project/${project.slug}`} className="flex flex-1 flex-col">
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          {project.coverUrl ? (
            <Image
              src={project.coverUrl}
              alt={`${project.title} cover`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center gap-2 text-slate-500">
              <ImageIcon className="h-6 w-6" />
              <span className="text-sm">No cover image</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-100 group-hover:text-sky-200">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-slate-300">{project.shortDesc}</p>
          </div>
          {project.tags.length > 0 ? (
            <div className="mt-auto flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <TagPill key={tag.id} tag={tag} />
              ))}
            </div>
          ) : (
            <div className="mt-auto flex items-center gap-2 text-xs text-slate-500">
              <Tag className="h-3.5 w-3.5" />
              <span>No tags</span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
