
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface SaveButtonProps {
  isSaving: boolean;
  onSave: () => void;
  text?: string;
}

export function SaveButton({
  isSaving,
  onSave,
  text = "Save Changes"
}: SaveButtonProps) {
  return (
    <Button
      onClick={onSave}
      disabled={isSaving}
    >
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          {text}
        </>
      )}
    </Button>
  );
}
