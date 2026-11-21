import Link from "next/link";
import { and, eq, gt, isNull } from "drizzle-orm";
import { CheckCircle2, XCircle } from "lucide-react";
import { db } from "@/lib/db";
import { authTokens, users } from "@/lib/db/schema";
import { sha256 } from "@/lib/auth";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let verified = false;

  if (token) {
    const hash = sha256(token);
    const [row] = await db
      .select()
      .from(authTokens)
      .where(and(eq(authTokens.tokenHash, hash), eq(authTokens.kind, "verify_email"), isNull(authTokens.usedAt), gt(authTokens.expiresAt, new Date())))
      .limit(1);

    if (row) {
      await db.update(users).set({ emailVerifiedAt: new Date() }).where(eq(users.id, row.userId));
      await db.update(authTokens).set({ usedAt: new Date() }).where(eq(authTokens.id, row.id));
      verified = true;
    }
  }

  return (
    <div className="panel panel-pad space-y-4 text-center">
      {verified ? (
        <>
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
          <h2 className="text-xl font-bold">Email address verified</h2>
          <p className="text-sm muted">Thank you! Your QREXq email address has been confirmed.</p>
          <Link href="/dashboard" className="btn btn-primary w-full">
            Continue to Dashboard
          </Link>
        </>
      ) : (
        <>
          <XCircle className="mx-auto h-12 w-12 text-danger" />
          <h2 className="text-xl font-bold">Verification link invalid or expired</h2>
          <p className="text-sm muted">
            This verification link has expired or has already been used. You can request a fresh verification link from your profile page.
          </p>
          <Link href="/dashboard" className="btn btn-secondary w-full">
            Go to Dashboard
          </Link>
        </>
      )}
    </div>
  );
}
