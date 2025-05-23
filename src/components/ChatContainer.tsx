
import { useEffect, useRef } from "react";
import { Message } from "@/context/ChatContext";
import { MessageBubble } from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
          <div className="flex justify-between items-center p-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10 shadow-sm">
            <h2 className="font-medium text-primary">Conversation</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
              onClick={onClearChat}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear chat
            </Button>
          </div>
          <div className="pb-16">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
          <div className="rounded-full bg-primary/10 p-4 mb-4 shadow-inner">
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">AI</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 text-primary">Welcome to AITI Chat</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            Start a conversation with our AI assistant. Choose between our standard AITI Lite model 
            or the advanced AITI Coder for more complex queries.
          </p>
        </div>
      )}
    </div>
  );
}
