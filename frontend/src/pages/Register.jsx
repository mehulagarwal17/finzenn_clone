import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/auth/register`, {
        email,
        password,
      });

      // Automatically log the user in after successful registration
      const loginRes = await axios.post(`${import.meta.env.VITE_API_BASE}/auth/login`, {
        email,
        password,
      });

      const { token, user } = loginRes.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Registered successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-white transition-colors">
      <Toaster position="top-center" />

      {/* 🫧 Floating Bubbles Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="blobGradient" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#1db954" />
              <stop offset="100%" stopColor="#1e3c72" />
            </radialGradient>
          </defs>
          <g fill="url(#blobGradient)" fillOpacity="0.12">
            {[...Array(25)].map((_, i) => {
              const r = Math.random() * 40 + 20;
              const cx = Math.random() * 1800;
              const cy = Math.random() * 1000;
              return (
                <circle
                  key={i}
                  r={r}
                  cx={cx}
                  cy={cy}
                  className={`animate-bubble-float animation-delay-${i % 10}`}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* 📝 Register Card */}
      <div className="z-10 bg-gray-100 dark:bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-gray-900 dark:text-white animate-fade-in border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">
          Create FinZen Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {/* Confirm Password with toggle */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-3 pr-12 rounded-lg bg-gray-200 dark:bg-gray-700 placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-300"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <button
              type="button"
              onClick={toggleConfirmPassword}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-900 dark:text-white"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-green-500 transition-all font-semibold rounded-lg"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline hover:text-lime-300">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
