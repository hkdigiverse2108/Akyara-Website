export const KEYS = {
  AUTH: {
    SIGNIN: "auth.signin",
    SIGNUP: "auth.signup",
    FORGOT_PASSWORD: "auth.forgotPassword",
    RESET_PASSWORD: "auth.resetPassword",
    VERIFY_OTP: "auth.verifyOtp",
    CHANGE_PASSWORD: "auth.changePassword",
  },
  USER: {
    BASE: "user.base",
    DROPDOWN: "user.dropdown",
  },
  POLICY: {
    ALL: "policy.all",
  },
  ABOUT: {
    ALL: "about.all",
  },
  FAQ: {
    ALL: "faq.all",
  },
  BLOG: {
    ALL: "blog.all",
    DETAIL: "blog.detail",
  },
  UPLOAD: {
    IMAGE: "upload.image",
  },
  NEWSLETTER: {
    SUBSCRIBE: "newsletter.subscribe",
  },
  CONTACT: {
    ADD: "contact.add",
  },
} as const;
