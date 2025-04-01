
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TemplateGrid from "./TemplateGrid";

interface PublicTemplateMarketplaceProps {
  templates: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    previewImageUrl: string;
  }>;
  onPurchaseClick: (template: any) => void;
}

const PublicTemplateMarketplace = ({ templates, onPurchaseClick }: PublicTemplateMarketplaceProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-bold text-xl">DezignSync</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/login" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Log In
            </Link>
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">Template Marketplace</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Featured Templates</CardTitle>
              <CardDescription>
                Pre-made templates to jumpstart your design process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateGrid 
                templates={templates} 
                onPurchaseClick={onPurchaseClick} 
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-100 border-t py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} DezignSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicTemplateMarketplace;
