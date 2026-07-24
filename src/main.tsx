import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Load EasyChatWidget after the app mounts to avoid it blocking initial render.
function loadEasyChat() {
  // Don't add twice
  if (document.querySelector('script[data-widget-id="o3dhIXGMNjpzq0VkSYAkv1i93viILbgL"]')) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://easychatwidget.com/widget.js";
  s.setAttribute("data-widget-id", "o3dhIXGMNjpzq0VkSYAkv1i93viILbgL");
  document.body.appendChild(s);
}

// Delay slightly so the React app can render first. Also load on first user interaction as a fallback.
const EASYCHAT_DELAY_MS = 800;
let easyChatTimeout = window.setTimeout(loadEasyChat, EASYCHAT_DELAY_MS);

function onFirstInteraction() {
  if (easyChatTimeout) {
    clearTimeout(easyChatTimeout);
    easyChatTimeout = 0 as unknown as number;
  }
  loadEasyChat();
  window.removeEventListener("pointerdown", onFirstInteraction);
  window.removeEventListener("keydown", onFirstInteraction);
}

window.addEventListener("pointerdown", onFirstInteraction, { once: true });
window.addEventListener("keydown", onFirstInteraction, { once: true });
