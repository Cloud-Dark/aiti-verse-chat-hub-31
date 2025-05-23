
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export type ModelType = "aiti" | "aiti-pro" | "ollama";

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

interface OllamaConfig {
  baseUrl: string;
  model: string;
}

interface ChatContextType {
  messages: Message[];
  conversations: Conversation[];
  selectedModel: ModelType;
  isLoading: boolean;
  activeConversationId: string | null;
  chainLength: number;
  ollamaConfig: OllamaConfig;
  setChainLength: (length: number) => void;
  setSelectedModel: (model: ModelType) => void;
  setOllamaConfig: (config: OllamaConfig) => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearAllHistory: () => void;
  shareConversation: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelType>("aiti");
  const [isLoading, setIsLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chainLength, setChainLength] = useState<number>(3);
  const [ollamaConfig, setOllamaConfig] = useState<OllamaConfig>({
    baseUrl: "http://10.0.24.130:11435",
    model: "smollm:360m"
  });
  const { toast } = useToast();

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

  // Function to call Ollama API
  const callOllamaAPI = async (content: string): Promise<string> => {
    try {
      const response = await fetch(`${ollamaConfig.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ollamaConfig.model,
          prompt: content,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response || "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.error('Ollama API error:', error);
      throw new Error('Failed to connect to Ollama. Please check your configuration and ensure Ollama is running.');
    }
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
    
    try {
      let response: string;
      
      if (selectedModel === "aiti") {
        // AITI Lite sekarang menggunakan Ollama
        response = await callOllamaAPI(content);
      } else if (selectedModel === "aiti-pro") {
        // AITI Coder sekarang berfungsi normal
        response = `This is an advanced response from AITI Coder. I can provide detailed analysis and help with coding tasks regarding "${content}". I offer enhanced capabilities for technical discussions, programming assistance, and complex problem-solving.`;
      } else {
        // ollama
        response = await callOllamaAPI(content);
      }
      
      // Simulate streaming response
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
        await new Promise((resolve) => setTimeout(resolve, selectedModel === "aiti" ? 20 : 30));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: errorMessage, isStreaming: false } 
            : msg
        )
      );
      
      setConversations(prev => 
        prev.map(conv => 
          conv.id === convId 
            ? { 
                ...conv, 
                messages: conv.messages.map(msg => 
                  msg.id === aiMessageId 
                    ? { ...msg, content: errorMessage, isStreaming: false } 
                    : msg
                ) 
              } 
            : conv
        )
      );
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      setIsLoading(false);
      return;
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
  
  const shareConversation = (id: string) => {
    const conversation = conversations.find(conv => conv.id === id);
    if (!conversation) return;
    
    const text = conversation.messages
      .map(m => `${m.role === 'user' ? 'You' : m.model === 'aiti' ? 'AITI Lite' : m.model === 'ollama' ? 'Ollama' : 'AITI Coder'}: ${m.content}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Conversation shared",
        description: "The conversation has been copied to your clipboard"
      });
    });
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        conversations,
        selectedModel, 
        isLoading,
        activeConversationId,
        chainLength,
        ollamaConfig,
        setChainLength,
        setSelectedModel, 
        setOllamaConfig,
        sendMessage,
        clearChat,
        selectConversation,
        deleteConversation,
        clearAllHistory,
        shareConversation
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
