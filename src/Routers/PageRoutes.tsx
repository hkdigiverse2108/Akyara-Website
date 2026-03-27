import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "../Layout";
import Home from "../Pages/Home";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

const NotFound = () => {
  return (
    <main className="mx-auto w-[92%] max-w-[1200px] py-[80px]">
      <h1 className="mb-3 text-2xl font-semibold">Page not found</h1>
      <p className="text-[#777777]">The page you are looking for does not exist.</p>
    </main>
  );
};

const PageRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
        <Route element={<PrivateRoutes />}>{/* Add private routes here */}</Route>
      </Routes>
    </BrowserRouter>
  );
};

export default PageRoutes;
