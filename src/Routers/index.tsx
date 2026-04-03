import { createBrowserRouter } from "react-router-dom";
import { MainLayout as Layout } from "../Layout";
import { AuthRoutes, PageRoutes } from "./PageRoutes";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";

export const Router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    children: [
      {
        element: <Layout />,
        children: PageRoutes,
      },
    ],
  },
  {
    element: <PublicRoutes />,
    children: AuthRoutes,
  },
]);
