import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Github, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import GitHubProfileCard from '../components/GitHubProfileCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ApiContext } from '../context/ApiContext';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [minStars, setMinStars] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { getProfiles, getGitHubData, loading } = useContext(ApiContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, [currentPage, searchQuery, skillsFilter, minStars]);

  const fetchProfiles = async () => {
    try {
      const data = await getProfiles({ page: currentPage, search: searchQuery, skills: skillsFilter, minStars });
      setProfiles(data.profiles || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      toast.error('Failed to fetch profiles');
    }
  };

  const searchGitHub = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a GitHub username or URL');
      return;
    }

    try {
      const username = searchQuery.includes('github.com') 
        ? searchQuery.split('/').pop() 
        : searchQuery;
      await getGitHubData(username);
      navigate(`/profile/${username}`);
      toast.success('GitHub profile loaded successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to fetch GitHub data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 bg-clip-text text-transparent">
          Discover Amazing Developers
        </h1>

        <div className="mb-8 bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
          <form onSubmit={searchGitHub} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by GitHub username or URL"
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                value={skillsFilter}
                onChange={(e) => setSkillsFilter(e.target.value)}
                placeholder="Filter by skills (e.g., JavaScript, React)"
                className="w-full pl-4 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                value={minStars}
                onChange={(e) => setMinStars(Math.max(0, e.target.value))}
                placeholder="Minimum stars"
                className="w-full pl-4 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-semibold flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
              Search
            </button>
          </form>
          <button
            onClick={() => navigate('/create')}
            className="mt-4 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg text-white font-semibold transition-all"
          >
            Create Your Profile
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : profiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400"
          >
            No profiles found. Try adjusting your search or filters.
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            <AnimatePresence>
              {profiles.map((profile) => (
                <GitHubProfileCard
                  key={profile.githubUsername}
                  profile={profile}
                  onClick={() => navigate(`/profile/${profile.githubUsername}`)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white disabled:opacity-50 transition-all"
            >
              Previous
            </button>
            <span className="px-6 py-2 text-gray-300 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-6 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white disabled:opacity-50 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Home;