"use client";

export default function TuitionCalculation({ tuitionInfo }) {
  if (!tuitionInfo) return null;

  return (
    <div style={{
      padding: 16,
      border: "1px solid #d0d0d0",
      borderRadius: 8,
      marginBottom: 20
    }}>
      <h2 style={{ color: "#004AAD" }}>Tuition Calculation Summary</h2>

      <p>Base Tuition: {tuitionInfo.base_tuition} Ks</p>
      <p>Prorated Tuition: {tuitionInfo.prorated} Ks</p>
      <p>Discounts Applied: {tuitionInfo.discount_total} Ks</p>
      <p><b>Final Tuition: {tuitionInfo.final_tuition} Ks</b></p>
    </div>
  );
}
