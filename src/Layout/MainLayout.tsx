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
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    setIsPageLoading(true);
    const timer = window.setTimeout(() => {
      setIsPageLoading(false);
    }, PAGE_TRANSITION_LOADER_MS);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search, location.hash]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {isPageLoading && <PageLoader />}
      <Header />
      <main className="flex-1">{children ?? <Outlet />}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
