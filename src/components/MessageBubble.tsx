
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
        "flex w-full items-start gap-4 px-4 py-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className={cn(
          "h-8 w-8 rounded-full border",
          message.model === "aiti-pro" ? "bg-aiti-pro-light" : "bg-aiti-light"
        )}>
          <span className="font-bold text-white">
            {message.model === "aiti" ? "A" : "AP"}
          </span>
        </Avatar>
      )}
      
      <div className="flex flex-col gap-2 max-w-[80%]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isUser ? "You" : message.model === "aiti" ? "AITI" : "AITI Pro"}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
        </div>
        
        <div
          className={cn(
            "rounded-lg px-4 py-2 text-sm",
            isUser 
              ? "message-user" 
              : message.model === "aiti" 
                ? "message-ai" 
                : "message-ai-pro"
          )}
        >
          {message.content}
          {message.isStreaming && (
            <div className="typing-indicator mt-1">
              <span className="animate-blink"></span>
              <span className="animate-blink"></span>
              <span className="animate-blink"></span>
            </div>
          )}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 rounded-full border bg-primary">
          <span className="font-bold text-white">You</span>
        </Avatar>
      )}
    </div>
  );
}
