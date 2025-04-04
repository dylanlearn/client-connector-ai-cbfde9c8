
export interface ProjectFile {
  id: string;
  project_id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  description: string | null;
  uploaded_at: string;
  is_deleted: boolean;
}

export type ProjectFileResponse = ProjectFile[];

export interface FileUploadResponse {
  path: string;
  fullPath: string;
}
