import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import Store from "./Store/Store";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={Store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={{ token: { fontFamily: "Jost, Segoe UI, sans-serif" } }}>
          <App />
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
