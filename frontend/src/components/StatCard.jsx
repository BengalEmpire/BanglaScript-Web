import React from 'react';

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const StatCard = ({ icon: Icon, label, value, color = 'purple' }) => (
  <div className={`backdrop-blur-md bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 text-center hover:bg-gray-800/50 hover:border-${color}-500/50 transition-all duration-300`}>
    <Icon className={`w-6 h-6 mx-auto mb-2 text-${color}-400`} />
    <div className="text-2xl font-bold text-white mb-1">{formatNumber(value)}</div>
    <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
  </div>
);

export default StatCard;