const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const validator = require('validator');
const NodeCache = require('node-cache');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize cache with 10 minute TTL
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Basic body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

// User Profile Schema
const profileSchema = new mongoose.Schema({
  githubUsername: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i.test(v);
      },
      message: 'Invalid GitHub username format'
    }
  },
  githubData: {
    login: String,
    id: Number,
    avatar_url: { type: String, validate: { validator: validator.isURL, message: 'Invalid avatar URL' } },
    name: { type: String, maxlength: 100 },
    bio: { type: String, maxlength: 500 },
    blog: { type: String, validate: { validator: (v) => !v || validator.isURL(v), message: 'Invalid blog URL' } },
    location: { type: String, maxlength: 100 },
    email: { type: String, validate: { validator: (v) => !v || validator.isEmail(v), message: 'Invalid email' } },
    twitter_username: String,
    followers: { type: Number, min: 0 },
    following: { type: Number, min: 0 },
    public_repos: { type: Number, min: 0 },
    created_at: Date,
    updated_at: Date,
    company: { type: String, maxlength: 100 },
    hireable: Boolean,
    html_url: String
  },
  repositories: [{
    id: Number,
    name: String,
    full_name: String,
    description: { type: String, maxlength: 1000 },
    html_url: String,
    stargazers_count: { type: Number, min: 0 },
    forks_count: { type: Number, min: 0 },
    language: String,
    updated_at: Date,
    topics: [{ type: String, maxlength: 50 }],
    size: Number,
    default_branch: String,
    archived: Boolean,
    disabled: Boolean,
    fork: Boolean
  }],
  customBio: { type: String, maxlength: 1000 },
  skills: [{ type: String, maxlength: 50 }],
  projects: [{
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    url: { type: String, validate: { validator: validator.isURL, message: 'Invalid project URL' } },
    tech: [{ type: String, maxlength: 30 }],
    featured: { type: Boolean, default: false }
  }],
  socialLinks: {
    linkedin: { type: String, validate: { validator: (v) => !v || validator.isURL(v), message: 'Invalid LinkedIn URL' } },
    twitter: { type: String, validate: { validator: (v) => !v || validator.isURL(v), message: 'Invalid Twitter URL' } },
    website: { type: String, validate: { validator: (v) => !v || validator.isURL(v), message: 'Invalid website URL' } },
    portfolio: { type: String, validate: { validator: (v) => !v || validator.isURL(v), message: 'Invalid portfolio URL' } }
  },
  theme: {
    primaryColor: { type: String, default: '#8b5cf6', match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
    secondaryColor: { type: String, default: '#06b6d4', match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
    background: { type: String, default: 'gradient', enum: ['gradient', 'solid', 'pattern'] },
    darkMode: { type: Boolean, default: false }
  },
  analytics: {
    profileViews: { type: Number, default: 0 },
    lastViewedAt: Date
  },
  isPublic: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
profileSchema.index({ githubUsername: 1 });
profileSchema.index({ isPublic: 1, lastUpdated: -1 });
profileSchema.index({ 'githubData.name': 'text', 'githubData.bio': 'text', githubUsername: 'text' });

// Virtual for total repository stars
profileSchema.virtual('totalStars').get(function() {
  return this.repositories.reduce((total, repo) => total + (repo.stargazers_count || 0), 0);
});

const Profile = mongoose.model('Profile', profileSchema);

// GitHub API helper
const fetchGitHubData = async (username, token = null) => {
  const cacheKey = `github_${username}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }

  const headers = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'DevPlatform/1.0'
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [userResponse, reposResponse] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { 
        headers,
        timeout: 10000
      }),
      axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50&type=owner`, { 
        headers,
        timeout: 10000
      })
    ]);

    const data = {
      userData: userResponse.data,
      repositories: reposResponse.data.filter(repo => !repo.fork || repo.stargazers_count > 0)
    };

    cache.set(cacheKey, data, 300);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`GitHub user '${username}' not found`);
    } else if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('GitHub API request timeout. Please try again.');
    }
    throw new Error(`GitHub API Error: ${error.response?.status || error.code} - ${error.response?.statusText || error.message}`);
  }
};

// Input validation middleware
const validateGitHubUsername = (req, res, next) => {
  const { username } = req.params;
  if (!username || !/^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i.test(username)) {
    return res.status(400).json({ error: 'Invalid GitHub username format' });
  }
  next();
};

const validateProfileData = (req, res, next) => {
  const { customBio, skills, projects, socialLinks } = req.body;
  
  if (customBio && customBio.length > 1000) {
    return res.status(400).json({ error: 'Custom bio must be less than 1000 characters' });
  }
  
  if (skills && (!Array.isArray(skills) || skills.length > 50)) {
    return res.status(400).json({ error: 'Skills must be an array with maximum 50 items' });
  }
  
  if (projects && Array.isArray(projects)) {
    for (const project of projects) {
      if (project.url && !validator.isURL(project.url)) {
        return res.status(400).json({ error: 'Invalid project URL' });
      }
    }
  }
  
  if (socialLinks) {
    const linkKeys = ['linkedin', 'twitter', 'website', 'portfolio'];
    for (const key of linkKeys) {
      if (socialLinks[key] && !validator.isURL(socialLinks[key])) {
        return res.status(400).json({ error: `Invalid ${key} URL` });
      }
    }
  }
  
  next();
};

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes
app.get('/api/github/:username', validateGitHubUsername, asyncHandler(async (req, res) => {
  const { username } = req.params;
  const githubData = await fetchGitHubData(username);
  res.json(githubData);
}));

app.post('/api/profiles', validateProfileData, asyncHandler(async (req, res) => {
  const { githubUsername, ...profileData } = req.body;
  
  if (!githubUsername) {
    return res.status(400).json({ error: 'GitHub username is required' });
  }
  
  const githubData = await fetchGitHubData(githubUsername);
  
  const profile = await Profile.findOneAndUpdate(
    { githubUsername: githubUsername.toLowerCase() },
    {
      githubUsername: githubUsername.toLowerCase(),
      githubData: githubData.userData,
      repositories: githubData.repositories,
      ...profileData,
      lastUpdated: new Date()
    },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(201).json(profile);
}));

app.get('/api/profiles/:username', validateGitHubUsername, asyncHandler(async (req, res) => {
  const username = req.params.username.toLowerCase();
  const profile = await Profile.findOne({ githubUsername: username });
  
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  await Profile.updateOne(
    { _id: profile._id },
    { 
      $inc: { 'analytics.profileViews': 1 },
      $set: { 'analytics.lastViewedAt': new Date() }
    }
  );

  res.json(profile);
}));

app.get('/api/profiles', asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 12, 
    search = '', 
    sortBy = 'lastUpdated',
    order = 'desc',
    skills = '',
    minStars = 0
  } = req.query;
  
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const sortOrder = order === 'asc' ? 1 : -1;
  
  const query = { isPublic: true };
  
  if (search) {
    query.$text = { $search: search };
  }
  
  if (skills) {
    const skillsArray = skills.split(',').map(s => s.trim());
    query.skills = { $in: skillsArray };
  }

  const aggregatePipeline = [
    { $match: query },
    {
      $addFields: {
        totalStars: {
          $sum: '$repositories.stargazers_count'
        }
      }
    },
    {
      $match: {
        totalStars: { $gte: parseInt(minStars) || 0 }
      }
    },
    { $sort: { [sortBy]: sortOrder } },
    { $skip: (pageNum - 1) * limitNum },
    { $limit: limitNum }
  ];

  const [profiles, totalCount] = await Promise.all([
    Profile.aggregate(aggregatePipeline),
    Profile.countDocuments(query)
  ]);

  res.json({
    profiles,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalCount,
      hasNextPage: pageNum * limitNum < totalCount,
      hasPrevPage: pageNum > 1
    }
  });
}));

app.put('/api/profiles/:username', validateGitHubUsername, validateProfileData, asyncHandler(async (req, res) => {
  const { username } = req.params;
  const updates = req.body;
  
  delete updates.githubData;
  delete updates.repositories;
  delete updates.githubUsername;
  delete updates.createdAt;
  delete updates.analytics;
  
  const profile = await Profile.findOneAndUpdate(
    { githubUsername: username.toLowerCase() },
    { ...updates, lastUpdated: new Date() },
    { new: true, runValidators: true }
  );

  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  res.json(profile);
}));

app.post('/api/profiles/:username/refresh', validateGitHubUsername, asyncHandler(async (req, res) => {
  const { username } = req.params;
  
  cache.del(`github_${username}`);
  
  const githubData = await fetchGitHubData(username);
  
  const profile = await Profile.findOneAndUpdate(
    { githubUsername: username.toLowerCase() },
    {
      githubData: githubData.userData,
      repositories: githubData.repositories,
      lastUpdated: new Date()
    },
    { new: true }
  );

  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  res.json(profile);
}));

app.delete('/api/profiles/:username', validateGitHubUsername, asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { soft = false } = req.query;
  
  if (soft === 'true') {
    const profile = await Profile.findOneAndUpdate(
      { githubUsername: username.toLowerCase() },
      { isPublic: false, lastUpdated: new Date() },
      { new: true }
    );
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json({ message: 'Profile hidden successfully', profile });
  } else {
    const profile = await Profile.findOneAndDelete({ githubUsername: username.toLowerCase() });
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json({ message: 'Profile deleted successfully' });
  }
}));

app.get('/api/analytics', asyncHandler(async (req, res) => {
  const stats = await Profile.aggregate([
    {
      $group: {
        _id: null,
        totalProfiles: { $sum: 1 },
        publicProfiles: { $sum: { $cond: ['$isPublic', 1, 0] } },
        totalViews: { $sum: '$analytics.profileViews' },
        avgStarsPerProfile: { 
          $avg: { 
            $sum: '$repositories.stargazers_count' 
          } 
        }
      }
    }
  ]);

  const topLanguages = await Profile.aggregate([
    { $unwind: '$repositories' },
    { $match: { 'repositories.language': { $ne: null } } },
    { $group: { _id: '$repositories.language', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.json({
    overview: stats[0] || { totalProfiles: 0, publicProfiles: 0, totalViews: 0, avgStarsPerProfile: 0 },
    topLanguages
  });
}));

app.get('/health', asyncHandler(async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const cacheStats = cache.getStats();
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbStatus,
    cache: {
      keys: cacheStats.keys,
      hits: cacheStats.hits,
      misses: cacheStats.misses
    },
    version: '2.0.0'
  });
}));

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(e => e.message);
    return res.status(400).json({ error: 'Validation Error', details: errors });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid data format' });
  }
  
  if (error.code === 11000) {
    return res.status(409).json({ error: 'Profile already exists' });
  }
  
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message 
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});