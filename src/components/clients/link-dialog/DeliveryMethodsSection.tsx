
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail, Phone } from "lucide-react";

interface DeliveryMethodsSectionProps {
  deliveryMethods: { email: boolean; sms: boolean };
  onDeliveryMethodChange: (method: 'email' | 'sms', checked: boolean) => void;
}

export default function DeliveryMethodsSection({
  deliveryMethods,
  onDeliveryMethodChange
}: DeliveryMethodsSectionProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right">
        Delivery
      </Label>
      <div className="col-span-3 space-y-2">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={deliveryMethods.email} 
            onCheckedChange={(checked) => onDeliveryMethodChange('email', checked)}
            id="email-delivery"
          />
          <Label htmlFor="email-delivery" className="flex items-center cursor-pointer">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={deliveryMethods.sms} 
            onCheckedChange={(checked) => onDeliveryMethodChange('sms', checked)}
            id="sms-delivery"
          />
          <Label htmlFor="sms-delivery" className="flex items-center cursor-pointer">
            <Phone className="h-4 w-4 mr-2" />
            SMS
          </Label>
        </div>
      </div>
    </div>
  );
}
