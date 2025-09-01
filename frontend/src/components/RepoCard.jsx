import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, Code, Calendar } from 'lucide-react';

const RepoCard = ({ repo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:bg-gray-800/30 transition-all duration-300"
    >
      <h3 className="text-lg font-semibold text-white mb-2">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-purple-400 transition-colors duration-200"
          aria-label={`View ${repo.name} on GitHub`}
        >
          {repo.name}
        </a>
      </h3>
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{repo.description || 'No description'}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {repo.language && (
          <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">
            {repo.language}
          </span>
        )}
        {repo.topics?.slice(0, 2).map((topic, index) => (
          <span key={index} className="px-2 py-1 bg-gray-600/20 text-gray-300 text-xs rounded-full">
            {topic}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          {repo.stargazers_count}
        </div>
        <div className="flex items-center gap-1">
          <GitFork className="w-4 h-4 text-green-400" />
          {repo.forks_count}
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-blue-400" />
          {new Date(repo.updated_at).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};

export default RepoCard;