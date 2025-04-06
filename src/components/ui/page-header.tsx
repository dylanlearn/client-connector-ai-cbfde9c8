
import React from 'react';

interface PageHeaderProps {
  heading: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ heading, description }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
      {description && (
        <p className="text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
};

