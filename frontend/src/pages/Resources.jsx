import React, { useState } from "react";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import { FaBookOpen, FaChartLine, FaPiggyBank, FaLightbulb, FaCalculator, FaYoutube, FaFileDownload, FaUniversity, FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";

const resourceCategories = [
  {
    name: "Guides & Articles",
    color: "from-[#1db954] to-[#1e90ff]",
    resources: [
      {
        icon: <FaBookOpen size={32} className="text-[#d1a6ff]" />,
        title: "Beginner's Guide to Budgeting",
        desc: "Learn the basics of budgeting, setting goals, and tracking your expenses.",
        link: "https://www.investopedia.com/budgeting-5079744",
        type: "article",
      },
      {
        icon: <FaChartLine size={32} className="text-[#1db954]" />,
        title: "Investing 101",
        desc: "Understand the fundamentals of investing and how to grow your wealth.",
        link: "https://www.nerdwallet.com/article/investing/investing-101",
        type: "article",
      },
      {
        icon: <FaPiggyBank size={32} className="text-[#1e90ff]" />,
        title: "Smart Saving Tips",
        desc: "Discover practical ways to save more and reach your financial goals.",
        link: "https://www.ramseysolutions.com/budgeting/how-to-save-money",
        type: "article",
      },
      {
        icon: <FaUniversity size={32} className="text-[#f59e42]" />,
        title: "Financial Literacy for Students",
        desc: "Essential money lessons for students and young adults.",
        link: "https://www.practicalmoneyskills.com/learn",
        type: "article",
      },
      {
        icon: <FaMoneyBillWave size={32} className="text-green-400" />,
        title: "How to Build an Emergency Fund",
        desc: "Step-by-step guide to creating a safety net for unexpected expenses.",
        link: "https://www.thebalance.com/how-to-build-an-emergency-fund-1289587",
        type: "article",
      },
    ],
  },
  {
    name: "Calculators & Tools",
    color: "from-[#f59e42] to-[#1db954]",
    resources: [
      {
        icon: <FaCalculator size={32} className="text-[#f59e42]" />,
        title: "Financial Planning Tools",
        desc: "Explore calculators and tools to help you plan your finances.",
        link: "https://www.calculator.net/financial-calculator.html",
        type: "tool",
      },
      {
        icon: <FaCalculator size={32} className="text-[#1e90ff]" />,
        title: "Budget Calculator",
        desc: "Interactive tool to help you create and manage your budget.",
        link: "https://www.nerdwallet.com/article/finance/budget-calculator",
        type: "tool",
      },
      {
        icon: <FaCalculator size={32} className="text-[#1db954]" />,
        title: "Retirement Calculator",
        desc: "Estimate how much you need to save for retirement.",
        link: "https://www.investor.gov/financial-tools-calculators/calculators/retirement-savings-calculator",
        type: "tool",
      },
      {
        icon: <FaMobileAlt size={32} className="text-[#d1a6ff]" />,
        title: "Best Budgeting Apps",
        desc: "Compare top budgeting apps to manage your money on the go.",
        link: "https://www.cnet.com/personal-finance/banking/best-budgeting-app/",
        type: "tool",
      },
    ],
  },
  {
    name: "Videos & Courses",
    color: "from-[#1e90ff] to-[#d1a6ff]",
    resources: [
      {
        icon: <FaYoutube size={32} className="text-red-500" />,
        title: "Financial Planning Basics (YouTube)",
        desc: "Watch this video to understand the basics of financial planning.",
        link: "https://www.youtube.com/watch?v=QkQ8QbKjK5w",
        type: "video",
      },
      {
        icon: <FaYoutube size={32} className="text-[#1db954]" />,
        title: "Investing for Beginners (YouTube)",
        desc: "A beginner-friendly video on how to start investing.",
        link: "https://www.youtube.com/watch?v=9UuG8T2rE8k",
        type: "video",
      },
      {
        icon: <FaYoutube size={32} className="text-[#1e90ff]" />,
        title: "How to Save Money (YouTube)",
        desc: "Tips and tricks for saving money effectively.",
        link: "https://www.youtube.com/watch?v=G7k5nqkKkz8",
        type: "video",
      },
      {
        icon: <FaFileDownload size={32} className="text-[#f59e42]" />,
        title: "Downloadable Budget Template",
        desc: "Get a free Excel/Google Sheets template to start budgeting today.",
        link: "https://www.vertex42.com/ExcelTemplates/personal-budget-spreadsheet.html",
        type: "download",
      },
    ],
  },
];

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-white transition-colors">
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground />
      </div>
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text drop-shadow-lg">
          Financial Resources & Education
        </h1>
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {resourceCategories.map((cat, idx) => (
            <button
              key={cat.name}
              className={`px-6 py-2 rounded-full font-semibold text-white transition-all text-lg shadow-lg bg-gradient-to-r ${cat.color} ${activeCategory === idx ? "scale-105 ring-2 ring-white/30" : "opacity-70 hover:opacity-100"}`}
              onClick={() => setActiveCategory(idx)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {resourceCategories[activeCategory].resources.map((res, idx) => (
            <a
              key={idx}
              href={res.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl transition-transform duration-300 hover:scale-105 hover:bg-white/10 group relative overflow-hidden"
            >
              <div className="flex justify-center mb-4">{res.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-center text-white">
                {res.title}
              </h3>
              <p className="text-sm text-center text-gray-300 mb-2">{res.desc}</p>
              <div className="text-center mt-2">
                {res.type === "video" ? (
                  <span className="inline-block px-4 py-1 rounded-full bg-red-500 text-white text-xs font-semibold shadow">
                    Watch Video
                  </span>
                ) : res.type === "download" ? (
                  <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-[#f59e42] to-[#1db954] text-white text-xs font-semibold shadow">
                    Download
                  </span>
                ) : res.type === "tool" ? (
                  <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white text-xs font-semibold shadow">
                    Try Tool
                  </span>
                ) : (
                  <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white text-xs font-semibold shadow">
                    Read More
                  </span>
                )}
              </div>
              {/* Interactive 3D hover effect */}
              <div className="absolute inset-0 pointer-events-none group-hover:scale-105 group-hover:rotate-1 group-hover:shadow-2xl transition-transform duration-300" style={{ boxShadow: '0 8px 32px 0 rgba(30,144,255,0.15)' }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources; 