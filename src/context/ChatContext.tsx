
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

interface ChatContextType {
  messages: Message[];
  selectedModel: ModelType;
  isLoading: boolean;
  setSelectedModel: (model: ModelType) => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelType>("aiti");
  const [isLoading, setIsLoading] = useState(false);

  // This is a mock function to simulate sending a message and getting a response
  // In a real application, you would call your API here
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      model: selectedModel,
      createdAt: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
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
    
    setMessages((prev) => [...prev, aiMessage]);
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
      
      // Wait a small amount of time to simulate typing
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    
    // Complete the AI message
    setMessages((prev) => 
      prev.map((msg) => 
        msg.id === aiMessageId 
          ? { ...msg, isStreaming: false } 
          : msg
      )
    );
    
    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        selectedModel, 
        isLoading,
        setSelectedModel, 
        sendMessage,
        clearChat
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
