"use client";

import { motion } from "framer-motion";
import { ExternalLink, Copy, Check, Plus } from "lucide-react";
import { useState } from "react";

interface Props {
  quoteUrl: string;
  onNewQuote?: () => void;
}

export default function QuoteReady({ quoteUrl, onNewQuote }: Props) {
  const [copied, setCopied] = useState(false);

  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${quoteUrl}`
      : quoteUrl;

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-lg shadow-black/5"
    >
      <div className="text-center mb-4">
        <div className="w-14 h-14 rounded-2xl bg-[#d8f3dc] flex items-center justify-center mx-auto mb-3">
          <Check className="w-7 h-7 text-[#2d6a4f]" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Quote Ready!</h3>
        <p className="text-sm text-gray-500 mt-1">
          Send this link to your customer
        </p>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={copyLink}
          className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl
            flex items-center justify-center gap-2
            hover:bg-gray-200 active:scale-[0.98] transition-all duration-150"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#2d6a4f]" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Link
            </>
          )}
        </button>
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 bg-[#2d6a4f] text-white font-semibold rounded-xl
            flex items-center justify-center gap-2
            hover:bg-[#40916c] active:scale-[0.98] transition-all duration-150
            shadow-lg shadow-[#2d6a4f]/20"
        >
          <ExternalLink className="w-4 h-4" />
          View Quote
        </a>
      </div>

      {onNewQuote && (
        <button
          onClick={onNewQuote}
          className="w-full py-3 bg-[#f0faf4] text-[#2d6a4f] font-semibold rounded-xl
            flex items-center justify-center gap-2 border border-[#b7e4c7]
            hover:bg-[#d8f3dc] active:scale-[0.98] transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          New Quote
        </button>
      )}
    </motion.div>
  );
}
