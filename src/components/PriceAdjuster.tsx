"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Check } from "lucide-react";

interface Props {
  suggestedPrice: number;
  onConfirm: (price: number) => void;
}

export default function PriceAdjuster({ suggestedPrice, onConfirm }: Props) {
  const [price, setPrice] = useState(suggestedPrice);

  const adjust = (amount: number) => {
    const newPrice = Math.max(10, price + amount);
    setPrice(newPrice);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg shadow-black/5"
    >
      <p className="text-sm font-semibold text-gray-500 mb-4 text-center">
        Adjust the price:
      </p>

      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => adjust(-5)}
          className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center
            hover:bg-gray-200 active:scale-[0.95] transition-all duration-150"
        >
          <Minus className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-center">
          <div className="text-4xl font-bold text-[#2d6a4f] tracking-tight">
            ${price}
          </div>
        </div>

        <button
          onClick={() => adjust(5)}
          className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center
            hover:bg-gray-200 active:scale-[0.95] transition-all duration-150"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex gap-2 justify-center mb-4">
        {[25, 50, 75, 100, 150, 200].map((preset) => (
          <button
            key={preset}
            onClick={() => setPrice(preset)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              price === preset
                ? "bg-[#2d6a4f] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            ${preset}
          </button>
        ))}
      </div>

      <button
        onClick={() => onConfirm(price)}
        className="w-full py-3 bg-[#2d6a4f] text-white font-semibold rounded-xl
          flex items-center justify-center gap-2
          transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          hover:bg-[#40916c] active:scale-[0.98]
          shadow-lg shadow-[#2d6a4f]/20"
      >
        <Check className="w-4 h-4" />
        Confirm ${price}
      </button>
    </motion.div>
  );
}
