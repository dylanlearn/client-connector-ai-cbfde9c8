
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { 
  FileText, Download, Copy, ArrowUpRight, Palette, 
  Layout, Type, FileImage, Share2, CheckCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data that would come from the questionnaire
const projectData = {
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

// AI-generated style recommendations
const styleRecommendations = {
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

// Component designs from inspiration references
const componentSuggestions = [
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

const QuestionnaireResults = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExport = (format: string) => {
    toast({
      title: `Exporting as ${format}`,
      description: "Your file will be ready to download shortly.",
    });
  };

  const handleCopy = () => {
    toast({
      title: "Summary copied",
      description: "The summary has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{projectData.name}</h1>
            <p className="text-gray-600">Client: {projectData.client} • Created: {projectData.date}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate("/project-view")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Setup
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="summary">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
                <TabsTrigger value="answers" className="flex-1">Client Answers</TabsTrigger>
                <TabsTrigger value="design" className="flex-1">Design Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      AI-Generated Project Brief
                    </CardTitle>
                    <CardDescription>
                      Our AI has analyzed the client's responses and generated a comprehensive project brief.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-6 bg-white rounded-lg border whitespace-pre-line">
                      {projectData.aiSummary}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCopy}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="answers">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Questionnaire Answers</CardTitle>
                    <CardDescription>
                      Complete responses from the client, including AI follow-up questions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {projectData.answers.map((item, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 border-b">
                            <h3 className="font-medium">{item.question}</h3>
                          </div>
                          <div className="p-4">
                            <p className="whitespace-pre-line">{item.answer}</p>
                            
                            {item.followup && (
                              <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                  <div className="bg-indigo-100 p-1 rounded-full">
                                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-indigo-600" fill="currentColor">
                                      <path d="M19.044 7.921c0 2.935-2.377 5.313-5.313 5.313s-5.313-2.378-5.313-5.313c0-2.936 2.377-5.314 5.313-5.314s5.313 2.378 5.313 5.314zm-13.698 12.47h16.812c-1.692-3.604-6.558-6.25-8.405-6.25-1.846 0-6.713 2.646-8.407 6.25z"/>
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-xs text-indigo-500 mb-1">AI Follow-up</p>
                                    <p className="text-sm text-indigo-900">{item.followup}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="design">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Design Recommendations</CardTitle>
                    <CardDescription>
                      Based on the client's answers, our AI has generated the following design recommendations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <Palette className="mr-2 h-5 w-5" />
                          Color Palette
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {styleRecommendations.colors.map((color, index) => (
                            <div key={index} className="border rounded-lg overflow-hidden">
                              <div className={`h-16 ${color.swatch}`}></div>
                              <div className="p-3">
                                <p className="font-medium">{color.name}</p>
                                <p className="text-sm text-gray-500">{color.hex}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <Type className="mr-2 h-5 w-5" />
                          Typography
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-2">Headings</p>
                            <p className="text-xl font-bold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                              {styleRecommendations.typography.headings}
                            </p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-2">Body</p>
                            <p className="text-base" style={{ fontFamily: "Open Sans, sans-serif" }}>
                              {styleRecommendations.typography.body}
                            </p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-500 mb-2">Accents</p>
                            <p className="text-base font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
                              {styleRecommendations.typography.accents}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <Layout className="mr-2 h-5 w-5" />
                          Layout Recommendations
                        </h3>
                        <ul className="space-y-2 border rounded-lg p-4">
                          {styleRecommendations.layouts.map((layout, index) => (
                            <li key={index} className="flex items-start">
                              <div className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span>{layout}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <FileImage className="mr-2 h-5 w-5" />
                          Component Suggestions
                        </h3>
                        <div className="space-y-4">
                          {componentSuggestions.map((component, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <h4 className="font-medium">{component.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{component.description}</p>
                              <p className="text-xs text-gray-500 italic">Inspiration: {component.inspiration}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Export & Share</CardTitle>
                <CardDescription>
                  Export the design brief or share it with your team.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => handleExport("pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleExport("notion")}>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Export to Notion
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleExport("figma")}>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Send to Figma
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => handleExport("webflow")}>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Send to Webflow
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share with Team
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Readiness Score</CardTitle>
                <CardDescription>
                  How complete and actionable the client's input is.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center rounded-full w-24 h-24 border-8 border-indigo-500 mb-2">
                    <span className="text-3xl font-bold">85%</span>
                  </div>
                  <p className="font-medium text-lg">Very Good</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Clarity of Purpose</span>
                      <span className="font-medium">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Audience Definition</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Visual References</span>
                      <span className="font-medium">80%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Brand Elements</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                  <h4 className="font-medium text-indigo-700 mb-2">AI Recommendation</h4>
                  <p className="text-sm text-indigo-900">
                    This client provided strong inputs for overall goals and audience. Consider asking for more specific 
                    brand assets like logos and typography guidelines before proceeding.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionnaireResults;
