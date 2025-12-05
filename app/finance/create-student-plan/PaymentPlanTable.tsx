"use client";

import styles from "./page.module.css";

export default function PaymentPlanTable({ plan }: any) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Month</th>
          <th>Due Date</th>
          <th>Tuition</th>
        </tr>
      </thead>
      <tbody>
        {plan.map((p: any, i: number) => (
          <tr key={i}>
            <td>{p.month}</td>
            <td>{p.due_date}</td>
            <td>{p.tuition_amount.toLocaleString()} Ks</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
