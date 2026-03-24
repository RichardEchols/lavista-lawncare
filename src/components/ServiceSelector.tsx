"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { AVAILABLE_SERVICES, type ServiceType } from "@/lib/types";

interface Props {
  selected: ServiceType[];
  onToggle: (service: ServiceType) => void;
  onConfirm: () => void;
}

export default function ServiceSelector({ selected, onToggle, onConfirm }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className="bg-white rounded-2xl border border-gray-200 p-4 shadow-lg shadow-black/5"
    >
      <p className="text-sm font-semibold text-gray-500 mb-3 px-1">
        Select services:
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {AVAILABLE_SERVICES.map((service) => {
          const isSelected = selected.includes(service);
          return (
            <button
              key={service}
              onClick={() => onToggle(service)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium
                transition-all duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                active:scale-[0.97] ${
                  isSelected
                    ? "bg-[#2d6a4f] text-white shadow-md shadow-[#2d6a4f]/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5" />}
              {service}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <button
          onClick={onConfirm}
          className="w-full py-3 bg-[#2d6a4f] text-white font-semibold rounded-xl
            transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
            hover:bg-[#40916c] active:scale-[0.98]
            shadow-lg shadow-[#2d6a4f]/20"
        >
          Confirm Services ({selected.length})
        </button>
      )}
    </motion.div>
  );
}
