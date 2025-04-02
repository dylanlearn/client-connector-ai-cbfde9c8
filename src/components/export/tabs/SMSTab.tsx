
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone } from "lucide-react";

interface SMSTabProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  handleSMSSend: () => void;
  isLoading: boolean;
}

export function SMSTab({
  phoneNumber,
  setPhoneNumber,
  message,
  setMessage,
  handleSMSSend,
  isLoading
}: SMSTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          type="tel" 
          placeholder="+1234567890" 
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Include country code (e.g., +1 for US)
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="smsMessage">Message (Optional)</Label>
        <Textarea 
          id="smsMessage" 
          placeholder="Here's your design brief..." 
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={handleSMSSend} 
        disabled={!phoneNumber || isLoading}
        className="w-full"
      >
        <Phone className="mr-2 h-4 w-4" />
        Send via SMS
      </Button>
    </div>
  );
}
