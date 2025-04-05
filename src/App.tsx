
import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Projects from './pages/Projects';
import NewProject from './pages/NewProject';
import AdminPanel from './pages/AdminPanel';
import AdminAnalytics from './pages/AdminAnalytics';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Settings from './pages/Settings';
import SupabaseAuditDashboard from './pages/admin/SupabaseAuditDashboard';
import AuditAndMonitoring from './pages/admin/AuditAndMonitoring';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/projects" element={<Projects />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/supabase-audit" element={<SupabaseAuditDashboard />} />
      <Route path="/admin/audit-and-monitoring" element={<AuditAndMonitoring />} />
      
      {/* Default route for any non-matching paths */}
      <Route path="*" element={<Index />} />
    </Routes>
  );
}

export default App;
