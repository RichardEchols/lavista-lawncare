import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { STRIPE_PRICES } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan } = body;

    if (!plan || !["per_quote", "unlimited"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const origin = req.nextUrl.origin;

    const priceId =
      plan === "per_quote"
        ? STRIPE_PRICES.PER_QUOTE
        : STRIPE_PRICES.UNLIMITED;

    const mode = plan === "unlimited" ? "subscription" : "payment";

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?payment=success&plan=${plan}`,
      cancel_url: `${origin}/?payment=cancelled`,
      metadata: {
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
