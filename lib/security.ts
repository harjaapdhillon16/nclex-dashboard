import "server-only";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";

/**
 * Fixed-window rate limiter backed by Postgres so it works across serverless instances.
 * Returns true when the request is allowed.
 */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  const rows = await db.execute<{ count: number }>(sql`
    INSERT INTO rate_limits (key, count, window_start) VALUES (${key}, 1, now())
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN rate_limits.window_start < now() - make_interval(secs => ${windowSec}) THEN 1 ELSE rate_limits.count + 1 END,
      window_start = CASE WHEN rate_limits.window_start < now() - make_interval(secs => ${windowSec}) THEN now() ELSE rate_limits.window_start END
    RETURNING count`);
  return Number(rows.rows[0]?.count ?? 0) <= limit;
}

export async function audit(userId: string | null | undefined, action: string, entity?: string, entityId?: string | number, meta?: unknown, ip?: string) {
  try {
    await db.insert(auditLogs).values({ userId: userId ?? null, action, entity, entityId: entityId?.toString(), meta: meta as object, ip });
  } catch (e) {
    console.error("audit failed", e);
  }
}
