
import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Projects from './pages/Projects';
import NewProject from './pages/NewProject';
import AdminPanel from './pages/AdminPanel';
import AdminAnalytics from './pages/AdminAnalytics';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import Settings from './pages/Settings';
import SupabaseAuditDashboard from './pages/admin/SupabaseAuditDashboard';
import AuditAndMonitoring from './pages/admin/AuditAndMonitoring';
import Templates from './pages/Templates';
import Dashboard from './pages/Dashboard';
import SignupConfirmation from './pages/SignupConfirmation';
import NotFound from './pages/NotFound';
import ClientHub from './pages/ClientHub';
import IntakeForm from './pages/IntakeForm';
import Analytics from './pages/Analytics';
import AIDesignSuggestions from './pages/AIDesignSuggestions';
import Clients from './pages/Clients';
import WebsiteAnalyzer from './pages/design-analysis/WebsiteAnalyzer';
import FeedbackAnalysis from './pages/FeedbackAnalysis';
import ClientAccess from './pages/ClientAccess';
import DesignPicker from './pages/DesignPicker';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup/confirmation" element={<SignupConfirmation />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/client-access" element={<ClientAccess />} />
      <Route path="/client-hub" element={<ClientHub />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/client-hub" element={<ClientHub />} />
        <Route path="/intake-form" element={<IntakeForm />} />
        <Route path="/design-picker" element={<DesignPicker />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ai-suggestions" element={<AIDesignSuggestions />} />
        <Route path="/feedback-analysis" element={<FeedbackAnalysis />} />
        <Route path="/website-analyzer" element={<WebsiteAnalyzer />} />
      </Route>
      
      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/supabase-audit" element={<SupabaseAuditDashboard />} />
        <Route path="/admin/audit-and-monitoring" element={<AuditAndMonitoring />} />
      </Route>
      
      {/* Not Found route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
