import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RATE_LIMIT = 5;
const RATE_WINDOW_HOURS = 1;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get IP for rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
               req.headers.get("cf-connecting-ip") || "unknown";
    const ipHash = await hashIP(ip);

    // Check rate limit
    const since = new Date(Date.now() - RATE_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .eq("action", "submit_business")
      .gte("created_at", since);

    if ((count ?? 0) >= RATE_LIMIT) {
      return new Response(
        JSON.stringify({ error: "Too many submissions. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    // Server-side validation
    const { name, category, city, description, type, whatsapp, instagram, phone, email, photo, owner_id } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0 || name.length > 200) {
      return new Response(JSON.stringify({ error: "Invalid name" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const validCategories = ["food", "health", "beauty", "immigration", "services", "professionals", "transport", "products", "others"];
    if (!validCategories.includes(category)) {
      return new Response(JSON.stringify({ error: "Invalid category" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!city || typeof city !== "string" || city.length > 100) {
      return new Response(JSON.stringify({ error: "Invalid city" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!description || typeof description !== "string" || description.trim().length === 0 || description.length > 1000) {
      return new Response(JSON.stringify({ error: "Invalid description" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const validTypes = ["company", "freelancer"];
    if (type && !validTypes.includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid type" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Record rate limit entry
    await supabaseAdmin.from("rate_limits").insert({ ip_hash: ipHash, action: "submit_business" });

    // Insert business using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from("businesses")
      .insert({
        name: name.trim(),
        category,
        city,
        description: description.trim(),
        type: type || "company",
        status: "pending",
        whatsapp: whatsapp?.trim() || null,
        instagram: instagram?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        photo: photo?.trim() || null,
        owner_id: owner_id || null,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-business error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + (Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "salt"));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
