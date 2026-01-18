import { Worker } from "bullmq";
import { sendEmail } from "./lib/email";
import { prisma } from "./lib/db";
import { emailQueue } from "./lib/queue";
import { checkRateLimit, delayIfNeeded } from "./lib/rateLimit";

const worker = new Worker(
  "email",
  async (job) => {
    const { id } = job.data;
    const emailJob = await prisma.emailJob.findUnique({ where: { id } });
    if (!emailJob || emailJob.status !== "scheduled") return;

    await delayIfNeeded();

    if (!(await checkRateLimit())) {
      // Reschedule to next hour
      const nextHour = new Date();
      nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
      await emailQueue.add(
        "send-email",
        { id },
        { delay: nextHour.getTime() - Date.now() }
      );
      return;
    }

    try {
      await sendEmail(emailJob.toEmail, emailJob.subject, emailJob.body);
      await prisma.emailJob.update({
        where: { id },
        data: { status: "sent", sentAt: new Date() },
      });
    } catch (error) {
      await prisma.emailJob.update({
        where: { id },
        data: { status: "failed" },
      });
      throw error;
    }
  },
  {
    connection: { host: "localhost", port: 6379 },
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || "5"),
    limiter: {
      max: 1,
      duration: parseInt(process.env.DELAY_BETWEEN_EMAILS || "2000"),
    },
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed: ${err.message}`);
});

console.log("Worker started");