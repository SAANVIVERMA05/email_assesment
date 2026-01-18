import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export async function checkRateLimit(): Promise<boolean> {
  const key = `emails_sent_${new Date().toISOString().slice(0, 13)}`; // hourly
  const count = await redis.incr(key);
  await redis.expire(key, 3600); // expire in 1 hour
  const limit = parseInt(process.env.EMAILS_PER_HOUR || "100");
  return count <= limit;
}

export async function delayIfNeeded() {
  // If rate limit exceeded, delay to next hour
  const key = `emails_sent_${new Date().toISOString().slice(0, 13)}`;
  const count = await redis.get(key);
  if (parseInt(count || "0") >= parseInt(process.env.EMAILS_PER_HOUR || "100")) {
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    const delay = nextHour.getTime() - Date.now();
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}