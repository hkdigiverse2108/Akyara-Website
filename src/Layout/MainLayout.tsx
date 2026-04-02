import { useEffect, useState, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PageLoader from "../Components/PageLoader";
import Footer from "./Footer";
import Header from "./Header";

type MainLayoutProps = {children?: ReactNode;
};

const PAGE_TRANSITION_LOADER_MS = 450;

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => {
      setIsPageLoading(true);
    }, 100);

    const hideTimer = window.setTimeout(() => {
      setIsPageLoading(false);
    }, PAGE_TRANSITION_LOADER_MS);

    window.scrollTo(0, 0);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      {isPageLoading && <PageLoader />}
      <Header />
      <main className="flex-1">{children ?? <Outlet />}</main>
      <Footer />
    </div>
  );
};
export default MainLayout;
