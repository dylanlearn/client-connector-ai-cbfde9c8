
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";

interface EmailTabProps {
  email: string;
  setEmail: (value: string) => void;
  subject: string;
  setSubject: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  handleEmailSend: () => void;
  isLoading: boolean;
}

export function EmailTab({
  email,
  setEmail,
  subject,
  setSubject,
  message,
  setMessage,
  handleEmailSend,
  isLoading
}: EmailTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="client@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input 
          id="subject" 
          placeholder="Your Design Brief" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea 
          id="message" 
          placeholder="Here's the design brief we discussed..." 
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={handleEmailSend} 
        disabled={!email || isLoading}
        className="w-full"
      >
        <Mail className="mr-2 h-4 w-4" />
        Send via Email
      </Button>
    </div>
  );
}
