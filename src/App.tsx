
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import WebsiteAnalyzer from '@/pages/design-analysis/WebsiteAnalyzer';

// Import any other components you need for your app

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Add a route for the website analyzer */}
        <Route path="/design-analysis" element={<WebsiteAnalyzer />} />
        
        {/* Add your other routes here */}
        <Route path="/" element={<WebsiteAnalyzer />} />
      </Routes>
      
      {/* Global UI components */}
      <Toaster />
      <SonnerToaster position="top-right" />
    </Router>
  );
};

export default App;
