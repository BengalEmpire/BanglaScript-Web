import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Github, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import GitHubProfileCard from '../components/GitHubProfileCard';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE = 'http://localhost:5000/api';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, [currentPage, searchQuery]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/profiles?page=${currentPage}&search=${searchQuery}`);
      const data = await response.json();
      setProfiles(data.profiles || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  const searchGitHub = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a GitHub username or URL');
      return;
    }

    setLoading(true);
    try {
      const username = searchQuery.includes('github.com') 
        ? searchQuery.split('/').pop() 
        : searchQuery;

      const response = await fetch(`${API_BASE}/github/${username}`);
      if (!response.ok) {
        throw new Error('GitHub user not found');
      }
      
      navigate(`/profile/${username}`);
      toast.success('GitHub profile loaded successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to fetch GitHub data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-white mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Developer Platform
        </h1>

        <div className="mb-8">
          <form onSubmit={searchGitHub} className="flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter GitHub username or URL"
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
              Search
            </button>
          </form>
          <button
            onClick={() => navigate('/create')}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg mx-auto block"
          >
            Create Profile
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg disabled:opacity-50"
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