
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormItem } from "@/components/ui/form";
import { VALIDATION_CONSTANTS } from "@/utils/validation-utils";

interface ClientInfoFieldsProps {
  clientName: string;
  setClientName: (name: string) => void;
  clientEmail: string;
  setClientEmail: (email: string) => void;
  clientPhone: string;
  setClientPhone: (phone: string) => void;
  personalMessage: string;
  setPersonalMessage: (message: string) => void;
}

const ClientInfoFields = ({
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  clientPhone,
  setClientPhone,
  personalMessage,
  setPersonalMessage
}: ClientInfoFieldsProps) => {
  // Calculate remaining characters using the constant from validation-utils
  const maxMessageLength = VALIDATION_CONSTANTS.MAX_PERSONAL_MESSAGE_LENGTH;
  const remainingChars = maxMessageLength - personalMessage.length;

  return (
    <div className="grid gap-4">
      <FormItem>
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          placeholder="Enter client name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
      </FormItem>
      <FormItem>
        <Label htmlFor="clientEmail">Client Email</Label>
        <Input
          id="clientEmail"
          type="email"
          placeholder="client@example.com"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
      </FormItem>
      <FormItem>
        <Label htmlFor="clientPhone">Client Phone Number (optional for SMS)</Label>
        <Input
          id="clientPhone"
          placeholder="+1 123 456 7890"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
        />
      </FormItem>
      <FormItem>
        <div className="flex justify-between">
          <Label htmlFor="personalMessage">Personal Message (optional)</Label>
          <span className={`text-xs ${remainingChars < 20 ? 'text-amber-500' : 'text-muted-foreground'} ${remainingChars < 0 ? 'text-destructive' : ''}`}>
            {remainingChars} characters remaining
          </span>
        </div>
        <Textarea
          id="personalMessage"
          placeholder="Add a personal message to your client..."
          value={personalMessage}
          onChange={(e) => setPersonalMessage(e.target.value)}
          className="resize-none"
          maxLength={maxMessageLength}
        />
      </FormItem>
    </div>
  );
};

export default ClientInfoFields;
