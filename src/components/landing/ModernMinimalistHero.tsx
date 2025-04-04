
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ModernMinimalistHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  image1Url?: string;
  image2Url?: string;
  logoUrls?: string[];
}

const ModernMinimalistHero = ({
  title = "Fast and effective services to drive startup's growth",
  subtitle = "Built with modern tech. Designed to convert. Delivered without the agency overhead.",
  ctaText = "Get Started",
  ctaLink = "/signup",
  image1Url = "/lovable-uploads/a3b75d3c-550b-44e0-b81b-4d74404d106c.png",
  image2Url,
  logoUrls = []
}: ModernMinimalistHeroProps) => {
  const navigate = useNavigate();
  
  // If image2Url is not provided, default to a placeholder
  const secondImage = image2Url || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80";
  
  return (
    <section className="relative bg-black text-white min-h-screen flex flex-col justify-between pb-20">
      {/* Navigation */}
      <nav className="w-full py-6 px-8">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-xl font-bold">
            Brand
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-400 hover:text-white transition">Services</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Capabilities</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Pricing</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
          </div>
        </div>
      </nav>
      
      {/* Hero content */}
      <div className="flex-1 flex flex-col justify-center px-8 max-w-4xl mx-auto w-full text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div>
          <Button 
            onClick={() => navigate(ctaLink)} 
            size="lg" 
            className="px-8 py-6 text-lg rounded-lg bg-white text-black hover:bg-gray-200 transition"
          >
            {ctaText}
          </Button>
        </div>
      </div>
      
      {/* Logos section */}
      {logoUrls.length > 0 && (
        <div className="px-8 py-10">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 max-w-4xl mx-auto opacity-60">
            {logoUrls.map((logo, index) => (
              <img 
                key={index} 
                src={logo} 
                alt="Partner logo" 
                className="h-8 md:h-10 object-contain" 
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Dual images */}
      <div className="w-full max-w-6xl mx-auto px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-square rounded-lg overflow-hidden">
            <img 
              src={image1Url} 
              alt="Feature image 1" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-square rounded-lg overflow-hidden">
            <img 
              src={secondImage} 
              alt="Feature image 2" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernMinimalistHero;
