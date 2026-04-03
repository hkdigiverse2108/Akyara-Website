import type { RouteObject } from "react-router-dom";
import { ROUTES } from "../Constants";
import { ForgotPassword, Login, ResetPassword, Signup, VerifyOtp } from "../Pages/Auth";
import Home from "../Pages/Home/Home";
import InfoPage from "../Pages/InfoPage";
import {AboutDetailPage,AboutPage,BlogDetailPage,BlogPage,CancellationPolicyPage,ContactPage,FAQPage,PrivacyPolicyPage,ReturnRefundPolicyPage,TermsConditionPage,} from "../Pages/InfoPages";
import NotFound from "../Pages/NotFound";
import Profile from "../Pages/Profile/index";

export const PageRoutes: RouteObject[] = [
  { path: ROUTES.HOME, element: <Home /> },
  { path: ROUTES.PROFILE, element: <Profile section="info" /> },
  { path: ROUTES.ACCOUNT.INFO, element: <Profile section="info" /> },
  { path: ROUTES.ACCOUNT.ORDERS, element: <Profile section="orders" /> },
  { path: ROUTES.ACCOUNT.WISHLIST, element: <Profile section="wishlist" /> },
  { path: ROUTES.ACCOUNT.ADDRESSES, element: <Profile section="addresses" /> },
  { path: ROUTES.ACCOUNT.PAYMENT, element: <Profile section="payment" /> },
  { path: ROUTES.ACCOUNT.CHANGE_PASSWORD, element: <Profile section="change-password" /> },
  { path: ROUTES.INFO.CONTACT, element: <ContactPage /> },
  { path: ROUTES.INFO.ABOUT, element: <AboutPage /> },
  { path: ROUTES.INFO.ABOUT_DETAIL, element: <AboutDetailPage /> },
  { path: ROUTES.INFO.TRACKING, element: <InfoPage title="Tracking Order" /> },
  { path: ROUTES.INFO.BLOG, element: <BlogPage /> },
  { path: ROUTES.INFO.BLOG_DETAIL, element: <BlogDetailPage /> },
  { path: ROUTES.INFO.FAQ, element: <FAQPage /> },
  { path: ROUTES.INFO.REFUND, element: <ReturnRefundPolicyPage /> },
  { path: ROUTES.INFO.PRIVACY, element: <PrivacyPolicyPage /> },
  { path: ROUTES.INFO.TERMS, element: <TermsConditionPage /> },
  { path: ROUTES.INFO.CANCELLATION, element: <CancellationPolicyPage /> },
  { path: "*", element: <NotFound /> },
];

export const AuthRoutes: RouteObject[] = [
  { path: ROUTES.AUTH.SIGNIN, element: <Login /> },
  { path: ROUTES.AUTH.LOGIN, element: <Login /> },
  { path: ROUTES.AUTH.SIGNUP, element: <Signup /> },
  { path: ROUTES.AUTH.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: ROUTES.AUTH.RESET_PASSWORD, element: <ResetPassword /> },
  { path: ROUTES.AUTH.VERIFY_OTP, element: <VerifyOtp /> },
];
