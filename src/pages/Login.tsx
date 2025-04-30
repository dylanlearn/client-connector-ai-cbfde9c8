
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout/AuthLayout';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLoggingIn) {
        await signIn(email, password);
        navigate('/dashboard');
      } else {
        await signUp(email, password);
        toast({
          title: "Account created",
          description: "Your account has been created successfully. Please check your email for verification.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: isLoggingIn ? "Login failed" : "Sign up failed",
        description: error.message || "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{isLoggingIn ? "Login" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLoggingIn 
              ? "Enter your email and password to access your account" 
              : "Fill in the information below to create your account"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (isLoggingIn ? "Logging in..." : "Creating account...") 
                : (isLoggingIn ? "Login" : "Create Account")}
            </Button>
            <Button 
              type="button" 
              variant="link" 
              className="w-full"
              onClick={() => setIsLoggingIn(!isLoggingIn)}
            >
              {isLoggingIn 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
