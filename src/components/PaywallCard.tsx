"use client";

import { motion } from "framer-motion";
import { Zap, Infinity, Sparkles } from "lucide-react";

interface Props {
  onSelect: (plan: "per_quote" | "unlimited") => void;
}

export default function PaywallCard({ onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-lg shadow-black/5"
    >
      <div className="text-center mb-5">
        <div className="w-12 h-12 rounded-2xl bg-[#d8f3dc] flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6 text-[#2d6a4f]" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Keep Quoting</h3>
        <p className="text-sm text-gray-500 mt-1">
          Choose a plan to continue creating quotes
        </p>
      </div>

      <div className="space-y-3">
        {/* Per-quote option */}
        <button
          onClick={() => onSelect("per_quote")}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100
            hover:border-[#b7e4c7] hover:bg-[#f0faf4] transition-all duration-200
            active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-[#d8f3dc] flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-[#2d6a4f]" />
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-gray-900">Single Quote</div>
            <div className="text-sm text-gray-500">Pay as you go</div>
          </div>
          <div className="text-xl font-bold text-[#2d6a4f]">$5</div>
        </button>

        {/* Unlimited option */}
        <button
          onClick={() => onSelect("unlimited")}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-[#2d6a4f]
            bg-[#f0faf4] hover:bg-[#d8f3dc] transition-all duration-200
            active:scale-[0.98] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-[#2d6a4f] text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
            BEST VALUE
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#2d6a4f] flex items-center justify-center flex-shrink-0">
            <Infinity className="w-5 h-5 text-white" />
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-gray-900">Unlimited</div>
            <div className="text-sm text-gray-500">Create as many quotes as you want</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-[#2d6a4f]">$29</div>
            <div className="text-xs text-gray-500">/month</div>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
