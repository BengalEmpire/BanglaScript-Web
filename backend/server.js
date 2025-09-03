const express = require('express');
const mongoose = require('mongoose');
const connectDB = require("./config/db")
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const cors = require('cors');
const axios = require('axios');
const validator = require('validator');
const NodeCache = require('node-cache');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const { setupWSConnection } = require('y-socket.io/dist/server');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Database initialize
connectDB();

// Passport Config
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });
    if (!user) {
      user = new User({
        githubId: profile.id,
        username: profile.username.toLowerCase(),
        avatar: profile.photos[0].value,
        email: profile.emails?.[0]?.value
      });
      await user.save();
    }
    user.accessToken = accessToken;
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// GitHub API Helper
const fetchGitHubData = async (username, token = null) => {
  const cacheKey = `github_${username}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const headers = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'MergedApp/1.0'
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  else if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const [userResponse, reposResponse] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers, timeout: 10000 }),
      axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50&type=owner`, { headers, timeout: 10000 })
    ]);

    const data = {
      userData: userResponse.data,
      repositories: reposResponse.data.filter(repo => !repo.fork || repo.stargazers_count > 0)
    };
    cache.set(cacheKey, data, 300);
    return data;
  } catch (error) {
    if (error.response?.status === 404) throw new Error(`GitHub user '${username}' not found`);
    if (error.response?.status === 403) throw new Error('GitHub API rate limit exceeded. Please try again later.');
    if (error.code === 'ECONNABORTED') throw new Error('GitHub API request timeout. Please try again.');
    throw new Error(`GitHub API Error: ${error.response?.status || error.code} - ${error.response?.statusText || error.message}`);
  }
};

// Middleware
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const validateGitHubUsername = (req, res, next) => {
  const { username } = req.params;
  if (!username || !/^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i.test(username)) {
    return res.status(400).json({ error: 'Invalid GitHub username format' });
  }
  next();
};

const validateProfileData = (req, res, next) => {
  const { customBio, skills, projects, socialLinks } = req.body;
  if (customBio && customBio.length > 1000) return res.status(400).json({ error: 'Custom bio must be less than 1000 characters' });
  if (skills && (!Array.isArray(skills) || skills.length > 50)) return res.status(400).json({ error: 'Skills must be an array with maximum 50 items' });
  if (projects && Array.isArray(projects)) {
    for (const project of projects) {
      if (project.url && !validator.isURL(project.url)) return res.status(400).json({ error: 'Invalid project URL' });
      if (project.description?.length > 500) return res.status(400).json({ error: 'Project description must be less than 500 characters' });
      if (project.name?.length > 100) return res.status(400).json({ error: 'Project name must be less than 100 characters' });
    }
  }
  if (socialLinks) {
    const linkKeys = ['linkedin', 'twitter', 'website', 'portfolio'];
    for (const key of linkKeys) {
      if (socialLinks[key] && !validator.isURL(socialLinks[key])) return res.status(400).json({ error: `Invalid ${key} URL` });
    }
  }
  next();
};

// Routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign(
    { githubId: req.user.githubId, username: req.user.username },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1d' }
  );
  res.redirect(`${process.env.FRONTEND_URL}/create?token=${token}&username=${req.user.username}`);
});

app.get('/api/user', (req, res) => {
  res.json(req.user ? {
    githubId: req.user.githubId,
    username: req.user.username,
    avatar: req.user.avatar,
    groupId: req.user.groupId,
    isCreator: req.user.isCreator,
    contributions: req.user.contributions,
    averageRating: req.user.ratings.length ? req.user.ratings.reduce((sum, r) => sum + r.score, 0) / req.user.ratings.length : 0
  } : null);
});

app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out' });
  });
});

// Profile Routes
app.get('/api/github/:username', validateGitHubUsername, asyncHandler(async (req, res) => {
  const { username } = req.params;
  const githubData = await fetchGitHubData(username, req.user?.accessToken);
  res.json(githubData);
}));

app.post('/api/profiles', validateProfileData, asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { githubUsername, ...profileData } = req.body;
  if (githubUsername.toLowerCase() !== req.user.username.toLowerCase()) {
    return res.status(403).json({ error: 'Can only create profile for authenticated user' });
  }

  const githubData = await fetchGitHubData(githubUsername, req.user.accessToken);
  const profile = await Profile.findOneAndUpdate(
    { githubUsername: githubUsername.toLowerCase() },
    {
      githubUsername: githubUsername.toLowerCase(),
      githubData: githubData.userData,
      repositories: githubData.repositories,
      ...profileData,
      userId: req.user._id,
      lastUpdated: new Date()
    },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(201).json({ profile, shareUrl: `${process.env.FRONTEND_URL}/profile/${githubUsername}` });
}));

app.get('/api/profiles/:username', validateGitHubUsername, asyncHandler(async (req, res) => {
  const username = req.params.username.toLowerCase();
  const profile = await Profile.findOne({ githubUsername: username }).populate('userId', 'contributions ratings');
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  await Profile.updateOne({ _id: profile._id }, { $inc: { 'analytics.profileViews': 1 }, $set: { 'analytics.lastViewedAt': new Date() } });
  res.json(profile);
}));

app.get('/api/profiles', asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, search = '', sortBy = 'lastUpdated', order = 'desc', skills = '', minStars = 0 } = req.query;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const sortOrder = order === 'asc' ? 1 : -1;
  const query = { isPublic: true };
  if (search) query.$text = { $search: search };
  if (skills) query.skills = { $in: skills.split(',').map(s => s.trim()) };

  const aggregatePipeline = [
    { $match: query },
    { $addFields: { totalStars: { $sum: '$repositories.stargazers_count' } } },
    { $match: { totalStars: { $gte: parseInt(minStars) || 0 } } },
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
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { username } = req.params;
  if (username.toLowerCase() !== req.user.username.toLowerCase()) {
    return res.status(403).json({ error: 'Can only update own profile' });
  }
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
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  res.json(profile);
}));

app.post('/api/profiles/:username/refresh', validateGitHubUsername, asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { username } = req.params;
  if (username.toLowerCase() !== req.user.username.toLowerCase()) {
    return res.status(403).json({ error: 'Can only refresh own profile' });
  }
  cache.del(`github_${username}`);
  const githubData = await fetchGitHubData(username, req.user.accessToken);
  const profile = await Profile.findOneAndUpdate(
    { githubUsername: username.toLowerCase() },
    { githubData: githubData.userData, repositories: githubData.repositories, lastUpdated: new Date() },
    { new: true }
  );
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  res.json(profile);
}));

// Group Routes
app.post('/api/groups', asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.groupId) return res.status(400).json({ error: 'Already in a group' });

  const group = new Group({
    name: req.body.name,
    creatorId: req.user._id,
    members: [req.user._id],
    htmlCode: '<h1>Hello World</h1>',
    cssCode: 'body { background: white; }'
  });
  await group.save();

  req.user.groupId = group._id;
  req.user.isCreator = true;
  await req.user.save();

  res.json(group);
}));

app.get('/api/groups/my', asyncHandler(async (req, res) => {
  if (!req.user || !req.user.groupId) return res.json(null);
  const group = await Group.findById(req.user.groupId).populate('members', 'username avatar').populate('pendingRequests', 'username avatar');
  res.json(group);
}));

app.post('/api/groups/:id/request', asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.groupId) return res.status(400).json({ error: 'Already in a group' });
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).json({ error: 'Group not found' });
  if (!group.pendingRequests.includes(req.user._id)) {
    group.pendingRequests.push(req.user._id);
    await group.save();
  }
  res.json({ message: 'Request sent' });
}));

app.post('/api/groups/accept/:userId', asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const group = await Group.findById(req.user.groupId);
  if (!group || !req.user.isCreator) return res.status(403).json({ error: 'Not creator' });
  const index = group.pendingRequests.indexOf(req.params.userId);
  if (index > -1) {
    group.pendingRequests.splice(index, 1);
    group.members.push(req.params.userId);
    await group.save();
    const newUser = await User.findById(req.params.userId);
    newUser.groupId = group._id;
    await newUser.save();
  }
  res.json(group);
}));

app.post('/api/groups/invite/:username', asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const group = await Group.findById(req.user.groupId);
  if (!group || !req.user.isCreator) return res.status(403).json({ error: 'Not creator' });
  const invitee = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!invitee || invitee.groupId) return res.status(400).json({ error: 'User not found or in group' });
  if (!invitee.invites.includes(group._id)) {
    invitee.invites.push(group._id);
    await invitee.save();
  }
  res.json({ message: 'Invite sent' });
}));

app.post('/api/groups/accept-invite/:groupId', asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.groupId) return res.status(400).json({ error: 'Already in group' });
  const index = req.user.invites.indexOf(req.params.groupId);
  if (index > -1) {
    req.user.invites.splice(index, 1);
    await req.user.save();
    const group = await Group.findById(req.params.groupId);
    group.members.push(req.user._id);
    await group.save();
    req.user.groupId = group._id;
    await req.user.save();
    res.json(group);
  } else {
    res.status(400).json({ error: 'No invite' });
  }
}));

app.post('/api/groups/leave', asyncHandler(async (req, res) => {
  if (!req.user || !req.user.groupId) return res.status(400).json({ error: 'Not in group' });
  const group = await Group.findById(req.user.groupId);
  const index = group.members.indexOf(req.user._id);
  if (index > -1) {
    group.members.splice(index, 1);
    if (req.user.isCreator && group.members.length > 0) {
      group.creatorId = group.members[0];
      const newCreator = await User.findById(group.members[0]);
      newCreator.isCreator = true;
      await newCreator.save();
    } else if (req.user.isCreator) {
      await Group.deleteOne({ _id: group._id });
    }
    await group.save();
  }
  req.user.groupId = null;
  req.user.isCreator = false;
  await req.user.save();
  res.json({ message: 'Left group' });
}));

app.delete('/api/groups', asyncHandler(async (req, res) => {
  if (!req.user || !req.user.groupId || !req.user.isCreator) return res.status(403).json({ error: 'Not creator' });
  const group = await Group.findById(req.user.groupId);
  for (let memberId of group.members) {
    const member = await User.findById(memberId);
    member.groupId = null;
    member.isCreator = false;
    await member.save();
  }
  await Group.deleteOne({ _id: req.user.groupId });
  res.json({ message: 'Group deleted' });
}));

app.post('/api/users/:id/rate', asyncHandler(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const ratedUser = await User.findById(req.params.id);
  if (!ratedUser || ratedUser.groupId !== req.user.groupId) return res.status(400).json({ error: 'Not in same group' });
  const existing = ratedUser.ratings.find(r => r.raterId.toString() === req.user._id.toString());
  if (existing) {
    existing.score = Math.max(1, Math.min(5, req.body.score));
    existing.timestamp = new Date();
  } else {
    ratedUser.ratings.push({ raterId: req.user._id, score: Math.max(1, Math.min(5, req.body.score)), timestamp: new Date() });
  }
  await ratedUser.save();
  res.json({ message: 'Rated' });
}));

app.get('/api/analytics', asyncHandler(async (req, res) => {
  const [stats, topLanguages, groupStats] = await Promise.all([
    Profile.aggregate([
      {
        $group: {
          _id: null,
          totalProfiles: { $sum: 1 },
          publicProfiles: { $sum: { $cond: ['$isPublic', 1, 0] } },
          totalViews: { $sum: '$analytics.profileViews' },
          avgStarsPerProfile: { $avg: { $sum: '$repositories.stargazers_count' } },
          totalProjects: { $sum: { $size: '$projects' } }
        }
      }
    ]),
    Profile.aggregate([
      { $unwind: '$repositories' },
      { $match: { 'repositories.language': { $ne: null } } },
      { $group: { _id: '$repositories.language', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    Group.aggregate([
      {
        $group: {
          _id: null,
          totalGroups: { $sum: 1 },
          totalMembers: { $sum: { $size: '$members' } },
          totalEdits: { $sum: { $size: '$history' } }
        }
      }
    ])
  ]);

  res.json({
    overview: stats[0] || { totalProfiles: 0, publicProfiles: 0, totalViews: 0, avgStarsPerProfile: 0, totalProjects: 0 },
    topLanguages,
    groupStats: groupStats[0] || { totalGroups: 0, totalMembers: 0, totalEdits: 0 }
  });
}));

// later, bind Yjs to Socket.IO
io.on('connection', (socket) => {
  setupWSConnection(socket, socket.request);
});

// Socket.IO for Collaboration
io.on('connection', (socket) => {
  socket.on('edit', async (data) => {
    const { groupId, userId, diff } = data;
    const group = await Group.findById(groupId);
    if (!group || !group.members.includes(userId)) return;
    group.history.push({ userId, timestamp: new Date(), diff });
    const user = await User.findById(userId);
    user.contributions += 1;
    await Promise.all([group.save(), user.save()]);
    socket.to(groupId).emit('edit', data);
  });
});

// Models
const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  avatar: { type: String, validate: { validator: validator.isURL, message: 'Invalid avatar URL' } },
  email: { type: String, validate: { validator: v => !v || validator.isEmail(v), message: 'Invalid email' } },
  accessToken: String,
  groupId: mongoose.Schema.Types.ObjectId,
  isCreator: { type: Boolean, default: false },
  contributions: { type: Number, default: 0 },
  ratings: [{ raterId: mongoose.Schema.Types.ObjectId, score: { type: Number, min: 1, max: 5 }, timestamp: Date }],
  invites: [mongoose.Schema.Types.ObjectId],
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  githubUsername: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: v => /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i.test(v),
      message: 'Invalid GitHub username format'
    }
  },
  githubData: {
    login: String,
    id: Number,
    avatar_url: { type: String, validate: { validator: validator.isURL } },
    name: { type: String, maxlength: 100 },
    bio: { type: String, maxlength: 500 },
    blog: { type: String, validate: { validator: v => !v || validator.isURL(v) } },
    location: { type: String, maxlength: 100 },
    email: { type: String, validate: { validator: v => !v || validator.isEmail(v) } },
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
    url: { type: String, validate: { validator: validator.isURL } },
    tech: [{ type: String, maxlength: 30 }],
    featured: { type: Boolean, default: false }
  }],
  socialLinks: {
    linkedin: { type: String, validate: { validator: v => !v || validator.isURL(v) } },
    twitter: { type: String, validate: { validator: v => !v || validator.isURL(v) } },
    website: { type: String, validate: { validator: v => !v || validator.isURL(v) } },
    portfolio: { type: String, validate: { validator: v => !v || validator.isURL(v) } }
  },
  theme: {
    primaryColor: { type: String, default: '#8b5cf6', match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
    secondaryColor: { type: String, default: '#06b6d4', match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
    background: { type: String, default: 'gradient', enum: ['gradient', 'solid', 'pattern'] }
  },
  analytics: {
    profileViews: { type: Number, default: 0 },
    lastViewedAt: Date
  },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

profileSchema.index({ githubUsername: 1 });
profileSchema.index({ isPublic: 1, lastUpdated: -1 });
profileSchema.index({ 'githubData.name': 'text', 'githubData.bio': 'text', githubUsername: 'text' });
profileSchema.virtual('totalStars').get(function () {
  return this.repositories.reduce((total, repo) => total + (repo.stargazers_count || 0), 0);
});
const Profile = mongoose.model('Profile', profileSchema);

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  htmlCode: { type: String, default: '<h1>Hello World</h1>' },
  cssCode: { type: String, default: 'body { background: white; }' },
  history: [{ userId: mongoose.Schema.Types.ObjectId, timestamp: Date, diff: String }],
  createdAt: { type: Date, default: Date.now }
});
const Group = mongoose.model('Group', groupSchema);

// Error Handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(e => e.message);
    return res.status(400).json({ error: 'Validation Error', details: errors });
  }
  if (error.name === 'CastError') return res.status(400).json({ error: 'Invalid data format' });
  if (error.code === 11000) return res.status(409).json({ error: 'Duplicate entry' });
  res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
});

// Start Server
server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  server.close(() => process.exit(0));
});