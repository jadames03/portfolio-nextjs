import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { TagPill } from "../../../components/TagPill";

type ProjectPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    select: { slug: true }
  });
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await prisma.project.findUnique({
    where: {
      slug: params.slug
    },
    include: {
      tags: true
    }
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="container max-w-4xl space-y-10 py-16">
      <header className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-slate-50">{project.title}</h1>
          <p className="text-base text-slate-300">{project.shortDesc}</p>
        </div>
        {project.tags.length ? (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <TagPill key={tag.id} tag={tag} />
            ))}
          </div>
        ) : null}
      </header>

      {project.coverUrl ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <Image
            src={project.coverUrl}
            alt={`${project.title} cover`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 70vw"
          />
        </div>
      ) : null}

      <section className="prose prose-invert max-w-none">
        {project.body ? (
          project.body.split("\n").map((paragraph, index) => (
            <p key={index} className="leading-relaxed text-slate-200">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-sm text-slate-400">
            This project does not have a detailed description yet.
          </p>
        )}
      </section>
    </div>
  );
}
