
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
import { Slider } from "@/components/ui/slider";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { ModelType } from "@/context/ChatContext";
import { 
  Moon,
  Sun,
  Trash2, 
  LogOut,
  Share2
} from "lucide-react";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleTheme: () => void;
  isDarkTheme: boolean;
}

export function Settings({ open, onOpenChange, onToggleTheme, isDarkTheme }: SettingsProps) {
  const { selectedModel, setSelectedModel, clearChat, clearAllHistory, chainLength, setChainLength } = useChat();
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
  
  const handleClearAllHistory = () => {
    clearAllHistory();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your chat experience
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">AI Model</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="aiti-model" 
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <div className={`w-3 h-3 rounded-full ${selectedModel === "aiti" ? "bg-primary" : "bg-gray-300"}`}></div>
                  AITI Lite
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
                  AITI Coder
                </label>
                <Switch 
                  id="aiti-pro-model" 
                  checked={selectedModel === "aiti-pro"} 
                  onCheckedChange={() => setSelectedModel("aiti-pro")} 
                />
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2">
              <p><strong>AITI Lite:</strong> Fast responses for everyday questions</p>
              <p><strong>AITI Coder:</strong> Advanced programming and technical capabilities</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Chain Length</h3>
            <div className="px-2">
              <Slider
                defaultValue={[chainLength]}
                max={10}
                min={1}
                step={1}
                onValueChange={(value) => setChainLength(value[0])}
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>1</span>
                <span>Current: {chainLength}</span>
                <span>10</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Control how many previous messages are included in the context when generating responses.
              </p>
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
              Clear Current Chat
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 text-destructive hover:text-destructive"
              onClick={handleClearAllHistory}
            >
              <Trash2 className="h-4 w-4" />
              Clear All History
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
