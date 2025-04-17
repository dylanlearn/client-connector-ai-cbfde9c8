
import React, { useState } from 'react';
import AdaptiveContainer from './AdaptiveContainer';
import AdaptiveElement from './AdaptiveElement';
import AdaptiveLayout from './AdaptiveLayout';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  LayoutGrid, 
  User, 
  Calendar, 
  BarChart3, 
  Mail, 
  MessageSquare, 
  Bell, 
  Settings 
} from 'lucide-react';

/**
 * Demo component showcasing the adaptive layout system
 */
const AdaptationDemo: React.FC = () => {
  const [containerWidth, setContainerWidth] = useState<number>(1000);
  
  return (
    <div className="space-y-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Adaptive Container Width</h2>
        <div className="flex items-center gap-4 mb-6">
          <Slider
            value={[containerWidth]}
            onValueChange={(values) => setContainerWidth(values[0])}
            min={300}
            max={1200}
            step={10}
            className="w-full"
          />
          <span className="text-sm font-mono w-16">{containerWidth}px</span>
        </div>
      </div>
      
      {/* Basic Adaptive Elements Demo */}
      <section>
        <h3 className="text-xl font-bold mb-4">Basic Adaptive Elements</h3>
        <AdaptiveContainer 
          className="border p-4 rounded-lg bg-background shadow-sm" 
          style={{ width: containerWidth }}
          debug={true}
        >
          <div className="flex gap-4 w-full flex-wrap">
            <AdaptiveElement 
              hideOnCompact 
              className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg"
            >
              This element hides in compact mode
            </AdaptiveElement>
            
            <AdaptiveElement 
              truncateOnCompact 
              className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg flex-1"
            >
              This element truncates text content when in compact mode - the text gets cut off with an ellipsis
            </AdaptiveElement>
            
            <AdaptiveElement 
              stackOnCompact
              className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-lg flex gap-2"
            >
              <div className="bg-amber-200 dark:bg-amber-800/50 p-2 rounded">Item 1</div>
              <div className="bg-amber-200 dark:bg-amber-800/50 p-2 rounded">Item 2</div>
              <div className="bg-amber-200 dark:bg-amber-800/50 p-2 rounded">Item 3</div>
            </AdaptiveElement>
          </div>
        </AdaptiveContainer>
      </section>
      
      {/* Adaptive Layout Demo */}
      <section>
        <h3 className="text-xl font-bold mb-4">Adaptive Layout</h3>
        <AdaptiveLayout 
          className="border rounded-lg bg-background shadow-sm" 
          style={{ width: containerWidth }}
          minColumns={1}
          maxColumns={4}
          gap={16}
          debug={true}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 h-32 flex items-center justify-center">
              <span className="text-lg font-semibold">Card {i + 1}</span>
            </Card>
          ))}
        </AdaptiveLayout>
      </section>
      
      {/* Complex Dashboard Example */}
      <section>
        <h3 className="text-xl font-bold mb-4">Dashboard Example</h3>
        <AdaptiveContainer 
          className="border rounded-lg bg-background shadow-sm" 
          style={{ width: containerWidth }}
          debug={true}
        >
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <AdaptiveElement className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5" />
              <AdaptiveElement hideOnCompact>
                <span className="font-bold">Dashboard</span>
              </AdaptiveElement>
            </AdaptiveElement>
            
            <AdaptiveElement className="flex items-center gap-2">
              <AdaptiveElement hideOnCompact className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Bell size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MessageSquare size={18} />
                </button>
              </AdaptiveElement>
              
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <User size={18} />
              </button>
            </AdaptiveElement>
          </div>
          
          {/* Main Content */}
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <AdaptiveElement 
              hideOnCompact
              className="w-full md:w-56 p-4 border-r"
            >
              <div className="space-y-2">
                <button className="flex items-center gap-2 w-full p-2 rounded-lg bg-primary/10 text-primary">
                  <LayoutGrid size={18} />
                  <span>Dashboard</span>
                </button>
                {[
                  { icon: <User size={18} />, label: 'Users' },
                  { icon: <Calendar size={18} />, label: 'Calendar' },
                  { icon: <BarChart3 size={18} />, label: 'Analytics' },
                  { icon: <Mail size={18} />, label: 'Messages' },
                  { icon: <Settings size={18} />, label: 'Settings' }
                ].map((item, i) => (
                  <button 
                    key={i} 
                    className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </AdaptiveElement>
            
            {/* Content */}
            <AdaptiveElement className="flex-1 p-4">
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
                <AdaptiveElement hideOnCompact>
                  <p className="text-gray-500 dark:text-gray-400">Here's an overview of your dashboard</p>
                </AdaptiveElement>
              </div>
              
              {/* Stats */}
              <AdaptiveLayout 
                className="mb-6" 
                minColumns={1} 
                maxColumns={3}
                gap={16}
              >
                {[
                  { label: 'Total Users', value: '1,234', color: 'bg-blue-100 dark:bg-blue-900/20' },
                  { label: 'Revenue', value: '$12,345', color: 'bg-green-100 dark:bg-green-900/20' },
                  { label: 'Active Projects', value: '12', color: 'bg-amber-100 dark:bg-amber-900/20' }
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-lg ${stat.color}`}
                  >
                    <h3 className="text-sm font-medium">{stat.label}</h3>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </AdaptiveLayout>
              
              {/* Recent Activity */}
              <Card className="p-4">
                <h3 className="font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div>
                          <p className="font-medium">Activity {i + 1}</p>
                          <AdaptiveElement hideOnCompact>
                            <p className="text-sm text-gray-500">Description of the activity</p>
                          </AdaptiveElement>
                        </div>
                      </div>
                      <AdaptiveElement hideOnCompact>
                        <Badge variant="outline">New</Badge>
                      </AdaptiveElement>
                    </div>
                  ))}
                </div>
              </Card>
            </AdaptiveElement>
          </div>
        </AdaptiveContainer>
      </section>
    </div>
  );
};

export default AdaptationDemo;
