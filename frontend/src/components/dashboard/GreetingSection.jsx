import React, { useEffect, useState } from "react";
import { fetchUserProfile } from "../../utils/api"; // make sure this exists
// frontend\src\utils\api.js
const GreetingSection = () => {
  const [greeting, setGreeting] = useState("Welcome");
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    // Set greeting based on current time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Fetch user profile
    const loadUserProfile = async () => {
      const profile = await fetchUserProfile();
      if (profile?.username) {
        setUserName(profile.username);
      } else if (profile?.profile?.firstName) {
        setUserName(profile.profile.firstName);
      } else {
        setUserName(profile?.email || "User");
      }
      setAvatar(profile?.profile?.avatar || "/src/assets/avatars/Avatar1.svg");
      setLoading(false);
    };

    loadUserProfile();
  }, []);

  if (loading) return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="text-center mt-10 mb-10 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        {avatar && (
          <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-[#1db954] bg-white/20" />
        )}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1db954] to-[#1e90ff] text-transparent bg-clip-text">
          Hi {userName}, {greeting} 👋
        </h1>
      </div>
      <p className="text-white/60 mt-2 text-sm md:text-base">
        Here's a snapshot of your financial health.
      </p>
    </div>
  );
};

export default GreetingSection;
