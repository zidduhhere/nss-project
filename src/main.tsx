import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "./hooks/scrollToTopHook.ts";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </AuthProvider>
);
