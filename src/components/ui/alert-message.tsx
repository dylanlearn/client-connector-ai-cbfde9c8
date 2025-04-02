
import { ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "info" | "success" | "warning" | "error";

interface AlertMessageProps {
  type: AlertType;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function AlertMessage({ 
  type = "info", 
  title, 
  children, 
  className 
}: AlertMessageProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 text-green-800";
      case "warning":
        return "border-amber-200 bg-amber-50 text-amber-800";
      case "error":
        return "border-red-200 bg-red-50 text-red-800";
      case "info":
      default:
        return "border-blue-200 bg-blue-50 text-blue-800";
    }
  };

  return (
    <Alert className={cn(getStyles(), className)}>
      {getIcon()}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
