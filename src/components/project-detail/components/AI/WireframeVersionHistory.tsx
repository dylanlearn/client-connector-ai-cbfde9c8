
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { WireframeVersion } from '@/types/wireframe';
import { useWireframeVersionControl } from '@/hooks/wireframe/use-wireframe-version-control';
import { Loader2 } from 'lucide-react';

interface WireframeVersionHistoryProps {
  projectId: string;
  wireframeId: string;
  onVersionSelect: (versionId: string) => void;
}

const WireframeVersionHistory: React.FC<WireframeVersionHistoryProps> = ({
  projectId,
  wireframeId,
  onVersionSelect
}) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const { versions, loadWireframeVersions, isLoading } = useWireframeVersionControl();

  useEffect(() => {
    if (projectId && wireframeId) {
      loadWireframeVersions(projectId, wireframeId);
    }
  }, [projectId, wireframeId, loadWireframeVersions]);

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersion(versionId);
    onVersionSelect(versionId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
        <CardDescription>
          Browse and select previous versions of this wireframe
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading versions...
          </div>
        ) : versions && versions.length > 0 ? (
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Version</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version) => (
                  <TableRow
                    key={version.id}
                    onClick={() => handleVersionSelect(version.id)}
                    className={`cursor-pointer hover:bg-secondary ${selectedVersion === version.id ? 'bg-accent' : ''}`}
                  >
                    <TableCell className="font-medium">{version.version_number || version.version}</TableCell>
                    <TableCell>{new Date(version.created_at || version.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{version.change_description || 'No description'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            No versions available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WireframeVersionHistory;
