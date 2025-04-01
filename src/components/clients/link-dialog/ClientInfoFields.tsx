
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ClientInfoFieldsProps {
  clientName: string;
  setClientName: (name: string) => void;
  clientEmail: string; 
  setClientEmail: (email: string) => void;
  clientPhone: string;
  setClientPhone: (phone: string) => void;
}

export default function ClientInfoFields({
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  clientPhone,
  setClientPhone
}: ClientInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="client-name" className="text-right">
          Name
        </Label>
        <Input
          id="client-name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="col-span-3"
          placeholder="Client Name"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="client-email" className="text-right">
          Email
        </Label>
        <Input
          id="client-email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          className="col-span-3"
          placeholder="client@example.com"
          type="email"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="client-phone" className="text-right">
          Phone
        </Label>
        <Input
          id="client-phone"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          className="col-span-3"
          placeholder="+1 (555) 123-4567"
          type="tel"
        />
      </div>
    </>
  );
}
