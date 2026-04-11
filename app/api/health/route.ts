export async function GET() {
  return Response.json({ status: "ok", ts: Date.now() });
}
