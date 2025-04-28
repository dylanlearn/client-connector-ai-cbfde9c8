
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WireframeEditorDemo from './pages/WireframeEditorDemo';
import AdvancedWireframeGeneratorPage from './pages/project-detail/AdvancedWireframeGeneratorPage';
import ComponentVariantLogicDemo from './pages/ComponentVariantLogicDemo';
import CollaborationDemo from './pages/CollaborationDemo';
import CollaborativeDocumentPage from './pages/CollaborativeDocumentPage';
import AdvancedDesignSystemPage from './pages/AdvancedDesignSystemPage';
import Home from './pages/Home';
import { AppProviders } from './providers/AppProviders';

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path="/wireframe-demo" element={<WireframeEditorDemo />} />
          <Route path="/project/:projectId/wireframe" element={<AdvancedWireframeGeneratorPage />} />
          <Route path="/variant-logic" element={<ComponentVariantLogicDemo />} />
          <Route path="/collaboration" element={<CollaborationDemo />} />
          <Route path="/collaborative-document" element={<CollaborativeDocumentPage />} />
          <Route path="/advanced-design-system" element={<AdvancedDesignSystemPage />} />
          {/* Set Home component as the default landing page */}
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AppProviders>
  );
}

export default App;
