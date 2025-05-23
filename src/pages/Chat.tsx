
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { Header } from "@/components/Header";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
import { ModelSelector } from "@/components/ModelSelector";
import { ChatHistory } from "@/components/ChatHistory";

const Chat = () => {
  const { isAuthenticated } = useAuth();
  const { 
    messages, 
    conversations,
    selectedModel, 
    isLoading, 
    activeConversationId,
    setSelectedModel, 
    sendMessage, 
    clearChat,
    selectConversation,
    deleteConversation,
    clearAllHistory
  } = useChat();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Chat History */}
        <div className="hidden md:block">
          <ChatHistory 
            isVisible={showHistory}
            toggleVisibility={() => setShowHistory(!showHistory)}
            conversations={conversations}
            onSelectConversation={selectConversation}
            onDeleteConversation={deleteConversation}
            activeConversationId={activeConversationId}
            onClearAllHistory={clearAllHistory}
          />
        </div>
        
        {/* Mobile Chat History Toggle */}
        <div className="md:hidden">
          <ChatHistory 
            isVisible={showHistory}
            toggleVisibility={() => setShowHistory(!showHistory)}
            conversations={conversations}
            onSelectConversation={selectConversation}
            onDeleteConversation={deleteConversation}
            activeConversationId={activeConversationId}
            onClearAllHistory={clearAllHistory}
          />
        </div>
        
        {/* Sidebar */}
        <aside className={`w-[280px] border-r bg-background ${showHistory ? 'hidden' : ''} md:block`}>
          <div className="h-full flex flex-col">
            <ModelSelector 
              selectedModel={selectedModel} 
              onChange={setSelectedModel} 
              disabled={isLoading}
            />
            
            <div className="flex-1 p-4">
              <h3 className="font-medium text-sm mb-3">About the models</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium">AITI</h4>
                  <p className="text-muted-foreground text-xs mt-1">
                    Our standard model suitable for everyday questions and basic assistance.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">AITI Pro</h4>
                  <p className="text-muted-foreground text-xs mt-1">
                    Advanced capabilities with improved reasoning, more detailed responses, and better understanding of complex topics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className={`flex-1 flex flex-col ${showHistory ? 'md:ml-0' : ''}`}>
          {/* Chat messages */}
          <div className="flex-1 overflow-hidden">
            <ChatContainer 
              messages={messages}
              onClearChat={clearChat}
              isLoading={isLoading}
            />
          </div>
          
          {/* Mobile model selector */}
          <div className="md:hidden border-t p-4">
            <ModelSelector 
              selectedModel={selectedModel} 
              onChange={setSelectedModel}
              disabled={isLoading} 
            />
          </div>
          
          {/* Input area */}
          <div className="border-t p-4">
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
