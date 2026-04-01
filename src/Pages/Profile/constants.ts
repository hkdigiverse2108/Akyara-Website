import { ROUTES } from "../../Constants";

export const profileSections = [
  { label: "My Order", to: ROUTES.ACCOUNT.ORDERS },
  { label: "Wishlist", to: ROUTES.ACCOUNT.WISHLIST },
  { label: "Profile Info", to: ROUTES.ACCOUNT.INFO },
  { label: "Addresses", to: ROUTES.ACCOUNT.ADDRESSES },
  { label: "Payment Methode", to: ROUTES.ACCOUNT.PAYMENT },
] as const;
