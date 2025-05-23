
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { ModelType } from "@/context/ChatContext";
import { 
  Moon,
  Sun,
  Trash2, 
  LogOut
} from "lucide-react";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleTheme: () => void;
  isDarkTheme: boolean;
}

export function Settings({ open, onOpenChange, onToggleTheme, isDarkTheme }: SettingsProps) {
  const { selectedModel, setSelectedModel, clearChat } = useChat();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleClearAllChats = () => {
    clearChat();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your chat experience
          </SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">AI Model</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="aiti-model" 
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <div className={`w-3 h-3 rounded-full ${selectedModel === "aiti" ? "bg-primary" : "bg-gray-300"}`}></div>
                  AITI
                </label>
                <Switch 
                  id="aiti-model" 
                  checked={selectedModel === "aiti"} 
                  onCheckedChange={() => setSelectedModel("aiti")} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="aiti-pro-model" 
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <div className={`w-3 h-3 rounded-full ${selectedModel === "aiti-pro" ? "bg-primary" : "bg-gray-300"}`}></div>
                  AITI Pro
                </label>
                <Switch 
                  id="aiti-pro-model" 
                  checked={selectedModel === "aiti-pro"} 
                  onCheckedChange={() => setSelectedModel("aiti-pro")} 
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Appearance</h3>
            <div className="flex items-center justify-between">
              <label htmlFor="theme-switch" className="flex items-center gap-2 text-sm cursor-pointer">
                {isDarkTheme ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {isDarkTheme ? "Dark Mode" : "Light Mode"}
              </label>
              <Switch 
                id="theme-switch" 
                checked={isDarkTheme} 
                onCheckedChange={onToggleTheme} 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Data Management</h3>
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 text-destructive hover:text-destructive"
              onClick={handleClearAllChats}
            >
              <Trash2 className="h-4 w-4" />
              Clear All Chats
            </Button>
          </div>
        </div>
        
        <SheetFooter className="pt-4 border-t">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
