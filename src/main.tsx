
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AppProviders } from './providers/AppProviders'
import { initializeErrorHandling } from "@/utils/monitoring/error-handling";
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!)

// Render the app
root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);

// Initialize error handling after rendering the app
// This ensures that error monitoring doesn't interfere with the initial render
setTimeout(() => {
  try {
    initializeErrorHandling();
  } catch (error) {
    console.error("Failed to initialize error handling:", error);
  }
}, 0);
