"use client";

export default function PaymentPlanTable({ plan }) {
  return (
    <div style={{
      padding: 16,
      border: "1px solid #ccc",
      borderRadius: 8,
      marginBottom: 20
    }}>
      <h2 style={{ color: "#004AAD" }}>Generated Payment Plan</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#004AAD", color: "white" }}>
            <th style={{ padding: 8 }}>Month</th>
            <th style={{ padding: 8 }}>Due Date</th>
            <th style={{ padding: 8 }}>Tuition (Ks)</th>
          </tr>
        </thead>

        <tbody>
          {plan.map((p, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: 8 }}>{p.month}</td>
              <td style={{ padding: 8 }}>{p.due_date}</td>
              <td style={{ padding: 8 }}>{p.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
