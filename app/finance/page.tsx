"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";

type DivisionId = "PRE" | "CPR" | "CLS" | "CUS" | "CAD";

type GradeLevelId =
  | "TE"
  | "SR"
  | "EY1"
  | "EY2"
  | "Y1"
  | "Y2"
  | "Y3"
  | "Y4"
  | "Y5"
  | "Y6"
  | "Y7"
  | "Y8"
  | "Y9"
  | "Y10"
  | "Y11"
  | "Y12"
  | "Y13";

type SessionType = "FULL_DAY" | "HALF_DAY" | "ONE_SESSION" | "NA";
type PlanType = "ANNUAL" | "TERMLY" | "MONTHLY";

type DiscountPriorityGroup = 1 | 2;

interface DiscountOption {
  discount_type_id: string;
  discount_name_type: string; // Referral, Sibling, Lucky Draw, etc.
  label: string; // e.g. "Referral – 100,000 Ks"
  priority_group: DiscountPriorityGroup;
  kind: "FIXED" | "PERCENT";
  value_fixed?: number;
  value_percent?: number;
}

// 🔵 Approx brand colors from logo: blue / gold
const cardClass =
  "bg-white shadow-sm rounded-2xl border border-slate-100 p-4 sm:p-6 mb-4 sm:mb-6";

const blueButtonClass =
  "inline-flex items-center justify-center rounded-xl bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

// NOTE: in real app, this will be loaded from DB (discount_types)
const DISCOUNT_OPTIONS: DiscountOption[] = [
  // Priority 1
  {
    discount_type_id: "RD100K",
    discount_name_type: "Referral",
    label: "Referral – 100,000 Ks",
    priority_group: 1,
    kind: "FIXED",
    value_fixed: 100000,
  },
  {
    discount_type_id: "LD_FREE_3T",
    discount_name_type: "Lucky Draw",
    label: "Lucky Draw – FREE 3 Terms",
    priority_group: 1,
    kind: "FIXED",
  },
  {
    discount_type_id: "LD_FREE_2T",
    discount_name_type: "Lucky Draw",
    label: "Lucky Draw – FREE 2 Terms",
    priority_group: 1,
    kind: "FIXED",
  },
  {
    discount_type_id: "LD_FREE_1T",
    discount_name_type: "Lucky Draw",
    label: "Lucky Draw – FREE 1 Term",
    priority_group: 1,
    kind: "FIXED",
  },
  {
    discount_type_id: "LD_FREE_SUMMER",
    discount_name_type: "Lucky Draw",
    label: "Lucky Draw – FREE Summer Class",
    priority_group: 1,
    kind: "FIXED",
  },

  // Priority 2 – Sibling
  {
    discount_type_id: "SD5",
    discount_name_type: "Sibling",
    label: "Sibling Discount – 5%",
    priority_group: 2,
    kind: "PERCENT",
    value_percent: 5,
  },
  {
    discount_type_id: "SD10",
    discount_name_type: "Sibling",
    label: "Sibling Discount – 10%",
    priority_group: 2,
    kind: "PERCENT",
    value_percent: 10,
  },
  {
    discount_type_id: "SD15",
    discount_name_type: "Sibling",
    label: "Sibling Discount – 15%",
    priority_group: 2,
    kind: "PERCENT",
    value_percent: 15,
  },

  // Priority 2 – Early Bird
  {
    discount_type_id: "EB35",
    discount_name_type: "Early Bird",
    label: "Early Bird – 35%",
    priority_group: 2,
    kind: "PERCENT",
    value_percent: 35,
  },

  // Priority 2 – Lucky Draw %
  {
    discount_type_id: "LD15",
    discount_name_type: "Lucky Draw",
    label: "Lucky Draw – 15%",
    priority_group: 2,
    kind: "PERCENT",
    value_percent: 15,
  },
  {
    discount_type_id: "LD25",
    discount_name_type: "Lucky Draw",
    label: "Lucky Draw – 25%",
    priority_group: 2,
    kind: "PERCENT",
    value_percent: 25,
  },
  {
    discount_type_id: "LD35",
    discount_name_type: "Lucky Draw",
    label: "Lucky Draw – 35%",
    priority_group: 2,
    kind: "PERCENT",
    value_percent: 35,
  },
  {
    discount_type_id: "LD40",
    discount_name_type: "Lucky Draw",
    label: "Lucky Draw – 40%",
    priority_group: 2,
    kind: "PERCENT",
    value_percent: 40,
  },
  {
    discount_type_id: "LD50",
    discount_name_type: "Lucky Draw",
    label: "Lucky Draw – 50%",
    priority_group: 2,
    kind: "PERCENT",
    value_percent: 50,
  },
  {
    discount_type_id: "LD75",
    discount_name_type: "Lucky Draw",
    label: "Lucky Draw – 75%",
    priority_group: 2,
    kind: "PERCENT",
    value_percent: 75,
  },

  // Priority 2 – Play & Learn
  {
    discount_type_id: "PL15",
    discount_name_type: "Play & Learn",
    label: "Play & Learn – 15%",
    priority_group: 2,
    kind: "PERCENT",
    value_percent: 15,
  },
];

const ACADEMIC_YEARS = [
  { id: "AY2025-2026", label: "AY 2025–2026", studentPrefix: "PR2025" },
  { id: "AY2026-2027", label: "AY 2026–2027", studentPrefix: "PR2026" },
];

const DIVISIONS: { id: DivisionId; name: string }[] = [
  { id: "PRE", name: "Preschool" },
  { id: "CPR", name: "Cambridge Primary" },
  { id: "CLS", name: "Cambridge Lower Secondary" },
  { id: "CUS", name: "Cambridge Upper Secondary (IGCSE)" },
  { id: "CAD", name: "Cambridge Advanced (A Level)" },
];

const GRADE_LEVELS: { id: GradeLevelId; name: string; divisionId: DivisionId }[] =
  [
    // Preschool
    { id: "TE", name: "Tiny Explorers", divisionId: "PRE" },
    { id: "SR", name: "School Readiness", divisionId: "PRE" },
    { id: "EY1", name: "Early Years 1", divisionId: "PRE" },
    { id: "EY2", name: "Early Years 2", divisionId: "PRE" },

    // Cambridge Primary
    { id: "Y1", name: "Year 1", divisionId: "CPR" },
    { id: "Y2", name: "Year 2", divisionId: "CPR" },
    { id: "Y3", name: "Year 3", divisionId: "CPR" },
    { id: "Y4", name: "Year 4", divisionId: "CPR" },
    { id: "Y5", name: "Year 5", divisionId: "CPR" },
    { id: "Y6", name: "Year 6", divisionId: "CPR" },

    // The rest exist in DB but won’t be used yet
    { id: "Y7", name: "Year 7", divisionId: "CLS" },
    { id: "Y8", name: "Year 8", divisionId: "CLS" },
    { id: "Y9", name: "Year 9", divisionId: "CLS" },
    { id: "Y10", name: "Year 10", divisionId: "CUS" },
    { id: "Y11", name: "Year 11", divisionId: "CUS" },
    { id: "Y12", name: "Year 12", divisionId: "CAD" },
    { id: "Y13", name: "Year 13", divisionId: "CAD" },
  ];

interface SelectedDiscount {
  id: string;
}

interface PaymentPlanRow {
  installmentNo: number;
  monthLabel: string;
  dueDate: string;
  tuitionAmount: number;
}

export default function CreateStudentPlanPage() {
  const today = useMemo(() => new Date(), []);
  const [academicYearId, setAcademicYearId] = useState("AY2025-2026");
  const [divisionId, setDivisionId] = useState<DivisionId>("PRE");
  const [gradeLevelId, setGradeLevelId] = useState<GradeLevelId>("SR");
  const [sessionType, setSessionType] = useState<SessionType>("FULL_DAY");
  const [planType, setPlanType] = useState<PlanType>("ANNUAL");

  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");

  const [registrationDate] = useState(today);
  const [firstAttendanceDate, setFirstAttendanceDate] = useState(
    format(today, "yyyy-MM-dd")
  );

  const [selectedDiscountIds, setSelectedDiscountIds] = useState<string[]>([]);
  const [paymentPlanRows, setPaymentPlanRows] = useState<PaymentPlanRow[]>([]);

  // ---- Derived helpers ----

  const selectedAcademicYear = ACADEMIC_YEARS.find(
    (ay) => ay.id === academicYearId
  );
  const studentIdPreview = selectedAcademicYear
    ? `${selectedAcademicYear.studentPrefix}xxx`
    : "PRxxxxxxx";

  const availableGrades = GRADE_LEVELS.filter(
    (g) => g.divisionId === divisionId
  );

  const isSR = gradeLevelId === "SR";
  const isTE = gradeLevelId === "TE";

  // Session type UI rules
  const effectiveSessionType: SessionType = useMemo(() => {
    if (isTE) return "ONE_SESSION";
    if (!isSR) return "FULL_DAY";
    return sessionType;
  }, [isTE, isSR, sessionType]);

  // Payment plan visibility rules
  const effectivePlanType: PlanType | "PACKAGE" = useMemo(() => {
    if (isTE) return "PACKAGE";
    return planType;
  }, [isTE, planType]);

  // DISCOUNTS: always sorted by priority_group, then label
  const sortedSelectedDiscounts: DiscountOption[] = useMemo(() => {
    const selected = DISCOUNT_OPTIONS.filter((d) =>
      selectedDiscountIds.includes(d.discount_type_id)
    );
    return [...selected].sort((a, b) => {
      if (a.priority_group !== b.priority_group) {
        return a.priority_group - b.priority_group;
      }
      return a.label.localeCompare(b.label);
    });
  }, [selectedDiscountIds]);

  // ⚠️ Placeholder tuition values (UI only!)
  // Later we will load from sms.tuitions_pricing based on AY + grade + session_type + plan_type
  const placeholderTuition = useMemo(() => {
    // Purely cosmetic for now
    if (isTE) return 400_000;
    if (gradeLevelId === "SR" && effectiveSessionType === "HALF_DAY")
      return 2_500_000;
    if (gradeLevelId === "SR") return 3_900_000;
    if (gradeLevelId === "EY1" || gradeLevelId === "EY2") return 3_900_000;
    if (gradeLevelId === "Y1" || gradeLevelId === "Y2") return 4_200_000;
    return 4_200_000;
  }, [gradeLevelId, effectiveSessionType, isTE]);

  const [finalTuitionPreview, setFinalTuitionPreview] = useState<number | null>(
    null
  );
  const [installmentsPreview, setInstallmentsPreview] = useState<number | null>(
    null
  );
  const [perInstallmentPreview, setPerInstallmentPreview] = useState<
    number | null
  >(null);

  // Simple dummy plan generator (UI only – NO BUSINESS LOGIC!)
  const handleGeneratePlan = () => {
    // For now we will:
    // - use placeholderTuition
    // - assume 8 installments for monthly, 3 for termly, 1 for annual
    // This will be replaced later with the real AY/term/month rule.
    let installments = 1;
    if (effectivePlanType === "TERMLY") installments = 3;
    if (effectivePlanType === "MONTHLY") installments = 10;
    if (effectivePlanType === "PACKAGE") installments = 1;

    const finalTuition = placeholderTuition; // will later include prorate + discounts
    const perInstallment = Math.round(finalTuition / installments);

    const rows: PaymentPlanRow[] = [];
    for (let i = 0; i < installments; i++) {
      // For UI: just show month numbers 1..n and fake due dates
      const monthLabel =
        effectivePlanType === "PACKAGE" ? "Package" : `Month ${i + 1}`;
      const dummyDate = new Date(registrationDate);
      dummyDate.setMonth(dummyDate.getMonth() + i);
      rows.push({
        installmentNo: i + 1,
        monthLabel,
        dueDate: format(dummyDate, "dd MMM yyyy"),
        tuitionAmount: perInstallment,
      });
    }

    setFinalTuitionPreview(finalTuition);
    setInstallmentsPreview(installments);
    setPerInstallmentPreview(perInstallment);
    setPaymentPlanRows(rows);
  };

  const handleToggleDiscount = (id: string) => {
    setSelectedDiscountIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 🚨 IMPORTANT:
    // This is where we will later:
    // 1) Insert student
    // 2) Insert enrollment
    // 3) Insert invoices + invoice_items
    // 4) Insert discounts used
    // For now, just log to console so you can see it works.
    console.log("SUBMIT Create Student Plan", {
      academicYearId,
      divisionId,
      gradeLevelId,
      sessionType: effectiveSessionType,
      planType: effectivePlanType,
      studentName,
      fatherName,
      registrationDate,
      firstAttendanceDate,
      selectedDiscountIds,
      paymentPlanRows,
    });
    alert("UI-only: Student Plan created (mock). DB wiring comes next.");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-3 sm:px-4 py-4 sm:py-6">
        {/* Page header */}
        <header className="mb-4 sm:mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Finance
            </p>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Create Student Plan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Registration → Tuition plan → First invoice.
            </p>
          </div>
          <div className="text-right text-xs sm:text-sm text-slate-500">
            <div>Today: {format(today, "dd MMM yyyy")}</div>
            <div>AY: {selectedAcademicYear?.label ?? "—"}</div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* SECTION 1 — STUDENT BASIC INFO */}
          <section className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              1. Student Information
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Father&apos;s Name *
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Student ID (preview)
                </label>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center rounded-xl bg-blue-50 px-3 py-1.5 text-blue-700 font-mono text-xs sm:text-sm">
                    {studentIdPreview}
                  </span>
                  <span className="text-xs text-slate-500">
                    Actual ID generated on save (unique & permanent).
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2 — ACADEMIC & PLAN */}
          <section className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              2. Academic Year & Tuition Plan
            </h2>

            <div className="grid gap-3 sm:grid-cols-3 mb-3">
              {/* Academic Year */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Academic Year *
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                  value={academicYearId}
                  onChange={(e) => setAcademicYearId(e.target.value)}
                >
                  {ACADEMIC_YEARS.map((ay) => (
                    <option key={ay.id} value={ay.id}>
                      {ay.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Division */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Division *
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                  value={divisionId}
                  onChange={(e) =>
                    setDivisionId(e.target.value as DivisionId)
                  }
                >
                  {DIVISIONS.map((div) => (
                    <option key={div.id} value={div.id}>
                      {div.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade Level */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Grade Level *
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                  value={gradeLevelId}
                  onChange={(e) =>
                    setGradeLevelId(e.target.value as GradeLevelId)
                  }
                >
                  {availableGrades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 mb-3">
              {/* Session Type */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Session Type *
                </label>
                {isSR ? (
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                    value={sessionType}
                    onChange={(e) =>
                      setSessionType(e.target.value as SessionType)
                    }
                  >
                    <option value="FULL_DAY">Full Day</option>
                    <option value="HALF_DAY">Half Day</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="inline-flex rounded-xl bg-slate-100 px-3 py-1.5 text-slate-700">
                      {isTE
                        ? "ONE SESSION (Tiny Explorers package)"
                        : "FULL DAY"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Auto-detected from grade.
                    </span>
                  </div>
                )}
              </div>

              {/* Payment Plan */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Payment Plan *
                </label>
                {isTE ? (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="inline-flex rounded-xl bg-slate-100 px-3 py-1.5 text-slate-700">
                      PACKAGE (10 sessions)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Tiny Explorers fixed package.
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2 text-xs">
                    {(["ANNUAL", "TERMLY", "MONTHLY"] as PlanType[]).map(
                      (p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setPlanType(p)}
                          className={`flex-1 rounded-xl border px-3 py-1.5 ${
                            effectivePlanType === p
                              ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold"
                              : "border-slate-200 bg-white text-slate-700"
                          }`}
                        >
                          {p === "ANNUAL"
                            ? "Annual"
                            : p === "TERMLY"
                            ? "Termly"
                            : "Monthly"}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Registration Date
                  </label>
                  <input
                    type="text"
                    disabled
                    value={format(registrationDate, "dd MMM yyyy")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    First Attendance Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                    value={firstAttendanceDate}
                    onChange={(e) => setFirstAttendanceDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Prorate info */}
            <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
              <div className="text-xs text-slate-600">
                <span className="font-semibold">Prorate:</span>{" "}
                <span>Automatic (month-based)</span>
              </div>
              <div className="text-[10px] text-slate-500">
                Rule: Prorate → Priority 1 fixed → Priority 2 % → Installments.
              </div>
            </div>
          </section>

          {/* SECTION 3 — DISCOUNTS */}
          <section className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              3. Discounts
            </h2>

            <div className="flex flex-wrap gap-2 mb-2">
              {DISCOUNT_OPTIONS.map((d) => {
                const selected = selectedDiscountIds.includes(
                  d.discount_type_id
                );
                return (
                  <button
                    key={d.discount_type_id}
                    type="button"
                    onClick={() => handleToggleDiscount(d.discount_type_id)}
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] sm:text-xs ${
                      selected
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-400"
                    }`}
                  >
                    <span className="mr-1 text-[9px] text-slate-400">
                      P{d.priority_group}
                    </span>
                    <span>{d.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-500">
              Order of application is controlled by database (priority group &
              type), not by click order.
            </p>
          </section>

          {/* SECTION 4 & 5 — TUITION CALCULATION (CARD) */}
          <section className={cardClass}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800">
                4. Tuition Calculation (Preview Only)
              </h2>
              <button
                type="button"
                onClick={handleGeneratePlan}
                className={blueButtonClass}
              >
                Preview Plan
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 text-xs sm:text-sm">
              {/* Column 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Base tuition</span>
                  <span className="font-mono">
                    {placeholderTuition.toLocaleString()} Ks
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Prorated (month)</span>
                  <span className="font-mono text-slate-400">–</span>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-1.5">
                <div className="text-slate-500">Priority 1 (fixed)</div>
                <ul className="list-disc list-inside text-[11px] text-slate-600">
                  {sortedSelectedDiscounts
                    .filter((d) => d.priority_group === 1)
                    .map((d) => (
                      <li key={d.discount_type_id}>{d.label}</li>
                    ))}
                  {sortedSelectedDiscounts.filter(
                    (d) => d.priority_group === 1
                  ).length === 0 && <li>None</li>}
                </ul>
                <div className="text-slate-500 mt-2">Priority 2 (%)</div>
                <ul className="list-disc list-inside text-[11px] text-slate-600">
                  {sortedSelectedDiscounts
                    .filter((d) => d.priority_group === 2)
                    .map((d) => (
                      <li key={d.discount_type_id}>{d.label}</li>
                    ))}
                  {sortedSelectedDiscounts.filter(
                    (d) => d.priority_group === 2
                  ).length === 0 && <li>None</li>}
                </ul>
              </div>

              {/* Column 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Final tuition</span>
                  <span className="font-mono font-semibold text-blue-700">
                    {finalTuitionPreview
                      ? `${finalTuitionPreview.toLocaleString()} Ks`
                      : "–"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Installments</span>
                  <span className="font-mono">
                    {installmentsPreview ?? "–"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Per installment</span>
                  <span className="font-mono">
                    {perInstallmentPreview
                      ? `${perInstallmentPreview.toLocaleString()} Ks`
                      : "–"}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              This box is read-only. All numbers will be generated from{" "}
              <span className="font-mono">tuitions_pricing</span>,{" "}
              <span className="font-mono">discount_types</span> and your
              prorate rules on the server.
            </p>
          </section>

          {/* SECTION 6 — PAYMENT PLAN TABLE */}
          <section className={cardClass}>
            <h2 className="text-sm font-semibold text-slate-800 mb-3">
              5. Generated Payment Plan (Tuition Only)
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
              <table className="min-w-full text-xs sm:text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-slate-500">
                      #
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-500">
                      Month / Term
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-500">
                      Due Date
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-slate-500">
                      Tuition
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentPlanRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-4 text-center text-slate-400 text-xs"
                      >
                        Click <strong>Preview Plan</strong> to generate
                        installments.
                      </td>
                    </tr>
                  ) : (
                    paymentPlanRows.map((row) => (
                      <tr key={row.installmentNo} className="border-t">
                        <td className="px-3 py-2 text-slate-600">
                          {row.installmentNo}
                        </td>
                        <td className="px-3 py-2 text-slate-700">
                          {row.monthLabel}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {row.dueDate}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-slate-800">
                          {row.tuitionAmount.toLocaleString()} Ks
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              This table shows only tuition per installment. Late fee and
              other charges will appear on actual invoices, not here.
            </p>
          </section>

          {/* FOOTER ACTION */}
          <div className="sticky bottom-0 z-10 -mx-3 sm:-mx-4 border-t border-slate-200 bg-slate-50/95 backdrop-blur">
            <div className="mx-auto max-w-5xl px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-[11px] text-slate-500">
                When you click{" "}
                <span className="font-semibold">Create Student Plan</span>, the
                system will create:
                <br />
                student + enrollment + payment plan + first invoice.
              </p>
              <button type="submit" className={blueButtonClass}>
                Create Student Plan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
