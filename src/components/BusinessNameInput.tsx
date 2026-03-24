"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

interface Props {
  onSubmit: (name: string) => void;
}

export default function BusinessNameInput({ onSubmit }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className="bg-white rounded-2xl border border-gray-200 p-4 shadow-lg shadow-black/5"
    >
      <p className="text-sm font-semibold text-gray-500 mb-3 px-1">
        Your business name:
      </p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Green Valley Landscaping"
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
              text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:border-[#52b788] focus:ring-2 focus:ring-[#52b788]/20
              transition-all duration-200"
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={!name.trim()}
          className="px-5 py-3 bg-[#2d6a4f] text-white font-semibold rounded-xl
            transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
            hover:bg-[#40916c] active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed
            shadow-lg shadow-[#2d6a4f]/20"
        >
          Done
        </button>
      </div>
    </motion.form>
  );
}
