
import { supabase } from "@/integrations/supabase/client";
import type { 
  DesignWorkflowTask, 
  DesignVersionControl, 
  DesignDeployment, 
  DesignChangeHook 
} from "@/types/design-workflow";

export class DesignWorkflowService {
  static async getWorkflowTasks(
    assignedTo?: string, 
    status?: string
  ): Promise<DesignWorkflowTask[]> {
    let query = supabase
      .from('design_workflow_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (assignedTo) {
      query = query.eq('assigned_to', assignedTo);
    }

    if (status) {
      query = query.eq('task_status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching workflow tasks:", error);
      throw error;
    }

    return data as DesignWorkflowTask[];
  }

  static async updateTaskStatus(
    taskId: string, 
    status: string
  ): Promise<DesignWorkflowTask> {
    const { data, error } = await supabase
      .from('design_workflow_tasks')
      .update({ task_status: status, updated_at: new Date().toISOString() })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error("Error updating task status:", error);
      throw error;
    }

    return data as DesignWorkflowTask;
  }

  static async createDesignVersion(
    designId: string,
    versionNumber: string,
    commitMessage: string
  ): Promise<DesignVersionControl> {
    const { data, error } = await supabase
      .from('design_version_control')
      .insert({
        design_id: designId,
        version_number: versionNumber,
        commit_message: commitMessage,
        status: 'pending',
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating design version:", error);
      throw error;
    }

    return data as DesignVersionControl;
  }

  static async getDesignVersions(
    designId: string
  ): Promise<DesignVersionControl[]> {
    const { data, error } = await supabase
      .from('design_version_control')
      .select('*')
      .eq('design_id', designId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching design versions:", error);
      throw error;
    }

    return data as DesignVersionControl[];
  }

  static async createDeployment(
    versionId: string, 
    environment: string
  ): Promise<DesignDeployment> {
    const { data, error } = await supabase
      .from('design_deployments')
      .insert({
        design_version_id: versionId,
        environment: environment,
        status: 'pending',
        deployed_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating deployment:", error);
      throw error;
    }

    return data as DesignDeployment;
  }

  static async getDeployments(
    versionId: string
  ): Promise<DesignDeployment[]> {
    const { data, error } = await supabase
      .from('design_deployments')
      .select('*')
      .eq('design_version_id', versionId)
      .order('deployed_at', { ascending: false });

    if (error) {
      console.error("Error fetching deployments:", error);
      throw error;
    }

    return data as DesignDeployment[];
  }

  static async createWebhook(
    projectId: string,
    hookType: string,
    webhookUrl: string,
    eventTypes: string[]
  ): Promise<DesignChangeHook> {
    const { data, error } = await supabase
      .from('design_change_hooks')
      .insert({
        project_id: projectId,
        hook_type: hookType,
        webhook_url: webhookUrl,
        event_types: eventTypes,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating webhook:", error);
      throw error;
    }

    return data as DesignChangeHook;
  }

  static async getWebhooks(
    projectId: string
  ): Promise<DesignChangeHook[]> {
    const { data, error } = await supabase
      .from('design_change_hooks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching webhooks:", error);
      throw error;
    }

    return data as DesignChangeHook[];
  }
}
