
import { useState, useEffect, useRef } from "react";
import { useAI } from "@/contexts/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Lightbulb, Bot, Sparkles } from "lucide-react";
import { DesignOption } from "./VisualPicker";

interface AIDesignAssistantProps {
  selectedDesigns: Record<string, DesignOption>;
  onSuggestionSelect?: (suggestion: DesignOption) => void;
  className?: string;
}

const AIDesignAssistant = ({
  selectedDesigns,
  onSuggestionSelect,
  className = "",
}: AIDesignAssistantProps) => {
  const { messages, isProcessing, simulateResponse } = useAI();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiSuggestions, setAiSuggestions] = useState<DesignOption[]>([]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate AI suggestions based on selected designs
  useEffect(() => {
    if (Object.keys(selectedDesigns).length > 0) {
      // This would be replaced with actual AI-generated suggestions
      const generateSuggestions = async () => {
        const categories = Object.values(selectedDesigns).map(design => design.category);
        
        if (categories.includes("hero")) {
          simulateResponse(`I notice you've selected a ${getDesignStyle(selectedDesigns)} hero section. 
          Would you like to see complementary navbar designs that would pair well with this style?`);
        } else if (categories.includes("navbar") && !categories.includes("hero")) {
          simulateResponse(`Your navbar selection has a ${getDesignStyle(selectedDesigns)} feel. 
          Let me suggest some hero sections that would create a cohesive look with this navigation style.`);
        }
      };
      
      generateSuggestions();
    }
  }, [selectedDesigns]);

  const getDesignStyle = (designs: Record<string, DesignOption>): string => {
    // This would be more sophisticated in a real implementation
    const styles = ["modern", "minimal", "bold", "classic", "playful"];
    return styles[Math.floor(Math.random() * styles.length)];
  };

  const handleSend = async () => {
    if (input.trim() === "") return;
    
    await simulateResponse(input);
    setInput("");
    
    // After user asks for help, generate some design suggestions
    if (input.toLowerCase().includes("suggest") || input.toLowerCase().includes("recommend")) {
      setTimeout(() => {
        // Mock AI-generated design suggestions (would be actual API calls)
        setAiSuggestions([
          {
            id: "suggestion-1",
            title: "Clean Hero Layout",
            description: "A minimalist hero with strong typography that would complement your selected navbar",
            imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Hero+Design",
            category: "hero"
          },
          {
            id: "suggestion-2",
            title: "Bold Footer Design",
            description: "A bold footer with clear sections for navigation and contact info",
            imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Footer+Design",
            category: "footer"
          }
        ]);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionSelect = (suggestion: DesignOption) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
      setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      simulateResponse(`I've added the ${suggestion.title} to your selections. This will pair nicely with your existing design choices.`);
    }
  };

  return (
    <Card className="flex flex-col h-full shadow-md border-gradient-subtle backdrop-blur-sm">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="flex items-center text-lg font-semibold">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-full mr-3">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Design Assistant
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto pb-0 px-4 scrollbar-thin space-y-4 pt-4">
        {messages.length === 0 && (
          <div className="flex items-start gap-3 bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full flex-shrink-0">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div className="text-sm text-blue-800">
              I'm your AI design assistant! I can help you create a cohesive design by suggesting complementary elements and color schemes. Ask me anything about your design choices.
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === "assistant"
                  ? "bg-muted/30 p-4 rounded-lg backdrop-blur-sm border border-purple-100/20"
                  : ""
              }`}
            >
              <div
                className={`${
                  message.role === "assistant"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-gradient-to-r from-orange-400 to-amber-500 text-white"
                } p-2 rounded-full flex-shrink-0 shadow-md`}
              >
                {message.role === "assistant" ? (
                  <MessageSquare className="h-4 w-4" />
                ) : (
                  <div className="w-4 h-4 flex items-center justify-center text-xs">U</div>
                )}
              </div>
              <div className="text-sm leading-relaxed">{message.content}</div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg backdrop-blur-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          )}
          
          {aiSuggestions.length > 0 && (
            <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <h4 className="font-medium text-sm">AI Design Suggestions</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiSuggestions.map(suggestion => (
                  <div key={suggestion.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
                    <img 
                      src={suggestion.imageUrl} 
                      alt={suggestion.title} 
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-3">
                      <h5 className="font-medium text-sm">{suggestion.title}</h5>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{suggestion.description}</p>
                      <Button 
                        size="sm" 
                        className="w-full text-xs h-8 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        Add to selections
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 border-t">
        <div className="flex w-full gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for design advice or suggestions..."
            className="flex-grow min-h-[60px] resize-none rounded-xl bg-muted/30 backdrop-blur-sm border-blue-100 focus-visible:ring-1 focus-visible:ring-blue-400"
          />
          <Button
            onClick={handleSend}
            disabled={isProcessing || input.trim() === ""}
            className="self-end h-10 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIDesignAssistant;
