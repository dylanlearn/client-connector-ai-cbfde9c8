import { diff } from 'fast-diff';
import { WireframeVersion, VersionComparisonResult } from "@/services/ai/wireframe/wireframe-types";

/**
 * Service for comparing wireframe versions and identifying differences.
 */
export const versionComparisonService = {
  /**
   * Compares two wireframe data objects and returns a summary of the differences.
   * @param older The older wireframe data object.
   * @param newer The newer wireframe data object.
   * @returns A VersionComparisonResult object containing the differences and a summary.
   */
  compareWireframeData: (older: any, newer: any): VersionComparisonResult => {
    const detectedDifferences: any[] = [];

    // Function to recursively compare objects and identify differences
    const findDifferences = (olderObj: any, newerObj: any, path: string = "") => {
      for (const key in newerObj) {
        if (newerObj.hasOwnProperty(key)) {
          const currentPath = path ? `${path}.${key}` : key;

          if (olderObj && olderObj.hasOwnProperty(key)) {
            if (typeof newerObj[key] === 'object' && newerObj[key] !== null && typeof olderObj[key] === 'object' && olderObj[key] !== null) {
              // Recursively compare nested objects
              findDifferences(olderObj[key], newerObj[key], currentPath);
            } else if (olderObj[key] !== newerObj[key]) {
              // Value has changed
              detectedDifferences.push({
                path: currentPath,
                oldValue: olderObj[key],
                newValue: newerObj[key],
                type: 'modified'
              });
            }
          } else {
            // Key is new
            detectedDifferences.push({
              path: currentPath,
              oldValue: undefined,
              newValue: newerObj[key],
              type: 'added'
            });
          }
        }
      }

      // Check for removed keys
      for (const key in olderObj) {
        if (olderObj.hasOwnProperty(key) && !newerObj.hasOwnProperty(key)) {
          const currentPath = path ? `${path}.${key}` : key;
          detectedDifferences.push({
            path: currentPath,
            oldValue: olderObj[key],
            newValue: undefined,
            type: 'removed'
          });
        }
      }
    };

    findDifferences(older, newer, "");

    const generateSummary = (differences: any[]): string => {
      if (differences.length === 0) {
        return "No significant changes detected.";
      }

      const changeCounts = {
        added: 0,
        modified: 0,
        removed: 0
      };

      differences.forEach(diff => {
        changeCounts[diff.type]++;
      });

      return `Detected ${differences.length} changes: ${changeCounts.added} added, ${changeCounts.modified} modified, ${changeCounts.removed} removed.`;
    };
    
    return {
      differences: detectedDifferences,
      summary: generateSummary(detectedDifferences),
      changes: detectedDifferences // Add changes property for compatibility
    };
  },

  /**
   * Generates a detailed text diff between two strings.
   * @param olderText The older text.
   * @param newerText The newer text.
   * @returns An array of diff segments.
   */
  generateTextDiff: (olderText: string, newerText: string): [string, number][] => {
    return diff(olderText, newerText);
  }
};
