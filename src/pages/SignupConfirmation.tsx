import { useLocation, Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw } from "lucide-react";

const SignupConfirmation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const email = location.state?.email || "your email";

  if (user) {
    return <Navigate to="/dashboard" />;
  }

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

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <Mail className="h-6 w-6 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              We've sent a confirmation link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-gray-600">
              Please check your email inbox and click on the confirmation link to activate your account. 
              If you don't see the email, check your spam folder.
            </p>
            
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-md">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> After confirming your email, you'll be redirected to the login page 
                where you can sign in with your credentials.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              <Button variant="outline" className="gap-2" asChild>
                <Link to="/login">
                  <RefreshCw className="h-4 w-4" />
                  Go to login page
                </Link>
              </Button>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              Didn't receive an email? Check your spam folder or{" "}
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 font-medium">
                try signing up again
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupConfirmation;
