
import { useState } from "react";
import { Message } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, EyeOff, Trash2 } from "lucide-react";

interface ChatHistoryProps {
  isVisible: boolean;
  toggleVisibility: () => void;
  conversations: { id: string; title: string; messages: Message[] }[];
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  activeConversationId: string | null;
  onClearAllHistory: () => void;
}

export function ChatHistory({
  isVisible,
  toggleVisibility,
  conversations,
  onSelectConversation,
  onDeleteConversation,
  activeConversationId,
  onClearAllHistory
}: ChatHistoryProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-20 z-20 bg-background shadow-sm border"
        onClick={toggleVisibility}
      >
        <Eye className="h-4 w-4" />
        <span className="sr-only">Show chat history</span>
      </Button>
    );
  }

  return (
    <div className="w-64 border-r bg-background h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium text-sm">Chat History</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleVisibility}
            title="Hide history"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onClearAllHistory}
            title="Clear all history"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-2 space-y-1">
        {conversations.length > 0 ? (
          conversations.map((conversation) => {
            // Get the first user message or use a default title
            const title = conversation.title || "New conversation";
            const date = conversation.messages[0]?.createdAt || new Date();
            
            return (
              <div
                key={conversation.id}
                className={cn(
                  "chat-history-item relative",
                  activeConversationId === conversation.id && "active"
                )}
                onClick={() => onSelectConversation(conversation.id)}
                onMouseEnter={() => setHoveredItem(conversation.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium text-sm truncate">{title}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(date), "MMM d, h:mm a")}
                  </span>
                </div>

                {hoveredItem === conversation.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 absolute right-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground text-sm px-4">
            <p>No conversations yet</p>
            <p className="text-xs mt-1">Your chat history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
