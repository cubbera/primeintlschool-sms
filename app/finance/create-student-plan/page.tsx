"use client";

import { useState } from "react";
import styles from "./page.module.css";
import DiscountSelector from "./DiscountSelector";
import TuitionCalculation from "./TuitionCalculation";
import PaymentPlanTable from "./PaymentPlanTable";

type PaymentPlanItem = {
  month: string;
  due_date: string;
  tuition_amount: number;
};

type TuitionInfo = {
  tuition_before: number;
  prorated: number;
  discounts: number;
  final_tuition: number;
};

export default function CreateStudentPlanPage() {
  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");

  const [discounts, setDiscounts] = useState<any[]>([]);
  const [tuitionInfo, setTuitionInfo] = useState<TuitionInfo | null>(null);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlanItem[]>([]);

  return (
    <div className={styles.container}>
      {/* SECTION 1 — Student Info */}
      <div className={styles.section}>
        <div className={styles.title}>Student Information</div>

        <label className={styles.label}>Full Name</label>
        <input
          className={styles.input}
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />

        <label className={styles.label}>Father's Name</label>
        <input
          className={styles.input}
          value={fatherName}
          onChange={(e) => setFatherName(e.target.value)}
        />

        <div style={{ marginTop: 10, fontSize: 14, opacity: 0.7 }}>
          Student ID will be auto-generated (e.g., PR2025xxx)
        </div>
      </div>

      {/* SECTION 2 — Discounts */}
      <div className={styles.section}>
        <div className={styles.title}>Discounts</div>
        <DiscountSelector
          discounts={discounts}
          setDiscounts={setDiscounts}
          onCalculate={(tuition: TuitionInfo, plan: PaymentPlanItem[]) => {
            setTuitionInfo(tuition);
            setPaymentPlan(plan);
          }}
        />
      </div>

      {/* SECTION 3 — Tuition Calculation */}
      {tuitionInfo && (
        <div className={styles.section}>
          <div className={styles.title}>Tuition Summary</div>
          <TuitionCalculation tuitionInfo={tuitionInfo} />
        </div>
      )}

      {/* SECTION 4 — Payment Plan */}
      {paymentPlan.length > 0 && (
        <div className={styles.section}>
          <div className={styles.title}>Payment Plan</div>
          <PaymentPlanTable plan={paymentPlan} />
        </div>
      )}

      {paymentPlan.length > 0 && (
        <button className={styles.button}>Submit & Generate Invoice</button>
      )}
    </div>
  );
}
