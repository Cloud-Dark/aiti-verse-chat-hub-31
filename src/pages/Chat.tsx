
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { Header } from "@/components/Header";
import { ChatContainer } from "@/components/ChatContainer";
import { ChatInput } from "@/components/ChatInput";
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
        
        {/* Main content */}
        <main className="flex-1 flex flex-col">
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
                Using {selectedModel === "aiti" ? "AITI" : "AITI Pro"}
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
