
import { supabase } from "@/integrations/supabase/client";
import { Annotation, AnnotationType, AnnotationStatus } from "@/types/annotations";
import { nanoid } from "nanoid";

/**
 * Service for handling document annotations
 */
export const AnnotationService = {
  /**
   * Create a new annotation
   */
  async createAnnotation(
    documentId: string, 
    userId: string,
    type: AnnotationType,
    content: string,
    position: { x: number; y: number; elementId?: string },
    parentId?: string,
    metadata?: Record<string, any>
  ) {
    try {
      const { data, error } = await supabase
        .from('document_annotations')
        .insert({
          document_id: documentId,
          user_id: userId,
          type,
          content,
          position,
          parent_id: parentId || null,
          metadata: metadata || {}
        })
        .select()
        .single();

      if (error) throw error;
      
      // Convert to our client-side Annotation type
      const annotation: Annotation = {
        id: data.id,
        documentId: data.document_id,
        userId: data.user_id,
        type: data.type as AnnotationType,
        content: data.content,
        position: data.position,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        status: data.status as AnnotationStatus,
        parentId: data.parent_id,
        metadata: data.metadata
      };
      
      return annotation;
    } catch (error) {
      console.error('Error creating annotation:', error);
      throw error;
    }
  },

  /**
   * Get annotations for a document
   */
  async getAnnotations(documentId: string) {
    try {
      const { data, error } = await supabase
        .from('document_annotations')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Convert to our client-side Annotation type
      const annotations: Annotation[] = data.map(item => ({
        id: item.id,
        documentId: item.document_id,
        userId: item.user_id,
        type: item.type,
        content: item.content,
        position: item.position,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        status: item.status,
        parentId: item.parent_id,
        metadata: item.metadata
      }));
      
      return annotations;
    } catch (error) {
      console.error('Error fetching annotations:', error);
      throw error;
    }
  },

  /**
   * Update an annotation
   */
  async updateAnnotation(annotationId: string, updates: Partial<Annotation>) {
    try {
      const { data, error } = await supabase
        .from('document_annotations')
        .update({
          content: updates.content,
          status: updates.status,
          metadata: updates.metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', annotationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating annotation:', error);
      throw error;
    }
  },

  /**
   * Delete an annotation
   */
  async deleteAnnotation(annotationId: string) {
    try {
      const { error } = await supabase
        .from('document_annotations')
        .delete()
        .eq('id', annotationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting annotation:', error);
      throw error;
    }
  },

  /**
   * Subscribe to annotation changes
   */
  subscribeToAnnotations(documentId: string, onUpdate: (annotations: Annotation[]) => void) {
    const channel = supabase
      .channel(`annotations-${documentId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'document_annotations',
          filter: `document_id=eq.${documentId}`
        },
        (payload) => {
          console.log('Annotation change:', payload);
          // Refresh annotations on any change
          this.getAnnotations(documentId).then(onUpdate);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
