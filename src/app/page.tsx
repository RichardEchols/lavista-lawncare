"use client";

import { motion } from "framer-motion";
import {
  Camera,
  MessageSquare,
  DollarSign,
  ArrowRight,
  Leaf,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";

const appleSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: appleSpring },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#40916c] to-[#2d6a4f] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-[#2d6a4f] tracking-tight">
              Lavista
            </span>
          </div>
          <Link
            href="/quote"
            className="px-5 py-2.5 bg-[#2d6a4f] text-white text-sm font-semibold rounded-xl
              transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
              hover:bg-[#40916c] active:scale-[0.98] shadow-lg shadow-[#2d6a4f]/20"
          >
            Start Quoting
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d8f3dc] text-[#2d6a4f] text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              AI-Powered Quotes
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[1.08] tracking-tight text-gray-900 mb-6"
          >
            Snap. Quote.
            <br />
            <span className="text-[#2d6a4f]">Get Paid.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Take a picture of the yard. AI creates a professional quote.
            Customer pays instantly. That simple.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4
                bg-[#2d6a4f] text-white text-lg font-semibold rounded-2xl
                transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                hover:bg-[#40916c] active:scale-[0.98]
                shadow-xl shadow-[#2d6a4f]/25"
            >
              Start Your First Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <span className="text-sm text-gray-400 font-medium">
              Free to use. No signup.
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Phone Mockup / Chat Preview */}
      <section className="pb-20 md:pb-32 px-6">
        <motion.div
          className="max-w-sm mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={appleSpring}
          viewport={{ once: true }}
        >
          <div className="bg-gray-50 rounded-[2rem] p-3 shadow-2xl shadow-black/10 border border-gray-200">
            <div className="bg-white rounded-[1.5rem] overflow-hidden">
              {/* Fake chat header */}
              <div className="bg-[#2d6a4f] px-5 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Lavista AI</div>
                  <div className="text-white/60 text-xs">Online</div>
                </div>
              </div>
              {/* Fake messages */}
              <div className="p-4 space-y-3">
                <div className="flex gap-2">
                  <div className="bg-[#f0faf4] text-[#2d6a4f] text-sm rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%]">
                    Welcome! Upload photos of the yard and I&apos;ll help you create
                    a professional quote.
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-[#2d6a4f] text-white text-sm rounded-2xl rounded-tr-md px-4 py-2.5">
                    Mowing + Edging + Blowing
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="bg-[#f0faf4] text-[#2d6a4f] text-sm rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[80%]">
                    Based on the yard size, I&apos;d suggest <strong>$85</strong>. Want to
                    adjust?
                  </div>
                </div>
              </div>
              {/* Fake input */}
              <div className="px-4 pb-4">
                <div className="bg-gray-100 rounded-full px-4 py-3 text-sm text-gray-400">
                  Type a message...
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-20 md:py-32 px-6 bg-[#f0faf4]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={appleSpring}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Three steps. Under a minute. From yard to payment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
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
                className="relative bg-white rounded-2xl p-8 shadow-lg shadow-black/5 border border-gray-100"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...appleSpring, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#d8f3dc] flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-[#2d6a4f]" />
                </div>
                <div className="absolute top-6 right-6 text-5xl font-bold text-[#b7e4c7]/40">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={appleSpring}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Built for Landscapers
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              No more scribbling quotes on paper. No more chasing payments.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
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
                className="flex gap-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...appleSpring, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="w-10 h-10 rounded-lg bg-[#d8f3dc] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#2d6a4f]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
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
      <section className="py-20 md:py-32 px-6 bg-[#f0faf4]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={appleSpring}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Simple Pricing
            </h2>
            <p className="text-lg text-gray-500 mb-12">
              Free to create quotes. Only pay when you get paid.
            </p>

            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-black/5 border border-gray-100 max-w-md mx-auto">
              <div className="text-6xl font-bold text-[#2d6a4f] mb-2">Free</div>
              <div className="text-gray-500 mb-8">to create unlimited quotes</div>
              <div className="border-t border-gray-100 pt-6 space-y-4 text-left">
                {[
                  "Unlimited photo uploads",
                  "AI-powered price suggestions",
                  "Professional branded quotes",
                  "Instant payment links",
                  "Works on any phone",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#d8f3dc] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#2d6a4f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="text-sm text-gray-400">
                  Small processing fee on paid invoices
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={appleSpring}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Ready to get paid faster?
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto">
            No signup. No credit card. Just open it and start quoting.
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-3 px-8 py-4
              bg-[#2d6a4f] text-white text-lg font-semibold rounded-2xl
              transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
              hover:bg-[#40916c] active:scale-[0.98]
              shadow-xl shadow-[#2d6a4f]/25"
          >
            Start Your First Quote — Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#40916c] to-[#2d6a4f] flex items-center justify-center">
              <Leaf className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#2d6a4f]">
              Lavista Lawn Care
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Built by RMDW LLC
          </p>
        </div>
      </footer>
    </div>
  );
}
