
// User types for collaboration
export interface UserPresence {
  status: 'active' | 'idle' | 'offline';
  focusElement: string | null;
  cursorPosition: CursorPosition | null;
  lastActive: string;
}

export interface User {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  presence: UserPresence;
}

// Cursor position type
export interface CursorPosition {
  x: number;
  y: number;
  elementId?: string;
  selection?: {
    start: number;
    end: number;
  };
}

// Document change types
export type OperationType = 'insert' | 'delete' | 'update' | 'move';

export interface DocumentChange {
  id: string;
  userId: string;
  documentId: string;
  operation: OperationType;
  path: string;
  value: any;
  timestamp: string;
  version?: number;
}

// State and action types for the reducer
export interface CollaborationState {
  users: Record<string, User>;
  activeUsers: string[];
  documentId: string | null;
  changes: DocumentChange[];
  pendingChanges: DocumentChange[];
  isConnected: boolean;
  error: string | null;
  lastSyncedVersion: number;
}

export type CollaborationAction =
  | { type: 'SET_DOCUMENT_ID'; payload: string | null }
  | { type: 'USER_JOINED'; payload: User }
  | { type: 'USER_LEFT'; payload: string }
  | { type: 'UPDATE_USER_PRESENCE'; payload: { userId: string; presence: Partial<UserPresence> } }
  | { type: 'ADD_CHANGE'; payload: DocumentChange }
  | { type: 'CHANGES_APPLIED'; payload: string[] }
  | { type: 'SET_CONNECTION_STATUS'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'MERGE_REMOTE_CHANGES'; payload: DocumentChange[] };
