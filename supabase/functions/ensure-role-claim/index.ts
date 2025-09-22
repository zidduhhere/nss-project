import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const userClient = createClient(url, anon, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const admin = createClient(url, service);

  try {
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });

    const { data: row, error } = await userClient
      .from("user_roles")
      .select("unit_uuid, roles!inner(name)")
      .eq("user_id", user.id)
      .single();
    if (error || !row) return new Response(JSON.stringify({ error: "Role not found" }), { status: 404, headers: cors });

    const role = row.roles.name as string;
    const unit_uuid = row.unit_uuid ?? null;
    const jwtRole = (user.app_metadata as any)?.role ?? null;
    const jwtUnit = (user.app_metadata as any)?.unit_uuid ?? null;

    if (jwtRole !== role || jwtUnit !== unit_uuid) {
      const { error: upd } = await admin.auth.admin.updateUserById(user.id, { app_metadata: { role, unit_uuid } });
      if (upd) return new Response(JSON.stringify({ error: upd.message }), { status: 500, headers: cors });
    }

    return new Response(JSON.stringify({ ok: true, role, unit_uuid }), { status: 200, headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors });
  }
});