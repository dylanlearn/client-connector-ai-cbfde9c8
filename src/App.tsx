
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import SignupConfirmation from "@/pages/SignupConfirmation";
import NotFound from "@/pages/NotFound";
import IntakeForm from "@/pages/IntakeForm";
import DesignPicker from "@/pages/DesignPicker";
import Clients from "@/pages/Clients";
import Projects from "@/pages/Projects";
import NewProject from "@/pages/NewProject";
import QuestionnaireResults from "@/pages/QuestionnaireResults";
import ProjectQuestionnaire from "@/pages/ProjectQuestionnaire";
import QuestionnairePreview from "@/pages/QuestionnairePreview";
import ClientHub from "@/pages/ClientHub";
import ClientAccess from "@/pages/ClientAccess";
import Templates from "@/pages/Templates";
import Settings from "@/pages/Settings";
import Analytics from "@/pages/Analytics";
import AIDesignSuggestions from "@/pages/AIDesignSuggestions";
import Onboarding from "@/pages/Onboarding";
import RequireSubscription from "@/components/auth/RequireSubscription";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-confirmation" element={<SignupConfirmation />} />
          <Route path="/templates" element={<Templates />} />
          
          {/* Client portal routes - protected by client token */}
          <Route path="/client-access" element={<ClientAccess />} />
          <Route path="/client-hub" element={<ClientHub />} />
          
          {/* Protected routes requiring authentication AND subscription */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <RequireSubscription>
                <Dashboard />
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          <Route path="/projects" element={
            <ProtectedRoute>
              <RequireSubscription>
                <Projects />
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          <Route path="/new-project" element={
            <ProtectedRoute>
              <RequireSubscription>
                <NewProject />
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          <Route path="/project/:projectId/questionnaire" element={
            <ProtectedRoute>
              <RequireSubscription>
                <ProjectQuestionnaire />
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          <Route path="/project/:projectId/questionnaire/preview" element={
            <ProtectedRoute>
              <RequireSubscription>
                <QuestionnairePreview />
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          <Route path="/project/:projectId/questionnaire/results" element={
            <ProtectedRoute>
              <RequireSubscription>
                <QuestionnaireResults />
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          <Route path="/clients" element={
            <ProtectedRoute>
              <RequireSubscription>
                <Clients />
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          <Route path="/intake-form" element={
            <ProtectedRoute>
              <RequireSubscription>
                <IntakeForm />
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          <Route path="/design-picker" element={
            <ProtectedRoute>
              <RequireSubscription>
                <DesignPicker />
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <ProtectedRoute>
              <RequireSubscription>
                <Analytics />
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          <Route path="/ai-suggestions" element={
            <ProtectedRoute>
              <RequireSubscription>
                <AIDesignSuggestions />
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <RequireSubscription>
                <Settings />
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <RequireSubscription>
                <Onboarding />
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <SonnerToaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
