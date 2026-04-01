export const POLICY_TYPE = {
  RETURN_REFUND: "returnRefund",
  PRIVACY: "privacy",
  TERMS_CONDITION: "termsCondition",
  SHIPPING: "shipping",
  CANCELLATION: "cancellation",
} as const;

export type PolicyType = (typeof POLICY_TYPE)[keyof typeof POLICY_TYPE];
