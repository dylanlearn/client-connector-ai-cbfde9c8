
import { supabase } from '@/integrations/supabase/client';

export interface DesignMemoryData {
  projectId: string;
  blueprintId?: string;
  layoutPatterns?: any;
  stylePreferences?: any;
  componentPreferences?: any;
}

export interface DesignMemoryResponse {
  id: string;
  project_id: string;
  blueprint_id?: string;
  layout_patterns?: any;
  style_preferences?: any;
  component_preferences?: any;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface DesignMemoryUpdate {
  memoryId: string;
  updates: Partial<Omit<DesignMemoryResponse, 'id' | 'project_id' | 'created_at' | 'updated_at' | 'user_id'>>;
}

export interface WireframeProject {
  id: string;
  title: string;
  description?: string;
  settings?: any;
  created_at: string;
  updated_at: string;
}

export interface WireframeCanvas {
  id: string;
  project_id: string;
  name: string;
  canvas_state: any;
  grid_settings: {
    visible: boolean;
    size: number;
    snap: boolean;
  };
  zoom_level: number;
  pan_offset: {
    x: number;
    y: number;
  };
  version: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface WireframeComponent {
  id: string;
  canvas_id: string;
  component_type: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  properties: any;
  layer_index: number;
  is_locked: boolean;
  is_visible: boolean;
}

/**
 * Service for managing wireframe design memory
 */
export const WireframeMemoryService = {
  /**
   * Store design memory for a project
   */
  storeDesignMemory: async (data: DesignMemoryData): Promise<DesignMemoryResponse | null> => {
    try {
      const { data: responseData, error } = await supabase.functions.invoke('wireframe-design-memory', {
        body: { 
          action: 'store', 
          projectId: data.projectId,
          blueprintId: data.blueprintId,
          layoutPatterns: data.layoutPatterns,
          stylePreferences: data.stylePreferences,
          componentPreferences: data.componentPreferences
        }
      });
      
      if (error) throw error;
      
      return responseData?.data?.[0] || null;
    } catch (error) {
      console.error('Error storing design memory:', error);
      throw error;
    }
  },
  
  /**
   * Retrieve design memory for a project
   */
  getDesignMemory: async (projectId: string): Promise<DesignMemoryResponse | null> => {
    try {
      const { data: responseData, error } = await supabase.functions.invoke('wireframe-design-memory', {
        body: { 
          action: 'retrieve', 
          projectId 
        }
      });
      
      if (error) throw error;
      
      return responseData?.data || null;
    } catch (error) {
      console.error('Error retrieving design memory:', error);
      throw error;
    }
  },
  
  /**
   * Update existing design memory
   */
  updateDesignMemory: async (updateData: DesignMemoryUpdate): Promise<DesignMemoryResponse | null> => {
    try {
      const { data: responseData, error } = await supabase.functions.invoke('wireframe-design-memory', {
        body: { 
          action: 'update', 
          memoryId: updateData.memoryId,
          updates: updateData.updates
        }
      });
      
      if (error) throw error;
      
      return responseData?.data || null;
    } catch (error) {
      console.error('Error updating design memory:', error);
      throw error;
    }
  },

  /**
   * Create a new wireframe project
   */
  createProject: async (title: string, description?: string): Promise<WireframeProject | null> => {
    try {
      const { data, error } = await supabase
        .from('wireframe_projects')
        .insert({
          title,
          description,
          settings: {}
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating wireframe project:', error);
      throw error;
    }
  },

  /**
   * Get a wireframe project by ID
   */
  getProject: async (projectId: string): Promise<WireframeProject | null> => {
    try {
      const { data, error } = await supabase
        .from('wireframe_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching wireframe project:', error);
      throw error;
    }
  },

  /**
   * Get all wireframe projects for the current user
   */
  getProjects: async (): Promise<WireframeProject[]> => {
    try {
      const { data, error } = await supabase
        .from('wireframe_projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching wireframe projects:', error);
      throw error;
    }
  },

  /**
   * Create a new canvas for a project
   */
  createCanvas: async (projectId: string, name: string): Promise<WireframeCanvas | null> => {
    try {
      const { data, error } = await supabase
        .from('wireframe_canvas')
        .insert({
          project_id: projectId,
          name,
          canvas_state: {},
          grid_settings: {
            visible: true,
            size: 8,
            snap: true
          },
          zoom_level: 1,
          pan_offset: { x: 0, y: 0 },
          version: 1,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating wireframe canvas:', error);
      throw error;
    }
  },

  /**
   * Get a canvas by ID
   */
  getCanvas: async (canvasId: string): Promise<WireframeCanvas | null> => {
    try {
      const { data, error } = await supabase
        .from('wireframe_canvas')
        .select('*')
        .eq('id', canvasId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching wireframe canvas:', error);
      throw error;
    }
  },

  /**
   * Get all canvases for a project
   */
  getCanvases: async (projectId: string): Promise<WireframeCanvas[]> => {
    try {
      const { data, error } = await supabase
        .from('wireframe_canvas')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching wireframe canvases:', error);
      throw error;
    }
  },

  /**
   * Update canvas state (zoom, pan, grid)
   */
  updateCanvasState: async (
    canvasId: string, 
    updates: Partial<Pick<WireframeCanvas, 'canvas_state' | 'zoom_level' | 'pan_offset' | 'grid_settings'>>
  ): Promise<WireframeCanvas | null> => {
    try {
      const { data, error } = await supabase
        .from('wireframe_canvas')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', canvasId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating canvas state:', error);
      throw error;
    }
  },

  /**
   * Add a component to a canvas
   */
  addComponent: async (component: Omit<WireframeComponent, 'id'>): Promise<WireframeComponent | null> => {
    try {
      const { data, error } = await supabase
        .from('wireframe_canvas_components')
        .insert(component)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error adding component to canvas:', error);
      throw error;
    }
  },

  /**
   * Update a component's properties
   */
  updateComponent: async (
    componentId: string, 
    updates: Partial<Omit<WireframeComponent, 'id' | 'canvas_id'>>
  ): Promise<WireframeComponent | null> => {
    try {
      const { data, error } = await supabase
        .from('wireframe_canvas_components')
        .update(updates)
        .eq('id', componentId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating component:', error);
      throw error;
    }
  },

  /**
   * Get all components for a canvas
   */
  getComponents: async (canvasId: string): Promise<WireframeComponent[]> => {
    try {
      const { data, error } = await supabase
        .from('wireframe_canvas_components')
        .select('*')
        .eq('canvas_id', canvasId)
        .order('layer_index', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching canvas components:', error);
      throw error;
    }
  },

  /**
   * Record an action for undo/redo functionality
   */
  recordAction: async (
    canvasId: string, 
    actionType: string, 
    componentId?: string, 
    previousState?: any, 
    newState?: any
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('wireframe_action_history')
        .insert({
          canvas_id: canvasId,
          action_type: actionType,
          component_id: componentId,
          previous_state: previousState,
          new_state: newState
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording action history:', error);
      throw error;
    }
  },

  /**
   * Get action history for a canvas
   */
  getActionHistory: async (canvasId: string, limit: number = 50): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('wireframe_action_history')
        .select('*')
        .eq('canvas_id', canvasId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching action history:', error);
      throw error;
    }
  }
};
