"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Send, Leaf } from "lucide-react";
import Link from "next/link";
import { v4 as uuid } from "uuid";
import ChatBubble from "@/components/ChatBubble";
import ServiceSelector from "@/components/ServiceSelector";
import PhotoUploader from "@/components/PhotoUploader";
import PriceAdjuster from "@/components/PriceAdjuster";
import BusinessNameInput from "@/components/BusinessNameInput";
import QuoteReady from "@/components/QuoteReady";
import TypingIndicator from "@/components/TypingIndicator";
import type { ChatMessage, ServiceType } from "@/lib/types";

type Step = "welcome" | "photos" | "services" | "analyzing" | "price" | "business_name" | "generating" | "done";

export default function QuotePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<Step>("welcome");
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [suggestedPrice, setSuggestedPrice] = useState(0);
  const [confirmedPrice, setConfirmedPrice] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [quoteUrl, setQuoteUrl] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [textInput, setTextInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const addMessage = useCallback((msg: Omit<ChatMessage, "id">) => {
    const newMsg = { ...msg, id: uuid() };
    setMessages((prev) => [...prev, newMsg]);
    return newMsg;
  }, []);

  const addBotMessage = useCallback(
    (content: string, extra?: Partial<ChatMessage>) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage({ role: "assistant", content, ...extra });
        scrollToBottom();
      }, 600);
    },
    [addMessage, scrollToBottom]
  );

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage(
        "Hey there! I'm your quoting assistant. Upload some photos of the yard and I'll help you create a professional quote in seconds.\n\nOr just type a description of the job if you don't have photos handy."
      );
      setStep("photos");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Handle photo upload
  const handlePhotosConfirm = () => {
    addMessage({
      role: "user",
      content: `Uploaded ${photos.length} photo${photos.length > 1 ? "s" : ""}`,
      photos: photos,
    });
    setStep("services");
    addBotMessage(
      "Got it! What services are you providing for this job? Select all that apply."
    );
  };

  // Handle text message (skip photos)
  const handleSendText = () => {
    if (!textInput.trim()) return;
    addMessage({ role: "user", content: textInput });
    setTextInput("");

    if (step === "photos") {
      setStep("services");
      addBotMessage(
        "Got it! What services are you providing for this job? Select all that apply."
      );
    }
  };

  // Handle service selection
  const toggleService = (service: ServiceType) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleServicesConfirm = async () => {
    addMessage({
      role: "user",
      content: selectedServices.join(", "),
    });
    setStep("analyzing");

    // Call the AI to analyze and suggest a price
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photos: photos,
          services: selectedServices,
          description: messages
            .filter((m) => m.role === "user" && !m.photos)
            .map((m) => m.content)
            .join(" "),
        }),
      });

      const data = await res.json();
      setIsTyping(false);

      const price = data.suggestedPrice || 75;
      setSuggestedPrice(price);

      addMessage({
        role: "assistant",
        content: data.message || `Based on the services selected, I'd suggest $${price} for this job. Feel free to adjust the price up or down.`,
        suggestedPrice: price,
      });

      setStep("price");
    } catch {
      setIsTyping(false);
      const fallbackPrice = selectedServices.length * 20 + 25;
      setSuggestedPrice(fallbackPrice);
      addMessage({
        role: "assistant",
        content: `Based on the ${selectedServices.length} services selected, I'd suggest $${fallbackPrice}. You can adjust this up or down.`,
        suggestedPrice: fallbackPrice,
      });
      setStep("price");
    }

    scrollToBottom();
  };

  // Handle price confirm
  const handlePriceConfirm = (price: number) => {
    setConfirmedPrice(price);
    addMessage({ role: "user", content: `$${price} confirmed` });
    setStep("business_name");
    addBotMessage(
      "Almost done! What's your business name? This will show on the quote."
    );
  };

  // Handle business name
  const handleBusinessName = async (name: string) => {
    setBusinessName(name);
    addMessage({ role: "user", content: name });
    setStep("generating");

    setIsTyping(true);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: name,
          services: selectedServices,
          price: confirmedPrice * 100, // convert to cents
          photos: photos,
        }),
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.id) {
        const url = `/quote/${data.id}`;
        setQuoteUrl(url);
        addMessage({
          role: "assistant",
          content: `Your quote is ready! Send this link to your customer and they can pay instantly.`,
          quoteId: data.id,
          quoteUrl: url,
        });
        setStep("done");
      } else {
        addMessage({
          role: "assistant",
          content: "Something went wrong creating the quote. Try again.",
        });
        setStep("business_name");
      }
    } catch {
      setIsTyping(false);
      addMessage({
        role: "assistant",
        content: "Something went wrong. Please try again.",
      });
      setStep("business_name");
    }

    scrollToBottom();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#2d6a4f] px-4 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-lg">
        <Link
          href="/"
          className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center
            hover:bg-white/25 transition-colors duration-150 active:scale-[0.95]"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-white font-semibold text-[15px]">
            Lavista Quote Assistant
          </div>
          <div className="text-white/60 text-xs">Always here to help</div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 hide-scrollbar"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Interactive widgets */}
        {step === "photos" && !isTyping && messages.length > 0 && (
          <PhotoUploader
            photos={photos}
            onAdd={(newPhotos) =>
              setPhotos((prev) => [...prev, ...newPhotos].slice(0, 3))
            }
            onRemove={(i) => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
            onConfirm={handlePhotosConfirm}
          />
        )}

        {step === "services" && !isTyping && (
          <ServiceSelector
            selected={selectedServices}
            onToggle={toggleService}
            onConfirm={handleServicesConfirm}
          />
        )}

        {step === "price" && !isTyping && (
          <PriceAdjuster
            suggestedPrice={suggestedPrice}
            onConfirm={handlePriceConfirm}
          />
        )}

        {step === "business_name" && !isTyping && (
          <BusinessNameInput onSubmit={handleBusinessName} />
        )}

        {step === "done" && quoteUrl && !isTyping && (
          <QuoteReady quoteUrl={quoteUrl} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Text Input (visible during photo step to allow skipping photos) */}
      {step === "photos" && !isTyping && (
        <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendText();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or describe the job..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-gray-900
                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#52b788]/30
                transition-all duration-200"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="w-11 h-11 bg-[#2d6a4f] rounded-xl flex items-center justify-center
                disabled:opacity-30 hover:bg-[#40916c] active:scale-[0.95]
                transition-all duration-150"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
