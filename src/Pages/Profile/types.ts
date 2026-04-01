export type AccountSection = "orders" | "wishlist" | "info" | "addresses" | "payment";

export type ProfileProps = {
  section?: AccountSection;
};
