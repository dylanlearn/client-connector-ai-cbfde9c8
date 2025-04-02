import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Lightbulb, Bot } from "lucide-react";
import { useAI } from "@/contexts/ai";
import { AIMessage } from "@/types/ai";

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
    <Card className={`glass-card flex flex-col h-full backdrop-blur-lg ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold">
          <div className="bg-gradient-primary p-2 rounded-full mr-3">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-gradient">{title}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto pb-0 px-4 scrollbar-thin">
        <div className="space-y-4">
          {messages.length === 0 && initialMessage && (
            <div className="flex items-start gap-3 bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full">
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
                  ? "bg-muted/30 p-4 rounded-lg backdrop-blur-sm border border-purple-100/20"
                  : ""
              }`}
            >
              <div
                className={`${
                  message.role === "assistant"
                    ? "bg-gradient-to-r from-[#8439e9] to-[#6142e7] text-white"
                    : "bg-gradient-to-r from-[#ee682b] to-[#8439e9] text-white"
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
                <div className="w-2 h-2 bg-gradient-to-r from-[#ee682b] to-[#8439e9] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gradient-to-r from-[#8439e9] to-[#6142e7] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gradient-to-r from-[#6142e7] to-[#ee682b] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
              <span className="text-sm text-muted-foreground">Processing...</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 px-4">
        <div className="flex w-full gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-grow min-h-[60px] resize-none rounded-xl bg-muted/30 backdrop-blur-sm border-gradient focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button
            onClick={handleSend}
            disabled={isProcessing || input.trim() === ""}
            className="self-end button-gradient rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIChat;
