import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { Example } from "@/lib/playground-example-bjs";

interface ExamplesBarProps {
  examples: Example[];
  onExampleSelect: (code: string) => void;
}

export function ExamplesBar({ examples, onExampleSelect }: ExamplesBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-yellow-400" />
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">উদাহরণ দেখুন:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {examples.map((example, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onExampleSelect(example.code)}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-gray-700 rounded-lg hover:border-green-500 hover:bg-gray-700 transition-all shadow-md hover:shadow-green-500/20 cursor-pointer"
          >
            {example.title}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}