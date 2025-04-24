
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Mic, 
  Video, 
  PenLine, 
  X, 
  Check,
  Clock,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Annotation, AnnotationType, AnnotationStatus } from '@/types/annotations';
import { useAnnotations } from '@/contexts/AnnotationContext';
import { format } from 'date-fns';

interface AnnotationPanelProps {
  onClose: () => void;
}

export const AnnotationPanel: React.FC<AnnotationPanelProps> = ({ onClose }) => {
  const { 
    state, 
    addAnnotation, 
    updateAnnotation, 
    deleteAnnotation, 
    setFilteredType,
    setFilteredStatus,
    getThreadedAnnotations
  } = useAnnotations();
  const [replyContent, setReplyContent] = React.useState('');
  
  const activeAnnotation = state.activeAnnotationId 
    ? state.annotations[state.activeAnnotationId] 
    : null;
  
  const replies = activeAnnotation 
    ? getThreadedAnnotations(activeAnnotation.id)
    : [];
    
  const handleStatusChange = (status: AnnotationStatus) => {
    if (activeAnnotation) {
      updateAnnotation(activeAnnotation.id, { status });
    }
  };
  
  const handleReplySubmit = () => {
    if (!activeAnnotation || !replyContent.trim()) return;
    
    addAnnotation({
      documentId: activeAnnotation.documentId,
      userId: activeAnnotation.userId, // In a real app, would be current user
      type: 'text',
      content: replyContent,
      position: activeAnnotation.position, // Same position as parent
      status: 'open',
      parentId: activeAnnotation.id
    });
    
    setReplyContent('');
  };
  
  const getStatusIcon = (status: AnnotationStatus) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in-review':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  const getStatusLabel = (status: AnnotationStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };
  
  if (!activeAnnotation) {
    return (
      <Card className="w-80 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Annotations
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription>
            Select an annotation or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all" onClick={() => setFilteredType('all')}>All</TabsTrigger>
              <TabsTrigger value="text" onClick={() => setFilteredType('text')}>
                <MessageSquare className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="voice" onClick={() => setFilteredType('voice')}>
                <Mic className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="video" onClick={() => setFilteredType('video')}>
                <Video className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="sketch" onClick={() => setFilteredType('sketch')}>
                <PenLine className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 mb-4">
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setFilteredStatus('all')}
              >
                All
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-yellow-50 border-yellow-200"
                onClick={() => setFilteredStatus('open')}
              >
                <Clock className="h-3 w-3 mr-1 text-yellow-500" />
                Open
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-blue-50 border-blue-200"
                onClick={() => setFilteredStatus('in-review')}
              >
                <AlertTriangle className="h-3 w-3 mr-1 text-blue-500" />
                In Review
              </Badge>
            </div>
            
            {Object.values(state.annotations).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No annotations yet
              </div>
            ) : (
              <div className="space-y-2">
                {Object.values(state.annotations)
                  .filter(a => !a.parentId) // Show only root annotations
                  .filter(a => 
                    (state.filteredType === 'all' || a.type === state.filteredType) &&
                    (state.filteredStatus === 'all' || a.status === state.filteredStatus)
                  )
                  .map(annotation => (
                    <div 
                      key={annotation.id}
                      className="p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                      onClick={() => updateAnnotation(annotation.id, {})}
                    >
                      <div className="flex items-center gap-2">
                        {annotation.type === 'text' && <MessageSquare className="h-4 w-4" />}
                        {annotation.type === 'voice' && <Mic className="h-4 w-4" />}
                        {annotation.type === 'video' && <Video className="h-4 w-4" />}
                        {annotation.type === 'sketch' && <PenLine className="h-4 w-4" />}
                        <span className="text-sm font-medium">
                          {annotation.content.substring(0, 20)}
                          {annotation.content.length > 20 ? '...' : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {getStatusIcon(annotation.status)}
                          <span className="ml-1">{getStatusLabel(annotation.status)}</span>
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {format(new Date(annotation.createdAt), 'MMM d')}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-80 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            {activeAnnotation.type === 'text' && <MessageSquare className="h-4 w-4 mr-2" />}
            {activeAnnotation.type === 'voice' && <Mic className="h-4 w-4 mr-2" />}
            {activeAnnotation.type === 'video' && <Video className="h-4 w-4 mr-2" />}
            {activeAnnotation.type === 'sketch' && <PenLine className="h-4 w-4 mr-2" />}
            Annotation
          </div>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>
          Created {format(new Date(activeAnnotation.createdAt), 'MMM d, yyyy h:mm a')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {getStatusIcon(activeAnnotation.status)}
              {getStatusLabel(activeAnnotation.status)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange('open')}>
                  <Clock className="h-4 w-4 mr-2" />
                  Mark as Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('in-review')}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Mark as In Review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('resolved')}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('rejected')}>
                  <X className="h-4 w-4 mr-2" />
                  Mark as Rejected
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    deleteAnnotation(activeAnnotation.id);
                    onClose();
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete Annotation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Display the annotation content based on its type */}
          {activeAnnotation.type === 'text' && (
            <p className="text-sm">{activeAnnotation.content}</p>
          )}
          {activeAnnotation.type === 'voice' && (
            <div className="bg-gray-100 rounded p-2 flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span className="text-sm">Audio Recording</span>
              <Button size="sm" variant="ghost" className="ml-auto">
                Play
              </Button>
            </div>
          )}
          {activeAnnotation.type === 'video' && (
            <div className="bg-gray-100 rounded p-2 flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span className="text-sm">Video Recording</span>
              <Button size="sm" variant="ghost" className="ml-auto">
                Play
              </Button>
            </div>
          )}
          {activeAnnotation.type === 'sketch' && (
            <div className="border rounded p-2">
              <div className="bg-gray-100 aspect-video flex items-center justify-center">
                <PenLine className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm mt-2">{activeAnnotation.content}</p>
            </div>
          )}
        </div>
        
        {/* Replies section */}
        <div>
          <h4 className="text-sm font-medium mb-2">Replies</h4>
          <div className="space-y-3">
            {replies.length === 0 ? (
              <p className="text-sm text-gray-500">No replies yet</p>
            ) : (
              replies.map(reply => (
                <div key={reply.id} className="bg-gray-50 rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">User</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(reply.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{reply.content}</p>
                </div>
              ))
            )}
            
            <div>
              <Textarea
                placeholder="Add a reply..."
                className="min-h-[60px] resize-none"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <Button 
                  size="sm" 
                  disabled={!replyContent.trim()}
                  onClick={handleReplySubmit}
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
