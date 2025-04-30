
import React from 'react';
import Layout from '@/components/layout/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Home Page</h1>
        <p className="text-muted-foreground mb-8">Welcome to our wireframe generation tool</p>
      </div>
    </Layout>
  );
};

export default Home;
