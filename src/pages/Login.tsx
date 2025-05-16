
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { getRedirectUrl } from '@/utils/auth-utils';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect URL from query params or default to dashboard
  const redirectUrl = getRedirectUrl();
  
  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      navigate(redirectUrl);
    }
  }, [user, navigate, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate(redirectUrl);
      }
    } catch (error) {
      toast({
        title: "An unexpected error occurred",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Redirect happens automatically via OAuth flow
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Sign In
            </Button>
          </form>

          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            type="button"
            className="w-full mt-4 flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.6959 6.36167H15.2959V6.33333H8.00008V9.66667H12.3834C11.8417 11.4917 10.0834 12.6667 8.00008 12.6667C5.42508 12.6667 3.33341 10.575 3.33341 8.00001C3.33341 5.42501 5.42508 3.33334 8.00008 3.33334C9.19175 3.33334 10.2834 3.78334 11.1084 4.52501L13.5751 2.05834C12.1501 0.783339 10.1834 0 8.00008 0C3.58341 0 0.000076294 3.58334 0.000076294 8.00001C0.000076294 12.4167 3.58341 16 8.00008 16C12.4167 16 16.0001 12.4167 16.0001 8.00001C16.0001 7.44167 15.9501 6.89167 15.6959 6.36167Z" fill="#FFC107"/>
                <path d="M0.847656 4.27081L3.66766 6.36748C4.36766 4.60915 6.04266 3.33331 8.00016 3.33331C9.19182 3.33331 10.2835 3.78331 11.1085 4.52498L13.5751 2.05831C12.1501 0.783312 10.1835 -2.19345e-05 8.00016 -2.19345e-05C4.84182 -2.19345e-05 2.10766 1.69165 0.847656 4.27081Z" fill="#FF3D00"/>
                <path d="M8.00009 16C10.1418 16 12.0751 15.2417 13.5084 13.9892L10.8084 11.65C10.0084 12.2667 9.02507 12.6667 8.00009 12.6667C5.92507 12.6667 4.17507 11.5083 3.62507 9.69167L0.780762 11.9417C2.02509 14.4917 4.80009 16 8.00009 16Z" fill="#4CAF50"/>
                <path d="M15.6958 6.36164H15.2958V6.33331H7.99984V9.66664H12.3832C12.1249 10.5333 11.5582 11.2833 10.8082 11.65L10.8091 11.6492L13.5091 13.9884C13.3499 14.1384 16 12.3333 16 8.00001C16 7.44167 15.95 6.89164 15.6958 6.36164Z" fill="#1976D2"/>
              </svg>
            )}
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
