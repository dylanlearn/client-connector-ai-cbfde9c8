
import React, { useState } from 'react';
import { Project } from '@/types/project';
import { useProjectFiles } from '@/hooks/use-project-files';
import { useClientNotifications } from '@/hooks/use-client-notifications';
import { File, Upload, Trash2, Download, Loader2, FileText } from 'lucide-react';
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

const ProjectFilesTab: React.FC<ProjectFilesTabProps> = ({ project }) => {
  const { files, isLoading, error, uploadFile, deleteFile, getFileUrl } = useProjectFiles(project.id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { createNotification } = useClientNotifications();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      await uploadFile.mutateAsync({
        file: selectedFile,
        description: fileDescription
      });
      
      // Optional: Notify client about the new file
      if (project.client_email) {
        await createNotification.mutateAsync({
          project_id: project.id,
          client_email: project.client_email,
          notification_type: 'file_uploaded',
          message: `A new file "${selectedFile.name}" has been uploaded to your project.`,
          metadata: {
            fileName: selectedFile.name,
          }
        });
      }
      
      // Reset form
      setSelectedFile(null);
      setFileDescription('');
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = async (fileId: string, fileName: string) => {
    if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
      await deleteFile.mutateAsync(fileId);
    }
  };
  
  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const url = await getFileUrl(filePath);
      
      // Create a temporary anchor and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load project files: {error.message}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div>
      <div className="mb-6 p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Upload New File</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Select File</Label>
            <Input 
              id="file-upload" 
              type="file" 
              onChange={handleFileChange} 
              className="mt-1" 
            />
          </div>
          
          <div>
            <Label htmlFor="file-description">Description (optional)</Label>
            <Textarea
              id="file-description"
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              placeholder="Enter a brief description of this file"
              className="mt-1"
            />
          </div>
          
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="flex items-center"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        </div>
      </div>
      
      {files && files.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Project Files</h3>
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-100 p-3 text-sm font-medium">
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-3">Uploaded</div>
              <div className="col-span-2">Actions</div>
            </div>
            {files.map((file) => (
              <div key={file.id} className="grid grid-cols-12 p-3 border-t items-center">
                <div className="col-span-5 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="truncate" title={file.file_name}>
                    {file.file_name}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-gray-600">
                  {formatFileSize(file.file_size)}
                </div>
                <div className="col-span-3 text-sm text-gray-600">
                  <span title={format(new Date(file.uploaded_at), 'PPp')}>
                    {formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })}
                  </span>
                </div>
                <div className="col-span-2 flex space-x-2">
                  <Button
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDownload(file.storage_path, file.file_name)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDelete(file.id, file.file_name)}
                    title="Delete"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {file.description && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="link"
                        className="col-span-12 text-left text-sm text-gray-500 pl-6 mt-1"
                      >
                        View description
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{file.file_name}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Description:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{file.description}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <File className="h-12 w-12 text-gray-300 mx-auto" />
          <p className="mt-4 text-gray-500">No files have been uploaded to this project yet.</p>
          <p className="text-sm text-gray-400">Upload files using the form above.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectFilesTab;
