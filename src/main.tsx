
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!)

// Render the app directly without wrapping in AppProviders since that's already in App.tsx
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize error handling after rendering the app
// This ensures that error monitoring doesn't interfere with the initial render
setTimeout(() => {
  try {
    const { initializeErrorHandling } = require("@/utils/monitoring/error-handling");
    initializeErrorHandling();
  } catch (error) {
    console.error("Failed to initialize error handling:", error);
  }
}, 0);
