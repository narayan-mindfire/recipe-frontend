import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { ToastProvider } from "./components/ui/index.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
