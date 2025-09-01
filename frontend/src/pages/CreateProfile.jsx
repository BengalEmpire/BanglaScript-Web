import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Github, ArrowLeft, User, Code, Briefcase, Globe, Palette, Eye, EyeOff, Plus, X, Check, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ApiContext } from '../context/ApiContext';
import { useStore } from '../store/index';
import validator from 'validator';

const CreateProfile = () => {
  const { user, createProfile, loading } = useContext(ApiContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    githubUsername: user?.username || '',
    customBio: '',
    skills: '',
    projects: [{ name: '', description: '', url: '', tech: '' }],
    socialLinks: { linkedin: '', twitter: '', website: '', portfolio: '' },
    theme: { primaryColor: '#8b5cf6', secondaryColor: '#06b6d4', background: 'gradient' },
    isPublic: true
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to create a profile');
      navigate('/');
    } else {
      setFormData((prev) => ({ ...prev, githubUsername: user.username }));
      setCompletedSteps((prev) => new Set([...prev, 0]));
    }
  }, [user, navigate]);

  const steps = [
    { id: 0, title: 'Basic Info', icon: User, description: 'Connect your GitHub account' },
    { id: 1, title: 'Skills & Bio', icon: Code, description: 'Showcase your expertise' },
    { id: 2, title: 'Projects', icon: Briefcase, description: 'Highlight your work' },
    { id: 3, title: 'Social Links', icon: Globe, description: 'Link your online presence' },
    { id: 4, title: 'Customize', icon: Palette, description: 'Personalize your profile' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim() && !completedSteps.has(currentStep)) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
    }
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    const newProjects = [...formData.projects];
    newProjects[index] = { ...newProjects[index], [name]: value };
    setFormData((prev) => ({ ...prev, projects: newProjects }));
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', url: '', tech: '' }]
    }));
  };

  const removeProject = (index) => {
    if (formData.projects.length > 1) {
      setFormData((prev) => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index)
      }));
    } else {
      toast.error('At least one project is required');
    }
  };

  const validateForm = () => {
    if (!formData.githubUsername.trim()) {
      toast.error('GitHub username is required');
      return false;
    }
    if (!/^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i.test(formData.githubUsername)) {
      toast.error('Invalid GitHub username format');
      return false;
    }
    if (formData.customBio.length > 1000) {
      toast.error('Custom bio must be less than 1000 characters');
      return false;
    }
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
    if (skillsArray.length > 50) {
      toast.error('Maximum 50 skills allowed');
      return false;
    }
    for (const project of formData.projects) {
      if (project.name.trim() && project.url && !validator.isURL(project.url)) {
        toast.error('Project URLs must be valid (e.g., https://example.com)');
        return false;
      }
      if (project.description.length > 500) {
        toast.error('Project description must be less than 500 characters');
        return false;
      }
      if (project.name.length > 100) {
        toast.error('Project name must be less than 100 characters');
        return false;
      }
      const techArray = project.tech.split(',').map(t => t.trim()).filter(t => t);
      if (techArray.length > 30) {
        toast.error('Maximum 30 technologies per project');
        return false;
      }
    }
    const socialLinks = ['linkedin', 'twitter', 'website', 'portfolio'];
    for (const key of socialLinks) {
      if (formData.socialLinks[key] && !validator.isURL(formData.socialLinks[key])) {
        toast.error(`Invalid ${key} URL`);
        return false;
      }
    }
    if (!formData.theme.primaryColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      toast.error('Invalid primary color format');
      return false;
    }
    if (!formData.theme.secondaryColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      toast.error('Invalid secondary color format');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const profileData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        projects: formData.projects.map(p => ({
          ...p,
          tech: p.tech.split(',').map(t => t.trim()).filter(t => t)
        }))
      };
      const response = await createProfile(profileData);
      toast.success('Profile created successfully!');
      navigate(`/profile/${formData.githubUsername}`);
    } catch (error) {
      toast.error(error.message || 'Failed to create profile');
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && getStepCompletion()) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
    } else {
      toast.error('Please complete the current step');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepCompletion = () => {
    switch (currentStep) {
      case 0: return formData.githubUsername.length > 0;
      case 1: return formData.customBio.length > 0 || formData.skills.length > 0;
      case 2: return formData.projects.some(p => p.name.length > 0);
      case 3: return Object.values(formData.socialLinks).some(link => link.length > 0);
      case 4: return true;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
                <Github className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Connect Your GitHub</h2>
              <p className="text-gray-400">Your GitHub profile is the foundation of your developer identity</p>
            </div>
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Username
              </label>
              <input
                type="text"
                name="githubUsername"
                value={formData.githubUsername}
                onChange={handleInputChange}
                placeholder="Enter your GitHub username"
                className="w-full px-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                required
                disabled
                aria-label="GitHub username"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Showcase Your Skills</h2>
              <p className="text-gray-400">Tell the world what makes you unique as a developer</p>
            </div>
            <div className="space-y-6">
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-200 mb-2">Your Story</label>
                <textarea
                  name="customBio"
                  value={formData.customBio}
                  onChange={handleInputChange}
                  placeholder="Write a compelling bio that captures your passion for coding..."
                  className="w-full px-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300 min-h-[150px]"
                  aria-label="Custom bio"
                />
                <span className="absolute bottom-2 right-3 text-xs text-gray-400">{formData.customBio.length}/1000</span>
              </div>
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-200 mb-2">Skills (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="React, Python, AWS..."
                  className="w-full px-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all duration-300"
                  aria-label="Skills"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Highlight Your Projects</h2>
              <p className="text-gray-400">Showcase the amazing work you've built</p>
            </div>
            {formData.projects.map((project, index) => (
              <div key={index} className="space-y-4 p-4 bg-gray-900/30 rounded-xl border border-gray-700/30">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Project {index + 1}</h3>
                  {formData.projects.length > 1 && (
                    <button
                      onClick={() => removeProject(index)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                      aria-label="Remove project"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">Project Name</label>
                    <input
                      type="text"
                      name="name"
                      value={project.name}
                      onChange={(e) => handleProjectChange(index, e)}
                      placeholder="Project Name"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      aria-label={`Project ${index + 1} name`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">Project URL</label>
                    <input
                      type="url"
                      name="url"
                      value={project.url}
                      onChange={(e) => handleProjectChange(index, e)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                      aria-label={`Project ${index + 1} URL`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, e)}
                    placeholder="Describe your project..."
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 min-h-[100px]"
                    aria-label={`Project ${index + 1} description`}
                  />
                  <span className="absolute bottom-2 right-3 text-xs text-gray-400">{project.description.length}/500</span>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    name="tech"
                    value={project.tech}
                    onChange={(e) => handleProjectChange(index, e)}
                    placeholder="React, Node.js, MongoDB..."
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    aria-label={`Project ${index + 1} technologies`}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addProject}
              className="flex items-center gap-2 px-4 py-2 bg-green-600/50 hover:bg-green-600/70 rounded-xl text-white transition-all duration-300"
              aria-label="Add another project"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Connect Your Online Presence</h2>
              <p className="text-gray-400">Link your social profiles to network with others</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['linkedin', 'twitter', 'website', 'portfolio'].map((key) => (
                <div key={key} className="relative group">
                  <label className="block text-sm font-semibold text-gray-200 mb-2 capitalize">{key}</label>
                  <input
                    type="url"
                    name={key}
                    value={formData.socialLinks[key]}
                    onChange={handleSocialLinkChange}
                    placeholder={`Enter your ${key} URL`}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    aria-label={`${key} URL`}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mb-4">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Personalize Your Profile</h2>
              <p className="text-gray-400">Choose colors and visibility settings</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Primary Color</label>
                <input
                  type="color"
                  name="primaryColor"
                  value={formData.theme.primaryColor}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, primaryColor: e.target.value }
                  }))}
                  className="w-full h-12 bg-gray-900/50 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
                  aria-label="Primary color"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Secondary Color</label>
                <input
                  type="color"
                  name="secondaryColor"
                  value={formData.theme.secondaryColor}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, secondaryColor: e.target.value }
                  }))}
                  className="w-full h-12 bg-gray-900/50 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
                  aria-label="Secondary color"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Background Style</label>
              <select
                name="background"
                value={formData.theme.background}
                onChange={(e) => setFormData((prev) => ({
                  ...prev,
                  theme: { ...prev.theme, background: e.target.value }
                }))}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
                aria-label="Background style"
              >
                <option value="gradient">Gradient</option>
                <option value="solid">Solid</option>
                <option value="pattern">Pattern</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))}
                className="w-5 h-5 bg-gray-900/50 border border-gray-700/50 rounded focus:ring-2 focus:ring-teal-500/50"
                aria-label="Make profile public"
              />
              <label htmlFor="isPublic" className="text-sm font-semibold text-gray-200">
                Make Profile Public
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-3xl mx-auto p-6 sm:p-8"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors duration-200"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-gray-800/20 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-700/30 shadow-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
            Create Your Developer Profile
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  currentStep === index
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                    : completedSteps.has(index)
                    ? 'bg-green-600/20 border border-green-500/50'
                    : 'bg-gray-900/50 border border-gray-700/50'
                }`}
                onClick={() => setCurrentStep(index)}
                role="button"
                aria-label={`Go to ${step.title} step`}
              >
                <step.icon className="w-5 h-5 text-white" />
                <div>
                  <div className="text-sm font-semibold text-white">{step.title}</div>
                  <div className="text-xs text-gray-400">{step.description}</div>
                </div>
                {completedSteps.has(index) && (
                  <Check className="w-5 h-5 text-green-400 ml-auto" />
                )}
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between items-center mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 disabled:bg-gray-800/30 rounded-xl text-white disabled:text-gray-500 transition-all duration-300"
                aria-label="Previous step"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600/50 hover:bg-blue-600/70 rounded-xl text-white transition-all duration-300"
                aria-label={showPreview ? 'Hide preview' : 'Show preview'}
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white transition-all duration-300"
                  aria-label="Next step"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:bg-gray-600/50 rounded-xl text-white transition-all duration-300"
                  aria-label="Save profile"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Save Profile
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 p-6 bg-gray-900/30 rounded-2xl border border-gray-700/30"
            >
              <h2 className="text-xl font-bold text-white mb-4">Profile Preview</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Username</h3>
                  <p className="text-gray-400">{formData.githubUsername || 'Not set'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Bio</h3>
                  <p className="text-gray-400">{formData.customBio || 'Not set'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Skills</h3>
                  <p className="text-gray-400">{formData.skills || 'Not set'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Projects</h3>
                  {formData.projects.map((project, index) => (
                    <div key={index} className="ml-4">
                      <p className="text-gray-400">{project.name || 'Unnamed Project'}</p>
                      <p className="text-gray-500 text-sm">{project.description || 'No description'}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Social Links</h3>
                  {Object.entries(formData.socialLinks).map(([key, value]) => (
                    value && <p key={key} className="text-gray-400">{key}: {value}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateProfile;