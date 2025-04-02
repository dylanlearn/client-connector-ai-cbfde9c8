
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to the pricing page
    navigate('/pricing', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-indigo-600" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-bold text-xl">DezignSync</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Redirecting...</CardTitle>
            <CardDescription>
              Please wait while we redirect you to our pricing page.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              To access DezignSync, you need to sign up for a subscription.
            </p>
            
            <Button 
              onClick={() => navigate('/pricing')}
              className="w-full"
            >
              View Pricing Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
