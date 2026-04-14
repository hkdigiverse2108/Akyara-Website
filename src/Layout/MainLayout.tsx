import { useEffect, useState, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PageLoader from "../Components/PageLoader";
import SupportHighlights from "../Components/SupportHighlights";
import Footer from "./Footer";
import Header from "./Header";

type MainLayoutProps = {children?: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const [isBootLoading, setIsBootLoading] = useState(true);

  useEffect(() => {
    const bootLoaderTimer = window.setTimeout(() => {
      setIsBootLoading(false);
    }, 450);

    return () => {
      window.clearTimeout(bootLoaderTimer);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      {isBootLoading ? <PageLoader /> : null}
      <Header />
      <main className={`flex-1 ${location.pathname === '/' ? '' : 'pt-[64px] sm:pt-[70px] lg:pt-[78px]'}`}>
        {children ?? <Outlet />}
      </main>
      <SupportHighlights />
      <Footer />
    </div>
  );
};
export default MainLayout;
