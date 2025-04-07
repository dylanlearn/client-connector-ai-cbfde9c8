
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface CreateInvitationFormProps {
  onInvitationCreated: () => void;
}

export function CreateInvitationForm({ onInvitationCreated }: CreateInvitationFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [plan, setPlan] = useState<"basic" | "pro">("pro");
  const [discountPercentage, setDiscountPercentage] = useState<number>(100);
  const [expiresInDays, setExpiresInDays] = useState<number>(30);
  const [maxUses, setMaxUses] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();

  const handleCreateInvitation = async () => {
    setIsCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-api", {
        body: {
          action: "create_invitation",
          plan,
          discountPercentage,
          expiresInDays,
          maxUses,
          notes,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Invitation code created successfully",
      });

      // Reset form
      setPlan("pro");
      setDiscountPercentage(100);
      setExpiresInDays(30);
      setMaxUses(1);
      setNotes("");

      // Notify parent component to refresh the list
      onInvitationCreated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create invitation code",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Invitation Code</CardTitle>
        <CardDescription>
          Generate invitation codes for users to get free or discounted subscriptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Plan</label>
            <Select value={plan} onValueChange={(value: any) => setPlan(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Discount %</label>
            <Select 
              value={discountPercentage.toString()} 
              onValueChange={(value) => setDiscountPercentage(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select discount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100% (Free)</SelectItem>
                <SelectItem value="75">75%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
                <SelectItem value="25">25%</SelectItem>
                <SelectItem value="20">20%</SelectItem>
                <SelectItem value="10">10%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Expires In (Days)</label>
            <Input
              type="number"
              min="1"
              max="365"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(parseInt(e.target.value) || 30)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Max Uses</label>
            <Input
              type="number"
              min="1"
              max="1000"
              value={maxUses}
              onChange={(e) => setMaxUses(parseInt(e.target.value) || 1)}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-1 block">Notes</label>
            <Textarea
              placeholder="Add optional notes about this invitation code"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreateInvitation} disabled={isCreating} className="ml-auto">
          {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Generate Invitation Code
        </Button>
      </CardFooter>
    </Card>
  );
}
