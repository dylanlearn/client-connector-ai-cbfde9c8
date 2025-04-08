// Import the proper types from wireframe-types
import { WireframeData, WireframeSection, WireframeVersion, VersionComparisonResult } from "@/services/ai/wireframe/wireframe-types";

/**
 * Compare two wireframe versions to identify differences
 */
export const compareWireframeVersions = async (
  version1: WireframeVersion | WireframeData,
  version2: WireframeVersion | WireframeData
): Promise<VersionComparisonResult> => {
  const additions: any[] = [];
  const deletions: any[] = [];
  const modifications: any[] = [];

  // Helper function to deeply compare two objects
  const deepCompare = (obj1: any, obj2: any, path: string = '') => {
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
      if (obj1 !== obj2) {
        modifications.push({ path, value1: obj1, value2: obj2 });
      }
      return;
    }

    const keys1 = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    for (const key of keys1) {
      const newPath = path ? `${path}.${key}` : key;

      if (!(key in obj1)) {
        additions.push({ path: newPath, value: obj2[key] });
      } else if (!(key in obj2)) {
        deletions.push({ path: newPath, value: obj1[key] });
      } else {
        deepCompare(obj1[key], obj2[key], newPath);
      }
    }
  };

  // Start the comparison from the root
  deepCompare(version1, version2);

  // Summarize the changes
  let summary = '';
  if (additions.length > 0) {
    summary += `Added ${additions.length} items. `;
  }
  if (deletions.length > 0) {
    summary += `Deleted ${deletions.length} items. `;
  }
  if (modifications.length > 0) {
    summary += `Modified ${modifications.length} items. `;
  }

  // At the end of the function, return the comparison result with the correct structure:
  return {
    additions,
    deletions,
    modifications,
    summary
  };
};
