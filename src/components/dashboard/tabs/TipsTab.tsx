
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const TipsTab = () => {
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Tips</CardTitle>
        <CardDescription>Get the most out of DezignSync</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className={isMobile ? "text-sm" : ""}>Create a project and generate a client link</span>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className={isMobile ? "text-sm" : ""}>Customize your questionnaire for better results</span>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className={isMobile ? "text-sm" : ""}>Browse templates to speed up your workflow</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default TipsTab;
