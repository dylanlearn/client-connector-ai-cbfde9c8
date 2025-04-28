
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useCompetitors } from '@/hooks/use-competitors';
import { AlertMessage } from '@/components/ui/alert-message';

export function CompetitorList() {
  const { competitors, isLoading, error } = useCompetitors();

  if (error) {
    return <AlertMessage type="error" title="Error loading competitors">{error.message}</AlertMessage>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Competitors</h2>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Competitor</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : competitors?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>No competitors added yet. Add your first competitor to begin competitive analysis.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors?.map((competitor) => (
            <Card key={competitor.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>{competitor.name}</span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{competitor.description}</p>
                <div className="text-sm text-muted-foreground">Industry: {competitor.industry}</div>
                {competitor.website_url && (
                  <a 
                    href={competitor.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center mt-2 text-primary text-sm hover:underline"
                  >
                    Visit Website <ExternalLink size={14} className="ml-1" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
