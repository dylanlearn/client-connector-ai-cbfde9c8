
export interface DesignWorkflowTask {
  id: string;
  design_artifact_id: string;
  artifact_type: 'token' | 'component' | 'wireframe';
  task_title: string;
  task_description: string | null;
  task_status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assigned_to: string | null;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface DesignVersionControl {
  id: string;
  design_id: string;
  version_number: string;
  commit_message: string | null;
  commit_hash: string | null;
  repository_url: string | null;
  pull_request_url: string | null;
  created_by: string | null;
  created_at: string;
  status: 'pending' | 'committed' | 'deployed' | 'failed';
}

export interface DesignDeployment {
  id: string;
  design_version_id: string;
  environment: string;
  deployed_at: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  deployment_url: string | null;
  deployment_logs: string | null;
  deployed_by: string | null;
}

export interface DesignChangeHook {
  id: string;
  project_id: string;
  hook_type: 'github' | 'gitlab' | 'jira' | 'slack' | 'custom';
  webhook_url: string;
  secret_token: string | null;
  event_types: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
