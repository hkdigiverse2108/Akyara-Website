export const URL_KEYS = {
  AUTH: {
    SIGNIN: "/auth/login",
    SIGNUP: "/auth/signup",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_OTP: "/auth/verify-otp",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  USER: {
    BASE: "/user",
    DROPDOWN: "/user/dropdown",
  },
} as const;
