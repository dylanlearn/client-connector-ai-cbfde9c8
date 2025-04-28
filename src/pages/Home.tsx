
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import TemplatesShowcase from '@/components/landing/TemplatesShowcase';

const Home = () => {
  return (
    <Layout showFormResumeHandler={false}>
      <div className="min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <TemplatesShowcase />
      </div>
    </Layout>
  );
};

export default Home;
