
interface FeatureItemProps {
  label: string;
  colorClass?: string;
  isMobile?: boolean;
}

export const FeatureItem = ({ 
  label, 
  colorClass = "bg-indigo-500", 
  isMobile = false 
}: FeatureItemProps) => {
  return (
    <div className="flex items-center">
      <div className={`${colorClass} text-white rounded-full p-1 mr-2`}>
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className={isMobile ? "text-sm" : ""}>{label}</span>
    </div>
  );
};
