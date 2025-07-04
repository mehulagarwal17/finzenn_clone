import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";

const initialGoals = [
  { name: "Vacation", target: 50000, current: 12000, targetDate: "2025-12-31" },
  { name: "Emergency Fund", target: 100000, current: 40000, targetDate: "2026-06-30" },
];

const Goals = () => {
  const [goals, setGoals] = useState(initialGoals);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", target: "", current: "", targetDate: "" });
  const [dateObj, setDateObj] = useState(null); // for DatePicker
  const [editIdx, setEditIdx] = useState(null); // index of goal being edited
  const [showDeleteIdx, setShowDeleteIdx] = useState(null); // index of goal being deleted

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (editIdx !== null) {
      // Edit mode
      const updatedGoals = [...goals];
      updatedGoals[editIdx] = { ...form, target: Number(form.target), current: Number(form.current) };
      setGoals(updatedGoals);
      setEditIdx(null);
    } else {
      setGoals([...goals, { ...form, target: Number(form.target), current: Number(form.current) }]);
    }
    setForm({ name: "", target: "", current: "", targetDate: "" });
    setDateObj(null);
    setShowForm(false);
  };

  const handleEditGoal = (idx) => {
    const g = goals[idx];
    setForm({
      name: g.name,
      target: g.target,
      current: g.current,
      targetDate: g.targetDate,
    });
    setDateObj(g.targetDate ? parseISO(g.targetDate) : null);
    setEditIdx(idx);
    setShowForm(true);
  };

  const handleDeleteGoal = (idx) => {
    setGoals(goals.filter((_, i) => i !== idx));
    setShowDeleteIdx(null);
  };

  const getProgress = (goal) => Math.min(100, Math.round((goal.current / goal.target) * 100));
  const getMonthsLeft = (goal) => {
    const now = new Date();
    const target = new Date(goal.targetDate);
    return Math.max(1, (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth()));
  };
  const getBoost = (goal) => {
    const monthsLeft = getMonthsLeft(goal);
    return Math.ceil((goal.target - goal.current) / monthsLeft);
  };

  // Calculate recommended monthly savings for the form
  const getRecommendedMonthly = () => {
    const { target, current, targetDate } = form;
    if (!target || !targetDate) return null;
    const now = new Date();
    const targetDt = new Date(targetDate);
    if (targetDt <= now) return null;
    const monthsLeft = Math.max(1, (targetDt.getFullYear() - now.getFullYear()) * 12 + (targetDt.getMonth() - now.getMonth()));
    const needed = Number(target) - Number(current || 0);
    if (needed <= 0) return null;
    return Math.ceil(needed / monthsLeft);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-[#0a0f1c] pt-24 px-2 transition-colors">
      <div className="bg-gradient-to-br from-gray-100 to-blue-50 dark:from-[#1e90ff]/10 dark:to-[#1db954]/10 rounded-3xl shadow-2xl p-8 w-full max-w-2xl mt-8 border border-gray-200 dark:border-white/10 transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            🎯 Your Goals
          </h3>
          <button
            className="bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
            onClick={() => setShowForm(true)}
          >
            + Add Goal
          </button>
        </div>
        {goals.length === 0 && (
          <div className="text-center text-gray-500 dark:text-white/70 py-8">No goals yet. Click <b>+ Add Goal</b> to get started!</div>
        )}
        {goals.map((goal, idx) => (
          <div key={idx} className="mb-8 bg-gray-100 dark:bg-white/5 rounded-2xl p-5 shadow flex flex-col gap-2 relative group transition-colors">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">🏆</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">{goal.name}</span>
              <span className="ml-auto flex items-center gap-2">
                <span className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-semibold transition-colors">
                  {/* Calendar Icon */}
                  <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><rect x='3' y='5' width='18' height='16' rx='2' fill='none' stroke='currentColor' strokeWidth='2'/><path d='M16 3v4M8 3v4M3 9h18' stroke='currentColor' strokeWidth='2' strokeLinecap='round'/></svg>
                  {goal.targetDate}
                </span>
                {/* Edit icon button */}
                <button
                  onClick={() => handleEditGoal(idx)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-100/20 hover:bg-blue-200 dark:hover:bg-blue-200/40 transition shadow-sm ml-1"
                  aria-label="Edit Goal"
                  title="Edit Goal"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z"/></svg>
                </button>
                {/* Delete icon button */}
                <button
                  onClick={() => setShowDeleteIdx(idx)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-100/20 hover:bg-red-200 dark:hover:bg-red-200/40 transition shadow-sm ml-1"
                  aria-label="Delete Goal"
                  title="Delete Goal"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m5 4v6m4-6v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </span>
            </div>
            <div className="relative w-full h-5 bg-gray-300 dark:bg-gray-300/40 rounded-full overflow-hidden mb-1 transition-colors">
              <div
                className="absolute left-0 top-0 h-5 bg-gradient-to-r from-[#1db954] to-[#1e90ff] rounded-full transition-all"
                style={{ width: `${getProgress(goal)}%` }}
              ></div>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-gray-800 dark:text-white drop-shadow">
                {getProgress(goal)}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-700 dark:text-white/80 transition-colors">
              <span className="flex items-center gap-1 bg-gray-200 dark:bg-gray-800/70 text-gray-900 dark:text-white px-3 py-1 rounded-full font-bold text-sm transition-colors">
                {/* Rupee Icon */}
                <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path d='M6 4h12M6 8h12M9 4v12a4 4 0 004 4h5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/></svg>
                ₹{goal.current} / ₹{goal.target}
              </span>
              <span>
                {getProgress(goal) === 100 ? (
                  <span className="text-green-600 dark:text-green-400 font-bold">Goal Achieved! 🎉</span>
                ) : (
                  <>Boost: <span className="text-blue-700 dark:text-blue-300 font-bold">Save ₹{getBoost(goal)} /mo</span></>
                )}
              </span>
            </div>
          </div>
        ))}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 transition-colors">
            <form
              onSubmit={handleAddGoal}
              className="bg-white dark:bg-[#181f2a] rounded-2xl p-8 shadow-xl w-full max-w-sm space-y-4 transition-colors"
            >
              <h4 className="text-xl font-bold text-[#1e90ff] dark:text-[#60efff] mb-2">{editIdx !== null ? "Edit Goal" : "Add New Goal"}</h4>
              <input type="text" placeholder="Goal Name" className="w-full p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#232b3a] text-gray-900 dark:text-white transition-colors" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input type="number" placeholder="Target Amount" className="w-full p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#232b3a] text-gray-900 dark:text-white transition-colors" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} required />
              <input type="number" placeholder="Current Saved" className="w-full p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#232b3a] text-gray-900 dark:text-white transition-colors" value={form.current} onChange={e => setForm({ ...form, current: e.target.value })} required />
              {/* Date Picker for Target Date */}
              <DatePicker
                selected={dateObj}
                onChange={date => {
                  setDateObj(date);
                  setForm({ ...form, targetDate: date ? format(date, "yyyy-MM-dd") : "" });
                }}
                minDate={new Date()}
                placeholderText="Select target date"
                dateFormat="yyyy-MM-dd"
                className="w-full p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#232b3a] text-gray-900 dark:text-white transition-colors"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                todayButton="Today"
                isClearable
                required
              />
              {getRecommendedMonthly() && (
                <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 rounded-lg px-4 py-2 text-center font-medium transition-colors">
                  Recommended Monthly Savings: <span className="font-bold">₹{getRecommendedMonthly()}</span>
                </div>
              )}
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-white py-2 rounded-lg font-semibold">{editIdx !== null ? "Save" : "Add Goal"}</button>
                <button type="button" className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white py-2 rounded-lg" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
        {showDeleteIdx !== null && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 transition-colors">
            <div className="bg-white dark:bg-[#181f2a] rounded-2xl p-8 shadow-xl w-full max-w-xs text-center transition-colors">
              <h4 className="text-lg font-bold mb-4 text-red-600 dark:text-red-400">Delete Goal?</h4>
              <p className="mb-6 text-gray-800 dark:text-gray-200">Are you sure you want to delete <span className="font-semibold">{goals[showDeleteIdx].name}</span>?</p>
              <div className="flex gap-2">
                <button onClick={() => handleDeleteGoal(showDeleteIdx)} className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold">Delete</button>
                <button onClick={() => setShowDeleteIdx(null)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals; 