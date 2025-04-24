
import React, { useState } from 'react';
import { CollaborationProvider } from '@/contexts/CollaborationContext';
import CollaborativeEditor from '@/components/collaboration/CollaborativeEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { nanoid } from 'nanoid';

const CollaborationDemo = () => {
  const [documentId, setDocumentId] = useState(nanoid());
  const [activeTab, setActiveTab] = useState('editor');
  
  const generateNewDocument = () => {
    setDocumentId(nanoid());
  };
  
  return (
    <CollaborationProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Collaboration Infrastructure</h1>
          <p className="text-gray-500 mb-6">
            Real-time collaborative editing with presence awareness
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Sync</CardTitle>
                <CardDescription>
                  Operational transforms for conflict-free editing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Changes are synchronized in real-time between all collaborators using delta-based
                  synchronization and operational transforms for conflict resolution.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Presence Awareness</CardTitle>
                <CardDescription>
                  See who's online and what they're doing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Real-time indicators show who is online, where their cursor is, and what part of the 
                  document they are focusing on.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Create and manage collaborative documents
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Input 
                  value={documentId} 
                  onChange={(e) => setDocumentId(e.target.value)}
                  className="text-sm font-mono"
                />
                <Button size="sm" onClick={generateNewDocument}>
                  Generate New ID
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="editor">Collaborative Editor</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="mt-4">
              <CollaborativeEditor documentId={documentId} />
            </TabsContent>
            
            <TabsContent value="about" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>About Collaboration Infrastructure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Real-Time Synchronization System</h3>
                    <p className="text-sm">
                      The system uses operational transforms to resolve conflicts when multiple users 
                      edit the same document simultaneously. Changes are represented as operations that can 
                      be transformed against one another to ensure consistent document state.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Presence Awareness Framework</h3>
                    <p className="text-sm">
                      The presence system tracks users' online status, cursor positions, and current focus. 
                      This information is distributed to all collaborators in real-time, enabling features like
                      custom cursors, avatar stacks, and activity indicators.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Technical Implementation</h3>
                    <p className="text-sm">
                      The infrastructure leverages Supabase's real-time channels for communication and 
                      presence tracking, with a custom React context provider for state management.
                      Changes are processed through an operational transform system that ensures 
                      consistency across all clients.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </CollaborationProvider>
  );
};

export default CollaborationDemo;
