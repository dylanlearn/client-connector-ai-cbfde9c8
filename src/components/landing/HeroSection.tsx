
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Sync Your Design Process
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-xl">
              The AI-powered platform that transforms chaotic client briefs into structured, actionable design insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate("/signup")}>
                Start For Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/demo")}>
                See Demo
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>
              <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30"></div>
              <div className="relative bg-white p-6 rounded-xl shadow-xl border border-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80&w=1000" 
                  alt="DezignSync Dashboard Preview" 
                  className="rounded-lg w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
