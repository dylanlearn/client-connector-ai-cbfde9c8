
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock template data for landing page showcase
const featuredTemplates = [
  {
    id: "1",
    title: "Agency Website Pack",
    description: "Complete website template pack for digital agencies",
    price: 39,
    imageUrl: "/placeholder.svg"
  },
  {
    id: "3",
    title: "Portfolio Showcase",
    description: "Minimalist portfolio template for creatives",
    price: 29,
    imageUrl: "/placeholder.svg"
  }
];

const TemplatesShowcase = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready-to-Use Templates</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Jump-start your design with our professionally crafted templates, ready to customize and deploy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {featuredTemplates.map((template) => (
            <div 
              key={template.id} 
              className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-gray-100">
                <img 
                  src={template.imageUrl} 
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{template.title}</h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${template.price}</span>
                  <Button variant="outline" onClick={() => navigate("/templates")}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            className="px-8" 
            size="lg" 
            onClick={() => navigate("/templates")}
          >
            Browse All Templates
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TemplatesShowcase;
