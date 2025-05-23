
import { cn } from "@/lib/utils";
import { Message } from "@/context/ChatContext";
import { Avatar } from "@/components/ui/avatar";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 px-4 py-4 group",
        isUser ? "justify-end" : "justify-start",
        "hover:bg-muted/30 transition-colors"
      )}
    >
      {!isUser && (
        <Avatar className={cn(
          "h-8 w-8 rounded-full border",
          message.model === "aiti-pro" ? "bg-gradient-to-tr from-aiti-pro-light to-red-600" : "bg-gradient-to-tr from-aiti-light to-rose-400"
        )}>
          <span className="font-bold text-white">
            {message.model === "aiti" ? "AL" : "AC"}
          </span>
        </Avatar>
      )}
      
      <div className="flex flex-col gap-2 max-w-[80%]">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium",
            message.model === "aiti-pro" && !isUser ? "text-aiti-pro-light" : 
            message.model === "aiti" && !isUser ? "text-aiti-light" : ""
          )}>
            {isUser ? "You" : message.model === "aiti" ? "AITI Lite" : "AITI Coder"}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
        </div>
        
        <div
          className={cn(
            "rounded-lg px-4 py-3 text-sm shadow-sm",
            isUser 
              ? "message-user bg-primary text-primary-foreground" 
              : message.model === "aiti" 
                ? "message-ai bg-muted" 
                : "message-ai-pro bg-muted border-l-2 border-red-500",
            "animate-fade-in transition-all duration-200"
          )}
        >
          {message.content}
          {message.isStreaming && (
            <div className="typing-indicator mt-1">
              <span className="animate-blink"></span>
              <span className="animate-blink animation-delay-300"></span>
              <span className="animate-blink animation-delay-600"></span>
            </div>
          )}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 rounded-full border bg-gradient-to-tr from-primary to-red-400">
          <span className="font-bold text-white">You</span>
        </Avatar>
      )}
    </div>
  );
}
