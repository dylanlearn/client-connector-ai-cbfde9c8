
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingViewProps } from "@/types/client";

const LoadingView: React.FC<LoadingViewProps> = ({ message }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {message && <p className="text-gray-500 mb-4">{message}</p>}
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-72 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-64 mb-8" />
      </div>
    </div>
  );
};

export default LoadingView;
