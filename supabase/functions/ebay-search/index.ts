// Live product discovery via eBay Browse API.
// Required Supabase Edge Function secrets: EBAY_CLIENT_ID, EBAY_CLIENT_SECRET.
// Optional: EBAY_MARKETPLACE_ID (defaults to EBAY_US).
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
let cachedToken: { value: string; expiresAt: number } | null = null;
async function getToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const id = Deno.env.get("EBAY_CLIENT_ID");
  const secret = Deno.env.get("EBAY_CLIENT_SECRET");
  if (!id || !secret) throw new Error("Live product search is not configured yet. Add eBay API credentials to Supabase secrets.");
  const credentials = btoa(id + ":" + secret);
  const response = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: { Authorization: "Basic " + credentials, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials&scope=" + encodeURIComponent("https://api.ebay.com/oauth/api_scope"),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description ?? "Could not authenticate with eBay.");
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 7200) * 1000 };
  return cachedToken.value;
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
  try {
    const body = await req.json();
    const q = String(body.query ?? "").trim().slice(0, 120);
    if (q.length < 2) return new Response(JSON.stringify({ items: [] }), { headers: { ...cors, "Content-Type": "application/json" } });
    const token = await getToken();
    const marketplace = Deno.env.get("EBAY_MARKETPLACE_ID") ?? "EBAY_US";
    const url = new URL("https://api.ebay.com/buy/browse/v1/item_summary/search");
    url.searchParams.set("q", q);
    url.searchParams.set("limit", "24");
    url.searchParams.set("filter", "buyingOptions:{FIXED_PRICE}");
    const response = await fetch(url, { headers: { Authorization: "Bearer " + token, "X-EBAY-C-MARKETPLACE-ID": marketplace, "Accept": "application/json" } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.errors?.[0]?.message ?? "eBay product search failed.");
    const items = (data.itemSummaries ?? []).map((x: any) => ({
      id: x.itemId, title: x.title, price: x.price?.value, currency: x.price?.currency,
      image: x.image?.imageUrl ?? x.thumbnailImages?.[0]?.imageUrl ?? null,
      url: x.itemWebUrl, condition: x.condition ?? "Condition not provided",
      seller: x.seller?.username ?? "eBay seller", shipping: x.shippingOptions?.[0]?.shippingCost?.value ?? null,
      source: "eBay",
    }));
    return new Response(JSON.stringify({ items, total: data.total ?? items.length, source: "eBay Browse API" }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Live search is temporarily unavailable." }), { status: 503, headers: { ...cors, "Content-Type": "application/json" } });
  }
});