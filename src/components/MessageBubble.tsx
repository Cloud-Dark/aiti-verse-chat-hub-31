
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
        "flex w-full items-start gap-4 px-6 py-6 group transition-all duration-300",
        isUser ? "justify-end" : "justify-start",
        "hover:bg-muted/20"
      )}
    >
      {!isUser && (
        <Avatar className={cn(
          "h-10 w-10 rounded-full border-2 shadow-lg transition-all duration-300 group-hover:scale-110",
          message.model === "aiti-pro" 
            ? "bg-gradient-to-tr from-red-500 to-red-600 border-red-300" 
            : "bg-gradient-to-tr from-primary to-rose-500 border-primary/30"
        )}>
          <span className="font-bold text-white text-sm">
            {message.model === "aiti" ? "AL" : "AC"}
          </span>
        </Avatar>
      )}
      
      <div className="flex flex-col gap-3 max-w-[75%]">
        <div className="flex items-center gap-3">
          <span className={cn(
            "text-sm font-semibold transition-colors duration-300",
            message.model === "aiti-pro" && !isUser ? "text-red-500" : 
            message.model === "aiti" && !isUser ? "text-primary" : "text-foreground"
          )}>
            {isUser ? "You" : message.model === "aiti" ? "AITI Lite" : "AITI Coder"}
          </span>
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
        </div>
        
        <div
          className={cn(
            "rounded-2xl px-5 py-4 text-sm shadow-md transition-all duration-300 hover:shadow-lg",
            isUser 
              ? "bg-gradient-to-tr from-primary to-rose-500 text-primary-foreground hover:scale-[1.02]" 
              : message.model === "aiti" 
                ? "bg-muted/80 backdrop-blur-sm border border-border/50 hover:bg-muted" 
                : "bg-muted/80 backdrop-blur-sm border-l-4 border-red-500 border-r border-t border-b border-border/50 hover:bg-muted",
            "animate-fade-in"
          )}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          {message.isStreaming && (
            <div className="flex items-center gap-1 mt-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-10 w-10 rounded-full border-2 shadow-lg bg-gradient-to-tr from-blue-500 to-purple-600 border-blue-300 transition-all duration-300 group-hover:scale-110">
          <span className="font-bold text-white text-sm">You</span>
        </Avatar>
      )}
    </div>
  );
}
