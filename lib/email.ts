import "server-only";

export type MailMessage = {
  to: string;
  subject: string;
  text: string;
  actionUrl?: string;
};

export function appOrigin(): string {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

/**
 * Transactional email seam. In development / when no SMTP or API provider is
 * configured, logs the message and returns the action link so verification and
 * password-reset flows can be tested end-to-end without external dependencies.
 */
export async function sendEmail(msg: MailMessage): Promise<{ delivered: boolean; previewUrl?: string }> {
  console.info(`[QREXq Mail] To: ${msg.to} | Subject: ${msg.subject}`);
  if (msg.actionUrl) {
    console.info(`[QREXq Mail] Action URL: ${msg.actionUrl}`);
  }
  return {
    delivered: false,
    previewUrl: msg.actionUrl,
  };
}
