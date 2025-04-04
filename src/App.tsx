
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import ClientHub from "@/pages/ClientHub";
import IntakeForm from "@/pages/IntakeForm";
import DesignPicker from "@/pages/DesignPicker";
import Analytics from "@/pages/Analytics";
import AIDesignSuggestions from "@/pages/AIDesignSuggestions";
import FeedbackAnalysisPage from "@/pages/FeedbackAnalysisPage";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { AppProviders } from "@/providers/AppProviders";

// Import WebsiteAnalyzer from the correct path
// The file exists at src/pages/design-analysis/WebsiteAnalyzer.tsx but is imported as a component
import WebsiteAnalyzer from "@/pages/design-analysis/WebsiteAnalyzer";

// Create placeholder auth components since the imports can't be resolved
const Login = () => (<div>Login Page</div>);
const Register = () => (<div>Register Page</div>);
const ForgotPassword = () => (<div>Forgot Password Page</div>);
const ResetPassword = () => (<div>Reset Password Page</div>);

const App = () => {
  return (
    <AppProviders>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/client-hub" element={<ClientHub />} />
        <Route path="/intake-form" element={<IntakeForm />} />
        <Route path="/design-picker" element={<DesignPicker />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ai-suggestions" element={<AIDesignSuggestions />} />
        <Route path="/feedback-analysis" element={<FeedbackAnalysisPage />} />
        <Route path="/website-analyzer" element={<WebsiteAnalyzer />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Default route for admin path */}
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppProviders>
  );
};

export default App;
