import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink } from 'lucide-react';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const RepoCard = ({ repo }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -3, scale: 1.02 }}
    className="backdrop-blur-md bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/50 hover:border-purple-500/50 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
          {repo.name}
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-purple-400 transition-colors" />
          </a>
        </h4>
        {repo.description && (
          <p className="text-sm text-gray-300 line-clamp-2 mb-2">{repo.description}</p>
        )}
      </div>
    </div>
    
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-3">
        {repo.language && (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
            {repo.language}
          </span>
        )}
        <div className="flex items-center gap-1 text-gray-400">
          <Star className="w-3 h-3" />
          <span>{repo.stargazers_count}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <GitFork className="w-3 h-3" />
          <span>{repo.forks_count}</span>
        </div>
      </div>
      <span className="text-gray-500">
        Updated {formatDate(repo.updated_at)}
      </span>
    </div>
  </motion.div>
);

export default RepoCard;