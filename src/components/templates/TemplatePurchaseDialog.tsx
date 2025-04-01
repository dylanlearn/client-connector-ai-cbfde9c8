
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PurchaseFormValues } from "@/hooks/use-template-purchase";

// Form validation schema
const purchaseFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

interface TemplatePurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: {
    id: string;
    title: string;
    description: string;
    price: number;
  };
  onPurchaseComplete: (data: PurchaseFormValues & { guestUserId?: string }) => void;
  isProcessing?: boolean;
}

const TemplatePurchaseDialog = ({ 
  open, 
  onOpenChange, 
  template, 
  onPurchaseComplete,
  isProcessing = false
}: TemplatePurchaseDialogProps) => {
  const { user } = useAuth();

  // Initialize the form with user data if available
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      name: user?.user_metadata?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: PurchaseFormValues) => {
    try {
      // Generate a UUID-like identifier for guest purchases
      const guestUserId = !user ? `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}` : undefined;
      
      onPurchaseComplete({
        ...data,
        guestUserId,
      });
      
      form.reset();
    } catch (error) {
      console.error("Error processing purchase:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Template</DialogTitle>
          <DialogDescription>
            You're purchasing {template.title} for ${template.price}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="you@example.com" 
                      {...field} 
                      disabled={!!user}
                      required 
                    />
                  </FormControl>
                  {user && (
                    <p className="text-xs text-muted-foreground">
                      Using email from your account
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4 bg-muted p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span>Template:</span>
                <span>{template.title}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${template.price}</span>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Complete Purchase"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePurchaseDialog;
