"use client";

import { TuitionInfoType } from "../../types/discount";

export default function TuitionCalculation({
  tuitionInfo,
}: {
  tuitionInfo: TuitionInfoType | null;
}) {
  if (!tuitionInfo) return null;

  return (
    <div style={{ background: "#f5f5f5", padding: 16, marginTop: 20 }}>
      <h3>Tuition Calculation</h3>

      <p>Before Prorate: {tuitionInfo.tuition_before_prorate.toLocaleString()}</p>
      <p>After Prorate: {tuitionInfo.prorated_tuition.toLocaleString()}</p>
      <p>
        Final Tuition After Discounts:{" "}
        {tuitionInfo.tuition_after_discounts.toLocaleString()}
      </p>

      <h4>Discount Breakdown</h4>
      <ul>
        {tuitionInfo.discount_breakdown.map((d, i) => (
          <li key={i}>
            Priority {d.priority}: {d.label} → {d.amount.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
