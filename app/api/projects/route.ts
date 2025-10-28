import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const tag = url.searchParams.get("tag");
  const query = url.searchParams.get("q");

  const projects = await prisma.project.findMany({
    where: {
      AND: [
        tag && tag !== "all"
          ? {
              tags: {
                some: {
                  slug: tag.toLowerCase()
                }
              }
            }
          : {},
        query
          ? {
              OR: [
                {
                  title: {
                    contains: query,
                    mode: "insensitive"
                  }
                },
                {
                  shortDesc: {
                    contains: query,
                    mode: "insensitive"
                  }
                }
              ]
            }
          : {}
      ]
    },
    include: {
      tags: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(projects);
}
