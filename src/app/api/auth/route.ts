import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, stripe_customer_id, plan } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Check if user already exists
    const { data: existing } = await supabase
      .from("lavista_users")
      .select("*")
      .eq("phone", phone)
      .single();

    if (existing) {
      // Update existing user
      const updates: Record<string, unknown> = {};
      if (stripe_customer_id) updates.stripe_customer_id = stripe_customer_id;
      if (plan) updates.plan = plan;

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from("lavista_users")
          .update(updates)
          .eq("phone", phone);

        if (error) {
          console.error("Update error:", error);
          return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({ user: { ...existing, ...updates } });
    }

    // Create new user
    const { data, error } = await supabase
      .from("lavista_users")
      .insert({
        phone,
        stripe_customer_id: stripe_customer_id || null,
        plan: plan || "free",
        quotes_used: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
