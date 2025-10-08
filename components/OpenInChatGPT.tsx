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

export default function OpenInChatGPT({ pageUrl }: { pageUrl: string }) {
  const chatUrl = `https://chat.openai.com/g/g-banglascript-helper?context=${encodeURIComponent(pageUrl)}`;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <Button
              asChild
              variant="outline"
              className="gap-2 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/60 transition text-sm font-medium"
            >
              <a
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                <span>Open in ChatGPT</span>
              </a>
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-sm">
          Ask ChatGPT to explain this page 🧠
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}