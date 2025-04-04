
import React from 'react';
import { Pencil, FilePlus, Clock } from 'lucide-react';
import { Project } from '@/types/project';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProjectNotes from '../components/ProjectNotes';
import { formatDistanceToNow } from 'date-fns';

interface ProjectSummaryTabProps {
  project: Project;
}

const ProjectSummaryTab: React.FC<ProjectSummaryTabProps> = ({ project }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Project Overview</CardTitle>
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Client</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.client_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Client Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.client_email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Project Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{project.project_type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{project.status}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">Project Notes</CardTitle>
            <Button variant="ghost" size="sm">
              <FilePlus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </CardHeader>
          <CardContent>
            <ProjectNotes projectId={project.id} />
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Project Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative pl-6 pb-6 border-l-2 border-gray-200">
              <div className="absolute -left-[9px] top-0">
                <div className="bg-blue-500 rounded-full h-4 w-4" />
              </div>
              <div className="ml-2">
                <p className="font-medium">Project Created</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="relative pl-6 pb-6 border-l-2 border-gray-200">
              <div className="absolute -left-[9px] top-0">
                <div className="bg-green-500 rounded-full h-4 w-4" />
              </div>
              <div className="ml-2">
                <p className="font-medium">Intake Form Completed</p>
                <p className="text-sm text-gray-500">2 days ago</p>
              </div>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-0">
                <div className="bg-purple-500 rounded-full h-4 w-4" />
              </div>
              <div className="ml-2">
                <p className="font-medium">Design Selection</p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              <Clock className="h-4 w-4 mr-2" />
              View Complete Timeline
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectSummaryTab;
