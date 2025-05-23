
import React, { createContext, useContext, useState, ReactNode } from "react";

export type ModelType = "aiti" | "aiti-pro";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  model: ModelType;
  createdAt: Date;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface ChatContextType {
  messages: Message[];
  conversations: Conversation[];
  selectedModel: ModelType;
  isLoading: boolean;
  activeConversationId: string | null;
  setSelectedModel: (model: ModelType) => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearAllHistory: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelType>("aiti");
  const [isLoading, setIsLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Helper to create a new conversation
  const createNewConversation = (initialMessage?: Message) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: initialMessage?.content.slice(0, 30) || "New conversation",
      messages: initialMessage ? [initialMessage] : [],
      createdAt: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    return newConversation.id;
  };

  // Function to send a message
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      model: selectedModel,
      createdAt: new Date(),
    };
    
    let convId = activeConversationId;
    // If no active conversation, create one
    if (!activeConversationId) {
      convId = createNewConversation(userMessage);
    } else {
      // Add to existing conversation
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConversationId 
            ? { ...conv, messages: [...conv.messages, userMessage] } 
            : conv
        )
      );
    }
    
    setMessages(prev => [...prev, userMessage]);
    
    // Start AI response with streaming simulation
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: "",
      role: "assistant",
      model: selectedModel,
      createdAt: new Date(),
      isStreaming: true,
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setConversations(prev => 
      prev.map(conv => 
        conv.id === convId 
          ? { ...conv, messages: [...conv.messages, aiMessage] } 
          : conv
      )
    );
    
    setIsLoading(true);
    
    // Simulate streaming response
    const response = selectedModel === "aiti" 
      ? `This is a response from the basic Aiti model. I'm here to help answer your questions about "${content}". However, I'm limited compared to my pro version.`
      : `This is an advanced response from Aiti Pro model. I can provide more detailed and nuanced information about "${content}". With Aiti Pro, you get enhanced capabilities and more accurate responses based on the latest AI research.`;
    
    let displayedResponse = "";
    
    for (let i = 0; i < response.length; i++) {
      displayedResponse += response[i];
      
      // Update the AI message with the current part of the response
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === aiMessageId 
            ? { ...msg, content: displayedResponse } 
            : msg
        )
      );
      
      // Also update in the conversations
      setConversations(prev => 
        prev.map(conv => 
          conv.id === convId 
            ? { 
                ...conv, 
                messages: conv.messages.map(msg => 
                  msg.id === aiMessageId 
                    ? { ...msg, content: displayedResponse } 
                    : msg
                ) 
              } 
            : conv
        )
      );
      
      // Wait a small amount of time to simulate typing
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    
    // Complete the AI message
    setMessages(prev => 
      prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, isStreaming: false } 
          : msg
      )
    );
    
    // Also update in the conversations
    setConversations(prev => 
      prev.map(conv => 
        conv.id === convId 
          ? { 
              ...conv, 
              messages: conv.messages.map(msg => 
                msg.id === aiMessageId 
                  ? { ...msg, isStreaming: false } 
                  : msg
              ) 
            } 
          : conv
      )
    );
    
    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    if (activeConversationId) {
      createNewConversation();
    }
  };

  const selectConversation = (id: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (conversation) {
      setActiveConversationId(id);
      setMessages(conversation.messages);
    }
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setMessages([]);
    }
  };

  const clearAllHistory = () => {
    setConversations([]);
    setActiveConversationId(null);
    setMessages([]);
  };

  return (
    <ChatContext.Provider 
      value={{ 
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
