
import { useState, useEffect } from 'react';
import { FeedbackService } from '@/services/feedback/feedbackService';
import { FeedbackItem, FeedbackStatus, FeedbackPriority } from '@/types/feedback';
import { useToast } from '@/hooks/use-toast';

export function useFeedbackManager(wireframeId: string) {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadFeedback();
  }, [wireframeId]);

  const loadFeedback = async () => {
    try {
      setIsLoading(true);
      const data = await FeedbackService.getFeedbackByWireframe(wireframeId);
      setFeedback(data);
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Error loading feedback",
        description: "Could not load feedback items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: FeedbackStatus) => {
    try {
      const updated = await FeedbackService.updateFeedbackStatus(id, status);
      setFeedback(prev => prev.map(item => 
        item.id === id ? { ...item, status } : item
      ));
      toast({
        title: "Status updated",
        description: "Feedback status has been updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error updating status",
        description: "Could not update feedback status",
        variant: "destructive",
      });
    }
  };

  const updatePriority = async (id: string, priority: FeedbackPriority) => {
    try {
      await FeedbackService.updateFeedbackPriority(id, priority);
      setFeedback(prev => prev.map(item => 
        item.id === id ? { ...item, priority } : item
      ));
      toast({
        title: "Priority updated",
        description: "Feedback priority has been updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error updating priority",
        description: "Could not update feedback priority",
        variant: "destructive",
      });
    }
  };

  const assignFeedback = async (id: string, assignedTo: string) => {
    try {
      await FeedbackService.assignFeedback(id, assignedTo);
      setFeedback(prev => prev.map(item => 
        item.id === id ? { ...item, assignedTo } : item
      ));
      toast({
        title: "Feedback assigned",
        description: "Feedback has been assigned successfully",
      });
    } catch (err) {
      toast({
        title: "Error assigning feedback",
        description: "Could not assign feedback",
        variant: "destructive",
      });
    }
  };

  return {
    feedback,
    isLoading,
    error,
    updateStatus,
    updatePriority,
    assignFeedback,
    refresh: loadFeedback
  };
}
