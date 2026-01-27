import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";
import "./i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
