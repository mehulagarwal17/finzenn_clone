// In src/components/dashboard/BankSync.jsx (create this file)
import React, { useState, useRef } from "react";
import { FaUniversity } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import indianBanks from "./indianBanks"; // We'll create this file for bank names and logos

const BankSync = () => {
  const [step, setStep] = useState(0); // 0: bank list, 1: form, 2: enter otp, 3: success
  const [selectedBank, setSelectedBank] = useState(null);
  const [form, setForm] = useState({ account: "", ifsc: "", mobile: "" });
  const [show, setShow] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [formError, setFormError] = useState("");

  const handleBankClick = (bank) => {
    setSelectedBank(bank);
    setStep(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "account") {
      // Only allow digits
      setForm({ ...form, [name]: value.replace(/\D/g, "") });
    } else if (name === "ifsc") {
      // Only allow up to 11 alphanumeric, auto-uppercase
      setForm({ ...form, [name]: value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 11) });
    } else if (name === "mobile") {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    setFormError("");
    // Validate IFSC and account number
    if (form.ifsc.length !== 11) {
      setFormError("IFSC code must be exactly 11 characters.");
      return;
    }
    if (!/^[0-9]+$/.test(form.account) || form.account.length === 0) {
      setFormError("Bank account number must contain only digits.");
      return;
    }
    setStep(2); // Go directly to OTP input window
  };

  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) return;
    const newOtp = [...otpDigits];
    newOtp[idx] = value[0];
    setOtpDigits(newOtp);
    // Move to next input
    if (idx < 5 && value) {
      inputsRef.current[idx + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length === 6) {
      setStep(3); // Show success window
    }
  };

  const handleClose = () => {
    setShow(false);
    setStep(0);
    setSelectedBank(null);
    setForm({ account: "", ifsc: "", mobile: "" });
    setOtpDigits(["", "", "", "", "", ""]);
    setFormError("");
  };

  return (
    <div>
      <button
        className="flex items-center gap-2 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white px-6 py-3 rounded-xl shadow-lg font-semibold hover:scale-105 transition-transform text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setShow(true)}
      >
        <FaUniversity className="text-xl md:text-2xl" />
        Connect My Bank
      </button>
      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-blue-600 transition"
              onClick={handleClose}
              aria-label="Close"
            >
              &times;
            </button>
            {step === 0 && (
              <>
                <h2 className="text-2xl font-extrabold text-center mb-8 text-blue-700 tracking-tight">
                  Select Your Bank
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-h-[400px] overflow-y-auto">
                  {indianBanks.map((bank) => (
                    <div
                      key={bank.name}
                      className="flex flex-col items-center justify-center bg-white/80 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer border border-transparent hover:border-blue-400 p-4 group"
                      onClick={() => handleBankClick(bank)}
                    >
                      <img
                        src={bank.logo}
                        alt={bank.name}
                        className="w-12 h-12 object-contain mb-2 group-hover:scale-110 transition-transform drop-shadow"
                      />
                      <span className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-700">
                        {bank.name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {step === 1 && selectedBank && (
              <>
                <div className="flex flex-col items-center mb-6">
                  <img src={selectedBank.logo} alt={selectedBank.name} className="w-16 h-16 mb-2 drop-shadow" />
                  <h2 className="text-2xl font-extrabold text-blue-700 mb-1">{selectedBank.name}</h2>
                  <div className="w-16 border-b-2 border-blue-200 mb-2"></div>
                </div>
                <form onSubmit={handleSendOTP} className="space-y-5">
                  <input
                    type="text"
                    name="account"
                    placeholder="Bank Account Number"
                    value={form.account}
                    onChange={handleInputChange}
                    className="w-full border-2 border-blue-200 px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  <input
                    type="text"
                    name="ifsc"
                    placeholder="IFSC CODE"
                    value={form.ifsc}
                    onChange={handleInputChange}
                    className="w-full border-2 border-blue-200 px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg uppercase"
                    required
                    maxLength={11}
                    minLength={11}
                    pattern="[A-Za-z]{4}[0-9]{7}"
                  />
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={form.mobile}
                    onChange={handleInputChange}
                    className="w-full border-2 border-blue-200 px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-lg"
                    required
                  />
                  {formError && <div className="text-red-600 text-sm">{formError}</div>}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 hover:brightness-110 transition text-lg"
                  >
                    Send OTP
                  </button>
                </form>
              </>
            )}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-5 text-center">
                <h2 className="text-2xl font-extrabold text-blue-700 mb-1">Enter OTP</h2>
                <div className="w-16 border-b-2 border-blue-200 mb-2 mx-auto"></div>
                <p className="mb-2 text-gray-600">Please enter the 6-digit code sent to <span className="font-semibold">{form.mobile}</span></p>
                <div className="flex justify-center gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(e, idx)}
                      onKeyDown={e => handleOtpKeyDown(e, idx)}
                      ref={el => (inputsRef.current[idx] = el)}
                      className="w-10 h-12 text-center border-2 border-blue-200 rounded-xl text-lg focus:ring-2 focus:ring-blue-400 transition"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 hover:brightness-110 transition text-lg mt-2"
                >
                  Verify OTP
                </button>
              </form>
            )}
            {step === 3 && (
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                <h2 className="text-2xl font-extrabold mb-2 text-green-700">Bank Account Connected!</h2>
                <FaCheckCircle className="text-green-500 text-6xl mb-4" />
                <div className="w-16 border-b-2 border-green-200 mb-2"></div>
                <p className="mb-4">Your demo bank account has been linked. (Demo only)</p>
                <button className="w-full bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 hover:brightness-110 transition text-lg" onClick={handleClose}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BankSync;