
import React from 'react';

const WhatNextSection: React.FC = () => {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
      <p className="text-gray-600 mb-4">
        After you complete these tasks, your designer will receive your preferences and feedback. 
        They'll use this information to create personalized design recommendations for your project.
      </p>
      <p className="text-gray-600">
        You'll be notified when your designer has updates to share with you. 
        Thank you for helping us understand your vision!
      </p>
    </div>
  );
};

export default WhatNextSection;
