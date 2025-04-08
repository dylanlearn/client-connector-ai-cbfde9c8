
import { WireframeVersion, WireframeVersionDiff, WireframeCompareResult } from '@/types/wireframe';
import { diff } from 'deep-object-diff';

/**
 * Service for comparing wireframe versions to identify differences
 */
export class VersionComparisonService {
  /**
   * Compare two wireframe versions to identify differences
   */
  static compareVersions(v1: WireframeVersion, v2: WireframeVersion): WireframeCompareResult {
    // Basic validation
    if (!v1 || !v2) {
      throw new Error('Both versions must be provided for comparison');
    }

    if (!v1.data || !v2.data) {
      throw new Error('Both versions must have data for comparison');
    }

    try {
      // Compute the diff between the two versions
      const differences = diff(v1.data, v2.data);

      // Track changes by type
      const changes: Array<{
        type: "added" | "removed" | "modified";
        path: string;
        values: [any, any];
      }> = [];

      // Process differences
      Object.entries(differences).forEach(([key, value]) => {
        // Determine change type
        let changeType: "added" | "removed" | "modified" = "modified";
        
        if (!(key in v1.data)) {
          changeType = "added";
        } else if (!(key in v2.data)) {
          changeType = "removed";
        }

        // Add to changes list
        changes.push({
          type: changeType,
          path: key,
          values: [v1.data[key], v2.data[key]]
        });
      });

      // Generate summary
      const summary = this.generateSummary(changes);

      return {
        changes,
        summary
      };
    } catch (error) {
      console.error('Error comparing wireframe versions:', error);
      throw new Error('Failed to compare versions');
    }
  }

  /**
   * Generate a summary of the changes
   */
  private static generateSummary(changes: Array<{
    type: "added" | "removed" | "modified";
    path: string;
    values: [any, any];
  }>): string {
    // Count changes by type
    const added = changes.filter(change => change.type === "added").length;
    const removed = changes.filter(change => change.type === "removed").length;
    const modified = changes.filter(change => change.type === "modified").length;

    // Generate summary text
    if (changes.length === 0) {
      return "No changes between versions";
    }

    const parts: string[] = [];
    if (added > 0) parts.push(`${added} addition${added !== 1 ? 's' : ''}`);
    if (modified > 0) parts.push(`${modified} modification${modified !== 1 ? 's' : ''}`);
    if (removed > 0) parts.push(`${removed} removal${removed !== 1 ? 's' : ''}`);

    return `This version contains ${parts.join(', ')}`;
  }
}
