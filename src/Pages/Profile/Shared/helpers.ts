import type { AuthSessionUser } from "../../../Types";

export const getDisplayName = (user: AuthSessionUser | null) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;

  if (user?.email) {
    return user.email
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return "Guest User";
};

export const getInitials = (user: AuthSessionUser | null) => {
  return getDisplayName(user)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

export const getPhoneNumber = (user: AuthSessionUser | null) => {
  const directPhone = typeof user?.phoneNumber === "string" ? user.phoneNumber : "";
  const contactPhone = user?.contact?.phoneNo ?? "";
  return directPhone || contactPhone || "Not available";
};
