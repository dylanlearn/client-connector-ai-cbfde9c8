import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'
import { initializeErrorHandling } from "@/utils/monitoring/error-handling";

// Create root once and store it
const root = createRoot(document.getElementById("root")!);

// Initialize error handling before rendering the app
initializeErrorHandling();

// Render the app with StrictMode for better development experience
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
