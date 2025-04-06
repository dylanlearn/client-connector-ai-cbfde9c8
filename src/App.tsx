import { AuthProvider } from "./contexts/AuthContext";
import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import RequirePermission from './components/auth/RequirePermission';
import { Permission } from './utils/authorization/auth-service';
import LoadingPage from './components/ui/LoadingPage';
import { QueryProvider } from './providers/QueryProvider';

// Lazy loaded components for better performance
const Index = lazy(() => import('./pages/Index'));
const Login = lazy(() => import('./pages/Login'));
const Projects = lazy(() => import('./pages/Projects'));
const NewProject = lazy(() => import('./pages/NewProject'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'));
const Settings = lazy(() => import('./pages/Settings'));
const SupabaseAuditDashboard = lazy(() => import('./pages/admin/SupabaseAuditDashboard'));
const AuditAndMonitoring = lazy(() => import('./pages/admin/AuditAndMonitoring'));
const Templates = lazy(() => import('./pages/Templates'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SignupConfirmation = lazy(() => import('./pages/SignupConfirmation'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ClientHub = lazy(() => import('./pages/ClientHub'));
const IntakeForm = lazy(() => import('./pages/IntakeForm'));
const Analytics = lazy(() => import('./pages/Analytics'));
const AIDesignSuggestions = lazy(() => import('./pages/AIDesignSuggestions'));
const Clients = lazy(() => import('./pages/Clients'));
const WebsiteAnalyzer = lazy(() => import('./pages/design-analysis/WebsiteAnalyzer'));
const FeedbackAnalysis = lazy(() => import('./pages/FeedbackAnalysis'));
const ClientAccess = lazy(() => import('./pages/ClientAccess'));
const DesignPicker = lazy(() => import('./pages/DesignPicker'));

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup/confirmation" element={<SignupConfirmation />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/client-access" element={<ClientAccess />} />
            <Route path="/client-hub" element={<ClientHub />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              <Route element={<RequirePermission permission={Permission.MANAGE_PROJECTS} redirectTo="/dashboard" />}>
                <Route path="/projects" element={<Projects />} />
              </Route>
              
              <Route element={<RequirePermission permission={Permission.MANAGE_PROJECTS} redirectTo="/dashboard" />}>
                <Route path="/new-project" element={<NewProject />} />
              </Route>
              
              <Route path="/settings" element={<Settings />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/client-hub" element={<ClientHub />} />
              <Route path="/intake-form" element={<IntakeForm />} />
              <Route path="/design-picker" element={<DesignPicker />} />
              
              <Route element={<RequirePermission permission={Permission.VIEW_ANALYTICS} redirectTo="/dashboard" />}>
                <Route path="/analytics" element={<Analytics />} />
              </Route>
              
              <Route element={<RequirePermission permission={Permission.ACCESS_PREMIUM_FEATURES} redirectTo="/dashboard" />}>
                <Route path="/ai-suggestions" element={<AIDesignSuggestions />} />
                <Route path="/feedback-analysis" element={<FeedbackAnalysis />} />
                <Route path="/website-analyzer" element={<WebsiteAnalyzer />} />
              </Route>
            </Route>
            
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/supabase-audit" element={<SupabaseAuditDashboard />} />
              <Route path="/admin/audit-and-monitoring" element={<AuditAndMonitoring />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
