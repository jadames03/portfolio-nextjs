import { prisma } from "../../../../lib/prisma";
import { AdminProjectForm } from "../../../../components/AdminProjectForm";

export const metadata = {
  title: "New Project"
};

export default async function NewProjectPage() {
  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc"
    }
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-slate-100">Create project</h2>
        <p className="text-sm text-slate-400">
          Provide details and assign tags. You can edit this later.
        </p>
      </div>
      <AdminProjectForm mode="create" tags={tags} />
    </div>
  );
}
