
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProviders } from "@/providers/AppProviders";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
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
import Pricing from "@/pages/Pricing";
import RequireSubscription from "@/components/auth/RequireSubscription";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Use React.lazy for code splitting of routes that aren't part of the critical path
const LazyAdminPanel = lazy(() => import("@/pages/AdminPanel"));
const LazyAnalytics = lazy(() => import("@/pages/Analytics"));
const LazyAIDesignSuggestions = lazy(() => import("@/pages/AIDesignSuggestions"));
const LazyOnboarding = lazy(() => import("@/pages/Onboarding"));

// Loading component for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <Router>
      <AppProviders>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-confirmation" element={<SignupConfirmation />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Client portal routes - protected by client token */}
          <Route path="/client-access" element={<ClientAccess />} />
          <Route path="/client-hub" element={<ClientHub />} />
          
          {/* Admin routes - lazy loaded */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <LazyAdminPanel />
              </Suspense>
            </ProtectedRoute>
          } />
          
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
                <Suspense fallback={<PageLoader />}>
                  <LazyAnalytics />
                </Suspense>
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          <Route path="/ai-suggestions" element={
            <ProtectedRoute>
              <RequireSubscription>
                <Suspense fallback={<PageLoader />}>
                  <LazyAIDesignSuggestions />
                </Suspense>
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
                <Suspense fallback={<PageLoader />}>
                  <LazyOnboarding />
                </Suspense>
              </RequireSubscription>
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppProviders>
    </Router>
  );
}

export default App;
