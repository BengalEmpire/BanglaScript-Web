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
import { useState } from "react";

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
  const [isLoadingChatGPT, setIsLoadingChatGPT] = useState(false);
  const [isLoadingGrok, setIsLoadingGrok] = useState(false);

  const getChatUrl = (platform: "chatgpt" | "grok") => {
    try {
      const encodedUrl = encodeURIComponent(pageUrl);
      const encodedPrompt = encodeURIComponent(customPrompt + pageUrl);

      if (platform === "grok") {
        return `https://grok.x.ai/?prompt=${encodedPrompt}`;
      }
      return `https://chat.openai.com/?prompt=${encodedPrompt}`;
    } catch (error) {
      console.error(`Error encoding URL or prompt for ${platform}:`, error);
      return "#";
    }
  };

  const handleClick = (platform: "chatgpt" | "grok") => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!pageUrl) {
      e.preventDefault();
      alert("No valid page URL provided.");
      return;
    }

    if (platform === "chatgpt") {
      setIsLoadingChatGPT(true);
    } else {
      setIsLoadingGrok(true);
    }

    if (onClickTrack) {
      onClickTrack();
    }

    setTimeout(() => {
      if (platform === "chatgpt") {
        setIsLoadingChatGPT(false);
      } else {
        setIsLoadingGrok(false);
      }
    }, 500);
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex gap-4">
        {/* ChatGPT Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Button
                as="a"
                href={getChatUrl("chatgpt")}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="gap-2 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/60 transition text-sm font-medium flex items-center"
                onClick={handleClick("chatgpt")}
                disabled={isLoadingChatGPT}
                aria-label="Open in ChatGPT to explain this page"
                aria-busy={isLoadingChatGPT}
              >
                <MessageCircle
                  className={`h-4 w-4 ${isLoadingChatGPT ? "animate-pulse" : ""} text-primary`}
                />
                <span>{isLoadingChatGPT ? "Opening..." : "Open in ChatGPT"}</span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-sm">
            Ask ChatGPT to explain this page 🧠
          </TooltipContent>
        </Tooltip>

        {/* Grok Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Button
                as="a"
                href={getChatUrl("grok")}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                className="gap-2 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/60 transition text-sm font-medium flex items-center"
                onClick={handleClick("grok")}
                disabled={isLoadingGrok}
                aria-label="Open in Grok to explain this page"
                aria-busy={isLoadingGrok}
              >
                <MessageCircle
                  className={`h-4 w-4 ${isLoadingGrok ? "animate-pulse" : ""} text-primary`}
                />
                <span>{isLoadingGrok ? "Opening..." : "Open in Grok"}</span>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-sm">
            Ask Grok to explain this page 🧠
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}