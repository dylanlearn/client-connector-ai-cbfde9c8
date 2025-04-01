
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Lightbulb } from "lucide-react";
import { useAI, AIMessage } from "@/contexts/AIContext";

interface AIChatProps {
  title?: string;
  placeholder?: string;
  initialMessage?: string;
  className?: string;
}

const AIChat = ({
  title = "AI Assistant",
  placeholder = "Ask me anything about your project...",
  initialMessage,
  className = "",
}: AIChatProps) => {
  const { messages, isProcessing, simulateResponse } = useAI();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() === "") return;
    
    await simulateResponse(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold">
          <MessageSquare className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto pb-0">
        <div className="space-y-4">
          {messages.length === 0 && initialMessage && (
            <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
              <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div className="text-sm text-blue-800">{initialMessage}</div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === "assistant"
                  ? "bg-muted/50 p-3 rounded-lg"
                  : ""
              }`}
            >
              <div
                className={`${
                  message.role === "assistant"
                    ? "bg-primary/10 text-primary"
                    : "bg-blue-500 text-white"
                } p-2 rounded-full flex-shrink-0`}
              >
                {message.role === "assistant" ? (
                  <MessageSquare className="h-4 w-4" />
                ) : (
                  <div className="w-4 h-4 flex items-center justify-center text-xs">U</div>
                )}
              </div>
              <div className="text-sm">{message.content}</div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
              <span>Thinking...</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <div className="flex w-full gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-grow min-h-[60px] resize-none"
          />
          <Button
            onClick={handleSend}
            disabled={isProcessing || input.trim() === ""}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIChat;
