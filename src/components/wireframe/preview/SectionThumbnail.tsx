
import React from 'react';
import { Card } from '@/components/ui/card';

interface SectionThumbnailProps {
  section: any;
  isActive?: boolean;
  onClick?: () => void;
}

const SectionThumbnail: React.FC<SectionThumbnailProps> = ({
  section,
  isActive = false,
  onClick
}) => {
  return (
    <Card
      className={`p-2 cursor-pointer transition-all hover:shadow-md ${
        isActive ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <div className="aspect-video bg-muted rounded-sm overflow-hidden">
        <div className="p-2 text-xs text-muted-foreground">
          {section.title || section.type}
        </div>
      </div>
    </Card>
  );
};

export default SectionThumbnail;
