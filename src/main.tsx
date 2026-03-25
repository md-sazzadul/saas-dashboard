import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router";
import { queryClient } from "./app/queryClient.ts";
import { router } from "./app/router.tsx";
import "./index.css";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 500,
              padding: "12px 16px",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
            },
            success: {
              iconTheme: { primary: "#6366f1", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
