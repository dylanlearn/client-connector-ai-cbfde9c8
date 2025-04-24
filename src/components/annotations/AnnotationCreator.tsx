
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Mic, Video, PenLine } from 'lucide-react';
import { AnnotationType } from '@/types/annotations';

interface AnnotationCreatorProps {
  type: AnnotationType;
  position: { x: number; y: number; elementId?: string };
  onSave: (content: string) => void;
  onCancel: () => void;
}

export const AnnotationCreator: React.FC<AnnotationCreatorProps> = ({
  type,
  position,
  onSave,
  onCancel,
}) => {
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // In a real app, we would handle recording for voice and video
  // and drawing for sketch annotations
  
  const handleSave = () => {
    if (content.trim() || type !== 'text') {
      onSave(content);
    }
  };
  
  const getCreatorTitle = () => {
    switch (type) {
      case 'text':
        return 'Add Text Comment';
      case 'voice':
        return 'Add Voice Annotation';
      case 'video':
        return 'Add Video Annotation';
      case 'sketch':
        return 'Add Sketch Annotation';
      default:
        return 'Add Annotation';
    }
  };
  
  const getCreatorIcon = () => {
    switch (type) {
      case 'text':
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case 'voice':
        return <Mic className="h-4 w-4 mr-2" />;
      case 'video':
        return <Video className="h-4 w-4 mr-2" />;
      case 'sketch':
        return <PenLine className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };
  
  return (
    <Card 
      className="p-3 w-72 shadow-lg absolute z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-16px)',
      }}
    >
      <div className="font-medium text-sm flex items-center mb-2">
        {getCreatorIcon()}
        {getCreatorTitle()}
      </div>
      
      {type === 'text' && (
        <Textarea
          placeholder="Enter your comment..."
          className="min-h-[80px] resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
        />
      )}
      
      {type === 'voice' && (
        <div className="bg-gray-100 rounded-md p-3 text-center">
          <Button 
            variant={isRecording ? "destructive" : "default"}
            className="mb-2"
            onClick={() => setIsRecording(!isRecording)}
          >
            <Mic className="h-4 w-4 mr-2" />
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          {isRecording && (
            <div className="text-sm text-gray-500">
              Recording: {Math.floor(recordingTime / 60)}:
              {(recordingTime % 60).toString().padStart(2, '0')}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Click the button to start/stop recording
          </p>
        </div>
      )}
      
      {type === 'video' && (
        <div className="bg-gray-100 rounded-md p-3 text-center">
          <Button 
            variant={isRecording ? "destructive" : "default"}
            className="mb-2"
            onClick={() => setIsRecording(!isRecording)}
          >
            <Video className="h-4 w-4 mr-2" />
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          {isRecording && (
            <div className="text-sm text-gray-500">
              Recording: {Math.floor(recordingTime / 60)}:
              {(recordingTime % 60).toString().padStart(2, '0')}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Click the button to start/stop recording
          </p>
        </div>
      )}
      
      {type === 'sketch' && (
        <div className="bg-gray-100 rounded-md p-3 text-center mb-2">
          <div className="border border-dashed border-gray-300 aspect-video mb-2 flex items-center justify-center">
            <PenLine className="h-8 w-8 text-gray-400" />
          </div>
          <Input
            placeholder="Add a description..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      )}
      
      <div className="flex justify-end gap-2 mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          size="sm" 
          onClick={handleSave}
          disabled={type === 'text' && !content.trim()}
        >
          Save
        </Button>
      </div>
    </Card>
  );
};
