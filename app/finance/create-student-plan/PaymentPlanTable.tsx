"use client";

import { PaymentPlanItem } from "../../types/discount";

export default function PaymentPlanTable({
  plan,
}: {
  plan: PaymentPlanItem[];
}) {
  if (!plan || plan.length === 0) return null;

  return (
    <table style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Month</th>
          <th>Due Date</th>
          <th>Tuition</th>
        </tr>
      </thead>

      <tbody>
        {plan.map((p, idx) => (
          <tr key={idx}>
            <td>{p.month}</td>
            <td>{p.due_date}</td>
            <td>{p.tuition_amount.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
