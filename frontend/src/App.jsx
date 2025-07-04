import { Toaster } from 'react-hot-toast';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";  
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import SpendingCoachPage from './pages/SpendingCoach';
import MicroInvestorGuidePage from './pages/MicroInvestorGuide';
import LoanEligibilityPage from './pages/LoanEligibility';
import Resources from './pages/Resources';
import Onboarding from './pages/Onboarding';
import Goals from './pages/Goals';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import SpinTheWheelModal from './components/dashboard/SpinTheWheelModal';

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/dashboard/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/dashboard/spending-coach" element={<PrivateRoute><SpendingCoachPage /></PrivateRoute>} />
        <Route path="/dashboard/micro-investor" element={<PrivateRoute><MicroInvestorGuidePage /></PrivateRoute>} />
        <Route path="/dashboard/loan-eligibility" element={<PrivateRoute><LoanEligibilityPage /></PrivateRoute>} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
        </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { isLoggedIn } = useAuth();
  const [showWheel, setShowWheel] = useState(false);

  // Show wheel modal after login, once per day
  useEffect(() => {
    if (isLoggedIn) {
      const lastSpin = localStorage.getItem('lastSpinDate');
      const today = new Date().toISOString().slice(0, 10);
      if (lastSpin !== today) {
        setShowWheel(true);
      }
    }
  }, [isLoggedIn]);

  const handleSpin = () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('lastSpinDate', today);
  };

  // Inject chat widget only if logged in
  useEffect(() => {
    const scriptId = 'omnidimension-web-widget';
    if (isLoggedIn) {
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = 'https://backend.omnidim.io/web_widget.js?secret_key=e5fac8d1d091a10aa2b7719ea85af890';
        document.body.appendChild(script);
      }
    } else {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-white transition-colors">
      <Navbar />
      <Toaster position="top-center" />
      <SpinTheWheelModal open={showWheel} onClose={() => setShowWheel(false)} onSpin={handleSpin} />
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-2xl mx-auto">
            <Onboarding onFinish={() => setShowOnboarding(false)} />
          </div>
        </div>
      )}
      <AnimatedRoutes />
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
