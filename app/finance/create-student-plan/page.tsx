"use client";

import { useState } from "react";

export default function CreateStudentPlan() {
  const [enrollFor, setEnrollFor] = useState("");
  const [enrollType, setEnrollType] = useState("new");
  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [studentId, setStudentId] = useState("");

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>Create Student Plan</h1>

      {/* STEP 1 — ENROLL FOR */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Step 1 — Enrollment</h3>

        <label>Select Enrollment Option:</label>
        <select
          value={enrollFor}
          onChange={(e) => setEnrollFor(e.target.value)}
          style={{ display: "block", marginTop: "8px", padding: "8px" }}
        >
          <option value="">Select…</option>
          <option value="AY25">Academic Year 2025–2026</option>
          <option value="SUM2026">Summer 2026</option>
          <option value="AY26">Academic Year 2026–2027</option>
          <option value="TE">Tiny Explorer (10-weeks)</option>
        </select>

        {/* ENROLL TYPE */}
        <div style={{ marginTop: "20px" }}>
          <label>Enroll Type:</label>
          <div style={{ marginTop: "8px" }}>
            <label>
              <input
                type="radio"
                checked={enrollType === "new"}
                onChange={() => setEnrollType("new")}
              />
              New Student
            </label>
            <label style={{ marginLeft: "20px" }}>
              <input
                type="radio"
                checked={enrollType === "current"}
                onChange={() => setEnrollType("current")}
              />
              Current Student
            </label>
          </div>
        </div>

        {/* STUDENT FIELDS */}
        <div style={{ marginTop: "20px" }}>
          {enrollType === "new" ? (
            <>
              <label>Student Full Name:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                style={{ display: "block", padding: "8px", marginTop: "6px" }}
              />

              <label style={{ marginTop: "10px" }}>Father’s Name:</label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                style={{ display: "block", padding: "8px", marginTop: "6px" }}
              />

              {/* Auto student ID preview */}
              {enrollFor && (
                <p style={{ marginTop: "10px", color: "green" }}>
                  Student ID will be auto-generated (prefix based on {enrollFor})
                </p>
              )}
            </>
          ) : (
            <>
              <label>Enter Student ID:</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                style={{ display: "block", padding: "8px", marginTop: "6px" }}
              />

              <p style={{ marginTop: "10px", color: "gray" }}>
                System will auto-fetch student details.
              </p>
            </>
          )}
        </div>
      </div>

      <p style={{ opacity: 0.4 }}>More steps will be added after cleanup.</p>
    </div>
  );
}
