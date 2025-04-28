
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { TestSuitesList } from '@/components/quality-assurance/TestSuitesList';
import { ValidationRulesList } from '@/components/quality-assurance/ValidationRulesList';
import { PerformanceMetrics } from '@/components/quality-assurance/PerformanceMetrics';

export default function QualityDashboard() {
  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-3xl font-bold mb-8">Quality Assurance Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TestSuitesList />
          <ValidationRulesList />
        </div>
        
        <PerformanceMetrics />
      </div>
    </Layout>
  );
}
