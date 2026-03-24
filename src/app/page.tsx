"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Send, Leaf, ImagePlus, Info } from "lucide-react";
import Link from "next/link";
import { v4 as uuid } from "uuid";
import ChatBubble from "@/components/ChatBubble";
import ServiceSelector from "@/components/ServiceSelector";
import PhotoUploader from "@/components/PhotoUploader";
import PriceAdjuster from "@/components/PriceAdjuster";
import BusinessNameInput from "@/components/BusinessNameInput";
import QuoteReady from "@/components/QuoteReady";
import PaywallCard from "@/components/PaywallCard";
import TypingIndicator from "@/components/TypingIndicator";
import type { ChatMessage, ServiceType } from "@/lib/types";

type Step =
  | "welcome"
  | "photos"
  | "services"
  | "analyzing"
  | "price"
  | "business_name"
  | "generating"
  | "done"
  | "paywall";

function getFreeQuoteUsed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("lavista_free_used") === "true";
}

function markFreeQuoteUsed() {
  if (typeof window !== "undefined") {
    localStorage.setItem("lavista_free_used", "true");
  }
}

function getPaidSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lavista_paid_session");
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<Step>("welcome");
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [suggestedPrice, setSuggestedPrice] = useState(0);
  const [confirmedPrice, setConfirmedPrice] = useState(0);
  const [quoteUrl, setQuoteUrl] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [textInput, setTextInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
      // Check if returning from payment
      const params = new URLSearchParams(window.location.search);
      const paymentSuccess = params.get("payment") === "success";

      if (paymentSuccess) {
        const plan = params.get("plan");
        // Store paid session
        if (plan === "unlimited") {
          localStorage.setItem("lavista_paid_session", "unlimited");
        } else if (plan === "per_quote") {
          localStorage.setItem("lavista_paid_session", "per_quote");
        }
        // Clear the URL params
        window.history.replaceState({}, "", "/");
        addBotMessage(
          "Payment received! You're all set. Upload a photo of the yard and I'll help you create a quote."
        );
      } else {
        addBotMessage(
          "Hey! Upload a photo of the yard and I'll help you create a quote in seconds."
        );
      }
      setStep("photos");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Check paywall before starting quote flow
  const checkPaywall = (): boolean => {
    const freeUsed = getFreeQuoteUsed();
    const paidSession = getPaidSession();

    if (!freeUsed) return false; // First quote is free
    if (paidSession === "unlimited") return false; // Unlimited subscriber
    if (paidSession === "per_quote") {
      // Single quote paid — consume it
      localStorage.removeItem("lavista_paid_session");
      return false;
    }

    // Paywall
    return true;
  };

  // Handle photo upload from the camera button in input bar
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setPhotos((prev) => [...prev, ...results].slice(0, 3));
    });

    if (fileRef.current) fileRef.current.value = "";
  };

  // Handle photo confirm
  const handlePhotosConfirm = () => {
    if (checkPaywall()) {
      setStep("paywall");
      addBotMessage(
        "You've used your free quote! To keep generating quotes, choose a plan below."
      );
      return;
    }

    addMessage({
      role: "user",
      content: `Uploaded ${photos.length} photo${photos.length > 1 ? "s" : ""}`,
      photos: photos,
    });
    setStep("services");
    addBotMessage(
      "What services are you providing? Select all that apply."
    );
  };

  // Handle text message (skip photos)
  const handleSendText = () => {
    if (!textInput.trim()) return;

    if (step === "photos") {
      if (checkPaywall()) {
        setStep("paywall");
        addBotMessage(
          "You've used your free quote! To keep generating quotes, choose a plan below."
        );
        return;
      }
    }

    addMessage({ role: "user", content: textInput });
    setTextInput("");

    if (step === "photos") {
      setStep("services");
      addBotMessage(
        "What services are you providing? Select all that apply."
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
        content:
          data.message ||
          `Based on what I see, I'd suggest $${price}. Want to adjust?`,
        suggestedPrice: price,
      });

      setStep("price");
    } catch {
      setIsTyping(false);
      const fallbackPrice = selectedServices.length * 20 + 25;
      setSuggestedPrice(fallbackPrice);
      addMessage({
        role: "assistant",
        content: `Based on the ${selectedServices.length} services, I'd suggest $${fallbackPrice}. Want to adjust?`,
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
      "What's your business name? This will appear on the quote."
    );
  };

  // Handle business name
  const handleBusinessName = async (name: string) => {
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
          price: confirmedPrice * 100,
          photos: photos,
        }),
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.id) {
        const url = `/quote/${data.id}`;
        setQuoteUrl(url);

        // Mark free quote as used
        markFreeQuoteUsed();

        addMessage({
          role: "assistant",
          content:
            "Here's your quote link! Send it to your customer.",
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

  // Start a new quote
  const handleNewQuote = () => {
    setPhotos([]);
    setSelectedServices([]);
    setSuggestedPrice(0);
    setConfirmedPrice(0);
    setQuoteUrl("");
    setTextInput("");

    if (checkPaywall()) {
      setStep("paywall");
      addBotMessage(
        "You've used your free quote! To keep generating quotes, choose a plan below."
      );
    } else {
      setStep("photos");
      addBotMessage(
        "Ready for another one! Upload a photo of the yard or describe the job."
      );
    }
  };

  // Handle paywall payment redirect
  const handlePaywallSelect = async (plan: "per_quote" | "unlimited") => {
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      addBotMessage("Something went wrong. Please try again.");
    }
  };

  const showInputBar = step === "photos" || step === "done";

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header — minimal */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#40916c] to-[#2d6a4f] flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="text-[17px] font-bold text-[#2d6a4f] tracking-tight">
            Lavista Lawn Care
          </span>
        </div>
        <Link
          href="/about"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#40916c] transition-colors duration-200"
        >
          <Info className="w-4 h-4" />
          <span>About</span>
        </Link>
      </div>

      {/* Messages Area */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 hide-scrollbar bg-gray-50/50"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Interactive widgets */}
        {step === "photos" && !isTyping && messages.length > 0 && photos.length > 0 && (
          <PhotoUploader
            photos={photos}
            onAdd={(newPhotos) =>
              setPhotos((prev) => [...prev, ...newPhotos].slice(0, 3))
            }
            onRemove={(i) =>
              setPhotos((prev) => prev.filter((_, idx) => idx !== i))
            }
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
          <QuoteReady quoteUrl={quoteUrl} onNewQuote={handleNewQuote} />
        )}

        {step === "paywall" && !isTyping && (
          <PaywallCard onSelect={handlePaywallSelect} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar — iMessage style */}
      {showInputBar && (
        <div className="px-3 pb-[env(safe-area-inset-bottom,8px)] pt-2 bg-white border-t border-gray-100 flex-shrink-0">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendText();
            }}
            className="flex items-center gap-2"
          >
            {/* Camera button */}
            <button
              type="button"
              onClick={() => {
                if (fileRef.current) {
                  fileRef.current.removeAttribute("capture");
                  fileRef.current.click();
                }
              }}
              className="w-10 h-10 rounded-full bg-[#2d6a4f] flex items-center justify-center
                hover:bg-[#40916c] active:scale-[0.95] transition-all duration-150 flex-shrink-0"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>

            {/* Gallery button */}
            <button
              type="button"
              onClick={() => {
                if (fileRef.current) {
                  fileRef.current.removeAttribute("capture");
                  fileRef.current.click();
                }
              }}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center
                hover:bg-gray-200 active:scale-[0.95] transition-all duration-150 flex-shrink-0"
            >
              <ImagePlus className="w-5 h-5 text-gray-500" />
            </button>

            {/* Text input */}
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={
                step === "done"
                  ? "Start a new quote..."
                  : "Describe the yard..."
              }
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-[15px] text-gray-900
                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#52b788]/30
                transition-all duration-200"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="w-10 h-10 rounded-full bg-[#2d6a4f] flex items-center justify-center
                disabled:opacity-30 hover:bg-[#40916c] active:scale-[0.95]
                transition-all duration-150 flex-shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
