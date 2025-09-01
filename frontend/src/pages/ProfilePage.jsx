import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, Share2, ExternalLink, Github, Globe, Twitter, MapPin, Building, Calendar, Users, User, BookOpen, Star, Code } from 'lucide-react';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import RepoCard from '../components/RepoCard';
import { ApiContext } from '../context/ApiContext';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const profileRef = useRef();
  const [profile, setProfile] = useState(null);
  const { getProfile, loading } = useContext(ApiContext);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const data = await getProfile(username);
      setProfile(data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch profile');
      navigate('/');
    }
  };

  const downloadHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${profile.githubData.name || profile.githubData.login} - Developer Profile</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-900 text-white min-h-screen">
        ${profileRef.current?.innerHTML || ''}
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.githubData.login}-profile.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Profile downloaded successfully!');
  };

  const shareProfile = async () => {
    const shareData = {
      title: `${profile.githubData.name || profile.githubData.login} - Developer Profile`,
      text: profile.githubData.bio || `Check out ${profile.githubData.name || profile.githubData.login}'s developer profile`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Profile shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          navigator.clipboard.writeText(window.location.href);
          toast.success('Profile link copied to clipboard!');
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Profile link copied to clipboard!');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!profile) return null;

  const { githubData, repositories = [], customBio, skills = [], projects = [], socialLinks = {} } = profile;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 sm:p-6"
    >
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex gap-2">
          <button 
            onClick={shareProfile}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/30 hover:bg-blue-600/40 rounded-lg text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button 
            onClick={downloadHTML}
            className="flex items-center gap-2 px-4 py-2 bg-green-600/30 hover:bg-green-600/40 rounded-lg text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <div ref={profileRef} className="max-w-7xl mx-auto">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-gray-800/20 border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="relative">
                <img 
                  src={githubData.avatar_url} 
                  alt={githubData.name || githubData.login}
                  className="w-48 h-48 rounded-full object-cover ring-4 ring-purple-400/50 shadow-2xl"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20"></div>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                {githubData.name || githubData.login}
              </h1>
              <p className="text-purple-300 text-xl mb-4">@{githubData.login}</p>
              {(customBio || githubData.bio) && (
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">{customBio || githubData.bio}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                {githubData.location && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4" />
                    {githubData.location}
                  </div>
                )}
                {githubData.company && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Building className="w-4 h-4" />
                    {githubData.company}
                  </div>
                )}
                {githubData.created_at && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDate(githubData.created_at)}
                  </div>
                )}
                {githubData.email && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Globe className="w-4 h-4" />
                    {githubData.email}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <a 
                  href={githubData.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg border border-gray-600/50 hover:border-purple-500/50 transition-all flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                {socialLinks.website && (
                  <a 
                    href={socialLinks.website.startsWith('http') ? socialLinks.website : `https://${socialLinks.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-4 py-2 bg-blue-700/50 hover:bg-blue-600/50 rounded-lg border border-gray-600/50 hover:border-blue-500/50 transition-all flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                {socialLinks.twitter && (
                  <a 
                    href={socialLinks.twitter.startsWith('http') ? socialLinks.twitter : `https://twitter.com/${socialLinks.twitter}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-4 py-2 bg-sky-700/50 hover:bg-sky-600/50 rounded-lg border border-gray-600/50 hover:border-cyan-500/50 transition-all flex items-center gap-2"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a 
                    href={socialLinks.linkedin.startsWith('http') ? socialLinks.linkedin : `https://${socialLinks.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-4 py-2 bg-blue-800/50 hover:bg-blue-700/50 rounded-lg border border-gray-600/50 hover:border-blue-800/50 transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.024-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.048c.476-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">📊 GitHub Stats</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={BookOpen} label="Repositories" value={githubData.public_repos} />
            <StatCard icon={Users} label="Followers" value={githubData.followers} color="blue" />
            <StatCard icon={User} label="Following" value={githubData.following} color="green" />
            <StatCard icon={Star} label="Total Stars" value={profile.totalStars} color="yellow" />
          </div>
        </motion.section>

        {skills.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">💻 Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {projects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6">🚀 Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="backdrop-blur-md bg-gray-800/30 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/50 hover:border-purple-500/50 transition-all duration-300"
                >
                  <h4 className="font-semibold text-white mb-1">{project.name}</h4>
                  <p className="text-sm text-gray-300 mb-2">{project.description}</p>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-sm flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Project
                    </a>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6">📈 Activity & Stats</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="backdrop-blur-md bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">GitHub Stats</h3>
              <img 
                src={`https://github-readme-stats.vercel.app/api?username=${githubData.login}&show_icons=true&theme=tokyonight&include_all_commits=true&count_private=true`} 
                alt="GitHub Stats" 
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="backdrop-blur-md bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Top Languages</h3>
              <img 
                src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${githubData.login}&layout=compact&langs_count=8&theme=tokyonight`} 
                alt="Top Languages" 
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
            </div>
          </div>
          <div className="mt-6 backdrop-blur-md bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Contribution Activity</h3>
            <img 
              src={`https://github-readme-activity-graph.vercel.app/graph?username=${githubData.login}&theme=tokyo-night&bg_color=1a1b27&color=70a5fd&line=bf91f3&point=38bdae&area=true&hide_border=true`} 
              alt="GitHub Activity Graph" 
              className="w-full h-auto rounded-lg"
              loading="lazy"
            />
          </div>
        </motion.section>

        {repositories.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <Code className="w-8 h-8" />
              Recent Repositories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {repositories.slice(0, 9).map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;