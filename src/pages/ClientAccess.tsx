
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ClientAccess = () => {
  const [clientLink, setClientLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if the link is valid
      if (!clientLink.trim()) {
        toast.error("Please enter a client access link");
        return;
      }
      
      // Try to extract client token and designer ID from the link
      let token = "";
      let designerId = "";
      
      try {
        const url = new URL(clientLink);
        const params = new URLSearchParams(url.search);
        token = params.get("clientToken") || "";
        designerId = params.get("designerId") || "";
      } catch (error) {
        // If the link is not a valid URL, check if it's just a token
        if (clientLink.length > 10) {
          token = clientLink;
        }
      }
      
      if (!token) {
        toast.error("Invalid client access link format");
        return;
      }
      
      // If we just have a token, try to find the corresponding designer ID
      if (token && !designerId) {
        try {
          const { data, error } = await supabase
            .from('client_access_links')
            .select('designer_id')
            .eq('token', token)
            .eq('status', 'active')
            .maybeSingle();
            
          if (error) throw error;
          
          if (data && data.designer_id) {
            designerId = data.designer_id;
          } else {
            toast.error("This access link has expired or is invalid");
            return;
          }
        } catch (error) {
          console.error("Error fetching designer ID:", error);
          toast.error("Unable to validate this access link");
          return;
        }
      }
      
      // If we have both token and designer ID, navigate to the client hub
      if (token && designerId) {
        navigate(`/client-hub?clientToken=${token}&designerId=${designerId}`);
        return;
      }
      
      toast.error("Invalid client access link");
    } catch (error) {
      console.error("Error processing client link:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Client Access</h1>
          <p className="mt-2 text-gray-600">
            Enter the access link provided by your designer to access your design hub.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Enter Access Link</CardTitle>
            <CardDescription>
              Paste the full URL or access code that was shared with you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="https://dezignsync.app/client-hub?clientToken=..."
                value={clientLink}
                onChange={(e) => setClientLink(e.target.value)}
                className="w-full"
                required
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Accessing..." : "Access Design Hub"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Alert className="mt-4">
              <AlertDescription>
                If you don't have an access link, please contact your designer to request one.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-6">
          <Button variant="link" onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientAccess;
