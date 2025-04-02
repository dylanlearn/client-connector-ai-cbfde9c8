
/**
 * Utility functions for working with status badges and indicators
 */

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending' | 'completed' | 'expired' | 'active';

interface StatusConfig {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  color: string;
}

/**
 * Get configuration for a status badge
 * @param status The status to get configuration for
 * @returns Configuration object for the status
 */
export const getStatusConfig = (status: StatusType): StatusConfig => {
  switch (status) {
    case 'success':
    case 'completed':
    case 'active':
      return {
        label: status === 'active' ? 'Active' : 'Completed',
        variant: 'success',
        color: 'text-green-800'
      };
    case 'warning':
    case 'pending':
      return {
        label: 'Pending',
        variant: 'secondary',
        color: 'text-amber-800'
      };
    case 'error':
      return {
        label: 'Error',
        variant: 'destructive',
        color: 'text-red-800'
      };
    case 'expired':
      return {
        label: 'Expired',
        variant: 'outline',
        color: 'text-gray-500'
      };
    case 'info':
      return {
        label: 'Info',
        variant: 'default',
        color: 'text-blue-800'
      };
    default:
      // For custom status types, create a capitalized label
      const statusString = String(status);
      return {
        label: statusString.charAt(0).toUpperCase() + statusString.slice(1),
        variant: 'default',
        color: 'text-blue-800'
      };
  }
};
