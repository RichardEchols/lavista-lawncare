import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { photos, services, description } = body;
    const anthropic = getAnthropic();

    // Build the message content
    const contentParts: Anthropic.ContentBlockParam[] = [];

    // Add photo analysis if photos provided
    if (photos && photos.length > 0) {
      for (const photo of photos) {
        // Extract base64 and media type from data URL
        const match = photo.match(/^data:(image\/\w+);base64,(.+)$/);
        if (match) {
          contentParts.push({
            type: "image",
            source: {
              type: "base64",
              media_type: match[1] as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: match[2],
            },
          });
        }
      }
    }

    contentParts.push({
      type: "text",
      text: `You are a lawn care quoting assistant. Analyze the provided information and suggest a fair price for the job.

${photos && photos.length > 0 ? "I've provided photos of the yard." : "No photos were provided."}

Services requested: ${services.join(", ")}
${description ? `Additional description: ${description}` : ""}

Based on the services and what you can see (if photos provided), suggest a single price in dollars.
Consider:
- Yard size (small: $30-50, medium: $50-80, large: $80-150, very large: $150+)
- Number of services
- Apparent condition/complexity

Respond with ONLY a JSON object: {"suggestedPrice": <number>, "message": "<friendly message explaining your suggestion>"}
The message should be conversational and brief (1-2 sentences). Mention what you see in the photos if applicable.
Do NOT include markdown formatting or code blocks.`,
    });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: contentParts,
        },
      ],
    });

    // Parse the response
    const textBlock = response.content.find((b) => b.type === "text");
    if (textBlock && textBlock.type === "text") {
      try {
        const parsed = JSON.parse(textBlock.text);
        return NextResponse.json(parsed);
      } catch {
        // Try to extract price from text
        const priceMatch = textBlock.text.match(/\$(\d+)/);
        const price = priceMatch ? parseInt(priceMatch[1]) : services.length * 20 + 25;
        return NextResponse.json({
          suggestedPrice: price,
          message: textBlock.text.slice(0, 200),
        });
      }
    }

    // Fallback
    const fallbackPrice = services.length * 20 + 25;
    return NextResponse.json({
      suggestedPrice: fallbackPrice,
      message: `Based on the ${services.length} services selected, I'd suggest $${fallbackPrice}. Adjust as needed.`,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { suggestedPrice: 75, message: "I'd suggest $75 for this job. Feel free to adjust." },
      { status: 200 }
    );
  }
}
