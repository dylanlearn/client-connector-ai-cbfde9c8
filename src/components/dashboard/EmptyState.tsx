
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  buttonAction: () => void;
  icon: LucideIcon;
}

const EmptyState = ({ title, description, buttonText, buttonAction, icon: Icon }: EmptyStateProps) => {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
      <Icon className="mx-auto h-12 w-12 text-gray-400 mb-6" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      <Button onClick={buttonAction}>{buttonText}</Button>
    </div>
  );
};

export default EmptyState;
