import React from 'react';
import { motion } from 'framer-motion';
import { Github, MapPin, Users, BookOpen, Star } from 'lucide-react';

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const GitHubProfileCard = ({ profile, onClick, compact = false }) => {
  const { githubData, totalStars } = profile;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5, scale: 1.03 }}
      className={`backdrop-blur-xl bg-gradient-to-br from-gray-800/20 via-gray-900/20 to-transparent border border-gray-700/50 rounded-2xl p-6 cursor-pointer hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-xl ${
        compact ? 'max-w-sm' : ''
      }`}
      onClick={() => onClick(profile)}
    >
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={githubData.avatar_url} 
          alt={githubData.name || githubData.login}
          className="w-16 h-16 rounded-full ring-2 ring-purple-400/50 shadow-md"
          loading="lazy"
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
      
      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        {githubData.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{githubData.location}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{formatNumber(githubData.followers)}</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          <span>{githubData.public_repos}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          <span>{formatNumber(totalStars)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubProfileCard;