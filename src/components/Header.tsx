
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings } from "@/components/Settings";
import { cn } from "@/lib/utils";

export function Header() {
  const { user } = useAuth();
  const { selectedModel } = useChat();
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  
  const toggleTheme = () => {
    const newThemeValue = !isDarkTheme;
    setIsDarkTheme(newThemeValue);
    
    if (newThemeValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  const initials = user?.name 
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() 
    : user?.email?.substring(0, 2).toUpperCase() || "U";

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
        return "bg-aiti-light/20 text-aiti-light";
      case "aiti-pro":
        return "bg-red-500/20 text-red-500";
      case "ollama":
        return "bg-green-500/20 text-green-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur shadow-sm">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/chat" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">AITI Chat</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                {user.email}
              </span>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full hidden sm:inline-block",
                getModelColor()
              )}>
                {getModelDisplayName()}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-primary/10 transition-all" 
                onClick={() => setShowSettings(true)}
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
              
              <Settings
                open={showSettings}
                onOpenChange={setShowSettings}
                onToggleTheme={toggleTheme}
                isDarkTheme={isDarkTheme}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
