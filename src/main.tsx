import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register the service worker only in production so dev never serves stale cached CSS/JS.
if (import.meta.env.PROD) {
  void import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
