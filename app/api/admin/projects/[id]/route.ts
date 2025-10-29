import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../lib/prisma";

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(150),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters.")
    .max(150)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and dashes."),
  shortDesc: z.string().min(10, "Short description must be at least 10 characters.").max(500),
  coverUrl: z
    .string()
    .optional()
    .transform((value) => value ?? "")
    .refine(
      (value) => !value || /^https?:\/\//i.test(value),
      "Cover URL must start with http:// or https://"
    ),
  projectUrl: z
    .string()
    .optional()
    .transform((value) => value ?? "")
    .refine(
      (value) => !value || /^https?:\/\//i.test(value),
      "Project URL must start with http:// or https://"
    ),
  body: z
    .string()
    .max(5000, "Body must be under 5000 characters.")
    .optional()
    .transform((value) => value ?? ""),
  tagIds: z.array(z.string()).optional().default([])
});

type Params = {
  params: {
    id: string;
  };
};

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = projectSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0];
      if (typeof path === "string" && !fieldErrors[path]) {
        fieldErrors[path] = issue.message;
      }
    }
    return NextResponse.json(
      { error: "Invalid project data.", fields: fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const slugConflict = await prisma.project.findFirst({
    where: {
      slug: data.slug,
      NOT: { id }
    }
  });
  if (slugConflict) {
    return NextResponse.json(
      { error: "Slug is already in use.", fields: { slug: "Choose a unique slug." } },
      { status: 409 }
    );
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        shortDesc: data.shortDesc,
        coverUrl: data.coverUrl ? data.coverUrl : null,
        projectUrl: data.projectUrl ? data.projectUrl : null,
        body: data.body?.trim() ? data.body : null,
        tags: {
          set: data.tagIds.map((tagId) => ({ id: tagId }))
        }
      },
      include: { tags: true }
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update project." }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = params;

  try {
    await prisma.project.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to delete project." }, { status: 500 });
  }
}
