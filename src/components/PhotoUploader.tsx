"use client";

import { useRef } from "react";
import { Camera, ImagePlus, X } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  photos: string[];
  onAdd: (photos: string[]) => void;
  onRemove: (index: number) => void;
  onConfirm: () => void;
}

export default function PhotoUploader({ photos, onAdd, onRemove, onConfirm }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const readers: Promise<string>[] = [];
    Array.from(files).forEach((file) => {
      readers.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
      );
    });

    Promise.all(readers).then((results) => {
      onAdd(results);
    });

    // Reset input
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className="bg-white rounded-2xl border border-gray-200 p-4 shadow-lg shadow-black/5"
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        onChange={handleFiles}
        className="hidden"
      />

      {photos.length === 0 ? (
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (fileRef.current) {
                fileRef.current.removeAttribute("capture");
                fileRef.current.click();
              }
            }}
            className="flex-1 flex flex-col items-center gap-2 py-8 rounded-xl border-2 border-dashed border-gray-200
              hover:border-[#52b788] hover:bg-[#f0faf4] transition-all duration-200 active:scale-[0.98]"
          >
            <ImagePlus className="w-8 h-8 text-[#40916c]" />
            <span className="text-sm font-medium text-gray-500">Choose Photos</span>
          </button>
          <button
            onClick={() => {
              if (fileRef.current) {
                fileRef.current.setAttribute("capture", "environment");
                fileRef.current.click();
              }
            }}
            className="flex-1 flex flex-col items-center gap-2 py-8 rounded-xl border-2 border-dashed border-gray-200
              hover:border-[#52b788] hover:bg-[#f0faf4] transition-all duration-200 active:scale-[0.98]"
          >
            <Camera className="w-8 h-8 text-[#40916c]" />
            <span className="text-sm font-medium text-gray-500">Take Photo</span>
          </button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2 flex-wrap mb-3">
            {photos.map((photo, i) => (
              <div key={i} className="relative">
                <img
                  src={photo}
                  alt={`Photo ${i + 1}`}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <button
                  onClick={() => onRemove(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full
                    flex items-center justify-center shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.length < 3 && (
              <button
                onClick={() => {
                  if (fileRef.current) {
                    fileRef.current.removeAttribute("capture");
                    fileRef.current.click();
                  }
                }}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200
                  flex items-center justify-center hover:border-[#52b788] transition-colors"
              >
                <ImagePlus className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={onConfirm}
            className="w-full py-3 bg-[#2d6a4f] text-white font-semibold rounded-xl
              transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
              hover:bg-[#40916c] active:scale-[0.98] shadow-lg shadow-[#2d6a4f]/20"
          >
            Send {photos.length} Photo{photos.length > 1 ? "s" : ""}
          </button>
        </div>
      )}
    </motion.div>
  );
}
