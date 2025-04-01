
import { Check } from "lucide-react";

const features = [
  {
    title: "AI-Powered Client Questionnaire",
    description: "Dynamic questions that adapt based on client responses, ensuring you capture all the details you need.",
    icon: "🤖"
  },
  {
    title: "Visual Inspiration Selector",
    description: "Let clients browse and rank design components, helping you understand their taste preferences.",
    icon: "👁️"
  },
  {
    title: "Brand Style Detection",
    description: "AI analysis of client language to determine tone, style, and brand personality.",
    icon: "🎨"
  },
  {
    title: "Auto-Generated Project Brief",
    description: "Compile questionnaire answers, inspiration boards, and AI insights into a comprehensive brief.",
    icon: "📝"
  },
  {
    title: "Content Generation",
    description: "AI-generated copy suggestions for headlines, CTAs, and value propositions.",
    icon: "✍️"
  },
  {
    title: "Export & Integration",
    description: "Export briefs to Notion, PDF, Figma, or Webflow CMS to start your design process.",
    icon: "🔄"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Designers</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to streamline client communication and transform scattered ideas into structured design briefs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-3">Ready to upgrade your design process?</h3>
              <p className="text-gray-700">Join thousands of designers who are saving time and improving client satisfaction.</p>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="text-green-500 mr-2 h-5 w-5" />
                <span>No credit card required</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 mr-2 h-5 w-5" />
                <span>Free tier available</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 mr-2 h-5 w-5" />
                <span>Cancel anytime</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
