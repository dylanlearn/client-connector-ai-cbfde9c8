
import { Badge } from "@/components/ui/badge";
import { StatusType, getStatusConfig } from "@/utils/status-utils";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  customLabel?: string;
}

/**
 * A reusable status badge component that applies consistent styling based on status type
 */
export function StatusBadge({ status, className, customLabel }: StatusBadgeProps) {
  const { label, variant, color } = getStatusConfig(status);
  
  return (
    <Badge 
      variant={variant} 
      className={className}
    >
      {customLabel || label}
    </Badge>
  );
}
