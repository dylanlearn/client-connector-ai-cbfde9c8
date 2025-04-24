
import { User } from './collaboration';

export type AnnotationType = 'text' | 'voice' | 'video' | 'sketch';

export type AnnotationStatus = 'open' | 'in-review' | 'resolved' | 'rejected';

export interface Annotation {
  id: string;
  documentId: string;
  userId: string;
  type: AnnotationType;
  content: string; // Text content or file/media URL
  position: {
    x: number;
    y: number;
    elementId?: string;
  };
  createdAt: string;
  updatedAt: string;
  status: AnnotationStatus;
  parentId?: string; // For threaded replies
  metadata?: AnnotationMetadata;
}

export interface AnnotationMetadata {
  duration?: number; // For audio/video
  dimensions?: { width: number; height: number }; // For sketches
  fileSize?: number;
  fileType?: string;
  thumbnailUrl?: string;
  labelColor?: string; // For categorizing annotations
  assignedTo?: string; // User ID
  priority?: 'low' | 'medium' | 'high';
  replies?: number; // Number of replies in a thread
}

export interface AnnotationThread {
  rootAnnotation: Annotation;
  replies: Annotation[];
}
