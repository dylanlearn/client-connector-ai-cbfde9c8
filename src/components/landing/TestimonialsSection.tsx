
const testimonials = [
  {
    quote: "DezignSync has completely transformed how we onboard new clients. What used to take days of back-and-forth emails now happens automatically with much better results.",
    author: "Sarah Johnson",
    role: "Creative Director, PixelPerfect Studio",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    quote: "The AI-powered questionnaire asks questions I would never think to ask, uncovering client needs I would have missed. It's like having a senior strategist on every project.",
    author: "Michael Chen",
    role: "Freelance Web Designer",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg"
  },
  {
    quote: "My clients love the visual inspiration selector. It gives them a way to communicate their preferences that goes beyond words, and the result is much clearer design direction.",
    author: "Emma Rodriguez",
    role: "UI/UX Designer, Elevate Agency",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Designers Are Saying</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join hundreds of designers and agencies who have improved their client relationships with DezignSync.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md relative">
              <div className="absolute -top-6 -right-6 bg-indigo-500 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-bold">{testimonial.author}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
