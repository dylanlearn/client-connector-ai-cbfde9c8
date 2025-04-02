
import { FeatureItem } from "./FeatureItem";

interface FeaturesListProps {
  features: string[];
  colorClass?: string;
  isMobile?: boolean;
}

export const FeaturesList = ({ 
  features, 
  colorClass = "bg-indigo-500",
  isMobile = false 
}: FeaturesListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
      {features.map((feature, index) => (
        <FeatureItem 
          key={index} 
          label={feature} 
          colorClass={colorClass} 
          isMobile={isMobile} 
        />
      ))}
    </div>
  );
};
