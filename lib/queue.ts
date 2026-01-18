import { Queue, Worker, QueueScheduler } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const emailQueue = new Queue("email", { connection });

export const emailScheduler = new QueueScheduler("email", { connection });