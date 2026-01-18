# Email Scheduler

A production-grade email scheduler service with dashboard.

## Features

- Schedule emails via API
- Persistent scheduling with BullMQ + Redis
- Rate limiting and concurrency control
- Dashboard for managing emails
- Google OAuth login

## Tech Stack

- Backend: Next.js API routes, TypeScript, Express-like
- Queue: BullMQ with Redis
- Database: PostgreSQL with Prisma
- Email: Ethereal SMTP
- Frontend: Next.js, Tailwind CSS, React

## Setup

1. Clone the repo.

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Set up Docker services:
   ```bash
   docker-compose up -d
   ```

4. Set up database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Configure environment variables in `.env.local`:
   - DATABASE_URL
   - REDIS_URL
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - ETHEREAL_HOST, PORT, USER, PASS
   - EMAILS_PER_HOUR=100
   - DELAY_BETWEEN_EMAILS=2000
   - WORKER_CONCURRENCY=5

6. Run the app:
   ```bash
   npm run dev
   ```

7. Run the worker in another terminal:
   ```bash
   npm run worker
   ```

## Architecture

- Scheduling: BullMQ delayed jobs persist in Redis.
- Persistence: DB stores job details, Redis handles queue.
- Rate Limiting: Redis counters for hourly limits, reschedule if exceeded.
- Concurrency: Worker concurrency set to 5, with 2s delay between sends.

## API

- POST /api/schedule: Schedule emails from CSV
- GET /api/scheduled: List scheduled emails
- GET /api/sent: List sent emails

## Assumptions

- Single sender for simplicity.
- CSV has 'email' column.
- No advanced error handling in frontend.

## Demo

1. Login with Google.
2. Upload CSV, fill form, schedule.
3. View in Scheduled tab.
4. Worker sends emails at scheduled time.
5. View in Sent tab.

For restart persistence: Stop server, start again, jobs still send.
