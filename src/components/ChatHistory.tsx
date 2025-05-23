
import { useState } from "react";
import { Message } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupAction,
} from "@/components/ui/sidebar";

interface ChatHistoryProps {
  conversations: { id: string; title: string; messages: Message[] }[];
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  activeConversationId: string | null;
  onClearAllHistory: () => void;
}

export function ChatHistory({
  conversations,
  onSelectConversation,
  onDeleteConversation,
  activeConversationId,
  onClearAllHistory
}: ChatHistoryProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex flex-col">
      <SidebarGroup>
        <div className="flex items-center justify-between">
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarGroupAction asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onClearAllHistory}
              title="Clear all history"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </SidebarGroupAction>
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
                    className="relative"
                  >
                    <SidebarMenuButton
                      isActive={activeConversationId === conversation.id}
                      onClick={() => onSelectConversation(conversation.id)}
                    >
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate">{title}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(date), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </SidebarMenuButton>
                    
                    {hoveredItem === conversation.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
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
