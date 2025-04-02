
import { InfoIcon } from 'lucide-react';

const GeographicMapPlaceholder = () => {
  return (
    <div className="flex items-center justify-center h-[500px] bg-gray-50 border rounded-md">
      <div className="text-center max-w-md p-6">
        <div className="inline-flex items-center justify-center bg-blue-100 p-3 rounded-full mb-4">
          <InfoIcon className="h-6 w-6 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">Geographic Map Coming Soon</h3>
        <p className="text-gray-600 mb-3">
          This feature will display user interactions on a geographic map when fully implemented.
        </p>
        <p className="text-sm text-gray-500">
          Location data collection is not yet active. When implemented, you'll be able to view interaction 
          patterns based on user location.
        </p>
      </div>
    </div>
  );
};

export default GeographicMapPlaceholder;
