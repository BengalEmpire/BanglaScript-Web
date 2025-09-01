import React, { useState } from 'react';
import { Loader2, Github, ArrowLeft, User, Code, Globe, Briefcase, Palette, Eye, EyeOff, Plus, X, Check, Star, Zap, Heart } from 'lucide-react';

const CreateProfile = () => {
  const [formData, setFormData] = useState({
    githubUsername: '',
    customBio: '',
    skills: '',
    projects: [{ name: '', description: '', url: '', tech: '' }],
    socialLinks: { linkedin: '', twitter: '', website: '', portfolio: '' },
    theme: { primaryColor: '#8b5cf6', secondaryColor: '#06b6d4', background: 'gradient' },
    isPublic: true
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showPreview, setShowPreview] = useState(false);

  const steps = [
    { id: 0, title: 'Basic Info', icon: User, description: 'Tell us about yourself' },
    { id: 1, title: 'Skills & Bio', icon: Code, description: 'Showcase your expertise' },
    { id: 2, title: 'Projects', icon: Briefcase, description: 'Display your work' },
    { id: 3, title: 'Social Links', icon: Globe, description: 'Connect with others' },
    { id: 4, title: 'Customize', icon: Palette, description: 'Make it yours' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Mark step as completed when user starts filling
    if (value.trim() && !completedSteps.has(currentStep)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
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
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Profile created successfully!');
    }, 2000);
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
              <h2 className="text-2xl font-bold text-white mb-2">Let's start with the basics</h2>
              <p className="text-gray-400">Your GitHub profile is the foundation of your developer identity</p>
            </div>

            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Username or URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="githubUsername"
                  value={formData.githubUsername}
                  onChange={handleInputChange}
                  placeholder="Enter your GitHub username or URL"
                  className="w-full px-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 hover:border-gray-600/50"
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
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
              <h2 className="text-2xl font-bold text-white mb-2">Show off your expertise</h2>
              <p className="text-gray-400">Tell the world what makes you unique as a developer</p>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Your Story
                </label>
                <textarea
                  name="customBio"
                  value={formData.customBio}
                  onChange={handleInputChange}
                  placeholder="Write a compelling bio that captures your passion for coding..."
                  className="w-full px-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 hover:border-gray-600/50 resize-none"
                  rows="5"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Skills & Technologies
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="JavaScript, React, Node.js, Python, AWS..."
                  className="w-full px-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300 hover:border-gray-600/50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-green-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Showcase your projects</h2>
              <p className="text-gray-400">Your work speaks louder than words</p>
            </div>

            <div className="space-y-4">
              {formData.projects.map((project, index) => (
                <div key={index} className="relative group">
                  <div className="bg-gray-900/30 border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300">
                    {formData.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="absolute top-4 right-4 w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        name="name"
                        value={project.name}
                        onChange={(e) => handleProjectChange(index, e)}
                        placeholder="Project Name"
                        className="px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                      />
                      <input
                        type="text"
                        name="url"
                        value={project.url}
                        onChange={(e) => handleProjectChange(index, e)}
                        placeholder="Project URL"
                        className="px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                      />
                    </div>
                    
                    <textarea
                      name="description"
                      value={project.description}
                      onChange={(e) => handleProjectChange(index, e)}
                      placeholder="Describe what makes this project special..."
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all mb-4 resize-none"
                      rows="3"
                    />
                    
                    <input
                      type="text"
                      name="tech"
                      value={project.tech}
                      onChange={(e) => handleProjectChange(index, e)}
                      placeholder="Technologies used (React, Node.js, MongoDB...)"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              ))}
              
              <button
                type="button"
                onClick={addProject}
                className="w-full py-4 border-2 border-dashed border-gray-600 hover:border-orange-500/50 rounded-xl text-gray-400 hover:text-orange-400 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Another Project
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Connect with the world</h2>
              <p className="text-gray-400">Make it easy for people to find and connect with you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'linkedin', label: 'LinkedIn', color: 'blue' },
                { key: 'twitter', label: 'Twitter/X', color: 'cyan' },
                { key: 'website', label: 'Website', color: 'indigo' },
                { key: 'portfolio', label: 'Portfolio', color: 'purple' }
              ].map(({ key, label, color }) => (
                <div key={key} className="relative group">
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={formData.socialLinks[key]}
                    onChange={handleSocialLinkChange}
                    placeholder={`Your ${label} URL`}
                    className={`w-full px-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-${color}-500/50 focus:border-${color}-500/50 transition-all duration-300 hover:border-gray-600/50`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r from-${color}-500/10 to-${color}-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Make it uniquely yours</h2>
              <p className="text-gray-400">Customize the look and feel of your profile</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-4">
                  Profile Visibility
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 ${
                      formData.isPublic
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-gray-800/50 border-gray-600/50 text-gray-400 hover:border-gray-500/50'
                    }`}
                  >
                    <Eye className="w-5 h-5" />
                    Public Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 ${
                      !formData.isPublic
                        ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                        : 'bg-gray-800/50 border-gray-600/50 text-gray-400 hover:border-gray-500/50'
                    }`}
                  >
                    <EyeOff className="w-5 h-5" />
                    Private Profile
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Preview Your Profile
                </h3>
                <p className="text-gray-300 mb-4">See how your profile will look to others</p>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors duration-300 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-pink-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Create Your <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Developer Profile</span>
            </h1>
            <p className="text-gray-400">Step {currentStep + 1} of {steps.length}</p>
          </div>

          <div className="w-20"></div>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center min-w-0 flex-1">
                <div className="relative">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative ${
                      index === currentStep
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white scale-110'
                        : index < currentStep || completedSteps.has(index)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {index < currentStep || completedSteps.has(index) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </button>
                  
                  {index === currentStep && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-ping opacity-20"></div>
                  )}
                </div>
                
                <div className="mt-3 text-center min-w-0">
                  <p className={`font-medium text-sm whitespace-nowrap ${
                    index === currentStep ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className={`absolute top-6 left-1/2 w-full h-0.5 transition-colors duration-500 hidden md:block ${
                    index < currentStep || completedSteps.has(index) ? 'bg-green-500' : 'bg-gray-700'
                  }`} style={{ left: '50%', width: 'calc(100% - 24px)', marginLeft: '12px' }} />
                )}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700/70 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all duration-300 backdrop-blur-sm"
            >
              Previous
            </button>

            <div className="flex items-center gap-4">
              {currentStep === steps.length - 1 ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 rounded-xl text-white font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Create Profile
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white font-medium transition-all duration-300 flex items-center gap-2"
                >
                  Next
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              )}
            </div>
          </div>

          {/* Completion Indicator */}
          {getStepCompletion() && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-sm">
                <Check className="w-4 h-4" />
                Step completed
              </div>
            </div>
          )}
        </form>

        {/* Motivation Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-gray-400">
            <Heart className="w-4 h-4 text-red-400" />
            <span>Building amazing developer profiles since 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;