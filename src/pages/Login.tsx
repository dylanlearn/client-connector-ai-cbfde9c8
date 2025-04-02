
import { useState, useEffect } from "react";
import { useNavigate, Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth"; 
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getPostLoginRedirect } from "@/utils/auth-utils";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [showConfirmationSuccess, setShowConfirmationSuccess] = useState(false);
  const [showSubscriptionNeeded, setShowSubscriptionNeeded] = useState(false);
  const isMobile = useIsMobile();
  const { signIn, signInWithGoogle, isLoading, user, profile } = useAuth();
  
  // Get the redirect path from location state, default to /dashboard
  const from = (location.state as { from?: string })?.from || "/dashboard";

  // Check URL parameters
  useEffect(() => {
    // Handle email confirmation success
    const confirmed = searchParams.get('confirmed');
    if (confirmed === 'true') {
      setShowConfirmationSuccess(true);
      toast({
        title: "Email confirmed",
        description: "Your email has been successfully confirmed. You can now sign in.",
        variant: "default",
      });
    }
    
    // Handle subscription needed notification
    const needSubscription = searchParams.get('needSubscription');
    if (needSubscription === 'true') {
      setShowSubscriptionNeeded(true);
      toast({
        title: "Subscription Required",
        description: "You need an active subscription to access the dashboard.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  // If user is already logged in, redirect to the appropriate destination
  if (user) {
    console.log("User logged in, profile:", profile);
    const redirectPath = getPostLoginRedirect(profile, from);
    console.log("Redirecting to:", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await signIn(email, password);
      // The redirect will happen automatically due to the Navigate component above
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleError(null);
      await signInWithGoogle();
      // The redirect will happen via the Supabase OAuth flow
    } catch (error: any) {
      console.error("Google login error:", error);
      setGoogleError(error?.message || "Failed to connect to Google. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4 w-full overflow-x-hidden">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-indigo-600" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-bold text-xl">DezignSync</span>
          </Link>
        </div>

        <Card className={isMobile ? "shadow-md" : "shadow-lg"}>
          <CardHeader className={isMobile ? "px-4 py-5" : ""}>
            <CardTitle className={isMobile ? "text-xl" : "text-2xl"}>Welcome back</CardTitle>
            <CardDescription className={isMobile ? "text-sm" : ""}>Sign in to your DezignSync account</CardDescription>
          </CardHeader>
          
          <CardContent className={`space-y-4 ${isMobile ? "px-4" : ""}`}>
            {googleError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{googleError}</AlertDescription>
              </Alert>
            )}
            
            {showConfirmationSuccess && (
              <Alert variant="default" className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">Your email has been confirmed successfully. You can now sign in.</AlertDescription>
              </Alert>
            )}
            
            {showSubscriptionNeeded && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>You need an active subscription to access the dashboard. Please subscribe to a plan.</AlertDescription>
              </Alert>
            )}
            
            {/* Google Sign In Button */}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Sign in with Google
            </Button>
            
            <div className="flex items-center gap-2 my-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className={`flex flex-col space-y-4 ${isMobile ? "px-4 pb-5" : ""}`}>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
