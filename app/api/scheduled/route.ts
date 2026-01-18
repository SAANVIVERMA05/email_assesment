import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobs = await prisma.emailJob.findMany({
    where: { userId: session.user.id, status: "scheduled" },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json(jobs);
}