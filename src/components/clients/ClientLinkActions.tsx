
import { useState } from "react";
import { Check, Copy, MailIcon, Phone, RotateCcw, Trash2, Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteClientLink, resendClientLink, updateClientLinkStatus } from "@/utils/client-service";

interface ClientLinkActionsProps {
  linkId: string;
  token: string;
  designerId: string;
  clientEmail: string;
  clientPhone: string | null;
  status: 'active' | 'expired' | 'completed';
  onRefresh: () => void;
}

export default function ClientLinkActions({
  linkId,
  token,
  designerId,
  clientEmail,
  clientPhone,
  status,
  onRefresh
}: ClientLinkActionsProps) {
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'active' | 'completed' | 'expired'>(status);
  
  const clientHubURL = `${window.location.origin}/client-hub?clientToken=${token}&designerId=${designerId}`;
  
  const copyLink = () => {
    navigator.clipboard.writeText(clientHubURL);
    toast.success("Link copied to clipboard");
  };
  
  const resendLink = async (type: 'email' | 'sms') => {
    const recipient = type === 'email' ? clientEmail : clientPhone;
    if (!recipient) {
      toast.error(`No ${type === 'email' ? 'email' : 'phone number'} available`);
      return;
    }
    
    setIsLoading({ ...isLoading, [type]: true });
    try {
      await resendClientLink(linkId, type, recipient);
      toast.success(`Link sent to client via ${type === 'email' ? 'email' : 'SMS'}`);
    } catch (error) {
      console.error(`Error resending link via ${type}:`, error);
      toast.error(`Failed to send link. Please try again.`);
    } finally {
      setIsLoading({ ...isLoading, [type]: false });
    }
  };

  const handleStatusChange = async (newStatus: 'active' | 'completed' | 'expired') => {
    setIsLoading({ ...isLoading, status: true });
    try {
      await updateClientLinkStatus(linkId, newStatus);
      toast.success(`Client status updated to ${newStatus}`);
      onRefresh();
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error(`Error updating client status:`, error);
      toast.error(`Failed to update status. Please try again.`);
    } finally {
      setIsLoading({ ...isLoading, status: false });
    }
  };
  
  const handleDeleteLink = async () => {
    setIsLoading({ ...isLoading, delete: true });
    try {
      await deleteClientLink(linkId);
      toast.success("Client link deleted successfully");
      onRefresh();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting client link:", error);
      toast.error("Failed to delete client link. Please try again.");
    } finally {
      setIsLoading({ ...isLoading, delete: false });
    }
  };
  
  const isActiveLink = status === 'active';
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <span className="sr-only">Open actions menu</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={copyLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </DropdownMenuItem>
          
          {isActiveLink && (
            <>
              <DropdownMenuItem 
                onClick={() => resendLink('email')}
                disabled={isLoading.email}
              >
                {isLoading.email ? (
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MailIcon className="mr-2 h-4 w-4" />
                )}
                Resend Email
              </DropdownMenuItem>
              
              {clientPhone && (
                <DropdownMenuItem 
                  onClick={() => resendLink('sms')}
                  disabled={isLoading.sms}
                >
                  {isLoading.sms ? (
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Phone className="mr-2 h-4 w-4" />
                  )}
                  Resend SMS
                </DropdownMenuItem>
              )}
            </>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => {
            setNewStatus(status === 'active' ? 'completed' : 'active');
            setIsStatusDialogOpen(true);
          }}>
            {status === 'active' ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Completed
              </>
            ) : status === 'completed' ? (
              <>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reactivate Link
              </>
            ) : (
              <>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reactivate Link
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this client link and all associated tasks. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteLink();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading.delete ? (
                <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Status Change Dialog */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {status === 'active' ? 'Mark as Completed?' : 'Reactivate Link?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {status === 'active' 
                ? "This will mark the client's tasks as completed. You can reactivate it later if needed."
                : "This will reactivate the client link, making it accessible again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleStatusChange(newStatus);
              }}
              className={status === 'active' ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isLoading.status ? (
                <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
              ) : status === 'active' ? (
                "Mark as Completed"
              ) : (
                "Reactivate"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
