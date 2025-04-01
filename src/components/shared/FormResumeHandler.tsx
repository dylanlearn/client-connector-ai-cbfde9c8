
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useIntakeForm } from "@/hooks/use-intake-form";
import { useState } from "react";

export default function FormResumeHandler() {
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { hasInProgressForm, clearFormData } = useIntakeForm();
  
  useEffect(() => {
    // Don't show resume dialog on the index page or already on intake form
    const isIndexPage = location.pathname === "/";
    const isAlreadyOnIntakeForm = location.pathname === "/intake";
    
    if (!isIndexPage && !isAlreadyOnIntakeForm && hasInProgressForm()) {
      setShowResumeDialog(true);
    }
  }, [location.pathname, hasInProgressForm]);

  const handleResumeForm = () => {
    navigate("/intake");
    setShowResumeDialog(false);
  };

  const handleIgnore = () => {
    setShowResumeDialog(false);
  };

  const handleClearForm = () => {
    clearFormData();
    setShowResumeDialog(false);
  };

  return (
    <AlertDialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resume Unfinished Form?</AlertDialogTitle>
          <AlertDialogDescription>
            You have an unfinished intake form. Would you like to resume where you left off?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex flex-col space-y-2 w-full sm:flex-row sm:space-y-0 sm:space-x-2">
            <AlertDialogCancel onClick={handleIgnore} className="sm:w-auto">
              Not Now
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleResumeForm} className="sm:w-auto">
              Resume Form
            </AlertDialogAction>
          </div>
          <button 
            onClick={handleClearForm}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear saved form data
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
