"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "8px 14px",
        background: "#d33",
        color: "white",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
