import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBell, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

const mockNotifications = [
  {
    id: 1,
    type: "success",
    title: "Goal Achieved!",
    message: "You reached your monthly savings goal. Great job!",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "info",
    title: "New Feature",
    message: "Check out the new Micro-Investor Guide in your dashboard.",
    timestamp: "1 day ago",
  },
  {
    id: 3,
    type: "warning",
    title: "Unusual Spending Detected",
    message: "Your spending in 'Dining Out' is 30% higher than last month.",
    timestamp: "3 days ago",
  },
];

const iconMap = {
  success: <FaCheckCircle className="text-green-400 text-xl" />,
  info: <FaInfoCircle className="text-blue-400 text-xl" />,
  warning: <FaExclamationCircle className="text-yellow-400 text-xl" />,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications); // Replace with API call in future
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-white transition-colors pt-28 px-4 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto w-full"
      >
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">Notifications</h2>
        {loading ? (
          <div className="text-white/60 text-center py-24">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-white/60 text-center py-24 flex flex-col items-center gap-2">
            <FaBell className="text-4xl mb-2" />
            No notifications yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="flex items-start gap-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm hover:bg-gray-200 dark:hover:bg-white/10 transition"
              >
                <div className="mt-1">{iconMap[n.type] || <FaBell className="text-gray-400 text-xl" />}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">{n.title}</span>
                    <span className="text-xs text-gray-400 dark:text-white/40 ml-2 whitespace-nowrap">{n.timestamp}</span>
                  </div>
                  <div className="text-gray-800 dark:text-white mt-1 text-sm">{n.message}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default Notifications; 