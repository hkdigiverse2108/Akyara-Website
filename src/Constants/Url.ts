export const URL_KEYS = {
  AUTH: {
    SIGNIN: "/auth/login",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_OTP: "/auth/verify-otp",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  USER: {
    BASE: "/user",
    ADD: "/user/add",
    EDIT: "/user/edit",
    DROPDOWN: "/user/dropdown",
  },
  POLICY: {
    BASE: "/policy",
    ALL: "/policy/all",
  },
  ABOUT: {
    BASE: "/about",
    ALL: "/about/all",
  },
  FAQ: {
    BASE: "/faq",
    ALL: "/faq/all",
  },
  NEWSLETTER: {
    SUBSCRIBE: "/newsletter/subscribe",
  },
} as const;
