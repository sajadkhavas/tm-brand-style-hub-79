import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";

// Configure QueryClient with proper caching settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always fetch fresh data
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 2,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
