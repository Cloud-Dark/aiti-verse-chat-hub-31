
import * as React from "react";
import { ModelType } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModelSelectorProps {
  selectedModel: ModelType;
  onChange: (model: ModelType) => void;
  disabled?: boolean;
}

export function ModelSelector({ selectedModel, onChange, disabled }: ModelSelectorProps) {
  const [showComingSoon, setShowComingSoon] = React.useState(false);

  const models: { id: ModelType; name: string; description: string }[] = [
    {
      id: "aiti",
      name: "AITI Lite",
      description: "Fast responses for everyday questions",
    },
    {
      id: "aiti-pro",
      name: "AITI Coder",
      description: "Advanced capabilities for complex tasks",
    },
  ];

  const handleModelSelect = (modelId: ModelType) => {
    if (modelId === "aiti-pro") {
      setShowComingSoon(true);
      return;
    }
    onChange(modelId);
  };

  return (
    <>
      <div className="flex flex-col space-y-2 p-4 border-b">
        <h3 className="font-medium text-sm">Select Model</h3>
        <div className="grid grid-cols-2 gap-2">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => handleModelSelect(model.id)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-start rounded-lg border p-3 text-left transition-colors",
                selectedModel === model.id
                  ? "border-primary bg-primary/5"
                  : "bg-background hover:bg-accent"
              )}
            >
              <div className="font-medium">{model.name}</div>
              <div className="text-xs text-muted-foreground">
                {model.description}
              </div>
              {model.id === "aiti-pro" && (
                <div className="text-xs text-orange-500 mt-1 font-medium">
                  Coming Soon
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>AITI Coder - Coming Soon</DialogTitle>
            <DialogDescription>
              AITI Coder with advanced programming capabilities is currently under development. 
              Please use AITI Lite for now. We'll notify you when AITI Coder is available.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowComingSoon(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
