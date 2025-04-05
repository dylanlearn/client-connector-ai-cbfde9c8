
export type StatusType = 'normal' | 'warning' | 'critical' | 'unknown' | 'success' | 'error' | 'pending' | 'archived' | 'active' | 'inactive';

interface StatusConfig {
  label: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'success' | 'warning';
  color: string;
}

export function getStatusConfig(status: StatusType): StatusConfig {
  switch (status) {
    case 'success':
    case 'normal':
    case 'active':
      return {
        label: status === 'active' ? 'Active' : status === 'success' ? 'Success' : 'Normal',
        variant: 'success',
        color: 'green'
      };
    case 'warning':
    case 'pending':
      return {
        label: status === 'pending' ? 'Pending' : 'Warning',
        variant: 'warning',
        color: 'amber'
      };
    case 'critical':
    case 'error':
      return {
        label: status === 'error' ? 'Error' : 'Critical',
        variant: 'destructive',
        color: 'red'
      };
    case 'inactive':
      return {
        label: 'Inactive',
        variant: 'secondary',
        color: 'gray'
      };
    case 'archived':
      return {
        label: 'Archived',
        variant: 'outline',
        color: 'gray'
      };
    case 'unknown':
    default:
      return {
        label: 'Unknown',
        variant: 'outline',
        color: 'gray'
      };
  }
}
