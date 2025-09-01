import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="flex justify-center items-center py-8"
  >
    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
  </motion.div>
);

export default LoadingSpinner;