
import React, { useState } from 'react';
import { Project } from '@/types/project';
import { useProjectFiles } from '@/hooks/use-project-files';
import { useClientNotifications } from '@/hooks/use-client-notifications';
import { File, Upload, Trash2, Download, Loader2, FileIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatDistanceToNow, format } from 'date-fns';
import { formatFileSize } from '@/utils/format-utils';

interface ProjectFilesTabProps {
  project: Project;
}

// Create a separate utility file for formatting
<lov-write file_path="src/utils/format-utils.ts">
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
