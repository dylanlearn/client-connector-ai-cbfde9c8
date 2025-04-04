import React, { useEffect, useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { FeedbackAnalyzer } from "@/components/feedback/FeedbackAnalyzer";
import { toast } from "sonner";
import { FeedbackAnalysisResult, FeedbackAnalysisService, FeedbackStatus } from '@/services/ai/content/feedback-analysis-service';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, FileText, BarChart, Check, ArrowLeft, Clock, ShieldAlert, AlertCircle, Filter } from "lucide-react";
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FeedbackAnalysisPage = () => {
  // TODO: [MEDIUM PRIORITY] Refactor this component into smaller sub-components
  // It currently exceeds 400 lines and handles too many responsibilities
  // Target completion: End of quarter
  
  const navigate = useNavigate();
  const [savedAnalyses, setSavedAnalyses] = useState<Array<{
    id: string;
    originalFeedback: string;
    result: FeedbackAnalysisResult;
    createdAt: string;
    priority?: string;
    status?: FeedbackStatus;
    category?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string | 'all'>('all');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (err) {
        console.error('Error checking auth status:', err);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const loadPastAnalyses = async () => {
      if (isAuthenticated === false) {
        return; // Don't try to load if not authenticated
      }
      
      if (isAuthenticated === null) {
        return; // Wait until auth state is determined
      }

      setIsLoading(true);
      setLoadError(null);
      
      try {
        const filters: { status?: FeedbackStatus } = {};
        
        if (statusFilter !== 'all') {
          filters.status = statusFilter;
        }
        
        // Priority filtering is done client-side as it's more flexible that way
        const analyses = await FeedbackAnalysisService.getPastAnalyses(10, filters);
        
        // Client-side filtering for priority if needed
        const filteredAnalyses = priorityFilter !== 'all' 
          ? analyses.filter(analysis => analysis.priority === priorityFilter)
          : analyses;
          
        setSavedAnalyses(filteredAnalyses);
      } catch (error: any) {
        console.error("Error loading past analyses:", error);
        setLoadError(error?.message || "Failed to load past analyses");
        toast.error("Failed to load past analyses");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPastAnalyses();
  }, [isAuthenticated, statusFilter, priorityFilter]);

  const handleAnalysisComplete = (result: FeedbackAnalysisResult) => {
    try {
      sessionStorage.setItem('feedback-analysis-results', JSON.stringify(result));
      
      setSavedAnalyses(prev => [{
        id: 'new-' + Date.now(),
        originalFeedback: result.summary,
        result,
        createdAt: new Date().toISOString(),
        status: 'open',
        priority: result.toneAnalysis.urgent ? 'high' : 'medium'
      }, ...prev.slice(0, 4)]);
      
      toast.success("Analysis complete!", {
        description: `${result.actionItems.length} action items identified.`
      });
    } catch (error) {
      console.error("Error saving analysis results:", error);
      toast.error("Failed to save analysis results");
    }
  };

  const handleStatusChange = async (analysisId: string, newStatus: FeedbackStatus) => {
    try {
      const success = await FeedbackAnalysisService.updateFeedbackStatus(analysisId, newStatus);
      
      if (success) {
        // Update the local state to reflect the change
        setSavedAnalyses(prev => prev.map(analysis => {
          if (analysis.id === analysisId) {
            return { ...analysis, status: newStatus };
          }
          return analysis;
        }));
        
        toast.success("Status updated", {
          description: `Feedback status updated to ${newStatus}`
        });
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  const handlePriorityChange = async (analysisId: string, newPriority: 'high' | 'medium' | 'low') => {
    try {
      const success = await FeedbackAnalysisService.updateFeedbackPriority(analysisId, newPriority);
      
      if (success) {
        // Update the local state to reflect the change
        setSavedAnalyses(prev => prev.map(analysis => {
          if (analysis.id === analysisId) {
            return { ...analysis, priority: newPriority };
          }
          return analysis;
        }));
        
        toast.success("Priority updated", {
          description: `Feedback priority updated to ${newPriority}`
        });
      } else {
        toast.error("Failed to update priority");
      }
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error("Error updating priority");
    }
  };

  const renderActionItemBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">High</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Low</span>;
      default:
        return null;
    }
  };

  const renderStatusBadge = (status?: FeedbackStatus) => {
    switch (status) {
      case 'open':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Open</span>;
      case 'in_progress':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">In Progress</span>;
      case 'implemented':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Implemented</span>;
      case 'declined':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Declined</span>;
      default:
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Open</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Client Feedback Analysis</h1>
          </div>
        </div>
        
        <p className="text-gray-600 mb-8">
          Paste client feedback to analyze sentiment and extract actionable tasks with AI assistance.
        </p>
        
        {isAuthenticated === false && (
          <Alert className="mb-8">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription className="flex items-center gap-4">
              <span>You need to be logged in to save feedback analysis results.</span>
              <Button size="sm" onClick={() => navigate("/login")}>
                Log In
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FeedbackAnalyzer
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Benefits</CardTitle>
                <CardDescription>
                  How feedback analysis helps your workflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Quickly identify action items from lengthy feedback</span>
                  </li>
                  <li className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Understand client sentiment to prioritize responses</span>
                  </li>
                  <li className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Detect urgent issues that need immediate attention</span>
                  </li>
                  <li className="flex">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Identify vague feedback that requires clarification</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Analyses</CardTitle>
                    <CardDescription>
                      Your latest feedback analysis results
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Select 
                    value={statusFilter} 
                    onValueChange={(value) => setStatusFilter(value as FeedbackStatus | 'all')}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="implemented">Implemented</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={priorityFilter} 
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center text-gray-500">
                    <Clock className="h-8 w-8 mb-2 mx-auto animate-pulse" />
                    <p>Loading past analyses...</p>
                  </div>
                ) : loadError ? (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{loadError}</AlertDescription>
                  </Alert>
                ) : savedAnalyses.length > 0 ? (
                  <ul className="space-y-4">
                    {savedAnalyses.map((analysis, index) => (
                      <li key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium line-clamp-1">{analysis.result.summary}</p>
                          <span className="text-xs text-gray-500">
                            {format(new Date(analysis.createdAt), 'MMM d')}
                          </span>
                        </div>
                        <div className="flex gap-2 mb-2">
                          {renderStatusBadge(analysis.status)}
                          {renderActionItemBadge(analysis.priority || 'medium')}
                          {analysis.category && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              {analysis.category}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          {analysis.id && !analysis.id.startsWith('new-') && (
                            <>
                              <Select 
                                value={analysis.status || 'open'} 
                                onValueChange={(value) => handleStatusChange(analysis.id, value as FeedbackStatus)}
                              >
                                <SelectTrigger className="h-7 text-xs px-2">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="implemented">Implemented</SelectItem>
                                  <SelectItem value="declined">Declined</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Select 
                                value={analysis.priority || 'medium'} 
                                onValueChange={(value) => handlePriorityChange(analysis.id, value as 'high' | 'medium' | 'low')}
                              >
                                <SelectTrigger className="h-7 text-xs px-2">
                                  <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <FileText className="h-8 w-8 mb-2 mx-auto opacity-50" />
                    <p>No past analyses yet</p>
                    <p className="text-sm mt-1">Analyses will appear here after you submit feedback</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackAnalysisPage;
