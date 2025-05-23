
import { useState } from "react";
import { Message } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Trash2, Share2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupAction,
} from "@/components/ui/sidebar";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ChatHistoryProps {
  conversations: { id: string; title: string; messages: Message[] }[];
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  activeConversationId: string | null;
  onClearAllHistory: () => void;
  onShareConversation?: (id: string) => void;
}

export function ChatHistory({
  conversations,
  onSelectConversation,
  onDeleteConversation,
  activeConversationId,
  onClearAllHistory,
  onShareConversation
}: ChatHistoryProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { toast } = useToast();

  const handleShare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If share functionality exists in props
    if (onShareConversation) {
      onShareConversation(id);
    } else {
      // Fallback to copy to clipboard
      const conversation = conversations.find(c => c.id === id);
      if (!conversation) return;
      
      const text = conversation.messages
        .map(m => `${m.role === 'user' ? 'You' : 'AITI'}: ${m.content}`)
        .join('\n\n');
      
      navigator.clipboard.writeText(text).then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Conversation has been copied to your clipboard"
        });
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <SidebarGroup>
        <div className="flex items-center justify-between">
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarGroupAction asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={onClearAllHistory}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </SidebarGroupAction>
              </TooltipTrigger>
              <TooltipContent side="right">Clear all history</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <SidebarGroupContent>
          <SidebarMenu>
            {conversations.length > 0 ? (
              conversations.map((conversation) => {
                // Get the first user message or use a default title
                const title = conversation.title || "New conversation";
                const date = conversation.messages[0]?.createdAt || new Date();
                
                return (
                  <SidebarMenuItem
                    key={conversation.id}
                    onMouseEnter={() => setHoveredItem(conversation.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative group"
                  >
                    <SidebarMenuButton
                      isActive={activeConversationId === conversation.id}
                      onClick={() => onSelectConversation(conversation.id)}
                      className="pr-16 transition-all duration-200 hover:translate-x-1"
                    >
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate">{title}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(date), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </SidebarMenuButton>
                    
                    <div className={cn(
                      "absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1",
                      hoveredItem === conversation.id ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                      "transition-opacity duration-200"
                    )}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-primary"
                        onClick={(e) => handleShare(conversation.id, e)}
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </SidebarMenuItem>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground text-sm px-4">
                <p>No conversations yet</p>
                <p className="text-xs mt-1">Your chat history will appear here</p>
              </div>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
}
