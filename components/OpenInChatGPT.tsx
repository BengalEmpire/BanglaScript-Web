"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function OpenInChatGPT({ pageUrl }: { pageUrl: string }) {
  const chatUrl = `https://chat.openai.com/?prompt=${encodeURIComponent("Explain this page: " + pageUrl)}`;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            as="a"
            href={chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="gap-2 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/60 transition text-sm font-medium flex items-center"
          >
            <MessageCircle className="h-4 w-4 text-primary" />
            <span>Open in ChatGPT</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-sm">
          Ask ChatGPT to explain this page 🧠
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}