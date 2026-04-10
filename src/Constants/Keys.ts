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
  ADDRESS: {
    BASE: "address.base",
    ALL: "address.all",
    DETAIL: "address.detail",
  },
  PRODUCT: {
    BASE: "product.base",
    ALL: "product.all",
    DETAIL: "product.detail",
  },
  REVIEW: {
    BASE: "review.base",
    ALL: "review.all",
    DETAIL: "review.detail",
  },
  POLICY: {
    ALL: "policy.all",
  },
  ABOUT: {
    ALL: "about.all",
    DETAIL: "about.detail",
  },
  FAQ: {
    ALL: "faq.all",
  },
  BLOG: {
    ALL: "blog.all",
    DETAIL: "blog.detail",
  },
  SETTINGS: {
    ALL: "settings.all",
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
  WISHLIST: {
    BASE: "wishlist.base",
    ALL: "wishlist.all",
  },
  CART: {
    BASE: "cart.base",
    ALL: "cart.all",
  },
  ORDER: {
    BASE: "order.base",
    ALL: "order.all",
    DETAIL: "order.detail",
  },
  RAZORPAY: {
    PAY: "razorpay.pay",
    VERIFY: "razorpay.verify",
  },
  PHONEPE: {
    PAY: "phonepe.pay",
    CALLBACK: "phonepe.callback",
  },
  IG_POST: {
    ALL: "ig_post.all",
  },
  BANNER: {
    ALL: "banner.all",
    DETAIL: "banner.detail",
  },
  SALE_BANNER: {
    ALL: "sale_banner.all",
  },
} as const;
