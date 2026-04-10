/**
 * Legacy compatibility alias for Clerk webhook delivery.
 *
 * Some Clerk dashboard configurations were set to POST to /auth instead of
 * /api/webhooks/clerk. This re-export keeps those webhooks working without
 * needing a Clerk dashboard update.
 *
 * TODO: Once the Clerk webhook URL is updated to /api/webhooks/clerk in the
 * Clerk dashboard and verified working in production, delete this file.
 */
export { POST } from "../api/webhooks/clerk/route";
