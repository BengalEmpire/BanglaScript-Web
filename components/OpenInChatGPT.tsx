"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface OpenInAIProps {
  pageUrl: string;
  customPrompt?: string;
  onClickTrack?: () => void;
}

export default function OpenInAI({
  pageUrl,
  customPrompt = "Explain this page in detail: ",
  onClickTrack,
}: OpenInAIProps) {
  const getChatUrl = () => {
    try {
      const encodedPrompt = encodeURIComponent(customPrompt + " " + pageUrl);
      return `https://chat.openai.com/?prompt=${encodedPrompt}`;
    } catch (error) {
      console.error("Error encoding ChatGPT URL or prompt:", error);
      return "#";
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!pageUrl) {
      e.preventDefault();
      alert("No valid page URL provided.");
      return;
    }

    if (onClickTrack) {
      onClickTrack();
    }

    // Open in new tab manually (optional, as <a target="_blank"> also does this)
    window.open(getChatUrl(), "_blank");
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Button
                as="a"
                href={getChatUrl()}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="gap-2 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/60 transition text-sm font-medium flex items-center"
                onClick={handleClick}
                aria-label="Open in ChatGPT to explain this page"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                <span>Open in ChatGPT</span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-sm">
            Ask ChatGPT to explain this page 🧠
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}