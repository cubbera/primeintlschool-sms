"use client";

import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./styles.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
      setLoading(false);
      return;
    }

    // Get role from metadata
    const user = data.user;
    const role = user?.user_metadata?.role || "viewer";

    // Redirect based on role
    if (role === "super_admin") {
      window.location.href = "/dashboard";
    } else if (role === "accountant") {
      window.location.href = "/finance";
    } else if (role === "admissions") {
      window.location.href = "/students";
    } else if (role === "teacher") {
      window.location.href = "/classroom";
    } else {
      alert("Your account has no assigned role. Please contact admin.");
      await supabase.auth.signOut();
    }

    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Prime International School Login</h1>

      <form className={styles.form} onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}