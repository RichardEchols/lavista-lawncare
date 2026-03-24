export interface Quote {
  id: string;
  business_name: string;
  customer_name?: string;
  services: string[];
  price: number; // cents
  photos: string[]; // base64 data URLs
  status: "draft" | "sent" | "paid";
  stripe_payment_link?: string;
  stripe_session_id?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  type?: "text" | "photos" | "services" | "price" | "business_name" | "quote_ready";
  photos?: string[];
  services?: string[];
  suggestedPrice?: number;
  quoteId?: string;
  quoteUrl?: string;
}

export const AVAILABLE_SERVICES = [
  "Mowing",
  "Edging",
  "Blowing",
  "Cleanup",
  "Hedge Trimming",
  "Mulching",
  "Leaf Removal",
  "Weed Control",
  "Fertilizing",
  "Aeration",
  "Other",
] as const;

export type ServiceType = (typeof AVAILABLE_SERVICES)[number];
