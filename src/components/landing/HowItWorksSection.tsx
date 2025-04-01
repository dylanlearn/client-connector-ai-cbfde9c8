
const steps = [
  {
    number: "01",
    title: "Client Onboarding",
    description: "Invite your client to complete the AI-powered questionnaire that adapts to their responses.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600"
  },
  {
    number: "02",
    title: "Visual Preferences",
    description: "Clients select and rank visual examples to help you understand their style preferences.",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=600"
  },
  {
    number: "03",
    title: "AI Analysis",
    description: "Our AI analyzes responses to determine brand voice, style, and project requirements.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
  },
  {
    number: "04",
    title: "Brief Generation",
    description: "Receive a comprehensive design brief with organized insights and recommendations.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=600"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How DezignSync Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple four-step process that transforms client communication into actionable design insights.
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}
            >
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -z-10 w-full h-full bg-indigo-100 rounded-xl transform rotate-3"></div>
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="rounded-lg shadow-lg relative z-10"
                  />
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="inline-block text-5xl font-bold text-indigo-200 mb-4">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
