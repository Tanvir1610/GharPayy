import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "No webhook secret" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, { "svix-id": svix_id, "svix-timestamp": svix_timestamp, "svix-signature": svix_signature }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses?.[0]?.email_address ?? "";
    const full_name = [first_name, last_name].filter(Boolean).join(" ");

    await supabase.from("profiles").upsert({
      id,
      email,
      full_name,
      avatar_url: image_url ?? null,
      role: "tenant",
    }, { onConflict: "id" });
  }

  if (evt.type === "user.deleted") {
    const { id } = evt.data;
    if (id) await supabase.from("profiles").delete().eq("id", id);
  }

  return NextResponse.json({ received: true });
}
