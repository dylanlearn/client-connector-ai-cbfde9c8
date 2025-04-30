
import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users,
  LineChart, 
  Settings,
  Layout,
  Wand2,
  Microscope,
  FileInput,
  FolderKanban
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Wireframe Editor', path: '/wireframe-editor', icon: Layout },
    { name: 'AI Suggestions', path: '/ai-suggestions', icon: Wand2 },
    { name: 'Website Analyzer', path: '/website-analyzer', icon: Microscope },
    { name: 'Analytics', path: '/analytics', icon: LineChart },
    { name: 'Intake Form', path: '/intake-form', icon: FileInput },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      navigate('/login');
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">DezignSync</h1>
          {user && (
            <p className="text-sm text-gray-500 mt-1">
              {user.email}
            </p>
          )}
        </div>
        
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center w-full px-4 py-2 text-left ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Button 
            onClick={handleSignOut}
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Sign Out
          </Button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {navItems.find(item => item.path === location.pathname)?.name || 'DezignSync'}
            </h2>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
