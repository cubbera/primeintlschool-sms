"use client";

import React, { useState } from "react";
import DiscountSelector from "./DiscountSelector";
import TuitionCalculation from "./TuitionCalculation";
import PaymentPlanTable from "./PaymentPlanTable";

// -----------------------------------------
// TYPES
// -----------------------------------------
export interface DiscountType {
  discount_type_id: string;
  discount_name_type: string;
  discount_description: string | null;
  discount_kind: "FIXED" | "PERCENT";
  value_fixed: number | null;
  value_percent: number | null;
  priority_group: number;
}

export interface TuitionInfoType {
  tuition_before_prorate: number;
  prorated_tuition: number;
  tuition_after_discounts: number;
  discount_breakdown: {
    priority: number;
    label: string;
    amount: number;
  }[];
}

export interface PaymentPlanItem {
  month: string;
  due_date: string;
  tuition_amount: number;
}

// -----------------------------------------
// PAGE COMPONENT
// -----------------------------------------
export default function CreateStudentPlanPage() {
  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");

  const [discounts, setDiscounts] = useState<DiscountType[]>([]);
  const [tuitionInfo, setTuitionInfo] = useState<TuitionInfoType | null>(null);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlanItem[]>([]);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>
        Finance → Create Student Plan
      </h1>

      {/* ---------------- STUDENT BASIC INFO ---------------- */}
      <div
        style={{
          background: "white",
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 12 }}>Student Information</h2>

        <label>Student Full Name</label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter student name"
          style={{
            width: "100%",
            padding: 10,
            marginTop: 4,
            marginBottom: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        <label>Father’s Name</label>
        <input
          type="text"
          value={fatherName}
          onChange={(e) => setFatherName(e.target.value)}
          placeholder="Enter father's name"
          style={{
            width: "100%",
            padding: 10,
            marginTop: 4,
            marginBottom: 12,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* ---------------- DISCOUNT SECTION ---------------- */}
      <DiscountSelector
        discounts={discounts}
        setDiscounts={(d: DiscountType[]) => setDiscounts(d)}
        onCalculate={(tuition: TuitionInfoType, plan: PaymentPlanItem[]) => {
          setTuitionInfo(tuition);
          setPaymentPlan(plan);
        }}
      />

      {/* ---------------- TUITION CALCULATION BOX ---------------- */}
      <TuitionCalculation tuitionInfo={tuitionInfo} />

      {/* ---------------- PAYMENT PLAN ---------------- */}
      <PaymentPlanTable plan={paymentPlan} />

      {/* ---------------- SUBMIT BUTTON ---------------- */}
      <button
        style={{
          marginTop: 32,
          width: "100%",
          padding: 14,
          fontSize: 18,
          background: "#004080",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Submit & Create Student Payment Plan
      </button>
    </div>
  );
}
