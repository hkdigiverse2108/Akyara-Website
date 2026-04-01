import type { RouteObject } from "react-router-dom";
import { POLICY_TYPE, ROUTES } from "../Constants";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import Login from "../Pages/Auth/Login";
import ResetPassword from "../Pages/Auth/ResetPassword";
import Signup from "../Pages/Auth/Signup";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import CategoryPage from "../Pages/CategoryPage";
import Home from "../Pages/Home";
import InfoPage from "../Pages/InfoPage";
import Profile from "../Pages/Profile/index";

export const PageRoutes: RouteObject[] = [
  { path: ROUTES.HOME, element: <Home /> },
  { path: ROUTES.PROFILE, element: <Profile section="info" /> },
  { path: ROUTES.ACCOUNT.INFO, element: <Profile section="info" /> },
  { path: ROUTES.ACCOUNT.ORDERS, element: <Profile section="orders" /> },
  { path: ROUTES.ACCOUNT.WISHLIST, element: <Profile section="wishlist" /> },
  { path: ROUTES.ACCOUNT.ADDRESSES, element: <Profile section="addresses" /> },
  { path: ROUTES.ACCOUNT.PAYMENT, element: <Profile section="payment" /> },
  {
    path: ROUTES.PRODUCTS,
    element: (
      <CategoryPage
        title="Products"
        description="Explore our full collection of fashion essentials and trending styles."
      />
    ),
  },
  {
    path: ROUTES.SHIRTS,
    element: (
      <CategoryPage
        title="Shirts"
        description="Browse classic shirts designed for everyday comfort and polished looks."
      />
    ),
  },
  {
    path: ROUTES.TSHIRTS,
    element: (
      <CategoryPage
        title="Tshirts"
        description="Discover easy everyday t-shirts with clean fits and relaxed styling."
      />
    ),
  },
  {
    path: ROUTES.JEANS,
    element: (
      <CategoryPage
        title="Jeans"
        description="Find denim staples built for versatility, comfort, and all-day wear."
      />
    ),
  },
  {
    path: ROUTES.INFO.CONTACT,
    element: (
      <InfoPage
        eyebrow="Company"
        title="Contact Us"
        description="Get in touch with our team for product questions, order help, and support anytime you need it."
      />
    ),
  },
  {
    path: ROUTES.INFO.ABOUT,
    element: (
      <InfoPage
        eyebrow="Company"
        title="About Us"
        description="Learn more about our brand, our values, and how we bring modern shopping experiences to everyday customers."
        aboutPage
      />
    ),
  },
  {
    path: ROUTES.INFO.TRACKING,
    element: (
      <InfoPage
        eyebrow="Company"
        title="Tracking Order"
        description="Track your purchase progress and stay updated on processing, shipping, and delivery information."
      />
    ),
  },
  {
    path: ROUTES.INFO.BLOG,
    element: (
      <InfoPage
        eyebrow="Company"
        title="Blog"
        description="Read the latest updates, shopping tips, styling ideas, and brand stories from our editorial team."
      />
    ),
  },
  {
    path: ROUTES.INFO.FAQ,
    element: (
      <InfoPage
        eyebrow="Company"
        title="FAQ Page"
        description="Find quick answers to the most common questions about orders, shipping, payments, and returns."
      />
    ),
  },
  {
    path: ROUTES.INFO.REFUND,
    element: (
      <InfoPage
        eyebrow="Support"
        title="Return & Refund Policy"
        description="Review our return timelines, refund eligibility, and the steps required to complete a return request."
        policyType={POLICY_TYPE.RETURN_REFUND}
      />
    ),
  },
  {
    path: ROUTES.INFO.PRIVACY,
    element: (
      <InfoPage
        eyebrow="Support"
        title="Privacy Policy"
        description="Understand how we collect, use, and protect your personal information across our website and services."
        policyType={POLICY_TYPE.PRIVACY}
      />
    ),
  },
  {
    path: ROUTES.INFO.TERMS,
    element: (
      <InfoPage
        eyebrow="Support"
        title="Terms & Condition"
        description="Review the rules, responsibilities, and usage terms that apply when shopping through our platform."
        policyType={POLICY_TYPE.TERMS_CONDITION}
      />
    ),
  },
  {
    path: ROUTES.INFO.CANCELLATION,
    element: (
      <InfoPage
        eyebrow="Support"
        title="Cancellation Policy"
        description="See how order cancellations work, including timing requirements and any applicable restrictions."
        policyType={POLICY_TYPE.CANCELLATION}
      />
    ),
  },
];

export const AuthRoutes: RouteObject[] = [
  { path: ROUTES.AUTH.SIGNIN, element: <Login /> },
  { path: ROUTES.AUTH.LOGIN, element: <Login /> },
  { path: ROUTES.AUTH.SIGNUP, element: <Signup /> },
  { path: ROUTES.AUTH.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: ROUTES.AUTH.RESET_PASSWORD, element: <ResetPassword /> },
  { path: ROUTES.AUTH.VERIFY_OTP, element: <VerifyOtp /> },
];
