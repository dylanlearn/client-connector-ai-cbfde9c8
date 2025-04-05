
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
  
  // Convert variant to a type that Badge accepts
  // This ensures the variant is compatible with the Badge component
  const badgeVariant = variant === "warning" ? "default" : variant;
  
  return (
    <Badge 
      variant={badgeVariant} 
      className={className}
    >
      {customLabel || label}
    </Badge>
  );
}
