
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="welcome-message">Welcome Message</Label>
        <Textarea
          id="welcome-message"
          placeholder="Enter a welcome message for your client..."
          defaultValue="Thanks for taking the time to fill out this questionnaire. Your answers will help us create a website that perfectly matches your vision and goals."
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="completion-message">Completion Message</Label>
        <Textarea
          id="completion-message"
          placeholder="Enter a message to show when the client completes the questionnaire..."
          defaultValue="Thank you for completing the questionnaire! We'll analyze your responses and be in touch soon with the next steps."
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label>AI Features</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch id="follow-up-questions" defaultChecked />
            <Label htmlFor="follow-up-questions">
              Enable AI follow-up questions
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="clarification" defaultChecked />
            <Label htmlFor="clarification">
              Ask for clarification on vague answers
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="suggestions" defaultChecked />
            <Label htmlFor="suggestions">
              Provide AI content suggestions
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
