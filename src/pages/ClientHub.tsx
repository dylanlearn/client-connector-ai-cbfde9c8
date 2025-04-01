
import React from 'react';
import { useClientHub } from '@/hooks/use-client-hub';
import LoadingView from '@/components/client-hub/LoadingView';
import AccessDeniedView from '@/components/client-hub/AccessDeniedView';
import TasksSection from '@/components/client-hub/TasksSection';
import WhatNextSection from '@/components/client-hub/WhatNextSection';
import ClientHubHeader from '@/components/client-hub/ClientHubHeader';

const ClientHubPage = () => {
  const {
    isValidatingAccess,
    accessDenied,
    isLoadingTasks,
    taskStatus,
    tasks,
    handleTaskButtonClick
  } = useClientHub();

  if (isValidatingAccess) {
    return <LoadingView message="Validating your access..." />;
  }

  if (accessDenied) {
    return <AccessDeniedView />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ClientHubHeader />

        <TasksSection 
          isLoading={isLoadingTasks}
          taskStatus={taskStatus}
          tasks={tasks}
          onTaskButtonClick={handleTaskButtonClick}
        />

        <WhatNextSection />
      </div>
    </div>
  );
};

export default ClientHubPage;
