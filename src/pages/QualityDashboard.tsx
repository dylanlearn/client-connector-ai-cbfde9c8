
import React from 'react';
import Layout from '@/components/layout/Layout';
import { TestSuitesList } from '@/components/quality-assurance/TestSuitesList';
import { ValidationRulesList } from '@/components/quality-assurance/ValidationRulesList';
import { PerformanceMetrics } from '@/components/quality-assurance/PerformanceMetrics';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Accessibility, Layers, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QualityDashboard() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Quality Assurance Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Monitor className="mr-2 h-5 w-5" />
                Cross-Browser Testing
              </CardTitle>
              <CardDescription>Test wireframes across browsers and devices</CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              <p className="text-sm text-muted-foreground mb-3">
                Verify rendering and behavior across different browsers and screen sizes.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/quality-dashboard?tab=browser')}>
                Go to Browser Testing
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Accessibility className="mr-2 h-5 w-5" />
                Accessibility Compliance
              </CardTitle>
              <CardDescription>WCAG standards and screen reader testing</CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              <p className="text-sm text-muted-foreground mb-3">
                Ensure wireframes meet accessibility standards for all users.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/quality-dashboard?tab=accessibility')}>
                Go to Accessibility Testing
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Layers className="mr-2 h-5 w-5" />
                Design Consistency
              </CardTitle>
              <CardDescription>Verify design consistency across wireframes</CardDescription>
            </CardHeader>
            <CardContent className="pt-1">
              <p className="text-sm text-muted-foreground mb-3">
                Check for consistent design patterns, colors, and spacing.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/quality-dashboard?tab=consistency')}>
                Go to Consistency Verification
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TestSuitesList />
          <ValidationRulesList />
        </div>
        
        <div className="mt-8">
          <PerformanceMetrics />
        </div>
      </div>
    </Layout>
  );
}
