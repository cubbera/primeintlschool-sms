"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

import {
  DiscountType,
  TuitionInfoType,
  PaymentPlanItem,
} from "../../types/discount";

import DiscountSelector from "./DiscountSelector";
import TuitionCalculation from "./TuitionCalculation";
import PaymentPlanTable from "./PaymentPlanTable";

export default function CreateStudentPlanPage() {
  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [studentId, setStudentId] = useState("");

  const [divisionId, setDivisionId] = useState("");
  const [gradeLevelId, setGradeLevelId] = useState("");
  const [sessionType, setSessionType] = useState("");

  const [paymentPlanType, setPaymentPlanType] = useState("ANNUAL");

  const [discounts, setDiscounts] = useState<DiscountType[]>([]);
  const [tuitionInfo, setTuitionInfo] = useState<TuitionInfoType | null>(null);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlanItem[]>([]);

  // --- Auto-generate Student ID ---
  useEffect(() => {
    async function fetchId() {
      const { data } = await supabase
        .rpc("generate_student_id", {}); // You must implement this RPC
      if (data) setStudentId(data);
    }
    fetchId();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>
        Create Student Plan
      </h1>

      {/* --- STUDENT BASIC INFO --- */}
      <section style={{ marginTop: 20 }}>
        <h2>Student Information</h2>

        <div>
          <label>Student Name</label>
          <input
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
        </div>

        <div>
          <label>Father Name</label>
          <input
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
          />
        </div>

        <div>
          <label>Generated Student ID</label>
          <input value={studentId} readOnly style={{ background: "#eee" }} />
        </div>
      </section>

      {/* --- GRADE SELECTION --- */}
      <section style={{ marginTop: 20 }}>
        <h2>Grade Selection</h2>

        <div>
          <label>Division</label>
          <select value={divisionId} onChange={(e) => setDivisionId(e.target.value)}>
            <option value="">-- select division --</option>
            <option value="PRE">Preschool</option>
            <option value="CPR">Cambridge Primary</option>
            <option value="CLS">Lower Secondary</option>
            <option value="CUS">IGCSE</option>
            <option value="CAD">A Level</option>
          </select>
        </div>

        <div>
          <label>Grade Level</label>
          <select
            value={gradeLevelId}
            onChange={(e) => setGradeLevelId(e.target.value)}
          >
            <option value="">-- select grade --</option>
            <option value="SR">School Readiness</option>
            <option value="EY1">Early Years 1</option>
            <option value="EY2">Early Years 2</option>
            <option value="Y1">Year 1</option>
            <option value="Y2">Year 2</option>
            <option value="Y3">Year 3</option>
          </select>
        </div>

        <div>
          <label>Session Type</label>
          <select
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
          >
            {gradeLevelId === "SR" ? (
              <>
                <option value="">--select--</option>
                <option value="FULL_DAY">FULL DAY</option>
                <option value="HALF_DAY">HALF DAY</option>
              </>
            ) : gradeLevelId === "TE" ? (
              <option value="ONE_SESSION">ONE SESSION</option>
            ) : (
              <option value="FULL_DAY">FULL DAY</option>
            )}
          </select>
        </div>

        <div>
          <label>Payment Plan</label>
          <select
            value={paymentPlanType}
            onChange={(e) => setPaymentPlanType(e.target.value)}
          >
            <option value="ANNUAL">Annual</option>
            <option value="TERMLY">Termly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>
      </section>

      {/* --- DISCOUNTS --- */}
      <section style={{ marginTop: 20 }}>
        <h2>Discounts</h2>

        <DiscountSelector
          discounts={discounts}
          setDiscounts={setDiscounts}
          onCalculate={(t: TuitionInfoType, p: PaymentPlanItem[]) => {
            setTuitionInfo(t);
            setPaymentPlan(p);
          }}
        />
      </section>

      {/* --- TUITION CALCULATION BOX --- */}
      <TuitionCalculation tuitionInfo={tuitionInfo} />

      {/* --- PAYMENT PLAN TABLE --- */}
      <PaymentPlanTable plan={paymentPlan} />
    </div>
  );
}
