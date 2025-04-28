
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize error handling after rendering the app
// This ensures that error monitoring doesn't interfere with the initial render
setTimeout(() => {
  try {
    // Use dynamic import instead of require for better Vite compatibility
    import("@/utils/monitoring/error-handling").then(module => {
      module.initializeErrorHandling();
    }).catch(error => {
      console.error("Failed to initialize error handling:", error);
    });
  } catch (error) {
    console.error("Failed to initialize error handling:", error);
  }
}, 0);
