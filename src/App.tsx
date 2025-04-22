
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WireframeEditorDemo from './pages/WireframeEditorDemo';
import AdvancedWireframeGeneratorPage from './pages/project-detail/AdvancedWireframeGeneratorPage';
import ComponentVariantLogicDemo from './pages/ComponentVariantLogicDemo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/wireframe-demo" element={<WireframeEditorDemo />} />
        <Route path="/project/:projectId/wireframe" element={<AdvancedWireframeGeneratorPage />} />
        <Route path="/variant-logic" element={<ComponentVariantLogicDemo />} />
        <Route path="/" element={<ComponentVariantLogicDemo />} />
      </Routes>
    </Router>
  );
}

export default App;
