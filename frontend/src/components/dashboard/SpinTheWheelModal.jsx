import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";
// For confetti
import Confetti from "react-confetti";

const tips = [
  "Track your expenses daily for a week!",
  "Set a savings goal and automate it.",
  "Review your subscriptions and cancel one you don't use.",
  "Try a no-spend day this week.",
  "Invest in yourself: read a finance article today.",
  "Compare prices before your next big purchase.",
  "Cook at home instead of eating out once this week.",
  "Review your credit card statement for hidden fees.",
  "Transfer a small amount to your emergency fund.",
  "Plan your meals to avoid food waste.",
  "Set a reminder to check your budget every Sunday.",
  "Celebrate a small financial win!"
];

const data = tips.map((tip, i) => ({ option: tip }));

const wheelColors = [
  "#1db954", "#1e90ff", "#fbbf24", "#f472b6", "#6366f1", "#34d399", "#f87171", "#f59e42", "#a78bfa", "#f472b6", "#60a5fa", "#facc15"
];

const SpinTheWheelModal = ({ open, onClose, onSpin }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spun, setSpun] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSpinClick = () => {
    const prize = Math.floor(Math.random() * data.length);
    setPrizeNumber(prize);
    setMustSpin(true);
    setSpun(true);
    setTimeout(() => setShowConfetti(true), 1200);
    setTimeout(() => setShowConfetti(false), 3500);
    if (onSpin) onSpin(prize);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={200} recycle={false} />}
      <div className="relative bg-white/70 dark:bg-[#181f2a]/80 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-3xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center animate-fade-in transition-colors" style={{boxShadow: '0 8px 40px 0 rgba(30,144,255,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)'}}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl">&times;</button>
        <h2 className="text-3xl font-extrabold mb-4 text-center bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text drop-shadow-lg tracking-tight">
          Spin the Wheel for Today's Tip!
        </h2>
        <div className="flex flex-col items-center">
          <div className="relative flex flex-col items-center justify-center mb-2">
            {/* Glowing shadow */}
            <div className="absolute -inset-4 rounded-full blur-2xl opacity-40 bg-gradient-to-br from-[#1db954] to-[#1e90ff] z-0"></div>
            {/* Animated pointer */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
              <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[32px] border-b-[#fbbf24] drop-shadow-lg animate-bounce"></div>
            </div>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              backgroundColors={wheelColors}
              textColors={["#fff"]}
              fontSize={18}
              outerBorderColor="#fff"
              outerBorderWidth={8}
              innerBorderColor="#e5e7eb"
              innerBorderWidth={2}
              radiusLineColor="#e5e7eb"
              radiusLineWidth={2}
              spinDuration={1.2}
              onStopSpinning={() => setMustSpin(false)}
              perpendicularText={true}
              size={320}
            />
          </div>
          <button
            className="mt-8 px-10 py-4 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white font-extrabold rounded-full shadow-xl text-2xl hover:scale-105 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#1db954]/30 animate-pulse"
            onClick={handleSpinClick}
            disabled={mustSpin || spun}
            style={{boxShadow: '0 4px 24px 0 rgba(30,144,255,0.18)'}}>
            {spun ? "Come back tomorrow!" : "SPIN"}
          </button>
          {spun && (
            <div className="mt-8 text-center text-2xl font-bold text-[#1db954] dark:text-[#60efff] animate-fade-in flex flex-col items-center gap-2">
              <span className="text-4xl">🎉</span>
              <span className="drop-shadow-lg">{tips[prizeNumber]}</span>
              <span className="text-4xl">🎉</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinTheWheelModal; 