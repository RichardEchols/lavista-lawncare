"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import type { ChatMessage } from "@/lib/types";

const appleSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 35,
};

export default function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={appleSpring}
      className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#d8f3dc] flex items-center justify-center flex-shrink-0 mt-1">
          <Leaf className="w-3.5 h-3.5 text-[#2d6a4f]" />
        </div>
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
          isUser
            ? "bg-[#2d6a4f] text-white rounded-br-md"
            : "bg-[#f0faf4] text-gray-800 rounded-bl-md"
        }`}
      >
        {message.photos && message.photos.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {message.photos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`Yard photo ${i + 1}`}
                className="w-24 h-24 object-cover rounded-xl"
              />
            ))}
          </div>
        )}
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </motion.div>
  );
}
