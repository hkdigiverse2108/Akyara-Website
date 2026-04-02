export type AccountSection = "orders" | "wishlist" | "info" | "addresses" | "payment" | "change-password";

export type ProfileProps = {
  section?: AccountSection;
};
