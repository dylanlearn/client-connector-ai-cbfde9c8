
import { AuthProvider } from "./contexts/AuthContext";
import { Outlet } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import AppSidebar from './components/layout/sidebar/AppSidebar';
import DashboardHeader from './components/dashboard/DashboardHeader';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <AppSidebar />
          <div className="flex-1">
            <DashboardHeader />
            <div className="container px-4 py-6 md:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </div>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
