
import React from 'react';

export default function ResponsiveSystemPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Responsive System</h1>
      <p className="text-gray-600 mb-8">
        A comprehensive system for building responsive components
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Container query demo */}
        <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-3">Container Queries</h2>
          <p className="text-gray-600">
            Components that respond to their container size rather than viewport size.
          </p>
        </div>
        
        {/* Responsive text demo */}
        <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-3">Responsive Typography</h2>
          <p className="text-gray-600">
            Text that adjusts size, weight, and spacing based on viewport or container.
          </p>
        </div>
        
        {/* Adaptive layout demo */}
        <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-3">Adaptive Layouts</h2>
          <p className="text-gray-600">
            Layouts that change structure based on available space.
          </p>
        </div>
      </div>
    </div>
  );
}
