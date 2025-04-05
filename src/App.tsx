
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup/confirmation" element={<SignupConfirmation />} />
      <Route path="/templates" element={<Templates />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/settings" element={<Settings />} />
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
