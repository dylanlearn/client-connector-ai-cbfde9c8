
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Projects from './pages/Projects';
import NewProject from './pages/NewProject';
import ProjectDetails from './pages/ProjectDetails';
import Help from './pages/Help';
import AdminPanel from './pages/AdminPanel';
import AdminAnalytics from './pages/AdminAnalytics';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import Settings from './pages/Settings';
import FourOhFour from './pages/FourOhFour';
import ClientTaskPage from './pages/ClientTaskPage';
import SupabaseAuditDashboard from './pages/admin/SupabaseAuditDashboard';
import AuditAndMonitoring from './pages/admin/AuditAndMonitoring';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/client/:token" element={<ClientTaskPage />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/projects" element={<Projects />} />
        <Route path="/new-project" element={<NewProject />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
      </Route>
      
      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/supabase-audit" element={<SupabaseAuditDashboard />} />
        <Route path="/admin/audit-and-monitoring" element={<AuditAndMonitoring />} />
      </Route>
      
      <Route path="*" element={<FourOhFour />} />
    </Routes>
  );
}

export default App;
