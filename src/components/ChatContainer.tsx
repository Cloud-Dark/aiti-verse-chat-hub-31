
import { useEffect, useRef } from "react";
import { Message } from "@/context/ChatContext";
import { MessageBubble } from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { Trash2, Sparkles } from "lucide-react";

interface ChatContainerProps {
  messages: Message[];
  onClearChat: () => void;
  isLoading: boolean;
}

export function ChatContainer({ messages, onClearChat, isLoading }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length > 0 ? (
        <>
          <div className="flex justify-between items-center p-6 sticky top-0 bg-gradient-to-b from-background via-background/95 to-transparent backdrop-blur-md z-10 border-b border-border/30">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <h2 className="font-semibold text-foreground">Conversation</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 hover:scale-105"
              onClick={onClearChat}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear chat
            </Button>
          </div>
          <div className="pb-20 px-2">
            {messages.map((message, index) => (
              <div 
                key={message.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MessageBubble message={message} />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-red-500/20 blur-xl animate-pulse" />
            <div className="relative rounded-full bg-gradient-to-tr from-primary/10 to-red-500/10 p-6 backdrop-blur-sm border border-border/30 shadow-2xl">
              <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-red-500 flex items-center justify-center shadow-inner">
                <span className="text-2xl font-bold text-white">AI</span>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
            Welcome to AITI Chat
          </h3>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            Start a conversation with our AI assistant. Choose between our standard AITI Lite model 
            or the advanced AITI Coder for development and technical queries.
          </p>
        </div>
      )}
    </div>
  );
}
