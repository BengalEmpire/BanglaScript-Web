import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Github, Loader2, Filter, Star, Users, Code, Sparkles, ArrowRight, TrendingUp, LogOut, Users as UsersIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import GitHubProfileCard from '../components/GitHubProfileCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { ApiContext } from '../context/ApiContext';
import { useStore } from '../store';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [minStars, setMinStars] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({ totalProfiles: 0, totalProjects: 0, totalStars: 0, totalGroups: 0 });
  const { getProfiles, getGitHubData, getAnalytics, loginWithGitHub, logout, createGroup, getMyGroup, user } = useContext(ApiContext);
  const { group, setGroup } = useStore();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
    fetchProfiles();
    if (user) fetchMyGroup();
  }, [currentPage, searchQuery, skillsFilter, minStars, user]);

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setStats({
        totalProfiles: data.overview.totalProfiles,
        totalProjects: data.overview.totalProjects,
        totalStars: Math.round(data.overview.avgStarsPerProfile * data.overview.totalProfiles),
        totalGroups: data.groupStats.totalGroups
      });
    } catch (error) {
      toast.error('Failed to fetch analytics');
    }
  };

  const fetchProfiles = async () => {
    try {
      const data = await getProfiles({ page: currentPage, search: searchQuery, skills: skillsFilter, minStars });
      setProfiles(data.profiles || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      toast.error('Failed to fetch profiles');
    }
  };

  const fetchMyGroup = async () => {
    try {
      const groupData = await getMyGroup();
      setGroup(groupData);
    } catch (error) {
      toast.error('Failed to fetch group');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.error('Group name is required');
      return;
    }
    try {
      const groupData = await createGroup(groupName);
      setGroup(groupData);
      toast.success('Group created successfully!');
      navigate('/editor');
    } catch (error) {
      toast.error(error.message || 'Failed to create group');
    }
  };

  const searchGitHub = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a GitHub username or URL');
      return;
    }
    try {
      const username = searchQuery.includes('github.com') ? searchQuery.split('/').pop() : searchQuery;
      await getGitHubData(username);
      navigate(`/profile/${username}`);
      toast.success('GitHub profile loaded successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to fetch GitHub data');
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Developer Canvas Beta (under development)
            </span>
          </h1>
          {user && (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/50 hover:bg-red-600/70 rounded-lg text-white transition-all duration-300"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>

        <div className="text-center mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 rounded-full border border-purple-500/30 text-purple-300 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            Discover & Collaborate
          </motion.div>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Connect with developers, build profiles, collaborate on code, and showcase your work.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8"
          >
            <StatCard icon={Users} value={stats.totalProfiles} label="Developers" color="from-purple-600 to-pink-600" />
            <StatCard icon={Code} value={stats.totalProjects} label="Projects" color="from-blue-600 to-cyan-600" />
            <StatCard icon={Star} value={stats.totalStars} label="Total Stars" color="from-yellow-500 to-orange-500" />
            <StatCard icon={UsersIcon} value={stats.totalGroups} label="Groups" color="from-green-600 to-teal-600" />
          </motion.div>
        </div>

        {!user ? (
          <div className="flex justify-center mb-12">
            <button
              onClick={loginWithGitHub}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-2xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              aria-label="Login with GitHub"
            >
              <Github className="w-5 h-5" />
              Login with GitHub
            </button>
          </div>
        ) : (
          <div className="mb-12 bg-gray-800/20 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-700/30 shadow-2xl">
            <form onSubmit={searchGitHub} className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by GitHub username, skills, or URL..."
                  className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-lg"
                  aria-label="Search GitHub profiles"
                />
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Toggle filters"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-900/30 rounded-2xl border border-gray-700/30"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Skills</label>
                      <input
                        type="text"
                        value={skillsFilter}
                        onChange={(e) => setSkillsFilter(e.target.value)}
                        placeholder="React, Python, AWS..."
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        aria-label="Filter by skills"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Stars</label>
                      <input
                        type="number"
                        value={minStars}
                        onChange={(e) => setMinStars(Math.max(0, e.target.value))}
                        placeholder="1000"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                        aria-label="Filter by minimum stars"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 rounded-2xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:scale-100"
                  aria-label="Search GitHub profiles"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Github className="w-5 h-5" />
                      Search GitHub
                    </>
                  )}
                </button>
                <button
                  onClick={() => navigate('/create')}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-2xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  aria-label="Create profile"
                >
                  <TrendingUp className="w-5 h-5" />
                  Create Profile
                </button>
                {group && (
                  <button
                    onClick={() => navigate('/editor')}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                    aria-label="Go to editor"
                  >
                    <Code className="w-5 h-5" />
                    Go to Editor
                  </button>
                )}
              </div>
            </form>

            {!group && (
              <div className="mt-6 p-6 bg-gray-900/30 rounded-2xl border border-gray-700/30">
                <h3 className="text-lg font-semibold text-white mb-4">Create a Group</h3>
                <form onSubmit={handleCreateGroup} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name..."
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    aria-label="Group name"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-xl text-white font-semibold transition-all duration-300"
                    aria-label="Create group"
                  >
                    Create Group
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              Featured Developers
            </h2>
            <div className="text-gray-400 text-sm">
              Showing {profiles.length} developers
            </div>
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
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
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
        </div>

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex justify-center items-center gap-4 mt-12"
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 disabled:bg-gray-800/30 rounded-xl text-white disabled:text-gray-500 transition-all duration-300 font-medium"
              aria-label="Previous page"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                    page === currentPage
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                  }`}
                  aria-label={`Page ${page}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 disabled:bg-gray-800/30 rounded-xl text-white disabled:text-gray-500 transition-all duration-300 font-medium"
              aria-label="Next page"
            >
              Next
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Home;