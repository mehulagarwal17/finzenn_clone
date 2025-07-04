import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqList = [
  {
    q: "Is FinZen free to use?",
    a: "Yes, FinZen offers a free plan with essential features for everyone. Premium plans are available too.",
  },
  {
    q: "Is my financial data safe?",
    a: "Absolutely. We use bank-level AES-256 encryption and never share your data with third parties.",
  },
  {
    q: "Can I sync multiple UPI apps?",
    a: "Yes, you can connect GPay, PhonePe, Paytm and many more under a single dashboard.",
  },
  {
    q: "What is AI Analyzer?",
    a: "It helps you track patterns, gives nudges, and classifies your transactions automatically using AI.",
  },
  {
    q: "Will I get spending alerts?",
    a: "Yes, you'll receive instant alerts and nudges if your spending exceeds your set limits.",
  },
  {
    q: "Is there a mobile app?",
    a: "We're working on it! FinZen's mobile app will launch soon with full sync and offline access.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 bg-[#0a0f1c] text-white overflow-hidden">
      {/* Bubble Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="faqBubble" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#1db954" />
              <stop offset="100%" stopColor="#1e3c72" />
            </radialGradient>
          </defs>
          <g fill="url(#faqBubble)" fillOpacity="0.15">
            {Array.from({ length: 25 }).map((_, i) => (
              <circle
                key={i}
                r={Math.random() * 100 + 20}
                cx={Math.random() * 1600}
                cy={Math.random() * 1000}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Section Heading */}
      <motion.h2
        className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Frequently Asked Questions
      </motion.h2>

      {/* FAQ Cards */}
      <div className="max-w-4xl mx-auto space-y-4 px-6">
        {faqList.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-xl transition hover:bg-white/10"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left"
            >
              <div className="text-lg font-semibold text-[#e6ccff]">
                <motion.h2
                  className=" bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.q}
                </motion.h2>
              </div>
              <span className="text-[#d1a6ff]">
                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.p
                  className="text-gray-300 mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
