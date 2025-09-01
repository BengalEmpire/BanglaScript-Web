import React from 'react';
import { motion } from 'framer-motion';
import { Github, Star, Users, Code } from 'lucide-react';

const GitHubProfileCard = ({ profile, onClick }) => {
  const { githubUsername, githubData, skills = [], projects = [], userId } = profile;
  const totalStars = profile.repositories?.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0) || 0;
  const averageRating = userId?.ratings?.length
    ? (userId.ratings.reduce((sum, r) => sum + r.score, 0) / userId.ratings.length).toFixed(1)
    : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:bg-gray-800/40 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View ${githubUsername}'s profile`}
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={githubData?.avatar_url || 'https://via.placeholder.com/64'}
          alt={`${githubUsername}'s avatar`}
          className="w-16 h-16 rounded-full border-2 border-gray-600/50 group-hover:border-purple-500/50 transition-all duration-300"
        />
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
            {githubData?.name || githubUsername}
          </h3>
          <p className="text-sm text-gray-400">@{githubUsername}</p>
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{githubData?.bio || profile.customBio || 'No bio available'}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full"
          >
            {skill}
          </span>
        ))}
        {skills.length > 3 && (
          <span className="px-2 py-1 bg-gray-600/20 text-gray-300 text-xs rounded-full">
            +{skills.length - 3}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-300">{totalStars} Stars</span>
        </div>
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300">{projects.length} Projects</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-green-400" />
          <span className="text-gray-300">{userId?.groupId ? 'In Group' : 'No Group'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Github className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300">Rating: {averageRating}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GitHubProfileCard;