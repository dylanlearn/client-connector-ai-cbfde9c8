
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdaptiveContainer from './AdaptiveContainer';
import AdaptiveElement from './AdaptiveElement';
import AdaptiveLayout from './AdaptiveLayout';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Calendar, 
  Settings, 
  Bell, 
  MessageSquare,
  FileText,
  ShoppingCart,
  CreditCard,
  Inbox
} from 'lucide-react';

const AdaptationDemo: React.FC = () => {
  const [containerWidth, setContainerWidth] = useState(800);
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <div className="space-y-6 p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Adaptive UI Components</h2>
        <p className="text-muted-foreground mb-4">
          Components that automatically adapt to available space and context
        </p>
        
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-medium min-w-24">Container Width:</span>
          <Slider
            value={[containerWidth]}
            min={300}
            max={1200}
            step={10}
            onValueChange={(values) => setContainerWidth(values[0])}
            className="flex-1"
          />
          <span className="text-sm font-medium min-w-16">{containerWidth}px</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Elements</TabsTrigger>
          <TabsTrigger value="layout">Adaptive Layout</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard Example</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Adaptive Elements</CardTitle>
            </CardHeader>
            <CardContent>
              <AdaptiveContainer 
                className="border border-dashed border-gray-300 rounded-lg p-4"
                debug={true}
                style={{ width: containerWidth }}
              >
                <div className="flex flex-wrap gap-4">
                  <AdaptiveElement 
                    adaptivePriority={3} 
                    adaptiveType="button"
                    hideOnCompact={false}
                  >
                    <Button className="w-full">Primary Action</Button>
                  </AdaptiveElement>
                  
                  <AdaptiveElement 
                    adaptivePriority={2}
                    adaptiveType="button"
                    hideOnCompact={true}
                  >
                    <Button variant="outline" className="w-full">Secondary Action</Button>
                  </AdaptiveElement>
                  
                  <AdaptiveElement 
                    adaptivePriority={1}
                    adaptiveType="info"
                    truncateOnCompact={true}
                  >
                    <div className="bg-muted px-4 py-2 rounded text-sm">
                      Additional information that can be truncated or hidden when space is limited
                    </div>
                  </AdaptiveElement>
                </div>
              </AdaptiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Adaptive Layout System</CardTitle>
            </CardHeader>
            <CardContent>
              <AdaptiveLayout 
                className="border border-dashed border-gray-300 rounded-lg p-4"
                minColumns={1}
                maxColumns={3}
                gap={16}
                debug={true}
                style={{ width: containerWidth }}
              >
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-muted p-4 rounded h-24 flex items-center justify-center">
                    Item {item}
                  </div>
                ))}
              </AdaptiveLayout>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Adaptive Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <AdaptiveContainer
                className="border border-dashed border-gray-300 rounded-lg p-4"
                debug={true}
                style={{ width: containerWidth }}
              >
                {/* Sidebar */}
                <div className="flex h-[500px]">
                  <AdaptiveElement
                    adaptiveType="sidebar"
                    adaptivePriority={3}
                    className="border-r"
                    hideOnCompact={true}
                    compact={
                      <div className="w-14 border-r h-full flex flex-col items-center py-4 space-y-6">
                        <LayoutDashboard size={20} />
                        <BarChart3 size={20} />
                        <Users size={20} />
                        <Calendar size={20} />
                        <Settings size={20} />
                      </div>
                    }
                  >
                    <div className="w-56 h-full p-4 flex flex-col space-y-4">
                      <div className="flex items-center space-x-3 font-medium">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BarChart3 size={20} />
                        <span>Analytics</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Users size={20} />
                        <span>Customers</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar size={20} />
                        <span>Calendar</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Settings size={20} />
                        <span>Settings</span>
                      </div>
                    </div>
                  </AdaptiveElement>
                  
                  {/* Main Content */}
                  <div className="flex-1 p-4 overflow-hidden">
                    {/* Header */}
                    <AdaptiveElement
                      adaptiveType="header"
                      adaptivePriority={2}
                      className="mb-4"
                      stackOnCompact={true}
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Dashboard Overview</h2>
                        <div className="flex items-center gap-2">
                          <AdaptiveElement hideOnCompact={true}>
                            <Button variant="outline" size="sm">
                              <Bell className="mr-1 h-4 w-4" />
                              Notifications
                            </Button>
                          </AdaptiveElement>
                          <AdaptiveElement adaptivePriority={1}>
                            <Button size="sm">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              Messages
                            </Button>
                          </AdaptiveElement>
                        </div>
                      </div>
                    </AdaptiveElement>
                    
                    {/* Stats Cards */}
                    <AdaptiveLayout
                      className="mb-4"
                      minColumns={1}
                      maxColumns={4}
                      gap={16}
                    >
                      <Card>
                        <CardContent className="p-4 flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Documents</p>
                            <p className="text-2xl font-bold">245</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 flex items-center space-x-3">
                          <ShoppingCart className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Orders</p>
                            <p className="text-2xl font-bold">16</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 flex items-center space-x-3">
                          <CreditCard className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Revenue</p>
                            <p className="text-2xl font-bold">$4,256</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 flex items-center space-x-3">
                          <Inbox className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Messages</p>
                            <p className="text-2xl font-bold">12</p>
                          </div>
                        </CardContent>
                      </Card>
                    </AdaptiveLayout>
                    
                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="md:col-span-2">
                        <CardHeader>
                          <CardTitle>Activity Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="h-64 flex items-center justify-center bg-muted/30">
                          <span className="text-muted-foreground">Chart Placeholder</span>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="h-64">
                          <ul className="space-y-2">
                            <li className="text-sm pb-2 border-b">New user registered</li>
                            <li className="text-sm pb-2 border-b">Invoice #123 paid</li>
                            <li className="text-sm pb-2 border-b">Project "Alpha" completed</li>
                            <li className="text-sm pb-2 border-b">New comment on task #45</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </AdaptiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdaptationDemo;
