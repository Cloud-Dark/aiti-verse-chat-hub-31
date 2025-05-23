
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { Header } from "@/components/Header";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger
} from "@/components/ui/sidebar";
import { ChatHistory } from "@/components/ChatHistory";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Chat = () => {
  const { isAuthenticated } = useAuth();
  const { 
    messages, 
    conversations,
    selectedModel, 
    isLoading, 
    activeConversationId,
    sendMessage, 
    clearChat,
    selectConversation,
    deleteConversation,
    clearAllHistory,
    shareConversation
  } = useChat();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }

  const getModelDisplayName = () => {
    switch (selectedModel) {
      case "aiti":
        return "AITI Lite";
      case "aiti-pro":
        return "AITI Coder";
      case "ollama":
        return "Ollama";
      default:
        return "AI Model";
    }
  };

  const getModelColor = () => {
    switch (selectedModel) {
      case "aiti":
        return "bg-aiti-light";
      case "aiti-pro":
        return "bg-red-500";
      case "ollama":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        
        <div className="flex flex-1 w-full overflow-hidden">
          {/* Sidebar with Chat History */}
          <Sidebar variant="sidebar" collapsible="offcanvas">
            <SidebarContent className="animate-slide-in-left backdrop-blur-md bg-sidebar/95 border-r border-border/50">
              <ChatHistory 
                conversations={conversations}
                onSelectConversation={selectConversation}
                onDeleteConversation={deleteConversation}
                activeConversationId={activeConversationId}
                onClearAllHistory={clearAllHistory}
                onShareConversation={shareConversation}
              />
            </SidebarContent>
          </Sidebar>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10">
              <SidebarTrigger>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="transition-all duration-300 hover:scale-110 hover:rotate-180 hover:bg-primary/10 hover:text-primary backdrop-blur-sm bg-background/80 border border-border/50 shadow-lg"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle history</span>
                </Button>
              </SidebarTrigger>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 overflow-hidden">
              <ChatContainer 
                messages={messages}
                onClearChat={clearChat}
                isLoading={isLoading}
              />
            </div>
            
            {/* Input area */}
            <div className="border-t border-border/50 p-6 bg-gradient-to-t from-background/95 to-transparent backdrop-blur-md">
              <div className="max-w-4xl mx-auto">
                <ChatInput onSend={sendMessage} disabled={isLoading} />
                
                {/* Current model indicator */}
                <div className="text-center mt-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 backdrop-blur-sm border border-border/30">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${getModelColor()}`} />
                    <span className="text-xs font-medium text-muted-foreground">
                      {getModelDisplayName()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chat;
