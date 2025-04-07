
import React from 'react'
import './App.css'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import EnhancedWireframeStudio from './components/wireframe/EnhancedWireframeStudio'
import ComponentLibraryInitializer from './components/wireframe/admin/ComponentLibraryInitializer'
import FAQCTAInitializer from './components/wireframe/admin/FAQCTAInitializer'

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Component Library & Wireframe Studio</h1>
      
      <Tabs defaultValue="wireframe" className="mb-8">
        <TabsList>
          <TabsTrigger value="wireframe">Wireframe Studio</TabsTrigger>
          <TabsTrigger value="initialize">Initialize Components</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wireframe">
          <Card className="p-6">
            <EnhancedWireframeStudio projectId="demo-project" />
          </Card>
        </TabsContent>
        
        <TabsContent value="initialize">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Component Library Initialization</h2>
            <div className="space-y-6">
              <ComponentLibraryInitializer />
              <div className="my-4">
                <h3 className="text-lg font-medium mb-2">FAQ & CTA Components</h3>
                <FAQCTAInitializer />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default App
