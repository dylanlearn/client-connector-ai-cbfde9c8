
import { PaintBucket } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";
import TemplateCard from "./TemplateCard";

interface TemplateGridProps {
  templates: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    previewImageUrl: string;
  }>;
  onPurchaseClick: (template: any) => void;
}

const TemplateGrid = ({ templates, onPurchaseClick }: TemplateGridProps) => {
  if (!templates.length) {
    return (
      <EmptyState 
        title="Coming Soon"
        description="Our template marketplace will be available shortly. Stay tuned!"
        buttonText="Create Custom Template"
        buttonAction={() => {}}
        icon={PaintBucket}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard 
          key={template.id} 
          template={template} 
          onPurchaseClick={onPurchaseClick} 
        />
      ))}
    </div>
  );
};

export default TemplateGrid;
