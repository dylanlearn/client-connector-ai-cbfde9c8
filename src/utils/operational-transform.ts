import { DocumentChange, OperationType } from '@/types/collaboration';

/**
 * Applies operational transformation to resolve conflicts between concurrent changes
 */
export function transformChanges(
  localChange: DocumentChange,
  remoteChange: DocumentChange
): DocumentChange {
  // Skip transform if changes are on different paths
  if (localChange.path !== remoteChange.path) {
    return localChange;
  }

  // Simple priority-based resolution
  // In a production system, this would be much more sophisticated
  // and would handle nested transforms, string operations, etc.
  
  // If the remote change comes later, transform local against remote
  if (new Date(localChange.timestamp) < new Date(remoteChange.timestamp)) {
    return transformAgainstPriorChange(localChange, remoteChange);
  }

  return localChange;
}

/**
 * Transforms a change against a prior change
 */
function transformAgainstPriorChange(
  change: DocumentChange,
  priorChange: DocumentChange
): DocumentChange {
  // Handle text operations specially
  if (change.path.startsWith('text:') && isTextOperation(change.operation)) {
    return transformTextOperation(change, priorChange);
  }

  // For non-text operations, use simple conflict resolution
  switch (priorChange.operation) {
    case 'delete':
      // If prior operation deleted this path, our operation becomes a no-op
      return {
        ...change,
        operation: 'update',
        value: null
      };
      
    case 'move':
      // Adjust the path if needed
      return {
        ...change,
        path: adjustPathAfterMove(change.path, priorChange)
      };
      
    case 'update':
      // For update, we may need to merge values or use the latest
      return {
        ...change,
        value: mergeValues(change.operation, change.value, priorChange.value)
      };
      
    default:
      return change;
  }
}

/**
 * Transform a text operation against a prior change
 */
function transformTextOperation(
  change: DocumentChange,
  priorChange: DocumentChange
): DocumentChange {
  // Simple position adjustment for text operations
  if (isTextOperation(priorChange.operation)) {
    if (change.operation === 'insert' && priorChange.operation === 'insert') {
      // If both are inserts, adjust position based on prior insert
      const insertPos = parseInt(change.path.split(':')[2], 10);
      const priorInsertPos = parseInt(priorChange.path.split(':')[2], 10);
      
      if (insertPos >= priorInsertPos) {
        // Adjust the insert position by the length of the prior insert
        const newPos = insertPos + String(priorChange.value).length;
        const pathParts = change.path.split(':');
        pathParts[2] = String(newPos);
        
        return {
          ...change,
          path: pathParts.join(':')
        };
      }
    } else if (change.operation === 'delete' && priorChange.operation === 'insert') {
      // Adjust delete position based on prior insert
      const deleteStart = parseInt(change.path.split(':')[2], 10);
      const deleteEnd = deleteStart + String(change.value).length;
      const priorInsertPos = parseInt(priorChange.path.split(':')[2], 10);
      
      if (deleteStart > priorInsertPos) {
        // Adjust the delete position by the length of the prior insert
        const newPos = deleteStart + String(priorChange.value).length;
        const pathParts = change.path.split(':');
        pathParts[2] = String(newPos);
        
        return {
          ...change,
          path: pathParts.join(':')
        };
      } else if (deleteStart <= priorInsertPos && deleteEnd > priorInsertPos) {
        // The delete overlaps with the prior insert - split into two operations
        // This is a simplified approach - in real implementation, would need more complex handling
        const beforeInsert = change.value.substring(0, priorInsertPos - deleteStart);
        const afterInsert = change.value.substring(priorInsertPos - deleteStart);
        
        // For simplicity, just modify the operation to delete before the insert
        return {
          ...change,
          value: beforeInsert,
        };
      }
    }
  }
  
  return change;
}

/**
 * Check if an operation is a text operation
 */
function isTextOperation(operation: OperationType): boolean {
  return ['insert', 'delete'].includes(operation);
}

/**
 * Adjust a path after a move operation
 */
function adjustPathAfterMove(path: string, moveChange: DocumentChange): string {
  // Get the source and destination from the move operation
  const sourcePath = moveChange.path;
  const destPath = String(moveChange.value);
  
  // If our path is within or equals the source, update it to the destination
  if (path === sourcePath || path.startsWith(sourcePath + '.')) {
    return path.replace(sourcePath, destPath);
  }
  
  return path;
}

/**
 * Merge values for update operations
 */
function mergeValues(operation: OperationType, newValue: any, priorValue: any): any {
  if (operation !== 'update') return newValue;
  
  // If both values are objects, merge them
  if (typeof newValue === 'object' && newValue !== null &&
      typeof priorValue === 'object' && priorValue !== null) {
    return { ...priorValue, ...newValue };
  }
  
  // Otherwise, use the new value
  return newValue;
}

/**
 * Apply a change to a document
 */
export function applyChange(document: any, change: DocumentChange): any {
  const { path, operation, value } = change;
  const result = { ...document };
  
  // Handle special text operations
  if (path.startsWith('text:')) {
    return applyTextChange(document, change);
  }
  
  // Get path segments
  const segments = path.split('.');
  let current = result;
  
  // Navigate to the parent of the target property
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    if (!current[segment]) {
      current[segment] = {};
    }
    current = current[segment];
  }
  
  // Get the target property name
  const lastSegment = segments[segments.length - 1];
  
  // Apply the operation
  switch (operation) {
    case 'insert':
      if (Array.isArray(current[lastSegment])) {
        current[lastSegment] = [
          ...current[lastSegment].slice(0, value.index),
          value.item,
          ...current[lastSegment].slice(value.index)
        ];
      } else {
        current[lastSegment] = value;
      }
      break;
      
    case 'update':
      if (typeof value === 'object' && value !== null && 
          typeof current[lastSegment] === 'object' && current[lastSegment] !== null) {
        current[lastSegment] = { ...current[lastSegment], ...value };
      } else {
        current[lastSegment] = value;
      }
      break;
      
    case 'delete':
      if (Array.isArray(current[lastSegment]) && typeof value === 'number') {
        current[lastSegment] = [
          ...current[lastSegment].slice(0, value),
          ...current[lastSegment].slice(value + 1)
        ];
      } else {
        delete current[lastSegment];
      }
      break;
      
    case 'move':
      // Move operation is handled differently as it involves two paths
      const targetPath = value;
      const targetSegments = targetPath.split('.');
      let targetCurrent = result;
      
      // Navigate to the parent of the target property
      for (let i = 0; i < targetSegments.length - 1; i++) {
        const segment = targetSegments[i];
        if (!targetCurrent[segment]) {
          targetCurrent[segment] = {};
        }
        targetCurrent = targetCurrent[segment];
      }
      
      // Get the target property name
      const targetLastSegment = targetSegments[targetSegments.length - 1];
      
      // Move the value
      targetCurrent[targetLastSegment] = current[lastSegment];
      delete current[lastSegment];
      break;
  }
  
  return result;
}

/**
 * Apply a text change to a document
 */
function applyTextChange(document: any, change: DocumentChange): any {
  const { path, operation, value } = change;
  const result = { ...document };
  
  // Parse the text path format: text:fieldName:position
  const [, fieldName, position] = path.split(':');
  const pos = parseInt(position, 10);
  
  // Get the current text
  let text = result[fieldName] || '';
  
  switch (operation) {
    case 'insert':
      // Insert text at the specified position
      text = text.substring(0, pos) + value + text.substring(pos);
      break;
      
    case 'delete':
      // Delete text at the specified position
      // Value can be either the number of characters to delete or the text to delete
      const deleteLength = typeof value === 'number' ? value : value.length;
      text = text.substring(0, pos) + text.substring(pos + deleteLength);
      break;
      
    case 'update':
      // Update might replace a range of text
      const updateLength = value.oldText?.length || 0;
      text = text.substring(0, pos) + value.newText + text.substring(pos + updateLength);
      break;
  }
  
  result[fieldName] = text;
  return result;
}
