import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { emailQueue } from "@/lib/queue";
import Papa from "papaparse";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;
  const file = formData.get("file") as File;
  const startTime = new Date(formData.get("startTime") as string);
  const delay = parseInt(formData.get("delay") as string);
  const hourlyLimit = parseInt(formData.get("hourlyLimit") as string);

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const csvText = await file.text();
  const parsed = Papa.parse(csvText, { header: true });
  const emails = parsed.data.map((row: any) => row.email).filter(Boolean);

  const jobs = [];
  let currentTime = startTime.getTime();

  for (const email of emails) {
    const scheduledAt = new Date(currentTime);
    const job = await prisma.emailJob.create({
      data: {
        subject,
        body,
        toEmail: email,
        scheduledAt,
        status: "scheduled",
        userId: session.user.id,
      },
    });

    await emailQueue.add(
      "send-email",
      { id: job.id },
      { delay: scheduledAt.getTime() - Date.now() }
    );

    currentTime += delay;
  }

  return NextResponse.json({ message: "Emails scheduled", count: emails.length });
}