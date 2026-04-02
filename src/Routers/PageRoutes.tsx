import type { RouteObject } from "react-router-dom";
import { ROUTES } from "../Constants";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import Login from "../Pages/Auth/Login";
import ResetPassword from "../Pages/Auth/ResetPassword";
import Signup from "../Pages/Auth/Signup";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import AboutPage from "../Pages/InfoPages/AboutPage";
import CancellationPolicyPage from "../Pages/InfoPages/CancellationPolicyPage";
import FAQPage from "../Pages/InfoPages/FAQPage";
import Home from "../Pages/Home";
import InfoPage from "../Pages/InfoPage";
import PrivacyPolicyPage from "../Pages/InfoPages/PrivacyPolicyPage";
import Profile from "../Pages/Profile/index";
import ReturnRefundPolicyPage from "../Pages/InfoPages/ReturnRefundPolicyPage";
import TermsConditionPage from "../Pages/InfoPages/TermsConditionPage";

export const PageRoutes: RouteObject[] = [
  { path: ROUTES.HOME, element: <Home /> },
  { path: ROUTES.PROFILE, element: <Profile section="info" /> },
  { path: ROUTES.ACCOUNT.INFO, element: <Profile section="info" /> },
  { path: ROUTES.ACCOUNT.ORDERS, element: <Profile section="orders" /> },
  { path: ROUTES.ACCOUNT.WISHLIST, element: <Profile section="wishlist" /> },
  { path: ROUTES.ACCOUNT.ADDRESSES, element: <Profile section="addresses" /> },
  { path: ROUTES.ACCOUNT.PAYMENT, element: <Profile section="payment" /> },
  { path: ROUTES.ACCOUNT.CHANGE_PASSWORD, element: <Profile section="change-password" /> },
  { path: ROUTES.INFO.CONTACT, element: <InfoPage title="Contact Us" /> },
  { path: ROUTES.INFO.ABOUT, element: <AboutPage /> },
  { path: ROUTES.INFO.TRACKING, element: <InfoPage title="Tracking Order" /> },
  { path: ROUTES.INFO.BLOG, element: <InfoPage title="Blog" /> },
  { path: ROUTES.INFO.FAQ, element: <FAQPage /> },
  { path: ROUTES.INFO.REFUND, element: <ReturnRefundPolicyPage /> },
  { path: ROUTES.INFO.PRIVACY, element: <PrivacyPolicyPage /> },
  { path: ROUTES.INFO.TERMS, element: <TermsConditionPage /> },
  { path: ROUTES.INFO.CANCELLATION, element: <CancellationPolicyPage /> },
];

export const AuthRoutes: RouteObject[] = [
  { path: ROUTES.AUTH.SIGNIN, element: <Login /> },
  { path: ROUTES.AUTH.LOGIN, element: <Login /> },
  { path: ROUTES.AUTH.SIGNUP, element: <Signup /> },
  { path: ROUTES.AUTH.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: ROUTES.AUTH.RESET_PASSWORD, element: <ResetPassword /> },
  { path: ROUTES.AUTH.VERIFY_OTP, element: <VerifyOtp /> },
];
