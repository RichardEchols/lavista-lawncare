"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="w-8 h-8 rounded-full bg-[#d8f3dc] flex items-center justify-center flex-shrink-0 mt-1">
        <Leaf className="w-4 h-4 text-[#2d6a4f]" />
      </div>
      <div className="bg-[#f0faf4] rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[#40916c]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
