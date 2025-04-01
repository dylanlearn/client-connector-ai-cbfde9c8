
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
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

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
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signup/confirmation" element={<SignupConfirmation />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/projects" 
                  element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/clients" 
                  element={
                    <ProtectedRoute>
                      <Clients />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/analytics" 
                  element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  } 
                />
                {/* Made templates accessible without authentication */}
                <Route path="/templates" element={<Templates />} />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/new-project" 
                  element={
                    <ProtectedRoute>
                      <NewProject />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/project-questionnaire" 
                  element={
                    <ProtectedRoute>
                      <ProjectQuestionnaire />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/questionnaire-preview" 
                  element={
                    <ProtectedRoute>
                      <QuestionnairePreview />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/questionnaire-results" 
                  element={
                    <ProtectedRoute>
                      <QuestionnaireResults />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/ai-design-suggestions" 
                  element={
                    <ProtectedRoute>
                      <AIDesignSuggestions />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/onboarding" 
                  element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
