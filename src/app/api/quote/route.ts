import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { business_name, services, price, photos, customer_name } = body;

    const quoteId = uuid();

    // Store photos as data URLs (up to ~3 photos)
    // In production, you'd upload to storage
    const photoUrls = photos || [];

    // Create Stripe payment link
    let stripePaymentLink = "";
    try {
      // Create a product for this quote
      const product = await stripe.products.create({
        name: `Lawn Care Service - ${business_name}`,
        description: services.join(", "),
      });

      // Create a price for the product
      const stripePrice = await stripe.prices.create({
        product: product.id,
        unit_amount: price, // already in cents
        currency: "usd",
      });

      // Create a payment link
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        metadata: {
          quote_id: quoteId,
        },
        after_completion: {
          type: "redirect",
          redirect: {
            url: `${process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin}/quote/${quoteId}?paid=true`,
          },
        },
      });

      stripePaymentLink = paymentLink.url;
    } catch (stripeError) {
      console.error("Stripe error:", stripeError);
      // Continue without payment link - quote still works
    }

    // Save to Supabase
    const { error } = await supabase.from("lavista_quotes").insert({
      id: quoteId,
      business_name,
      customer_name: customer_name || null,
      services,
      price,
      photos: photoUrls,
      status: "sent",
      stripe_payment_link: stripePaymentLink,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase error:", error);
      // Even if Supabase fails, return the quote data so the user can still share
      return NextResponse.json({
        id: quoteId,
        stripe_payment_link: stripePaymentLink,
        warning: "Quote saved locally but database sync failed.",
      });
    }

    return NextResponse.json({
      id: quoteId,
      stripe_payment_link: stripePaymentLink,
    });
  } catch (error) {
    console.error("Quote API error:", error);
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    );
  }
}
