import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabase = getSupabase();

    // Check for existing subscription
    const { data: existing } = await supabase
      .from("prime_clinics_leads")
      .select("id")
      .eq("email", normalizedEmail)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "This email is already subscribed." },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from("prime_clinics_leads")
      .insert({ email: normalizedEmail });

    if (error) {
      console.error("[subscribe] Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[subscribe] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
