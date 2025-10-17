'use client';

import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DownloadButton = () => {
  const downloadUrl = 'https://github.com/BengalEmpire/banglascript-desktop/releases/download/v1.1.0/BanglaScript.Playground.exe';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'BanglaScript.Playground.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-colors cursor-pointer"
          >
            Download Playground
          </motion.button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Practice in the offline Playground on your Desktop!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DownloadButton;