import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProfiles = async (params = {}) => {
  try {
    const response = await api.get('/profiles', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch profiles');
  }
};

export const getProfile = async (username) => {
  try {
    const response = await api.get(`/profiles/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch profile');
  }
};

export const getGitHubData = async (username) => {
  try {
    const response = await api.get(`/github/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch GitHub data');
  }
};

export const createProfile = async (profileData) => {
  try {
    const response = await api.post('/profiles', profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create profile');
  }
};