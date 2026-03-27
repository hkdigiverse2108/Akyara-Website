import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

type MainLayoutProps = {
  children?: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <Header />
      {children ?? <Outlet />}
      <Footer />
    </div>
  );
};

export default MainLayout;
