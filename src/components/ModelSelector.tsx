
import * as React from "react";
import { ModelType } from "@/context/ChatContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ModelSelectorProps {
  selectedModel: ModelType;
  onChange: (model: ModelType) => void;
  disabled?: boolean;
}

export function ModelSelector({ selectedModel, onChange, disabled }: ModelSelectorProps) {
  const models: { id: ModelType; name: string; description: string }[] = [
    {
      id: "aiti",
      name: "AITI",
      description: "Fast responses for everyday questions",
    },
    {
      id: "aiti-pro",
      name: "AITI Pro",
      description: "Advanced capabilities for complex tasks",
    },
  ];

  return (
    <div className="flex flex-col space-y-2 p-4 border-b">
      <h3 className="font-medium text-sm">Select Model</h3>
      <div className="grid grid-cols-2 gap-2">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onChange(model.id)}
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
          </button>
        ))}
      </div>
    </div>
  );
}
