
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Annotation, AnnotationStatus } from '@/types/annotations';
import { MessageSquare, Mic, Video, PenLine, Trash2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AnnotationPanelProps {
  annotation: Annotation;
  onUpdate: (annotation: Annotation) => void;
  onDelete: (annotationId: string) => void;
  onClose: () => void;
}

export const AnnotationPanel: React.FC<AnnotationPanelProps> = ({
  annotation,
  onUpdate,
  onDelete,
  onClose
}) => {
  const [content, setContent] = useState(annotation.content);
  const [status, setStatus] = useState<AnnotationStatus>(annotation.status);
  
  const handleSaveChanges = () => {
    onUpdate({
      ...annotation,
      content,
      status,
      updatedAt: new Date().toISOString()
    });
  };

  const getIcon = () => {
    switch (annotation.type) {
      case 'text':
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case 'voice':
        return <Mic className="h-4 w-4 mr-2" />;
      case 'video':
        return <Video className="h-4 w-4 mr-2" />;
      case 'sketch':
        return <PenLine className="h-4 w-4 mr-2" />;
      default:
        return <MessageSquare className="h-4 w-4 mr-2" />;
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'open':
        return 'text-yellow-500';
      case 'in-review':
        return 'text-blue-500';
      case 'resolved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div className="flex items-center">
          {getIcon()}
          <span className="font-medium">
            {annotation.type.charAt(0).toUpperCase() + annotation.type.slice(1)} Annotation
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        {annotation.type === 'text' && (
          <Textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            className="min-h-[100px]"
          />
        )}
        
        {(annotation.type === 'voice' || annotation.type === 'video') && (
          <div className="flex flex-col space-y-2">
            {/* Mock player UI - in a real app, would use actual media player */}
            <div className="bg-gray-100 rounded-md p-3 flex items-center justify-center">
              {annotation.type === 'voice' ? (
                <Mic className="h-8 w-8 text-gray-400" />
              ) : (
                <Video className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <Textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Add a description..."
              className="min-h-[60px]"
            />
          </div>
        )}
        
        {annotation.type === 'sketch' && (
          <div className="flex flex-col space-y-2">
            {/* Mock sketch viewer - in a real app, would render the actual sketch */}
            <div className="bg-gray-100 border border-dashed border-gray-300 rounded-md aspect-video flex items-center justify-center">
              <PenLine className="h-8 w-8 text-gray-400" />
            </div>
            <Textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Add a description..."
              className="min-h-[60px]"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Updated {formatDistanceToNow(new Date(annotation.updatedAt))} ago
          </div>
          
          <Select 
            value={status}
            onValueChange={(value) => setStatus(value as AnnotationStatus)}
          >
            <SelectTrigger className={`w-[140px] ${getStatusColor()}`}>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="destructive"
          size="sm"
          onClick={() => onDelete(annotation.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        
        <Button 
          size="sm"
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};
