
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";
import { DocumentChange, Annotation, User } from "@/types/collaboration";

/**
 * Service for handling collaborative document operations
 */
export const DocumentService = {
  /**
   * Create a new collaborative document
   */
  async createDocument(title: string, initialContent: string = '') {
    try {
      const { data, error } = await supabase
        .from('collaborative_documents')
        .insert({
          title,
          content: initialContent,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  /**
   * Get a document by ID
   */
  async getDocument(documentId: string) {
    try {
      const { data, error } = await supabase
        .from('collaborative_documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  },

  /**
   * Save document changes
   */
  async saveChanges(documentId: string, changes: Omit<DocumentChange, 'id' | 'timestamp'>[]) {
    try {
      const changesWithDocId = changes.map(change => ({
        ...change,
        document_id: documentId,
        id: nanoid(),
        timestamp: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('document_changes')
        .insert(changesWithDocId)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving changes:', error);
      throw error;
    }
  },

  /**
   * Get document changes since a specific version
   */
  async getChangesSince(documentId: string, version: number) {
    try {
      const { data, error } = await supabase
        .from('document_changes')
        .select('*')
        .eq('document_id', documentId)
        .gt('version', version)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching changes:', error);
      throw error;
    }
  },

  /**
   * Subscribe to document changes
   */
  subscribeToChanges(documentId: string, onChanges: (changes: DocumentChange[]) => void) {
    const channel = supabase
      .channel(`document-${documentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'document_changes',
          filter: `document_id=eq.${documentId}`
        },
        (payload) => {
          console.log('New document change:', payload);
          // Transform from Supabase payload to our DocumentChange type
          const change: DocumentChange = {
            id: payload.new.id,
            userId: payload.new.user_id,
            documentId: payload.new.document_id,
            operation: payload.new.operation as any,
            path: payload.new.path,
            value: payload.new.value,
            timestamp: payload.new.timestamp,
            version: payload.new.version
          };
          onChanges([change]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
