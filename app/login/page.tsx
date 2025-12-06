"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { supabase } from "../../../lib/supabaseClient";

// ---------------- TYPES ------------------

type EnrollmentCode = "AY25" | "SUM2026" | "AY26" | "TE";

interface DiscountType {
  discount_type_id: string;
  discount_name_type: string;
  discount_description: string;
  discount_kind: "FIXED" | "PERCENT";
  value_fixed: number | null;
  value_percent: number | null;
  priority_group: number;
}

interface PricingRow {
  pricing_source: string; // AY | SUM | TE
  annual_tuition_amount: number | null;
  termly_tuition_amount: number | null;
  monthly_tuition_amount: number | null;
}

// ---------------- UI COMPONENT ------------------

export default function CreateStudentPlan() {
  const [enrollmentFor, setEnrollmentFor] = useState<EnrollmentCode>("AY25");

  const [isNewStudent, setIsNewStudent] = useState(true);
  const [studentID, setStudentID] = useState("");
  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");

  const [firstAttendance, setFirstAttendance] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [pricing, setPricing] = useState<PricingRow | null>(null);

  const [discounts, setDiscounts] = useState<DiscountType[]>([]);
  const [availableDiscounts, setAvailableDiscounts] = useState<DiscountType[]>(
    []
  );

  const [tuitionFinal, setTuitionFinal] = useState<number>(0);

  // ---------------- LOAD DISCOUNTS ------------------

  useEffect(() => {
    async function loadDiscounts() {
      const { data } = await supabase
        .from("discount_types")
        .select("*")
        .eq("is_active", true);

      if (data) setAvailableDiscounts(data);
    }
    loadDiscounts();
  }, []);

  // ---------------- LOAD PRICING ------------------

  useEffect(() => {
    async function loadPricing() {
      let src = "AY";
      if (enrollmentFor === "SUM2026") src = "SUM";
      if (enrollmentFor === "TE") src = "TE";

      const { data } = await supabase
        .from("tuitions_pricing")
        .select("*")
        .eq("pricing_source", src)
        .limit(1);

      if (data && data.length > 0) setPricing(data[0]);
    }

    loadPricing();
  }, [enrollmentFor]);

  // ---------------- ALLOWED DISCOUNT RULES ------------------

  function getAllowedDiscounts() {
    if (enrollmentFor === "SUM2026") {
      return availableDiscounts.filter(
        (d) =>
          d.discount_type_id === "FREE_SUMMER" ||
          d.discount_type_id === "DISC50"
      );
    }

    if (enrollmentFor === "TE") {
      return availableDiscounts.filter((d) => d.discount_type_id === "DISC50");
    }

    // AY25 & AY26 → all except free summer
    return availableDiscounts.filter(
      (d) => d.discount_type_id !== "FREE_SUMMER"
    );
  }

  // ---------------- ADD DISCOUNT ------------------

  function addDiscount(id: string) {
    const found = availableDiscounts.find((d) => d.discount_type_id === id);
    if (!found) return;
    setDiscounts((prev) => [...prev, found]);
  }

  // ---------------- CALCULATE TUITION ------------------

  useEffect(() => {
    if (!pricing) return;

    let base = 0;

    if (enrollmentFor === "SUM2026") base = 850000;
    else if (enrollmentFor === "TE") base = 450000;
    else base = pricing.annual_tuition_amount ?? 0;

    let total = base;

    const sorted = [...discounts].sort(
      (a, b) => a.priority_group - b.priority_group
    );

    for (const d of sorted) {
      if (d.discount_kind === "FIXED") total -= d.value_fixed ?? 0;
      else if (d.discount_kind === "PERCENT")
        total -= Math.floor(total * ((d.value_percent ?? 0) / 100));
    }

    if (total < 0) total = 0;
    setTuitionFinal(total);
  }, [discounts, pricing, enrollmentFor]);

  // ---------------- RENDER ------------------

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create Student Plan</h1>

      {/* STEP 1 — ENROLLMENT TYPE */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Step 1 — Enrollment</h2>

        <label><input type="radio" checked={enrollmentFor === "AY25"} onChange={() => setEnrollmentFor("AY25")} /> AY 2025–2026</label>
        <label><input type="radio" checked={enrollmentFor === "SUM2026"} onChange={() => setEnrollmentFor("SUM2026")} /> Summer 2026</label>
        <label><input type="radio" checked={enrollmentFor === "AY26"} onChange={() => setEnrollmentFor("AY26")} /> AY 2026–2027</label>
        <label><input type="radio" checked={enrollmentFor === "TE"} onChange={() => setEnrollmentFor("TE")} /> Tiny Explorer</label>

        <br /><br />

        <label><input type="radio" checked={isNewStudent} onChange={() => setIsNewStudent(true)} /> New Student</label>
        <label><input type="radio" checked={!isNewStudent} onChange={() => setIsNewStudent(false)} /> Current Student</label>

        {isNewStudent ? (
          <>
            <div>Student ID Preview: <b>{enrollmentFor === "AY26" ? "PR2026xxx" : "PR2025xxx"}</b></div>
            <input className={styles.input} placeholder="Student Name" value={studentName} onChange={(e)=>setStudentName(e.target.value)} />
            <input className={styles.input} placeholder="Father's Name" value={fatherName} onChange={(e)=>setFatherName(e.target.value)} />
          </>
        ) : (
          <>
            <input className={styles.input} placeholder="Search Student ID or Name" />
          </>
        )}
      </div>

      {/* STEP 2 — FIRST ATTENDANCE */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Step 2 — First Attendance Date</h2>

        <input
          type="date"
          className={styles.input}
          value={firstAttendance}
          onChange={(e) => setFirstAttendance(e.target.value)}
        />
      </div>

      {/* STEP 3 — DISCOUNTS + TUITION */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Step 3 — Tuition & Discounts</h2>

        <h3>Add Discount</h3>
        <select className={styles.input} onChange={(e)=>addDiscount(e.target.value)}>
          <option value="">Select…</option>
          {getAllowedDiscounts().map(d => (
            <option key={d.discount_type_id} value={d.discount_type_id}>
              {d.discount_name_type} — {d.discount_description}
            </option>
          ))}
        </select>

        <h3>Selected Discounts</h3>
        {discounts.map(d => (
          <div key={d.discount_type_id} className={styles.discountLine}>
            {d.discount_name_type} — {d.discount_description}
          </div>
        ))}

        <h3>Final Tuition</h3>
        <div className={styles.finalBox}>{tuitionFinal.toLocaleString()} Ks</div>
      </div>
    </div>
  );
}