
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface TemplateCardProps {
  template: {
    id: string;
    title: string;
    description: string;
    price: number;
    previewImageUrl: string;
  };
  onPurchaseClick: (template: any) => void;
}

const TemplateCard = ({ template, onPurchaseClick }: TemplateCardProps) => {
  return (
    <Card className="overflow-hidden border hover:shadow-md transition-shadow">
      <div className="aspect-video bg-muted">
        <img 
          src={template.previewImageUrl} 
          alt={template.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{template.title}</CardTitle>
        <CardDescription className="line-clamp-2">{template.description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="font-bold text-lg">${template.price}</span>
        <Button onClick={() => onPurchaseClick(template)}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Purchase
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
