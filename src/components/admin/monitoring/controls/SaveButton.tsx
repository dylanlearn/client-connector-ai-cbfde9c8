
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  isSaving: boolean;
  onSave: () => void;
}

export function SaveButton({ isSaving, onSave }: SaveButtonProps) {
  return (
    <Button 
      disabled={isSaving}
      onClick={onSave}
      className="w-full sm:w-auto"
    >
      <Save className="h-4 w-4 mr-2" />
      {isSaving ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}
