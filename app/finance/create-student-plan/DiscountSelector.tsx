"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

// Define the type structure of a discount item
interface DiscountType {
  discount_type_id: string;
  discount_name_type: string;
  discount_kind: "FIXED" | "PERCENT";
  value_fixed: number | null;
  value_percent: number | null;
  priority_group: number;
}

interface DiscountSelectorProps {
  discounts: DiscountType[];
  setDiscounts: (d: DiscountType[]) => void;
  onCalculate: (data: any) => void;
}

export default function DiscountSelector({
  discounts,
  setDiscounts,
  onCalculate,
}: DiscountSelectorProps) {
  const [discountOptions, setDiscountOptions] = useState<DiscountType[]>([]);

  useEffect(() => {
    async function loadDiscounts() {
      const { data, error } = await supabase
        .from("discount_types")
        .select("*")
        .eq("is_active", true)
        .order("priority_group", { ascending: true });

      if (!error && data) {
        setDiscountOptions(data as DiscountType[]);
      }
    }

    loadDiscounts();
  }, []);

  function addDiscount(id: string) {
    if (!id) return;
    const selected = discountOptions.find((item) => item.discount_type_id === id);
    if (selected && !discounts.some((d) => d.discount_type_id === selected.discount_type_id)) {
      setDiscounts([...discounts, selected]);
    }
  }

  return (
    <div style={{ marginBottom: 30 }}>
      <h2 style={{ color: "#004AAD" }}>Discounts</h2>

      {/* Add Discount Dropdown */}
      <select
        onChange={(e) => addDiscount(e.target.value)}
        style={{ padding: 8, marginBottom: 12, width: "100%" }}
      >
        <option value="">Select discount...</option>
        {discountOptions.map((d) => (
          <option key={d.discount_type_id} value={d.discount_type_id}>
            {d.discount_name_type} —{" "}
            {d.discount_kind === "FIXED"
              ? `${d.value_fixed} Ks`
              : `${d.value_percent}%`}
          </option>
        ))}
      </select>

      {/* Selected Discounts List */}
      <ul style={{ background: "#eee", padding: 12, borderRadius: 6 }}>
        {discounts.map((d) => (
          <li key={d.discount_type_id}>
            {d.discount_name_type} —{" "}
            {d.discount_kind === "FIXED"
              ? `-${d.value_fixed} Ks`
              : `-${d.value_percent}%`}
          </li>
        ))}
      </ul>
    </div>
  );
}
