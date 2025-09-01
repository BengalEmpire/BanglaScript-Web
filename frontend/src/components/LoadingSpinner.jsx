import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => (
  <motion.div 
    className="flex items-center justify-center p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
  </motion.div>
);

export default LoadingSpinner;