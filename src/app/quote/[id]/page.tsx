"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Leaf,
  CheckCircle2,
  Clock,
  CreditCard,
  Sparkles,
} from "lucide-react";
import type { Quote } from "@/lib/types";

const appleSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

export default function QuoteViewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isPaid = searchParams.get("paid") === "true";

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch(`/api/quote/${params.id}`);
        if (!res.ok) throw new Error("Quote not found");
        const data = await res.json();
        setQuote(data);

        if (isPaid && data.status !== "paid") {
          // Update status
          // In production this would be done via Stripe webhook
        }
      } catch {
        setError("Quote not found or has been removed.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchQuote();
  }, [params.id, isPaid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#2d6a4f]/20 border-t-[#2d6a4f] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Quote Not Found</h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const priceInDollars = quote.price / 100;
  const showPaid = isPaid || quote.status === "paid";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#2d6a4f] px-6 pt-12 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={appleSpring}
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {quote.business_name}
          </h1>
          <p className="text-white/60 text-sm mt-1">Lawn Care Services</p>
        </motion.div>
      </div>

      <div className="px-6 -mt-4 pb-12 max-w-lg mx-auto">
        {/* Status Banner */}
        {showPaid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={appleSpring}
            className="bg-[#d8f3dc] border border-[#b7e4c7] rounded-2xl p-4 mb-4 flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 text-[#2d6a4f] flex-shrink-0" />
            <div>
              <div className="font-semibold text-[#2d6a4f]">Payment Received</div>
              <div className="text-sm text-[#40916c]">Thank you for your payment!</div>
            </div>
          </motion.div>
        )}

        {/* Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...appleSpring, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 overflow-hidden"
        >
          {/* Photos */}
          {quote.photos && quote.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-1 p-1">
              {quote.photos.map((photo, i) => (
                <div
                  key={i}
                  className={`aspect-square overflow-hidden ${
                    quote.photos.length === 1
                      ? "col-span-3 aspect-video"
                      : quote.photos.length === 2
                      ? i === 0
                        ? "col-span-2 row-span-1"
                        : "col-span-1"
                      : ""
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Yard photo ${i + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#40916c]" />
              <span className="text-sm font-semibold text-[#40916c] uppercase tracking-wide">
                Service Quote
              </span>
            </div>

            {/* Services */}
            <div className="space-y-2 mb-6">
              {quote.services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-[#52b788]" />
                  <span className="text-gray-700 font-medium">{service}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="bg-[#f0faf4] rounded-xl p-5 text-center mb-6">
              <div className="text-sm text-[#40916c] font-semibold mb-1">
                Total
              </div>
              <div className="text-4xl font-bold text-[#2d6a4f] tracking-tight">
                ${priceInDollars.toFixed(2)}
              </div>
            </div>

            {/* Pay Button */}
            {!showPaid && quote.stripe_payment_link && (
              <a
                href={quote.stripe_payment_link}
                className="w-full py-4 bg-[#2d6a4f] text-white text-lg font-semibold rounded-xl
                  flex items-center justify-center gap-2
                  hover:bg-[#40916c] active:scale-[0.98]
                  transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                  shadow-xl shadow-[#2d6a4f]/25"
              >
                <CreditCard className="w-5 h-5" />
                Pay Now
              </a>
            )}

            {!showPaid && !quote.stripe_payment_link && (
              <div className="text-center text-sm text-gray-400 py-3">
                Contact {quote.business_name} to arrange payment
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-1.5 text-gray-400 text-xs">
            <Leaf className="w-3 h-3" />
            <span>Powered by Lavista Lawn Care</span>
          </div>
        </div>
      </div>
    </div>
  );
}
