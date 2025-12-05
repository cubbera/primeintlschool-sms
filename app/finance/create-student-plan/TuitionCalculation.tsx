"use client";

interface TuitionInfo {
  base_tuition: number;
  prorated_tuition: number;
  fixed_discounts_total: number;
  percent_discounts_total: number;
  final_tuition: number;
}

interface TuitionCalculationProps {
  tuitionInfo: TuitionInfo | null;
}

export default function TuitionCalculation({ tuitionInfo }: TuitionCalculationProps) {
  if (!tuitionInfo) return null;

  return (
    <div
      style={{
        padding: 16,
        background: "#F5F8FF",
        borderRadius: 8,
        border: "1px solid #D6E4FF",
        marginBottom: 20,
      }}
    >
      <h3 style={{ marginBottom: 12, color: "#004AAD" }}>Tuition Calculation</h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ padding: 6 }}>Base Tuition</td>
            <td style={{ padding: 6, textAlign: "right" }}>
              {tuitionInfo.base_tuition.toLocaleString()}
            </td>
          </tr>

          <tr>
            <td style={{ padding: 6 }}>Prorated Tuition</td>
            <td style={{ padding: 6, textAlign: "right" }}>
              {tuitionInfo.prorated_tuition.toLocaleString()}
            </td>
          </tr>

          <tr>
            <td style={{ padding: 6 }}>Fixed Discounts</td>
            <td style={{ padding: 6, textAlign: "right", color: "red" }}>
              -{tuitionInfo.fixed_discounts_total.toLocaleString()}
            </td>
          </tr>

          <tr>
            <td style={{ padding: 6 }}>Percent Discounts</td>
            <td style={{ padding: 6, textAlign: "right", color: "red" }}>
              -{tuitionInfo.percent_discounts_total.toLocaleString()}
            </td>
          </tr>

          <tr style={{ background: "#E9F1FF" }}>
            <td style={{ padding: 6, fontWeight: "bold" }}>Final Tuition</td>
            <td style={{ padding: 6, textAlign: "right", fontWeight: "bold", color: "#004AAD" }}>
              {tuitionInfo.final_tuition.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
