
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DesignOption } from "./VisualPicker";

interface SelectionLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  attemptedSelection: DesignOption | null;
  maxSelectionsByCategory: Record<string, number>;
}

const SelectionLimitDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  attemptedSelection,
  maxSelectionsByCategory
}: SelectionLimitDialogProps) => {
  if (!attemptedSelection) return null;
  
  const maxForCategory = maxSelectionsByCategory[attemptedSelection.category] || 4;
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Category Selection Limit Reached</AlertDialogTitle>
          <AlertDialogDescription>
            You've already selected the maximum of {maxForCategory} {attemptedSelection.category} elements.
            Please remove an existing {attemptedSelection.category} selection first if you want to add a new one.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SelectionLimitDialog;
