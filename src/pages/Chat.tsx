
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
    clearAllHistory
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
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col min-h-screen w-full bg-background">
        <Header />
        
        <div className="flex flex-1 w-full overflow-hidden">
          {/* Sidebar with Chat History */}
          <Sidebar variant="sidebar" collapsible="offcanvas">
            <SidebarContent>
              <ChatHistory 
                conversations={conversations}
                onSelectConversation={selectConversation}
                onDeleteConversation={deleteConversation}
                activeConversationId={activeConversationId}
                onClearAllHistory={clearAllHistory}
              />
            </SidebarContent>
          </Sidebar>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div className="absolute top-3 left-3 z-10">
              <SidebarTrigger />
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
            <div className="border-t p-4">
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
