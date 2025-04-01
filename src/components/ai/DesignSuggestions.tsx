
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface FormValues {
  prompt: string;
  industry: string;
  style: string;
}

const DesignSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    defaultValues: {
      prompt: "",
      industry: "",
      style: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to use the AI design suggestions feature.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSuggestions(null);

    try {
      const { data, error } = await supabase.functions.invoke("design-suggestions", {
        body: {
          prompt: values.prompt,
          industry: values.industry || undefined,
          style: values.style || undefined,
        },
      });

      if (error) {
        throw error;
      }

      setSuggestions(data.suggestions);
      toast({
        title: "Suggestions generated",
        description: "AI design suggestions have been generated successfully.",
      });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        title: "Failed to generate suggestions",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>AI Design Suggestions</CardTitle>
        <CardDescription>
          Get intelligent design recommendations for your project by describing what you need.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What design help do you need?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="E.g., I need a color scheme for a tech startup website that conveys innovation and trust."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry (Optional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Any industry</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Design Style (Optional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Any style</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="playful">Playful</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="vintage">Vintage/Retro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating suggestions...
                </>
              ) : (
                "Generate Design Suggestions"
              )}
            </Button>
          </form>
        </Form>

        {suggestions && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">AI Suggestions:</h3>
            <div className="bg-muted p-4 rounded-md whitespace-pre-line">
              {suggestions}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DesignSuggestions;
