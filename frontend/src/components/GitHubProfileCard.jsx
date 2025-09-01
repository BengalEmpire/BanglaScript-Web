import React from 'react';
import { motion } from 'framer-motion';
import { Github, MapPin, Users, BookOpen } from 'lucide-react';

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const GitHubProfileCard = ({ profile, onClick, compact = false }) => {
  const { githubData } = profile;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-xl p-6 cursor-pointer hover:border-white/20 transition-all duration-300 shadow-xl ${
        compact ? 'max-w-sm' : ''
      }`}
      onClick={() => onClick(profile)}
    >
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={githubData.avatar_url} 
          alt={githubData.name || githubData.login}
          className="w-16 h-16 rounded-full ring-2 ring-purple-400/50"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white truncate">
            {githubData.name || githubData.login}
          </h3>
          <p className="text-purple-300 text-sm">@{githubData.login}</p>
        </div>
        <Github className="w-5 h-5 text-gray-400" />
      </div>
      
      {githubData.bio && (
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{githubData.bio}</p>
      )}
      
      <div className="flex items-center gap-4 text-sm text-gray-400">
        {githubData.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{githubData.location}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>{formatNumber(githubData.followers)}</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          <span>{githubData.public_repos}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubProfileCard;