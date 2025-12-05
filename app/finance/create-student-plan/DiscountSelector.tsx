"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function DiscountSelector({ discounts, setDiscounts, onCalculate }) {
  const [discountOptions, setDiscountOptions] = useState([]);

  useEffect(() => {
    async function loadDiscounts() {
      const { data, error } = await supabase
        .from("discount_types")
        .select("*")
        .eq("is_active", true)
        .order("priority_group", { ascending: true });

      if (!error) setDiscountOptions(data);
    }
    loadDiscounts();
  }, []);

  function addDiscount(id) {
    if (!id) return;
    const d = discountOptions.find((item) => item.discount_type_id === id);
    if (d && !discounts.includes(d)) {
      setDiscounts([...discounts, d]);
    }
  }

  return (
    <div style={{ marginBottom: 30 }}>
      <h2 style={{ color: "#004AAD" }}>Discounts</h2>

      {/* Add Discount */}
      <select
        onChange={(e) => addDiscount(e.target.value)}
        style={{ padding: 8, marginBottom: 12, width: "100%" }}
      >
        <option value="">Select discount...</option>
        {discountOptions.map((d) => (
          <option key={d.discount_type_id} value={d.discount_type_id}>
            {d.discount_name_type} — {d.discount_kind === "FIXED"
              ? `${d.value_fixed} Ks`
              : `${d.value_percent}%`}
          </option>
        ))}
      </select>

      {/* Display Selected Discounts */}
      <ul style={{ background: "#eee", padding: 12, borderRadius: 6 }}>
        {discounts.map((d) => (
          <li key={d.discount_type_id}>
            {d.discount_name_type}  
            {d.discount_kind === "FIXED"
              ? ` (-${d.value_fixed})`
              : ` (-${d.value_percent}%)`}
          </li>
        ))}
      </ul>
    </div>
  );
}
