
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
          <Route path="/wireframe-demo" element={<WireframeEditorDemo />} />
          <Route path="/project/:projectId/wireframe" element={<AdvancedWireframeGeneratorPage />} />
          <Route path="/variant-logic" element={<ComponentVariantLogicDemo />} />
          <Route path="/collaboration" element={<CollaborationDemo />} />
          <Route path="/collaborative-document" element={<CollaborativeDocumentPage />} />
          <Route path="/advanced-design-system" element={<AdvancedDesignSystemPage />} />
          <Route path="/wireframe/:wireframeId/handoff" element={<DesignHandoffPage />} />
          <Route path="/wireframe/:wireframeId/testing" element={<WireframeTestingPage />} />
          <Route path="/design-automation/:projectId" element={<DesignAutomationPage />} />
          <Route path="/design-automation/:projectId/:wireframeId" element={<DesignAutomationPage />} />
          <Route path="/quality-dashboard" element={<QualityDashboard />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
