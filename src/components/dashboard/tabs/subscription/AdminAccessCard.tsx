
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeaturesList } from "./FeaturesList";

interface AdminAccessCardProps {
  isMobile: boolean;
}

export const AdminAccessCard = ({ isMobile }: AdminAccessCardProps) => {
  const navigate = useNavigate();
  
  const adminFeatures = [
    "Unlimited projects",
    "Advanced AI analysis",
    "Client readiness score",
    "Project analytics"
  ];
  
  return (
    <Card className="md:col-span-2">
      <CardHeader className={isMobile ? "px-4 py-4" : ""}>
        <CardTitle className={isMobile ? "text-lg" : ""}>Admin Access</CardTitle>
        <CardDescription className={isMobile ? "text-sm" : ""}>
          As an admin, you have access to all Sync Pro features
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? "px-4 pt-0 pb-4" : ""}>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 md:p-6 rounded-lg">
          <div className="text-center mb-4">
            <div className="font-bold text-lg md:text-xl text-green-700">Full Access Enabled</div>
            <p className="text-sm text-gray-600">You have admin privileges with access to all features</p>
          </div>
          
          <FeaturesList 
            features={adminFeatures} 
            colorClass="bg-green-500"
            isMobile={isMobile}
          />
          
          <div className="mt-4">
            <Button 
              className="w-full md:w-auto text-sm"
              variant="outline"
              onClick={() => navigate("/admin")} 
            >
              Go to Admin Panel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
