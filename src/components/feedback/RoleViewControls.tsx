
import React from 'react';
import { ViewRole } from '@/types/feedback';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useViewPreferences } from '@/hooks/useViewPreferences';

export function RoleViewControls() {
  const { preferences, isLoading, updateViewRole, updatePreferences } = useViewPreferences();

  if (isLoading || !preferences) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>View Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">View As</label>
          <Select
            value={preferences.viewRole}
            onValueChange={(value: ViewRole) => updateViewRole(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Show Annotations</label>
          <Switch
            checked={preferences.showAnnotations}
            onCheckedChange={(checked) => 
              updatePreferences({ showAnnotations: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Show Developer Notes</label>
          <Switch
            checked={preferences.showDeveloperNotes}
            onCheckedChange={(checked) =>
              updatePreferences({ showDeveloperNotes: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Show Client Feedback</label>
          <Switch
            checked={preferences.showClientFeedback}
            onCheckedChange={(checked) =>
              updatePreferences({ showClientFeedback: checked })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
