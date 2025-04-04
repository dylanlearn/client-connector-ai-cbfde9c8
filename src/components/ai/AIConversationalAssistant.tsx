
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Lightbulb, Bot, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useConversationalMemory } from "@/hooks/ai-design/useConversationalMemory";
import { useToneAdaptation } from "@/hooks/ai-design/useToneAdaptation";
import { useAI } from "@/contexts/ai";
import { ProgressiveDisclosureService } from "@/services/ai/design/progressive-disclosure-service";

interface AIConversationalAssistantProps {
  initialTopic?: string;
  className?: string;
}

const AIConversationalAssistant: React.FC<AIConversationalAssistantProps> = ({
  initialTopic,
  className = "",
}) => {
  const { messages, isProcessing, simulateResponse } = useAI();
  const { getPersonalizedGreeting, storeConversationEntry } = useConversationalMemory();
  const { adaptMessageTone } = useToneAdaptation();
  
  const [input, setInput] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [showFollowUps, setShowFollowUps] = useState(true);
  const [progressiveContent, setProgressiveContent] = useState<{
    segments: string[];
    currentSegment: number;
    topic: string;
  } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Send the initial greeting when component mounts
  useEffect(() => {
    if (!hasGreeted) {
      const greeting = getPersonalizedGreeting();
      simulateResponse(greeting);
      setHasGreeted(true);
      
      // If there's an initial topic, queue up follow-up questions
      if (initialTopic) {
        const questions = ProgressiveDisclosureService.generateFollowUpQuestions(initialTopic);
        setFollowUpQuestions(questions);
      }
    }
  }, [hasGreeted, getPersonalizedGreeting, simulateResponse, initialTopic]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // If the AI just responded and it wasn't a progressive disclosure response
    if (messages.length > 0 && 
        messages[messages.length - 1].role === "assistant" && 
        !progressiveContent) {
      
      // Extract potential topic from the last message
      const lastMessage = messages[messages.length - 1].content;
      const potentialTopics = extractTopics(lastMessage);
      
      if (potentialTopics.length > 0) {
        // Generate follow-up questions based on the most relevant topic
        const topic = potentialTopics[0];
        const questions = ProgressiveDisclosureService.generateFollowUpQuestions(topic);
        setFollowUpQuestions(questions.slice(0, 3)); // Limit to 3 questions
        setShowFollowUps(true);
      }
    }
  }, [messages, progressiveContent]);

  // Extract potential topics from a message
  const extractTopics = (message: string): string[] => {
    // This is a simplified implementation
    // A more advanced version would use NLP to extract topics
    const designTopics = [
      'color', 'palette', 'layout', 'typography', 'font', 
      'interaction', 'animation', 'component', 'spacing',
      'responsive', 'mobile', 'desktop', 'accessibility'
    ];
    
    const foundTopics: string[] = [];
    designTopics.forEach(topic => {
      if (message.toLowerCase().includes(topic)) {
        foundTopics.push(topic);
      }
    });
    
    return foundTopics;
  };

  const handleSend = async () => {
    if (input.trim() === "") return;
    
    // Store the user message
    storeConversationEntry(input, 'user');
    
    // Clear follow-up questions when user sends a message
    setFollowUpQuestions([]);
    
    // If we're in the middle of progressive disclosure
    if (progressiveContent && progressiveContent.currentSegment < progressiveContent.segments.length - 1) {
      // Move to the next segment
      setProgressiveContent({
        ...progressiveContent,
        currentSegment: progressiveContent.currentSegment + 1
      });
      
      // Simulate AI response with the next segment
      await simulateResponse(progressiveContent.segments[progressiveContent.currentSegment + 1]);
      
      // If we're at the last segment, add a follow-up prompt
      if (progressiveContent.currentSegment + 1 === progressiveContent.segments.length - 1) {
        const followUpPrompt = ProgressiveDisclosureService.createFollowUpPrompt(progressiveContent.topic);
        const questions = ProgressiveDisclosureService.generateFollowUpQuestions(progressiveContent.topic);
        setFollowUpQuestions(questions);
        setShowFollowUps(true);
        
        // Clear progressive content state
        setProgressiveContent(null);
      }
    } else {
      // Normal response
      
      // Check if this could be a request for a lot of information
      const isLargeInfoRequest = /tell me (all|everything) about|explain in (detail|depth)|give me (comprehensive|complete)/i.test(input);
      
      if (isLargeInfoRequest) {
        // Use progressive disclosure for large information requests
        await simulateResponse(adaptMessageTone("I'd be happy to explain that. Let me break it down into manageable parts:"));
        
        // Send the actual request to get a comprehensive response
        const fullResponsePrompt = `${input}. Provide a comprehensive, detailed explanation.`;
        
        // This would normally be an API call; here we're simulating with simulateResponse
        // In a real implementation, we would get the full content first, then segment it
        await simulateResponse(fullResponsePrompt);
        
        // For simulation, let's assume we got a large response and need to segment it
        // In a real implementation, the segmentation would happen after getting the full response
        
        // Extracting topics for follow-up
        const topics = extractTopics(input);
        const primaryTopic = topics.length > 0 ? topics[0] : 'design';
        
        // Generate follow-up questions
        const questions = ProgressiveDisclosureService.generateFollowUpQuestions(primaryTopic);
        setFollowUpQuestions(questions);
        setShowFollowUps(true);
      } else {
        // Regular response
        await simulateResponse(input);
      }
    }
    
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFollowUpClick = (question: string) => {
    setInput(question);
    setFollowUpQuestions([]);
  };

  const toggleFollowUps = () => {
    setShowFollowUps(!showFollowUps);
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
              {adaptMessageTone("I'm your design assistant! I can help you create a cohesive design by suggesting complementary elements and color schemes. Ask me anything about your design choices.")}
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
          
          {/* Follow-up questions */}
          {followUpQuestions.length > 0 && (
            <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <h4 className="font-medium text-sm">{adaptMessageTone("Follow-up Questions")}</h4>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={toggleFollowUps}
                >
                  {showFollowUps ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              
              {showFollowUps && (
                <div className="grid grid-cols-1 gap-2">
                  {followUpQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left font-normal hover:bg-blue-50 hover:text-blue-700 transition-colors h-auto py-2"
                      onClick={() => handleFollowUpClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              )}
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

export default AIConversationalAssistant;
