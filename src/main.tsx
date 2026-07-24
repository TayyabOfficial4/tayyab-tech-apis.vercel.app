import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Load EasyChatWidget only after the user interacts to ensure the app UI renders first.
function loadEasyChat() {
  // Don't add twice
  if (document.querySelector('script[data-widget-id="o3dhIXGMNjpzq0VkSYAkv1i93viILbgL"]')) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://easychatwidget.com/widget.js";
  s.setAttribute("data-widget-id", "o3dhIXGMNjpzq0VkSYAkv1i93viILbgL");
  document.body.appendChild(s);
}

function onFirstInteraction() {
  loadEasyChat();
  window.removeEventListener("pointerdown", onFirstInteraction);
  window.removeEventListener("keydown", onFirstInteraction);
}

// Only load after first user interaction to avoid the widget taking focus or blocking the initial render.
window.addEventListener("pointerdown", onFirstInteraction, { once: true });
window.addEventListener("keydown", onFirstInteraction, { once: true });
