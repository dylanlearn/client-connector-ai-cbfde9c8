
import React, { useState } from 'react';
import { 
  FeedbackItem, 
  FeedbackStatus, 
  FeedbackPriority 
} from '@/types/feedback';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { useFeedbackManager } from '@/hooks/useFeedbackManager';

interface FeedbackItemCardProps {
  feedback: FeedbackItem;
  onUpdateStatus: (id: string, status: FeedbackStatus) => void;
  onUpdatePriority: (id: string, priority: FeedbackPriority) => void;
}

function FeedbackItemCard({ feedback, onUpdateStatus, onUpdatePriority }: FeedbackItemCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{feedback.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{feedback.createdBy}</p>
          </div>
          <div className="flex gap-2">
            <Select
              value={feedback.priority}
              onValueChange={(value: FeedbackPriority) => onUpdatePriority(feedback.id, value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={feedback.status}
              onValueChange={(value: FeedbackStatus) => onUpdateStatus(feedback.id, value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{feedback.content}</p>
      </CardContent>
    </Card>
  );
}

export function FeedbackManagementPanel({ wireframeId }: { wireframeId: string }) {
  const { feedback, isLoading, updateStatus, updatePriority } = useFeedbackManager(wireframeId);
  const [filter, setFilter] = useState<string>("");

  const filteredFeedback = feedback.filter(item => 
    item.title.toLowerCase().includes(filter.toLowerCase()) ||
    item.content.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading feedback...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Feedback</h2>
        <Input
          placeholder="Search feedback..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="space-y-4">
        {filteredFeedback.map((item) => (
          <FeedbackItemCard
            key={item.id}
            feedback={item}
            onUpdateStatus={updateStatus}
            onUpdatePriority={updatePriority}
          />
        ))}
        {filteredFeedback.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No feedback found
          </p>
        )}
      </div>
    </div>
  );
}
