// 📁 src/pages/Dashboard.jsx
import React, { useRef, useEffect, useState } from "react";
// import Sidebar from "../components/layout/Sidebar";
// Placeholder imports for new/updated components
// import Header from "../components/layout/Header";
import FinancialOverviewCards from "../components/dashboard/FinancialOverviewCards";
import SpendingChart from "../components/dashboard/SpendingChart";
import IncomeChart from "../components/dashboard/IncomeChart";
import IncomeVsExpenseChart from "../components/dashboard/IncomeVsExpenseChart";
import TransactionHistory from "../components/dashboard/TransactionHistory";
import QuickInsights from "../components/dashboard/QuickInsights";
import SpendingCoach from "../components/dashboard/SpendingCoach";
import MicroInvestorGuide from "../components/dashboard/MicroInvestorGuide";
import GreetingSection from "../components/dashboard/GreetingSection";
import BankSync from "../components/dashboard/BankSync";
import ReceiptScanner from '../components/dashboard/ReceiptScanner';
import { useNavigate } from "react-router-dom";
import { addTransaction, fetchTransactions } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const transactionSectionRef = useRef(null);
  const [onboardingData, setOnboardingData] = useState({});
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    // Try to get onboarding data from localStorage (for demo)
    const data = JSON.parse(localStorage.getItem("onboardingData") || '{}');
    setOnboardingData(data);
  }, []);

  const handleAddTransaction = () => {
    if (transactionSectionRef.current) {
      transactionSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => {
      window.dispatchEvent(new Event("openAddTransactionModal"));
    }, 400); // allow scroll to finish
  };

  const handleAddExpense = async (expense) => {
    await addTransaction({
      title: expense.description || 'Receipt Expense',
      category: expense.category || 'Scanned',
      date: expense.date || new Date().toISOString().slice(0, 10),
      amount: -Math.abs(Number(expense.amount)),
      icon: '🧾',
    });
    setShowScanner(false);
    fetchTransactions(); // Refresh the transactions list after adding
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-white transition-colors pt-24 flex flex-col md:flex-row">
      {/* Sidebar removed */}
      {/* Main Content */}
      <main className="flex-1 px-2 sm:px-4 md:px-10 py-8 transition-all w-full max-w-full overflow-x-auto flex flex-col items-center">
        {/* Onboarding Data Card */}
        {(onboardingData.goal || onboardingData.categories?.length || onboardingData.upiApps?.length) && (
          <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#1db954]/30 to-[#1e90ff]/30 border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Your Profile Highlights</h3>
              <div className="flex flex-wrap gap-4">
                {onboardingData.upiApps?.length > 0 && (
                  <div>
                    <div className="text-white/70 text-sm">UPI Apps</div>
                    <div className="font-semibold text-white">{onboardingData.upiApps.join(", ")}</div>
                  </div>
                )}
                {onboardingData.goal && (
                  <div>
                    <div className="text-white/70 text-sm">Financial Goal</div>
                    <div className="font-semibold text-white">₹{onboardingData.goal.toLocaleString()}</div>
                  </div>
                )}
                {onboardingData.categories?.length > 0 && (
                  <div>
                    <div className="text-white/70 text-sm">Preferred Categories</div>
                    <div className="font-semibold text-white">{onboardingData.categories.join(", ")}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Greeting and Add Transaction */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 w-full">
          <GreetingSection />
          <BankSync />
          <div className="flex gap-4 mb-6">
            <button
              className="bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
              onClick={() => setShowScanner(true)}
            >
              Scan Receipt
            </button>
          <button
            className="bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white px-4 sm:px-6 py-3 rounded-xl shadow-lg font-semibold hover:scale-105 transition-transform self-center md:self-auto w-full md:w-auto"
            onClick={handleAddTransaction}
          >
            + Add Transaction
          </button>
          </div>
        </div>
        {/* Overview Section */}
        <section className="mb-10 w-full">
          <h2 className="text-xl font-bold text-white/80 mb-4">Overview</h2>
          <FinancialOverviewCards />
        </section>
        {/* Charts Section */}
        <section className="mb-10 w-full">
          <h2 className="text-xl font-bold text-white/80 mb-4">Charts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            <SpendingChart />
            <IncomeChart />
          </div>
          <div className="mt-10 w-full">
            <IncomeVsExpenseChart />
          </div>
        </section>
        {/* Transactions Section */}
        <section className="mb-10 w-full" ref={transactionSectionRef}>
          <h2 className="text-xl font-bold text-white/80 mb-4">Recent Transactions</h2>
          <TransactionHistory />
        </section>
        {/* Insights Section */}
        <section className="mb-10 w-full">
          <h2 className="text-xl font-bold text-white/80 mb-4">Quick Insights</h2>
          <QuickInsights />
        </section>
        {/* AI & Tools Section */}
        {/* <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <SpendingCoach />
          </div>
          <div>
            <MicroInvestorGuide />
          </div>
        </section> */}
      </main>
      {showScanner && (
        <ReceiptScanner onExpenseAdd={handleAddExpense} onClose={() => setShowScanner(false)} />
      )}
    </div>
  );
};

export default Dashboard;
