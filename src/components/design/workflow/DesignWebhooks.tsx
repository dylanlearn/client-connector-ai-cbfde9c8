
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw, Webhook, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DesignWorkflowService } from '@/services/design-workflow/design-workflow-service';
import type { DesignChangeHook } from '@/types/design-workflow';

interface DesignWebhooksProps {
  projectId: string;
}

const EVENT_TYPES = [
  { id: 'design_token_created', label: 'Design Token Created' },
  { id: 'design_token_updated', label: 'Design Token Updated' },
  { id: 'component_created', label: 'Component Created' },
  { id: 'component_updated', label: 'Component Updated' },
  { id: 'wireframe_created', label: 'Wireframe Created' },
  { id: 'wireframe_updated', label: 'Wireframe Updated' },
  { id: 'design_published', label: 'Design Published' },
];

export function DesignWebhooks({ projectId }: DesignWebhooksProps) {
  const [webhooks, setWebhooks] = useState<DesignChangeHook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [webhookType, setWebhookType] = useState('github');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      loadWebhooks();
    }
  }, [projectId]);

  const loadWebhooks = async () => {
    setIsLoading(true);
    try {
      const data = await DesignWorkflowService.getWebhooks(projectId);
      setWebhooks(data);
    } catch (error) {
      console.error("Error loading webhooks:", error);
      toast({
        title: "Error loading webhooks",
        description: "Failed to load webhook configurations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createWebhook = async () => {
    if (!webhookUrl || selectedEvents.length === 0) return;

    setIsCreating(true);
    try {
      await DesignWorkflowService.createWebhook(projectId, webhookType, webhookUrl, selectedEvents);
      setShowDialog(false);
      setWebhookType('github');
      setWebhookUrl('');
      setSelectedEvents([]);
      loadWebhooks();
      toast({
        title: "Webhook created",
        description: "Webhook has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating webhook:", error);
      toast({
        title: "Error creating webhook",
        description: "Failed to create webhook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const formatWebhookType = (type: string) => {
    switch (type) {
      case 'github':
        return 'GitHub';
      case 'gitlab':
        return 'GitLab';
      case 'jira':
        return 'Jira';
      case 'slack':
        return 'Slack';
      default:
        return 'Custom';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Integration Webhooks</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={loadWebhooks} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Webhook</DialogTitle>
                <DialogDescription>
                  Configure a webhook to notify external services when design changes occur.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="webhookType">Integration Type</Label>
                  <select
                    id="webhookType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={webhookType}
                    onChange={(e) => setWebhookType(e.target.value)}
                  >
                    <option value="github">GitHub</option>
                    <option value="gitlab">GitLab</option>
                    <option value="jira">Jira</option>
                    <option value="slack">Slack</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input 
                    id="webhookUrl" 
                    value={webhookUrl} 
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Trigger Events</Label>
                  <div className="grid gap-3">
                    {EVENT_TYPES.map(event => (
                      <div key={event.id} className="flex items-center space-x-2">
                        <Switch
                          id={`event-${event.id}`}
                          checked={selectedEvents.includes(event.id)}
                          onCheckedChange={() => toggleEvent(event.id)}
                        />
                        <Label htmlFor={`event-${event.id}`}>{event.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button 
                  onClick={createWebhook} 
                  disabled={isCreating || !webhookUrl || selectedEvents.length === 0}
                >
                  {isCreating ? "Creating..." : "Create Webhook"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : webhooks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No webhooks configured. Add a webhook to notify external services of design changes.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {webhooks.map(webhook => (
            <Card key={webhook.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Webhook className="h-4 w-4" />
                      <h3 className="font-semibold">{formatWebhookType(webhook.hook_type)} Integration</h3>
                      <Badge variant={webhook.is_active ? "default" : "outline"}>
                        {webhook.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm font-mono truncate max-w-md">
                      {webhook.webhook_url}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {webhook.event_types.map(event => (
                        <Badge key={event} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-x-2">
                    <Switch
                      checked={webhook.is_active}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
