
import React from 'react';
import { MessageSquare, Flag, Filter, Download } from 'lucide-react';
import { Project } from '@/types/project';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ProjectFeedbackTabProps {
  project: Project;
}

const ProjectFeedbackTab: React.FC<ProjectFeedbackTabProps> = ({ project }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Client Feedback</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Feedback</TabsTrigger>
          <TabsTrigger value="action">Action Items</TabsTrigger>
          <TabsTrigger value="summary">AI Summary</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                    <CardTitle>Homepage Design Feedback</CardTitle>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Received 3 days ago from {project.client_name}</p>
                </div>
                <Badge>High Priority</Badge>
              </CardHeader>
              <CardContent>
                <p className="mb-4">The overall design looks great, but I have a few concerns:</p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>The hero section feels too cluttered. Can we simplify it?</li>
                  <li>The blue color is a bit too bright for our brand. Let's tone it down.</li>
                  <li>I'd like the CTAs to be more prominent on the page.</li>
                </ul>
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <h4 className="font-medium flex items-center">
                    <Flag className="h-4 w-4 mr-2 text-yellow-600" />
                    AI Analysis
                  </h4>
                  <p className="text-sm text-gray-700 mt-1">
                    This feedback indicates UI simplification needs, color refinement, and CTA enhancement. 
                    Consider addressing these as high priority items.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                    <CardTitle>About Page Content Review</CardTitle>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Received 1 week ago from {project.client_name}</p>
                </div>
                <Badge variant="outline">Medium Priority</Badge>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  The content looks good, but I think we need to make a few changes to better reflect our company values:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Add more emphasis on our sustainability initiatives</li>
                  <li>Include more team photos throughout the page</li>
                  <li>Shorten the company history section - it's too verbose</li>
                </ul>
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <h4 className="font-medium flex items-center">
                    <Flag className="h-4 w-4 mr-2 text-yellow-600" />
                    AI Analysis
                  </h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Content adjustments needed with focus on brand values. Suggests more visual elements
                    and more concise writing.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="action" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Action Items from Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Simplify homepage hero section</h3>
                    <p className="text-sm text-gray-600">Reduce visual elements and focus on key message</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">High Priority</Badge>
                      <span className="text-xs text-gray-500 ml-2">Due in 2 days</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Adjust brand color palette</h3>
                    <p className="text-sm text-gray-600">Tone down primary blue to match brand guidelines</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">High Priority</Badge>
                      <span className="text-xs text-gray-500 ml-2">Due in 3 days</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Enhance CTA visibility</h3>
                    <p className="text-sm text-gray-600">Make call-to-action buttons more prominent</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Medium Priority</Badge>
                      <span className="text-xs text-gray-500 ml-2">Due in 5 days</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs mr-3 mt-0.5">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Add sustainability section to About page</h3>
                    <p className="text-sm text-gray-600">Create new section highlighting company initiatives</p>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Medium Priority</Badge>
                      <span className="text-xs text-gray-500 ml-2">Due in 1 week</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Feedback Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Feedback Themes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h4 className="font-medium text-blue-700">Design Simplification</h4>
                      <p className="text-sm text-gray-700 mt-1">
                        Multiple comments about reducing visual complexity and focusing on key content.
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-md">
                      <h4 className="font-medium text-green-700">Content Enhancement</h4>
                      <p className="text-sm text-gray-700 mt-1">
                        Requests for more focused content that emphasizes company values and mission.
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-md">
                      <h4 className="font-medium text-purple-700">Brand Alignment</h4>
                      <p className="text-sm text-gray-700 mt-1">
                        Feedback aimed at better aligning the design with established brand guidelines.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Sentiment Analysis</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span>Positive</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <div className="flex items-center justify-between mb-2 mt-4">
                      <span>Neutral</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <div className="flex items-center justify-between mb-2 mt-4">
                      <span>Negative</span>
                      <span>15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-gray-200 ml-3 pl-6 space-y-6">
                {/* Timeline items would go here */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0">
                    <div className="bg-blue-500 rounded-full h-5 w-5" />
                  </div>
                  <h3 className="font-medium">Homepage Design Feedback</h3>
                  <p className="text-sm text-gray-500">3 days ago</p>
                  <p className="mt-2 text-gray-700">
                    Feedback included concerns about hero section complexity and color choices.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[31px] top-0">
                    <div className="bg-blue-500 rounded-full h-5 w-5" />
                  </div>
                  <h3 className="font-medium">About Page Content Review</h3>
                  <p className="text-sm text-gray-500">1 week ago</p>
                  <p className="mt-2 text-gray-700">
                    Feedback focused on improving content to better reflect company values.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[31px] top-0">
                    <div className="bg-blue-500 rounded-full h-5 w-5" />
                  </div>
                  <h3 className="font-medium">Initial Design Concept Presentation</h3>
                  <p className="text-sm text-gray-500">2 weeks ago</p>
                  <p className="mt-2 text-gray-700">
                    Overall positive response to initial designs with minor adjustment requests.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectFeedbackTab;
