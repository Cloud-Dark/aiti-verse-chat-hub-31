
import { cn } from "@/lib/utils";
import { Message } from "@/context/ChatContext";
import { Avatar } from "@/components/ui/avatar";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  
  const getModelDisplay = () => {
    switch (message.model) {
      case "aiti":
        return { name: "AITI Lite", short: "AL", color: "from-primary to-rose-500" };
      case "aiti-pro":
        return { name: "AITI Coder", short: "AC", color: "from-red-500 to-red-600" };
      case "ollama":
        return { name: "Ollama", short: "OL", color: "from-green-500 to-green-600" };
      default:
        return { name: "AI", short: "AI", color: "from-gray-500 to-gray-600" };
    }
  };

  const modelInfo = getModelDisplay();
  
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
          `bg-gradient-to-tr ${modelInfo.color} border-opacity-30`
        )}>
          <span className="font-bold text-white text-sm">
            {modelInfo.short}
          </span>
        </Avatar>
      )}
      
      <div className="flex flex-col gap-3 max-w-[75%]">
        <div className="flex items-center gap-3">
          <span className={cn(
            "text-sm font-semibold transition-colors duration-300",
            !isUser && message.model === "aiti-pro" ? "text-red-500" : 
            !isUser && message.model === "aiti" ? "text-primary" :
            !isUser && message.model === "ollama" ? "text-green-500" : "text-foreground"
          )}>
            {isUser ? "You" : modelInfo.name}
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
                : message.model === "aiti-pro"
                  ? "bg-muted/80 backdrop-blur-sm border-l-4 border-red-500 border-r border-t border-b border-border/50 hover:bg-muted"
                  : "bg-muted/80 backdrop-blur-sm border-l-4 border-green-500 border-r border-t border-b border-border/50 hover:bg-muted",
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
