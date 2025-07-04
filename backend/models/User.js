import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: false, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
      phone: String,
      occupation: String,
      income: Number
    },

    preferences: {
      upiApps: [String],
      primaryUPI: String,
      darkMode: { type: Boolean, default: false }
    },

    goals: {
      savingsTarget: Number,
      investmentTarget: Number,
      monthlyBudget: Number,
      shortTerm: String,
      longTerm: String
    },

    spendingCategories: {
      prioritized: [String],
      avoid: [String]
    },

    onboardingCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
