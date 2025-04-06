import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { useAdminStatus } from '@/hooks/use-admin-status';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { signIn, signInWithGoogle } = useAuth();
  const { isAdmin, verifyAdminStatus } = useAdminStatus();

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
      
      // Redirect to dashboard
      navigate('/dashboard');
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
      
      await signInWithGoogle();
      
    } catch (error: any) {
      console.error('Google login error:', error);
      setErrorMessage(error.message || 'Failed to login with Google');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              type="email" 
              id="email" 
              name="email"
              placeholder="Enter your email" 
              value={email}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              type="password" 
              id="password" 
              name="password"
              placeholder="Enter your password" 
              value={password}
              onChange={handleInputChange}
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleLoginWithEmail} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleLoginWithGoogle} disabled={isLoading}>
            {isLoading ? 'Logging in with Google...' : 'Login with Google'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
