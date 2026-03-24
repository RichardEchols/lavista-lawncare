"use client";

import { motion } from "framer-motion";
import {
  Camera,
  MessageSquare,
  DollarSign,
  ArrowLeft,
  Leaf,
  Sparkles,
  Shield,
  Zap,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const appleSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: appleSpring },
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left p-5 bg-white rounded-2xl border border-gray-100 shadow-sm
        hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-gray-900">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>
      {open && (
        <p className="mt-3 text-gray-500 text-[15px] leading-relaxed">{a}</p>
      )}
    </button>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#2d6a4f] font-semibold hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Chat
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#40916c] to-[#2d6a4f] flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[15px] font-bold text-[#2d6a4f]">
              Lavista
            </span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-20 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeUp} className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d8f3dc] text-[#2d6a4f] text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              AI-Powered Quotes
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-gray-900 mb-5"
          >
            Snap. Quote.{" "}
            <span className="text-[#2d6a4f]">Get Paid.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Take a picture of the yard. AI creates a professional quote.
            Customer pays instantly. That simple.
          </motion.p>

          <motion.div variants={fadeUp}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3.5
                bg-[#2d6a4f] text-white text-base font-semibold rounded-2xl
                transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                hover:bg-[#40916c] active:scale-[0.98]
                shadow-xl shadow-[#2d6a4f]/25"
            >
              Start Quoting
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-16 md:py-24 px-6 bg-[#f0faf4]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={appleSpring}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-3">
              How It Works
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Three steps. Under a minute. From yard to payment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Camera,
                title: "Upload Photos",
                desc: "Snap a picture of the yard from the field. Or just describe the job.",
                step: "1",
              },
              {
                icon: MessageSquare,
                title: "AI Creates Quote",
                desc: "AI analyzes the photos, suggests a price, and generates a professional quote.",
                step: "2",
              },
              {
                icon: DollarSign,
                title: "Get Paid",
                desc: "Send the quote link to your customer. They pay instantly with a card.",
                step: "3",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative bg-white rounded-2xl p-7 shadow-lg shadow-black/5 border border-gray-100"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...appleSpring, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-11 h-11 rounded-xl bg-[#d8f3dc] flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-[#2d6a4f]" />
                </div>
                <div className="absolute top-5 right-5 text-4xl font-bold text-[#b7e4c7]/40">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={appleSpring}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-3">
              Built for Landscapers
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              No more scribbling quotes on paper. No more chasing payments.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: Zap,
                title: "60-Second Quotes",
                desc: "From photo to professional quote faster than writing on a napkin.",
              },
              {
                icon: Camera,
                title: "AI Photo Analysis",
                desc: "AI looks at the yard and suggests pricing based on size and condition.",
              },
              {
                icon: DollarSign,
                title: "Instant Payments",
                desc: "Customers pay online with a card. Money hits your account fast.",
              },
              {
                icon: Shield,
                title: "Professional Look",
                desc: "Branded quotes with your business name. Look bigger than you are.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="flex gap-4 p-5 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...appleSpring, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="w-10 h-10 rounded-lg bg-[#d8f3dc] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#2d6a4f]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-[15px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 px-6 bg-[#f0faf4]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={appleSpring}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-3">
              Simple Pricing
            </h2>
            <p className="text-gray-500">
              Your first quote is free. Then pick a plan.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={appleSpring}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-7 shadow-lg shadow-black/5 border border-gray-100 text-center"
            >
              <div className="text-4xl font-bold text-[#2d6a4f] mb-1">$5</div>
              <div className="text-gray-500 text-sm mb-4">per quote</div>
              <div className="text-sm text-gray-600">
                Pay only when you need a quote. No commitment.
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ ...appleSpring, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-7 shadow-lg shadow-black/5 border-2 border-[#2d6a4f] text-center relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2d6a4f] text-white text-xs font-bold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
              <div className="text-4xl font-bold text-[#2d6a4f] mb-1">$29</div>
              <div className="text-gray-500 text-sm mb-4">/month unlimited</div>
              <div className="text-sm text-gray-600">
                Unlimited quotes. Create as many as you need.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.h2
            className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Questions?
          </motion.h2>

          <div className="space-y-3">
            <FAQItem
              q="How does the AI know what to charge?"
              a="Our AI analyzes the photos you upload — looking at yard size, condition, and the services you select — then suggests a competitive price. You can always adjust it."
            />
            <FAQItem
              q="How does my customer pay?"
              a="You get a quote link to send to your customer. They open it, see the services and price, and pay with any credit or debit card. Money goes to your Stripe account."
            />
            <FAQItem
              q="Is the first quote really free?"
              a="Yes! Your very first quote is completely free, no payment info needed. After that, choose the $5 per-quote or $29/month unlimited plan."
            />
            <FAQItem
              q="Do I need to sign up?"
              a="No signup required for your free quote. After that, we just need your phone number to keep track of your account."
            />
            <FAQItem
              q="What if I need help?"
              a="Reach out anytime. We're a small team and we respond fast."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#40916c] to-[#2d6a4f] flex items-center justify-center">
              <Leaf className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#2d6a4f]">
              Lavista Lawn Care
            </span>
          </div>
          <p className="text-sm text-gray-400">Built by RMDW LLC</p>
        </div>
      </footer>
    </div>
  );
}
