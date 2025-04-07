
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AppProviders } from './providers/AppProviders'
import { initializeErrorHandling } from "@/utils/monitoring/error-handling";
import { RouterProvider } from 'react-router-dom';
import router from './routes';

const root = ReactDOM.createRoot(document.getElementById('root')!)

// Render the app with the router
root.render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
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
