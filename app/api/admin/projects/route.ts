import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";

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
    .trim()
    .optional()
    .transform((value) => value ?? "")
    .refine(
      (value) => !value || /^https?:\/\//i.test(value),
      "Cover URL must start with http:// or https://"
    ),
  projectUrl: z
    .string()
    .trim()
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

export async function POST(request: NextRequest) {
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
      {
        error: "Invalid project data.",
        fields: fieldErrors
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const existing = await prisma.project.findUnique({
    where: { slug: data.slug }
  });

  if (existing) {
    return NextResponse.json(
      {
        error: "Slug is already in use.",
        fields: { slug: "Choose a unique slug." }
      },
      { status: 409 }
    );
  }

  try {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        shortDesc: data.shortDesc,
        coverUrl: data.coverUrl ? data.coverUrl : null,
        projectUrl: data.projectUrl ? data.projectUrl : null,
        body: data.body?.trim() ? data.body : null,
        tags: {
          connect: data.tagIds.map((id) => ({ id }))
        }
      },
      include: {
        tags: true
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create project." }, { status: 500 });
  }
}
