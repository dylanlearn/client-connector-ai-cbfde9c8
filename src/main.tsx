
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'
import { initializeErrorHandling } from "@/utils/monitoring/error-handling";

// Create root once and store it
const root = createRoot(document.getElementById("root")!);

// Render the app first
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Initialize error handling after rendering the app
// This ensures that error monitoring doesn't interfere with the initial render
initializeErrorHandling();
