const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!uuid.test(id)) return new Response(null, { status: 404 });
  const base = (process.env.DIRECTUS_URL || "http://localhost:8055").replace(/\/$/, "");
  const upstream = await fetch(`${base}/website-content/media/${id}`, { cache: "no-store" });
  if (!upstream.ok) return new Response(null, { status: upstream.status === 404 ? 404 : 502 });
  return new Response(upstream.body, { headers: { "Content-Type": upstream.headers.get("content-type") || "application/octet-stream", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
