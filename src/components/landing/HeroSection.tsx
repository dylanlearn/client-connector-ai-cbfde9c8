
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-20">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#ee682b]/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-light"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#8439e9]/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-light" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-2/3 h-1/2 bg-[#6142e7]/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-light" style={{ animationDelay: "2s" }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYyYzcuNzMyIDAgMTQgNi4yNjggMTQgMTRoMnptLTIgMGMwIDcuNzMyLTYuMjY4IDE0LTE0IDE0djJjOS45NCAwIDE4LTguMDYgMTgtMThoLTJ6IiBmaWxsLW9wYWNpdHk9Ii4yIiBmaWxsPSIjNjE0MmU3Ii8+PHBhdGggZD0iTTQwIDIwSDIwdjIwaDIwVjIwem0tNCAxNkgyNHYtMTJoMTJ2MTJ6IiBmaWxsLW9wYWNpdHk9Ii4xIiBmaWxsPSIjNjE0MmU3Ii8+PHBhdGggZD0iTTAgMDBoNjB2NjBIMHoiLz48L2c+PC9zdmc+')] opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <div className="inline-block mb-2 px-4 py-1 rounded-full bg-gradient-to-r from-[#ee682b]/10 via-[#8439e9]/10 to-[#6142e7]/10 text-sm font-medium text-[#8439e9]">
              AI-Powered Design
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-gradient">Sync Your Design</span>
              <br /> Process With AI
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-xl">
              The AI-powered platform that transforms chaotic client briefs into structured, actionable design insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="button-gradient rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all" onClick={() => navigate("/signup")}>
                Start For Free
              </Button>
              <Button size="lg" variant="outline" className="border-gradient rounded-xl" onClick={() => navigate("/demo")}>
                See Demo
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-20 h-20 border-t-2 border-l-2 border-[#ee682b] rounded-tl-xl opacity-70"></div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 border-b-2 border-r-2 border-[#6142e7] rounded-br-xl opacity-70"></div>
              
              {/* Floating graphic elements */}
              <div className="absolute -top-8 -right-4 w-16 h-16 bg-gradient-to-br from-[#ee682b] to-[#8439e9] rounded-xl opacity-60 animate-float" style={{ animationDelay: "0.5s" }}></div>
              <div className="absolute -bottom-4 -left-8 w-12 h-12 bg-gradient-to-br from-[#8439e9] to-[#6142e7] rounded-full opacity-60 animate-float" style={{ animationDelay: "1.5s" }}></div>
              
              {/* Main image */}
              <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border-white/30">
                <div className="relative">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#ee682b]/10 via-transparent to-[#6142e7]/20 rounded-2xl"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80&w=1000" 
                    alt="DezignSync Dashboard Preview" 
                    className="rounded-2xl w-full object-cover"
                  />
                </div>
              </div>
              
              {/* Animated circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-[#8439e9]/20 animate-spin-slow opacity-70"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border border-[#ee682b]/10 animate-spin-slow opacity-50" style={{ animationDuration: "15s" }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
