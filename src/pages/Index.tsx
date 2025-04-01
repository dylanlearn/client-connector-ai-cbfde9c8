
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import TemplatesShowcase from "@/components/landing/TemplatesShowcase";
import Footer from "@/components/landing/Footer";
import { useState, useEffect } from "react";
import { Menu, X, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showClientError, setShowClientError] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    // Check for client hub error parameter
    const urlParams = new URLSearchParams(window.location.search);
    setShowClientError(urlParams.get('clientHubError') === 'true');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 bg-white z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-bold text-xl">DezignSync</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
            <Link to="/design-picker" className="text-sm font-medium hover:text-primary transition-colors">Design Picker</Link>
            <Button 
              variant="outline" 
              className="text-sm font-medium"
              onClick={() => navigate("/client-access")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Client Access
            </Button>
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/login")}>Log In</Button>
            <Button onClick={() => navigate("/signup")}>Get Started</Button>
          </div>
          
          <button 
            className="md:hidden p-2 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-white w-full py-4 px-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a 
                href="#pricing" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <Link 
                to="/design-picker" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Design Picker
              </Link>
              <Button 
                variant="outline" 
                className="text-sm font-medium justify-start"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/client-access");
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Client Access
              </Button>
              <div className="flex flex-col space-y-3 pt-2">
                <Button variant="outline" onClick={() => navigate("/login")}>Log In</Button>
                <Button onClick={() => navigate("/signup")}>Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {showClientError && (
          <div className="max-w-6xl mx-auto p-4 mt-6">
            <Alert variant="destructive">
              <AlertTitle>Client Hub Access Error</AlertTitle>
              <AlertDescription>
                The client hub link you attempted to use is invalid or has expired. Please contact your designer for a new link.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <HeroSection />
        
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <TemplatesShowcase />
        <PricingSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
