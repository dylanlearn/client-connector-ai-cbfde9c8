
import { useState, useEffect, useRef } from "react";
import { useAI } from "@/contexts/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Lightbulb, Bot, Sparkles } from "lucide-react";
import { DesignOption } from "./VisualPicker";
import { useConversationalMemory } from "@/hooks/ai-design/useConversationalMemory";
import { useToneAdaptation } from "@/hooks/ai-design/useToneAdaptation";
import { useInteractiveDesignSuggestions } from "@/hooks/ai-design/useInteractiveDesignSuggestions";
import AIDesignSuggestionCard from "./AIDesignSuggestionCard";

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
  const { getPersonalizedGreeting, storeConversationEntry } = useConversationalMemory();
  const { adaptMessageTone } = useToneAdaptation();
  const { 
    activeSuggestion,
    isGenerating,
    generateSuggestion,
    processFeedback
  } = useInteractiveDesignSuggestions();
  
  const [input, setInput] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Send the initial greeting when component mounts
  useEffect(() => {
    if (!hasGreeted) {
      const greeting = getPersonalizedGreeting();
      simulateResponse(greeting);
      setHasGreeted(true);
      
      // Generate design suggestions based on selected designs if any
      if (Object.keys(selectedDesigns).length > 0) {
        setTimeout(() => {
          generateSuggestionsFromSelections();
        }, 1000);
      }
    }
  }, [hasGreeted]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate AI suggestions based on selected designs
  const generateSuggestionsFromSelections = async () => {
    if (Object.keys(selectedDesigns).length === 0) return;
    
    const categories = Object.values(selectedDesigns).map(design => design.category);
    const allStyles = Object.values(selectedDesigns).map(design => design.title);
    
    // Determine which type of suggestions to generate
    if (categories.includes("hero") && !categories.includes("navbar")) {
      simulateResponse(adaptMessageTone(`I notice you've selected a ${getDesignStyle(selectedDesigns)} hero section. Would you like to see complementary navbar designs that would pair well with this style?`));
      
      // Generate a navbar suggestion
      await generateSuggestion(
        'component',
        `Navbar designs that complement a ${getDesignStyle(selectedDesigns)} hero section`,
        { 
          category: 'navbar',
          styles: allStyles,
          selectedComponents: categories
        }
      );
      
    } else if (categories.includes("navbar") && !categories.includes("hero")) {
      simulateResponse(adaptMessageTone(`Your navbar selection has a ${getDesignStyle(selectedDesigns)} feel. Let me suggest some hero sections that would create a cohesive look with this navigation style.`));
      
      // Generate a hero suggestion
      await generateSuggestion(
        'component',
        `Hero designs that complement a ${getDesignStyle(selectedDesigns)} navbar`,
        { 
          category: 'hero',
          styles: allStyles,
          selectedComponents: categories
        }
      );
    } else if (!categories.includes("footer")) {
      simulateResponse(adaptMessageTone(`I see you've selected both navbar and hero sections. Would you like me to suggest a complementary footer design?`));
      
      // Generate a footer suggestion
      await generateSuggestion(
        'component',
        `Footer designs that complement the selected ${allStyles.join(', ')} components`,
        { 
          category: 'footer',
          styles: allStyles,
          selectedComponents: categories
        }
      );
    } else {
      // Suggest a color palette that ties everything together
      simulateResponse(adaptMessageTone(`You've selected several key components. Would you like me to suggest a cohesive color palette that would work well across all of these elements?`));
      
      await generateSuggestion(
        'color',
        `Color palette that works well with ${allStyles.join(', ')} design elements`,
        { 
          styles: allStyles,
          selectedComponents: categories
        }
      );
    }
  };

  const getDesignStyle = (designs: Record<string, DesignOption>): string => {
    // Extract design styles from selected components
    const styles = Object.values(designs).map(design => {
      if (design.title.toLowerCase().includes('minimal')) return 'minimal';
      if (design.title.toLowerCase().includes('modern')) return 'modern';
      if (design.title.toLowerCase().includes('bold')) return 'bold';
      if (design.title.toLowerCase().includes('playful')) return 'playful';
      if (design.title.toLowerCase().includes('classic')) return 'classic';
      if (design.title.toLowerCase().includes('corporate')) return 'corporate';
      return 'modern'; // Default
    });
    
    // Return the most common style
    const styleCounts = styles.reduce((counts, style) => {
      counts[style] = (counts[style] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const dominantStyle = Object.entries(styleCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
      
    return dominantStyle;
  };

  const handleSend = async () => {
    if (input.trim() === "") return;
    
    // Store the conversation entry
    storeConversationEntry(input, 'user');
    
    await simulateResponse(input);
    setInput("");
    
    // After user asks for help, generate some design suggestions
    if (input.toLowerCase().includes("suggest") || 
        input.toLowerCase().includes("recommend") ||
        input.toLowerCase().includes("show me")) {
      
      // Determine what type of suggestion to show
      if (input.toLowerCase().includes("color") || input.toLowerCase().includes("palette")) {
        await generateSuggestion('color', input, { source: 'user-request' });
      } 
      else if (input.toLowerCase().includes("layout")) {
        await generateSuggestion('layout', input, { source: 'user-request' });
      }
      else if (input.toLowerCase().includes("font") || input.toLowerCase().includes("typography")) {
        await generateSuggestion('typography', input, { source: 'user-request' });
      }
      else if (input.toLowerCase().includes("button") || 
               input.toLowerCase().includes("card") || 
               input.toLowerCase().includes("component") ||
               input.toLowerCase().includes("section")) {
        await generateSuggestion('component', input, { source: 'user-request' });
      }
      else {
        // General suggestion - pick the most likely category
        const categories = ['color', 'layout', 'component', 'typography'] as const;
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        await generateSuggestion(randomCategory, input, { source: 'user-request' });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionSelect = (suggestion: any) => {
    if (onSuggestionSelect && suggestion.value) {
      // Convert to DesignOption format
      const designOption: DesignOption = {
        id: suggestion.id,
        title: suggestion.title,
        description: suggestion.description || '',
        imageUrl: suggestion.imageUrl || '',
        category: suggestion.value.category || 'component'
      };
      
      onSuggestionSelect(designOption);
      
      simulateResponse(adaptMessageTone(`I've added the ${suggestion.title} to your selections. This will pair nicely with your existing design choices.`));
    }
  };

  const handleFeedback = async (feedback: { message: string, type: 'like' | 'dislike' | 'refine' }) => {
    if (!activeSuggestion) return;
    
    storeConversationEntry(feedback.message, 'user');
    
    if (feedback.type === 'like') {
      simulateResponse(adaptMessageTone("I'm glad you like these suggestions! Let me know if you'd like to explore more options."));
    } else if (feedback.type === 'dislike') {
      simulateResponse(adaptMessageTone("I understand these don't quite match what you're looking for. Let me know what you'd prefer, and I can generate new suggestions."));
    } else {
      simulateResponse(adaptMessageTone("Thanks for your feedback. Let me refine these suggestions based on your comments."));
      
      // Process the feedback to generate refined suggestions
      await processFeedback({
        suggestionId: activeSuggestion.id,
        message: feedback.message,
        options: {
          refine: true,
          moreOptions: false,
          differentDirection: false
        }
      });
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
              {adaptMessageTone("I'm your AI design assistant! I can help you create a cohesive design by suggesting complementary elements and color schemes. Ask me anything about your design choices.")}
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
              <div className="text-sm leading-relaxed">
                {message.role === "assistant" 
                  ? adaptMessageTone(message.content) 
                  : message.content
                }
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg backdrop-blur-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
              <span className="text-sm text-muted-foreground">{adaptMessageTone("Thinking...")}</span>
            </div>
          )}
          
          {/* Show active suggestion card */}
          {activeSuggestion && (
            <AIDesignSuggestionCard
              title={activeSuggestion.title}
              description={activeSuggestion.description}
              options={activeSuggestion.options}
              onSelect={handleSuggestionSelect}
              onFeedback={handleFeedback}
              isLoading={isGenerating}
            />
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
            placeholder={adaptMessageTone("Ask for design advice or suggestions...")}
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
