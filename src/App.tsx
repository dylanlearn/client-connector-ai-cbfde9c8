
import { AuthProvider } from "./contexts/AuthContext";
import { Outlet } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import AppSidebar from './components/layout/sidebar/AppSidebar';
import DashboardHeader from './components/dashboard/DashboardHeader';

/**
 * Main application component that serves as the application shell
 * Provides the outer layout structure, authentication context, and query capabilities
 */
function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <AppSidebar />
          <div className="flex-1">
            <DashboardHeader />
            <main className="container px-4 py-6 md:px-6 lg:px-8">
              <Outlet />
            </main>
          </div>
        </div>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
