
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { ExternalLink, Github, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast: uiToast } = useToast();

  const { signIn, signInWithGoogle, user } = useAuth();
  
  // Get the intended destination from location state, default to /dashboard
  const from = location.state?.from || "/dashboard";

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleLoginWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setErrorMessage('');
      setIsLoading(true);
      
      await signIn(email, password);
      
      // Log success
      console.log('Login successful');
      
      // Show success toast
      toast.success('Login successful');
      
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      setErrorMessage('');
      setIsLoading(true);
      
      console.log('Starting Google login process');
      await signInWithGoogle();
      console.log('Google login initiated');
      
      // Note: The redirect will be handled by the OAuth flow, 
      // we don't need to navigate programmatically
    } catch (error: any) {
      console.error('Google login error:', error);
      setErrorMessage(error.message || 'Failed to login with Google');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Welcome to DezignSync</h1>
        <p className="text-muted-foreground mt-2">Sign in to access your account</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleLoginWithGoogle} disabled={isLoading} className="w-full">
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <form onSubmit={handleLoginWithEmail} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                type="email" 
                id="email" 
                name="email"
                placeholder="Enter your email" 
                value={email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/reset-password" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                type="password" 
                id="password" 
                name="password"
                placeholder="Enter your password" 
                value={password}
                onChange={handleInputChange}
                required
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login with Email'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </div>
          <Button 
            variant="outline" 
            className="w-full text-sm" 
            onClick={() => navigate("/client-access")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Access as Client
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
