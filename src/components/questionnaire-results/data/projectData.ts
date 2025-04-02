
export const projectData = {
  name: "Acme Inc. Website Redesign",
  client: "Acme Inc.",
  date: new Date().toLocaleDateString(),
  answers: [
    {
      question: "What is the main purpose of your website?",
      answer: "Our website should showcase our products, establish our brand as an industry leader, and generate leads by encouraging visitors to contact us or request a demo.",
      followup: "We need features like product galleries, testimonials, and a contact form that collects qualified leads."
    },
    {
      question: "Who is your target audience?",
      answer: "Small to medium-sized businesses in the manufacturing sector, specifically operations managers and business owners looking to improve efficiency.",
      followup: "They're typically aged 35-55, value reliability and ROI, and are somewhat tech-savvy but not early adopters."
    },
    {
      question: "What are the main goals you want to achieve with this website?",
      answer: "Increase lead generation by 30%, reduce bounce rate, clearly explain our complex products, and build credibility in our industry."
    },
    {
      question: "List 3-5 websites that you like the style of and explain why.",
      answer: "1. Asana.com - Clean, modern design with clear CTAs\n2. Slack.com - Great use of illustrations and easy navigation\n3. HubSpot.com - Professional but approachable tone, good balance of text and visuals"
    },
    {
      question: "What are your brand colors? Please provide hex codes if available.",
      answer: "Primary: #3A5FCD (deep blue)\nSecondary: #FF8C00 (bright orange)\nAccent: #36454F (charcoal grey)\nBackground: #F8F9FA (light grey/off-white)"
    }
  ],
  aiSummary: "Based on the responses, Acme Inc. needs a professional B2B website that balances modern design with clear communication about complex products. The client values clean layouts, strong CTAs, and a professional but approachable tone similar to SaaS companies like Asana and Slack.\n\nTheir brand identity centers around blues and oranges, suggesting they want to convey both trust (blue) and energy/innovation (orange). The target audience of operations managers and business owners will respond well to content that emphasizes ROI, reliability, and efficiency gains.\n\nRecommended approach: Create a clean, conversion-focused design with clear navigation, prominent CTAs, and visual explanations of complex products. Include social proof elements like testimonials and case studies to build credibility."
};

export const styleRecommendations = {
  colors: [
    { name: "Primary Blue", hex: "#3A5FCD", swatch: "bg-[#3A5FCD]" },
    { name: "Secondary Orange", hex: "#FF8C00", swatch: "bg-[#FF8C00]" },
    { name: "Charcoal Grey", hex: "#36454F", swatch: "bg-[#36454F]" },
    { name: "Light Grey", hex: "#F8F9FA", swatch: "bg-[#F8F9FA] border border-gray-200" },
    { name: "Dark Blue", hex: "#2A4DA0", swatch: "bg-[#2A4DA0]" },
    { name: "Light Orange", hex: "#FFA333", swatch: "bg-[#FFA333]" },
  ],
  typography: {
    headings: "Montserrat",
    body: "Open Sans",
    accents: "Montserrat Medium"
  },
  layouts: [
    "Clean, minimal layout with ample whitespace",
    "Card-based content organization",
    "Strong visual hierarchy with clear section delineation",
    "Sticky navigation with prominent CTAs",
    "Mobile-first responsive design"
  ]
};

export const componentSuggestions = [
  {
    name: "Hero Section",
    description: "Clean, bold headline with a clear value proposition and strong CTA button",
    inspiration: "Similar to Asana's hero with product visual on right"
  },
  {
    name: "Features Grid",
    description: "3-column layout with icons, short headlines, and brief descriptions",
    inspiration: "Similar to Slack's features section with custom illustrations"
  },
  {
    name: "Testimonials Carousel",
    description: "Rotating quotes with client logos, names, and titles",
    inspiration: "Similar to HubSpot's testimonial display with social proof elements"
  },
  {
    name: "Product Showcase",
    description: "Visual product demonstrations with annotated features and benefits",
    inspiration: "Custom design based on client's specific products"
  },
  {
    name: "Lead Generation Form",
    description: "Simple, high-converting form with minimal required fields",
    inspiration: "Best practices design with clear value exchange"
  }
];
