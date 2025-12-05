"use client";

import React, { useState } from "react";
import DiscountSelector from "./DiscountSelector";
import TuitionCalculation from "./TuitionCalculation";
import PaymentPlanTable from "./PaymentPlanTable";

export default function CreateStudentPlanPage() {
  const [discounts, setDiscounts] = useState([]);
  const [tuitionInfo, setTuitionInfo] = useState(null);
  const [paymentPlan, setPaymentPlan] = useState([]);

  return (
    <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ color: "#004AAD", marginBottom: 20 }}>
        Create Student Payment Plan
      </h1>

      {/* Section: Discounts */}
      <DiscountSelector
        discounts={discounts}
        setDiscounts={setDiscounts}
        onCalculate={(data) => setTuitionInfo(data)}
      />

      {/* Section: Tuition Calculation */}
      {tuitionInfo && (
        <TuitionCalculation tuitionInfo={tuitionInfo} />
      )}

      {/* Section: Payment Plan Table */}
      {paymentPlan.length > 0 && (
        <PaymentPlanTable plan={paymentPlan} />
      )}
    </div>
  );
}
