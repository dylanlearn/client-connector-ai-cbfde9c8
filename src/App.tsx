
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import WireframeEditorDemo from './pages/WireframeEditorDemo';
import AdvancedWireframeGeneratorPage from './pages/project-detail/AdvancedWireframeGeneratorPage';
import ComponentVariantLogicDemo from './pages/ComponentVariantLogicDemo';
import CollaborationDemo from './pages/CollaborationDemo';
import CollaborativeDocumentPage from './pages/CollaborativeDocumentPage';
import AdvancedDesignSystemPage from './pages/AdvancedDesignSystemPage';
import Home from './pages/Home';
import { AppProviders } from './providers/AppProviders';
import DesignHandoffPage from './pages/DesignHandoffPage';
import DesignAutomationPage from "./pages/DesignAutomationPage";
import QualityDashboard from './pages/QualityDashboard';
import WireframeTestingPage from './pages/WireframeTestingPage';

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wireframe-editor" element={<WireframeEditorDemo />} />
          <Route path="/advanced-generator" element={<AdvancedWireframeGeneratorPage />} />
          <Route path="/component-variants" element={<ComponentVariantLogicDemo />} />
          <Route path="/collaboration-demo" element={<CollaborationDemo />} />
          <Route path="/document/:id" element={<CollaborativeDocumentPage />} />
          <Route path="/design-system" element={<AdvancedDesignSystemPage />} />
          <Route path="/handoff" element={<DesignHandoffPage />} />
          <Route path="/automation" element={<DesignAutomationPage />} />
          <Route path="/quality-dashboard" element={<QualityDashboard />} />
          <Route path="/wireframe-testing" element={<WireframeTestingPage />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
