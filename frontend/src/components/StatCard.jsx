import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, value, label, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:bg-gray-800/40 transition-all duration-300 group"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <div className="text-lg font-bold text-white">{value.toLocaleString()}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  </motion.div>
);

export default StatCard;