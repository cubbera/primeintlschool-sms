"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

import {
  DiscountType,
  TuitionInfoType,
  PaymentPlanItem
} from "../../types/discount";


export default function DiscountSelector({
  discounts,
  setDiscounts,
  onCalculate,
}: {
  discounts: DiscountType[];
  setDiscounts: (d: DiscountType[]) => void;
  onCalculate: (t: TuitionInfoType, p: PaymentPlanItem[]) => void;
}) {
  const [options, setOptions] = useState<DiscountType[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("discount_types").select("*");
      if (data) setOptions(data);
    }
    load();
  }, []);

  const addDiscount = (id: string) => {
    const d = options.find((x) => x.discount_type_id === id);
    if (!d) return;

    setDiscounts([...discounts, d]);
  };

  return (
    <div>
      <select onChange={(e) => addDiscount(e.target.value)}>
        <option value="">-- add discount --</option>
        {options.map((d) => (
          <option key={d.discount_type_id} value={d.discount_type_id}>
            {d.discount_name_type} — {d.value_percent ?? d.value_fixed}
          </option>
        ))}
      </select>

      <ul>
        {discounts.map((d) => (
          <li key={d.discount_type_id}>{d.discount_name_type}</li>
        ))}
      </ul>
    </div>
  );
}
