
import React, { ReactNode } from 'react';
import Layout from './Layout';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default DashboardLayout;
