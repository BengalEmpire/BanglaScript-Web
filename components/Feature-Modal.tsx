"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Gift } from "lucide-react";
import CurvedLoop from "./CurvedLoop";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Modal({ isOpen, onClose, image }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-md mx-4 rounded-2xl bg-background shadow-2xl overflow-hidden"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1 text-black shadow hover:bg-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Image Section */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <img
                  src={image}
                  alt="BanglaScript Free Winter Hoodie"
                  className="w-full h-full object-cover"
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-sm font-medium">
                  Community Free Winter Hoodie 🎁
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Content */}
          <div className="p-5 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold">
              <Gift className="h-5 w-5" />
              Free Hoodie – Community Edition
            </div>

            <p className="text-sm text-muted-foreground">
              BanglaScript থেকে বিশেষ ফ্রি winter hoodie।
              খুব শিগগিরই eligibility ও details জানানো হবে।
            </p>

            <p className="text-xs text-muted-foreground">
              Want to sponsor? <span className="font-medium">mahmud@devplus.fun</span>
            </p>
          </div>
        </motion.div>

        {/* Bottom Marquee */}
        <div className="absolute bottom-6 w-full">
          <CurvedLoop marqueeText="BanglaScript ✦ 4.0.0 ✦" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}