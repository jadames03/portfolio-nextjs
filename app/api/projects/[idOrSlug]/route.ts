import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type Params = {
  params: {
    idOrSlug: string;
  };
};

export async function GET(_request: NextRequest, { params }: Params) {
  const { idOrSlug } = params;

  let project = await prisma.project.findUnique({
    where: { id: idOrSlug },
    include: { tags: true }
  });

  if (!project) {
    project = await prisma.project.findUnique({
      where: { slug: idOrSlug },
      include: { tags: true }
    });
  }

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json(project);
}
