
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings } from "@/components/Settings";

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
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/chat" className="flex items-center space-x-2">
            <span className="text-xl font-bold gradient-text">AITI Chat</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                {user.email}
              </span>
              <span className="text-xs px-2 py-1 bg-primary/10 rounded-full hidden sm:inline-block">
                {selectedModel === "aiti" ? "AITI Lite" : "AITI Coder"}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
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
