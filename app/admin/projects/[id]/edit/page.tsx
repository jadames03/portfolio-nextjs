import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/prisma";
import { AdminProjectForm } from "../../../../../components/AdminProjectForm";

type EditProjectPageProps = {
  params: {
    id: string;
  };
};

export const metadata = {
  title: "Edit Project"
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const [project, tags] = await Promise.all([
    prisma.project.findUnique({
      where: { id: params.id },
      include: { tags: true }
    }),
    prisma.tag.findMany({
      orderBy: {
        name: "asc"
      }
    })
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-slate-100">Edit project</h2>
        <p className="text-sm text-slate-400">Update details and tags.</p>
      </div>
      <AdminProjectForm mode="edit" tags={tags} project={project} />
    </div>
  );
}
