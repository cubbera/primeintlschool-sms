"use client";

import { useState, useEffect } from "react";

export default function DiscountSelector({ discounts, setDiscounts, onCalculate }: any) {
  const [options, setOptions] = useState<any[]>([]);

  // Load discounts from DB (simplified for now)
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/mock-discounts"); // TODO replace with supabase
      const data = await res.json();
      setOptions(data);
    }
    load();
  }, []);

  function addDiscount(d: any) {
    setDiscounts([...discounts, d]);
  }

  function calculate() {
    // Temporary simple calculation
    const tuitionBefore = 4200000;
    const prorated = tuitionBefore;
    const discountTotal = discounts.reduce((sum, d) => sum + (d.value || 0), 0);
    const final = prorated - discountTotal;

    const tuitionInfo = {
      tuition_before: tuitionBefore,
      prorated,
      discounts: discountTotal,
      final_tuition: final,
    };

    const plan = [
      { month: "August", due_date: "2025-08-01", tuition_amount: final / 8 },
      { month: "September", due_date: "2025-09-01", tuition_amount: final / 8 },
    ];

    onCalculate(tuitionInfo, plan);
  }

  return (
    <div>
      <select onChange={(e) => addDiscount(JSON.parse(e.target.value))}>
        <option value="">Select discount…</option>
        {options.map((d) => (
          <option key={d.id} value={JSON.stringify(d)}>
            {d.name}
          </option>
        ))}
      </select>

      <button style={{ marginTop: 12 }} onClick={calculate}>
        Calculate Tuition
      </button>

      <ul>
        {discounts.map((d, i) => (
          <li key={i}>{d.name}</li>
        ))}
      </ul>
    </div>
  );
}
