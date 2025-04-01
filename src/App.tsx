
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AIProvider } from "@/contexts/AIContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupConfirmation from "./pages/SignupConfirmation";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Clients from "./pages/Clients";
import Analytics from "./pages/Analytics";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import NewProject from "./pages/NewProject";
import ProjectQuestionnaire from "./pages/ProjectQuestionnaire";
import QuestionnairePreview from "./pages/QuestionnairePreview";
import QuestionnaireResults from "./pages/QuestionnaireResults";
import Onboarding from "./pages/Onboarding";
import AIDesignSuggestions from "./pages/AIDesignSuggestions";
import IntakeForm from "./pages/IntakeForm";
import DesignPicker from "./pages/DesignPicker";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

// Helper function to create protected routes with DashboardLayout
const ProtectedDashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AIProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signup/confirmation" element={<SignupConfirmation />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/intake" element={<IntakeForm />} />
                <Route path="/design-picker" element={<DesignPicker />} />
                
                {/* Protected routes with dashboard layout */}
                <Route path="/dashboard" element={<ProtectedDashboardRoute><Dashboard /></ProtectedDashboardRoute>} />
                <Route path="/projects" element={<ProtectedDashboardRoute><Projects /></ProtectedDashboardRoute>} />
                <Route path="/clients" element={<ProtectedDashboardRoute><Clients /></ProtectedDashboardRoute>} />
                <Route path="/analytics" element={<ProtectedDashboardRoute><Analytics /></ProtectedDashboardRoute>} />
                <Route path="/settings" element={<ProtectedDashboardRoute><Settings /></ProtectedDashboardRoute>} />
                <Route path="/new-project" element={<ProtectedDashboardRoute><NewProject /></ProtectedDashboardRoute>} />
                <Route path="/project-questionnaire" element={<ProtectedDashboardRoute><ProjectQuestionnaire /></ProtectedDashboardRoute>} />
                <Route path="/questionnaire-preview" element={<ProtectedDashboardRoute><QuestionnairePreview /></ProtectedDashboardRoute>} />
                <Route path="/questionnaire-results" element={<ProtectedDashboardRoute><QuestionnaireResults /></ProtectedDashboardRoute>} />
                <Route path="/ai-design-suggestions" element={<ProtectedDashboardRoute><AIDesignSuggestions /></ProtectedDashboardRoute>} />
                <Route path="/onboarding" element={<ProtectedDashboardRoute><Onboarding /></ProtectedDashboardRoute>} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </BrowserRouter>
      </AIProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
