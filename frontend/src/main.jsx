import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { SettingsProvider } from "./state/settings/settings.context";
import "tailwindcss/index.css";

document.documentElement.classList.add("h-full", "scroll-smooth");
document.body.classList.add(
  "m-0",
  "min-h-screen",
  "w-full",
  "font-['Inter',sans-serif]",
  "text-base",
  "text-slate-900",
  "leading-[1.6]",
  "antialiased",
);

createRoot(document.getElementById("root")).render(
  <SettingsProvider>
    <App />
  </SettingsProvider>,
);
