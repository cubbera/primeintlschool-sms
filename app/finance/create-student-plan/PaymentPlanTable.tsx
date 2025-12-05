"use client";

interface PlanRow {
  month: string;
  due_date: string;
  tuition: number;
}

interface PaymentPlanTableProps {
  plan: PlanRow[];
}

export default function PaymentPlanTable({ plan }: PaymentPlanTableProps) {
  return (
    <div
      style={{
        padding: 16,
        background: "#F5F8FF",
        borderRadius: 8,
        border: "1px solid #D6E4FF",
        marginBottom: 20,
      }}
    >
      <h3 style={{ marginBottom: 12, color: "#004AAD" }}>Payment Plan (Auto-Generated)</h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#E9F1FF", color: "#004AAD" }}>
            <th style={{ padding: 8, textAlign: "left" }}>Month</th>
            <th style={{ padding: 8, textAlign: "left" }}>Due Date</th>
            <th style={{ padding: 8, textAlign: "right" }}>Tuition (MMK)</th>
          </tr>
        </thead>

        <tbody>
          {plan.map((row, idx) => (
            <tr
              key={idx}
              style={{
                background: idx % 2 === 0 ? "#FFFFFF" : "#F4F7FF",
              }}
            >
              <td style={{ padding: 8 }}>{row.month}</td>
              <td style={{ padding: 8 }}>{row.due_date}</td>
              <td style={{ padding: 8, textAlign: "right" }}>
                {row.tuition.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
