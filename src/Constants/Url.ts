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
  ADDRESS: {
    BASE: "/address",
    ADD: "/address/add",
    EDIT: "/address/edit",
    ALL: "/address/all",
  },
  PRODUCT: {
    BASE: "/product",
    ALL: "/product/all",
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
  BLOG: {
    BASE: "/blog",
    ALL: "/blog/all",
  },
  SETTINGS: {
    BASE: "/settings",
  },
  UPLOAD: {
    IMAGE: "/upload/image",
  },
  NEWSLETTER: {
    SUBSCRIBE: "/newsletter/subscribe",
  },
  CONTACT: {
    ADD: "/contact/add",
  },
} as const;
