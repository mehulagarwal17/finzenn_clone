import React, { useState, useRef } from "react";
import { FiUpload, FiX, FiCopy, FiCalendar } from "react-icons/fi";
import Tesseract from "tesseract.js";

const extractAmount = (text) => {
  // Find all numbers in the text, return the largest as the likely amount
  const matches = text.match(/\d+[.,]?\d*/g);
  if (!matches) return "";
  return matches.map(s => parseFloat(s.replace(/,/g, ""))).sort((a, b) => b - a)[0] || "";
};

function formatDateForInput(dateStr) {
  if (!dateStr) return "";
  // Try to match dd-mm-yyyy, dd/mm/yyyy, dd.mm.yyyy, dd mm yyyy
  const match = dateStr.match(/(\d{1,2})[\/\-.\s](\d{1,2})[\/\-.\s](\d{2,4})/);
  if (match) {
    let [ , d, m, y ] = match;
    if (y.length === 2) y = '20' + y; // handle yy as yyyy
    d = d.padStart(2, '0');
    m = m.padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  // Try to match yyyy-mm-dd, yyyy/mm/dd, yyyy.mm.dd, yyyy mm dd
  const match2 = dateStr.match(/(\d{4})[\/\-.\s](\d{1,2})[\/\-.\s](\d{1,2})/);
  if (match2) {
    let [ , y, m, d ] = match2;
    d = d.padStart(2, '0');
    m = m.padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return "";
}

const ReceiptScanner = ({ onExpenseAdd, onClose }) => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [form, setForm] = useState({ amount: "", description: "", date: "" });
  const [showText, setShowText] = useState(false);
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setFile(file);
      setOcrText("");
      setForm({ amount: "", description: "", date: "" });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(URL.createObjectURL(e.dataTransfer.files[0]));
      setFile(e.dataTransfer.files[0]);
      setOcrText("");
      setForm({ amount: "", description: "", date: "" });
    }
  };

  const handleScan = async () => {
    setScanning(true);
    setOcrText("Scanning...");
    const result = await Tesseract.recognize(image, "eng", { logger: m => {} });
    setOcrText(result.data.text);
    setScanning(false);
    setShowText(true);

    // Send OCR text to backend for smarter parsing
    try {
      const response = await fetch("/api/transactions/parse-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: result.data.text }),
      });
      const data = await response.json();
      setForm(f => ({
        ...f,
        amount: data.amount || "",
        category: data.category || "",
        date: formatDateForInput(data.date) || "",
      }));
    } catch (err) {
      // fallback: just extract amount from text
      const amount = extractAmount(result.data.text);
      setForm(f => ({ ...f, amount: amount || "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the transaction object
    const transaction = {
      title: 'Receipt Expense',
      category: form.category || 'Other',
      date: form.date || new Date().toISOString().slice(0, 10),
      amount: -Math.abs(Number(form.amount)), // negative for expense
      icon: '🧾',
    };
    // POST to backend
    await fetch('/api/transactions/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });
    if (onExpenseAdd) onExpenseAdd(transaction);
    setImage(null);
    setFile(null);
    setOcrText("");
    setForm({ amount: "", category: "", date: "" });
    if (onClose) onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ocrText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white/80 dark:bg-[#181f2a]/90 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-3xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center animate-fade-in transition-colors max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-[#232b3a] shadow-lg text-2xl text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition z-50 border border-gray-200 dark:border-gray-700"
          aria-label="Close"
          type="button"
        >
          <FiX />
        </button>
        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text drop-shadow-lg tracking-tight">
          Scan Expense Receipt
        </h2>
        {/* Upload Area */}
        {!image && (
          <div
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-[#232b3a] cursor-pointer mb-6 transition hover:border-[#1db954] hover:bg-[#e6f9f0] dark:hover:bg-[#232b3a]/80"
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            tabIndex={0}
            aria-label="Upload receipt image"
          >
            <FiUpload className="text-4xl text-[#1db954] mb-2" />
            <span className="font-semibold text-gray-700 dark:text-gray-200">Click or drag to upload</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
        )}
        {/* Image Preview */}
        {image && (
          <div className="flex flex-col items-center mb-6 w-full">
            <img src={image} alt="Receipt Preview" className="rounded-xl max-h-56 shadow-lg border-2 border-gray-200 dark:border-gray-700 mb-2" />
            <button
              className="text-xs text-red-500 hover:underline mb-2"
              onClick={() => { setImage(null); setFile(null); }}
              type="button"
            >
              Remove Image
            </button>
          </div>
        )}
        {/* Scan Button */}
        {image && !form.amount && (
          <button
            className="mb-6 px-8 py-3 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white font-extrabold rounded-full shadow-xl text-lg hover:scale-105 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#1db954]/30 animate-pulse"
            onClick={handleScan}
            disabled={scanning}
            type="button"
          >
            {scanning ? "Scanning..." : "Scan Receipt"}
          </button>
        )}
        {/* Extracted Text Collapsible */}
        {ocrText && (
          <div className="w-full mb-4">
            <button
              className="flex items-center gap-2 text-sm font-semibold text-[#1e90ff] dark:text-[#60efff] mb-1 hover:underline"
              onClick={() => setShowText(v => !v)}
              type="button"
            >
              {showText ? "Hide Extracted Text" : "Show Extracted Text"}
              <FiCopy onClick={e => { e.stopPropagation(); handleCopy(); }} className="ml-2 text-lg hover:text-[#1db954] cursor-pointer" title="Copy text" />
            </button>
            {showText && (
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs text-gray-700 dark:text-gray-200 max-h-32 overflow-y-auto font-mono border border-gray-200 dark:border-gray-700">
                {ocrText}
              </div>
            )}
          </div>
        )}
        {/* Expense Form */}
        {form.amount && (
          <form onSubmit={handleSubmit} className="w-full space-y-4 mt-2">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Amount</label>
              <input
                type="number"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#232b3a] text-gray-900 dark:text-white text-lg font-bold"
                placeholder="Amount"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Category</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#232b3a] text-gray-900 dark:text-white"
                placeholder="Category (e.g. Food, Electricity)"
                value={form.category || ""}
                onChange={e => setForm({ ...form, category: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#232b3a] text-gray-900 dark:text-white pr-10"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                />
                <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white py-3 rounded-lg font-extrabold text-lg shadow-lg hover:scale-105 transition-all">Add Expense</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReceiptScanner; 