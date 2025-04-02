
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/use-subscription";
import { Loader2 } from "lucide-react";

export function RedeemInvitation() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { refreshSubscription } = useSubscription();

  const handleRedeemInvitation = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter an invitation code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("redeem-invitation", {
        body: { code: code.trim() },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Success!",
        description: data.message,
      });

      // Refresh subscription info
      await refreshSubscription();

      // Clear the code input
      setCode("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to redeem invitation code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redeem Invitation</CardTitle>
        <CardDescription>
          Enter your invitation code to activate special features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Enter invitation code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="uppercase"
            maxLength={10}
          />
          <Button onClick={handleRedeemInvitation} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Redeem
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Invitation codes can be redeemed only once per account.
      </CardFooter>
    </Card>
  );
}
