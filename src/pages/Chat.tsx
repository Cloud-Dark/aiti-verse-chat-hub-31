
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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
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
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex flex-col min-h-screen w-full bg-background">
        <Header />
        
        <div className="flex flex-1 w-full overflow-hidden">
          {/* Sidebar with Chat History */}
          <Sidebar variant="sidebar" collapsible="offcanvas">
            <SidebarContent className="animate-slide-in-left">
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
            <div className="absolute top-3 left-3 z-10">
              <SidebarTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="transition-transform hover:rotate-90 duration-200"
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
            <div className="border-t p-4 bg-gradient-to-b from-transparent to-background/30 backdrop-blur-sm">
              <ChatInput onSend={sendMessage} disabled={isLoading} />
              
              {/* Current model indicator */}
              <div className="text-center mt-2">
                <span className="text-xs text-muted-foreground">
                  Using {selectedModel === "aiti" ? "AITI Lite" : "AITI Coder"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chat;
