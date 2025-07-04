const API_BASE = import.meta.env.VITE_API_BASE
// const API_URL = "http://localhost:5000";

// 1. Fetch Profile
export const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/user/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch user profile");
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    return null;
  }
};

// 2. Fetch Cards
export const fetchCardsOverview = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/cards/cards`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch cards overview");
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching cards:", err.message);
    return [];
  }
};

// 3. Fetch Insights
export const fetchInsights = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/insights/insights`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch insights");
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching insights:", err.message);
    return [];
  }
};

// 4. Spending Breakdown
export const fetchSpendingBreakdown = async (filter = "month") => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/transactions/spending-breakdown?filter=${filter}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch spending breakdown");
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching spending breakdown:", err);
    return [];
  }
};

// 5. Income Breakdown
export const fetchIncomeBreakdown = async (filter = "month") => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/transactions/income?filter=${filter}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch income breakdown");
    return await res.json();
  } catch (err) {
    console.error("❌ Income breakdown fetch error:", err);
    return [];
  }
};
//income vs expense

export const fetchIncomeVsExpense = async (filter = "month") => {
  try {
    const res = await fetch(`${API_BASE}/income-vs-expense/income-vs-expense?filter=${filter}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch income vs expense data");

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("❌ Income vs Expense fetch error:", err.message);
    return [];
  }
};

// Transaction CRUD
export const fetchTransactions = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/transactions/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
    return [];
  }
};

export const addTransaction = async (txn) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/transactions/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(txn),
    });
    if (!res.ok) throw new Error("Failed to add transaction");
    return await res.json();
  } catch (err) {
    console.error("❌ Error adding transaction:", err);
    return null;
  }
};

export const editTransaction = async (id, txn) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/transactions/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(txn),
    });
    if (!res.ok) throw new Error("Failed to edit transaction");
    return await res.json();
  } catch (err) {
    console.error("❌ Error editing transaction:", err);
    return null;
  }
};

export const deleteTransaction = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/transactions/transactions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete transaction");
    return await res.json();
  } catch (err) {
    console.error("❌ Error deleting transaction:", err);
    return null;
  }
};

export const fetchSpendingCoachAdvice = async (transactions = null, followup = null) => {
  const token = localStorage.getItem("token");
  try {
    const body = followup
      ? JSON.stringify({ transactions, followup })
      : JSON.stringify(transactions ? { transactions } : {});
    const res = await fetch(`${API_BASE}/dashboard/spending-coach`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });
    if (!res.ok) throw new Error("Failed to fetch spending coach advice");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ Error fetching spending coach advice:", err);
    return null;
  }
};

export const fetchPortfolio = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/insights/portfolio`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch portfolio");
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching portfolio:", err);
    return null;
  }
};

export const tradePortfolio = async (asset, amount) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/insights/portfolio/trade`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ asset, amount }),
    });
    if (!res.ok) throw new Error("Failed to execute trade");
    return await res.json();
  } catch (err) {
    console.error("❌ Error trading portfolio:", err);
    return null;
  }
};

export const fetchLoanEligibility = async (income, employment, creditScore) => {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({ income, employment, creditScore });
  try {
    const res = await fetch(`${API_BASE}/insights/loan-eligibility?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch loan eligibility");
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching loan eligibility:", err);
    return null;
  }
};

export const fetchGoalBooster = async (goal, current) => {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({ goal, current });
  try {
    const res = await fetch(`${API_BASE}/insights/goal-booster?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch goal booster");
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching goal booster:", err);
    return null;
  }
};

export const updateUserProfile = async (profile) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_BASE}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return await res.json();
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    return null;
  }
};

export const sendOTP = async (mobile) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE.replace(/\/$/, '')}/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const verifyOTP = async (mobile, otp) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE.replace(/\/$/, '')}/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};