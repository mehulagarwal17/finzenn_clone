// In src/components/dashboard/DemoBankModal.jsx (create this file)
import React from "react";

const demoTransactions = [
  { date: "2025-06-25", description: "Starbucks", amount: -250 },
  { date: "2025-06-24", description: "Salary", amount: 50000 },
  { date: "2025-06-23", description: "Amazon", amount: -1200 },
  { date: "2025-06-22", description: "Uber", amount: -350 },
];

const DemoBankModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 className="text-xl font-bold mb-2">Demo Bank Sync</h2>
      <p className="mb-4 text-gray-600">
        This is a <span className="font-semibold text-blue-600">demo</span> for hackathon purposes. No real bank data is used.
      </p>
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="text-left">Date</th>
            <th className="text-left">Description</th>
            <th className="text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {demoTransactions.map((txn, idx) => (
            <tr key={idx}>
              <td>{txn.date}</td>
              <td>{txn.description}</td>
              <td className="text-right">{txn.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

export default DemoBankModal;