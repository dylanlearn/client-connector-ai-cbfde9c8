
export interface ProjectHistory {
  id: string;
  project_id: string;
  user_id: string;
  previous_status: string | null;
  new_status: string;
  changed_at: string;
  notes: string | null;
}

export type ProjectHistoryResponse = ProjectHistory[];
