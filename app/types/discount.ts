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
