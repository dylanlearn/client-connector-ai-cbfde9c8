
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibilityStandard } from "@/types/compliance";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface AccessibilityStandardsViewProps {
  standards: AccessibilityStandard[];
  workspaceId: string;
}

export function AccessibilityStandardsView({ standards, workspaceId }: AccessibilityStandardsViewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Accessibility Standards</CardTitle>
          <CardDescription>
            WCAG, ADA, and other accessibility requirements
          </CardDescription>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Standard
        </Button>
      </CardHeader>
      <CardContent>
        {standards.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {standards.map((standard, index) => (
              <AccordionItem key={standard.id} value={standard.id}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    {standard.is_active ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                    <span>{standard.standard_name}</span>
                    {!standard.workspace_id && (
                      <Badge variant="outline" className="ml-2">Global</Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      {standard.description || 'No description provided.'}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Requirements:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {standard.requirements && standard.requirements.length > 0 ? (
                          standard.requirements.map((requirement, idx) => (
                            <li key={idx}>
                              {requirement.name || requirement.id || `Requirement ${idx + 1}`}
                              {requirement.description && (
                                <span className="text-sm text-muted-foreground"> - {requirement.description}</span>
                              )}
                            </li>
                          ))
                        ) : (
                          <li className="text-muted-foreground">No specific requirements defined.</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Edit Standard
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">No Accessibility Standards</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Define accessibility standards to enforce compliance with WCAG, ADA, and other requirements.
            </p>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Standard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
