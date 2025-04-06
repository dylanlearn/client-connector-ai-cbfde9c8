
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Palette, PenTool, LineChart, Layout } from "lucide-react";
import { CreativeStyleProfile, CreativeEnhancementService } from "@/services/ai/creative-enhancement-service";

interface CreativeProfileSelectorProps {
  selectedProfile: string;
  onProfileChange: (profileName: string) => void;
}

const CreativeProfileSelector: React.FC<CreativeProfileSelectorProps> = ({
  selectedProfile,
  onProfileChange
}) => {
  // Get available profiles
  const profiles = {
    wireframing: CreativeEnhancementService.getStyleProfile("wireframing"),
    designSuggestions: CreativeEnhancementService.getStyleProfile("designSuggestions"),
    contentCreation: CreativeEnhancementService.getStyleProfile("contentCreation"),
    feedbackAnalysis: CreativeEnhancementService.getStyleProfile("feedbackAnalysis"),
    default: CreativeEnhancementService.getStyleProfile("default")
  };

  // Helper function to render profile card
  const renderProfileCard = (profile: CreativeStyleProfile, icon: React.ReactNode) => (
    <Card className={`overflow-hidden transition-all ${
      profile.name === profiles[selectedProfile as keyof typeof profiles].name ? 
      'border-primary shadow-md' : 'border-border'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{profile.name}</CardTitle>
          <Badge variant={profile.name === profiles[selectedProfile as keyof typeof profiles].name ? "default" : "outline"}>
            {profile.creativityLevel}/10
          </Badge>
        </div>
        <CardDescription>{profile.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-1 mb-4">
          {profile.tonalKeywords.slice(0, 5).map((keyword, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Creativity</span>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${profile.creativityLevel * 10}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Decisiveness</span>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${profile.decisiveness * 10}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Articulation</span>
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${profile.articulation * 10}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={profile.name === profiles[selectedProfile as keyof typeof profiles].name ? "default" : "outline"}
          className="w-full"
          onClick={() => {
            const profileKey = Object.keys(profiles).find(
              key => profiles[key as keyof typeof profiles].name === profile.name
            );
            if (profileKey) {
              onProfileChange(profileKey);
            }
          }}
        >
          {profile.name === profiles[selectedProfile as keyof typeof profiles].name ? 
            'Currently Selected' : 'Select Profile'}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">AI Creative Profiles</h2>
      </div>
      
      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="cards">Visual Cards</TabsTrigger>
          <TabsTrigger value="list">Quick Select</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderProfileCard(profiles.wireframing, <Layout className="h-4 w-4" />)}
            {renderProfileCard(profiles.designSuggestions, <Palette className="h-4 w-4" />)}
            {renderProfileCard(profiles.contentCreation, <PenTool className="h-4 w-4" />)}
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <div className="space-y-2">
            <Button 
              variant={selectedProfile === "wireframing" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onProfileChange("wireframing")}
            >
              <Layout className="h-4 w-4 mr-2" />
              {profiles.wireframing.name}
              <Badge className="ml-auto" variant="secondary">{profiles.wireframing.creativityLevel}/10</Badge>
            </Button>
            
            <Button 
              variant={selectedProfile === "designSuggestions" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onProfileChange("designSuggestions")}
            >
              <Palette className="h-4 w-4 mr-2" />
              {profiles.designSuggestions.name}
              <Badge className="ml-auto" variant="secondary">{profiles.designSuggestions.creativityLevel}/10</Badge>
            </Button>
            
            <Button 
              variant={selectedProfile === "contentCreation" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onProfileChange("contentCreation")}
            >
              <PenTool className="h-4 w-4 mr-2" />
              {profiles.contentCreation.name}
              <Badge className="ml-auto" variant="secondary">{profiles.contentCreation.creativityLevel}/10</Badge>
            </Button>
            
            <Button 
              variant={selectedProfile === "feedbackAnalysis" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onProfileChange("feedbackAnalysis")}
            >
              <LineChart className="h-4 w-4 mr-2" />
              {profiles.feedbackAnalysis.name}
              <Badge className="ml-auto" variant="secondary">{profiles.feedbackAnalysis.creativityLevel}/10</Badge>
            </Button>
            
            <Button 
              variant={selectedProfile === "default" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onProfileChange("default")}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {profiles.default.name}
              <Badge className="ml-auto" variant="secondary">{profiles.default.creativityLevel}/10</Badge>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreativeProfileSelector;
