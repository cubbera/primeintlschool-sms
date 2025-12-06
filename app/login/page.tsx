"use client";

import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./styles.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Accountant Login</h1>

      <form className={styles.form} onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className={styles.button}>Login</button>
      </form>
    </div>
  );
}