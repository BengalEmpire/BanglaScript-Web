import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export const ApiContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        setLoading(true);
        const response = await api(url, options);
        return response.data;
      } catch (err) {
        if (attempt === retries) {
          const errorMessage = err.response?.data?.error || 'Failed to fetch data';
          setError(errorMessage);
          toast.error(errorMessage);
          throw err;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      } finally {
        setLoading(false);
      }
    }
  };

  const getProfiles = useCallback(async ({ page = 1, search = '', skills = '', minStars = 0 }) => {
    return fetchWithRetry('/profiles', { params: { page, search, skills, minStars } });
  }, []);

  const getProfile = useCallback(async (username) => {
    return fetchWithRetry(`/profiles/${username}`);
  }, []);

  const getGitHubData = useCallback(async (username) => {
    return fetchWithRetry(`/github/${username}`);
  }, []);

  const createProfile = useCallback(async (profileData) => {
    return fetchWithRetry('/profiles', { method: 'POST', data: profileData });
  }, []);

  const getAnalytics = useCallback(async () => {
    return fetchWithRetry('/analytics');
  }, []);

  const loginWithGitHub = () => {
    window.location.href = `${API_BASE}/auth/github`;
  };

  const logout = useCallback(async () => {
    await fetchWithRetry('/logout', { method: 'POST' });
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const createGroup = useCallback(async (name) => {
    return fetchWithRetry('/groups', { method: 'POST', data: { name } });
  }, []);

  const getMyGroup = useCallback(async () => {
    return fetchWithRetry('/groups/my');
  }, []);

  const requestJoinGroup = useCallback(async (groupId) => {
    return fetchWithRetry(`/groups/${groupId}/request`, { method: 'POST' });
  }, []);

  const acceptJoinRequest = useCallback(async (groupId, userId) => {
    return fetchWithRetry(`/groups/accept/${userId}`, { method: 'POST' });
  }, []);

  const inviteToGroup = useCallback(async (username) => {
    return fetchWithRetry(`/groups/invite/${username}`, { method: 'POST' });
  }, []);

  const acceptInvite = useCallback(async (groupId) => {
    return fetchWithRetry(`/groups/accept-invite/${groupId}`, { method: 'POST' });
  }, []);

  const leaveGroup = useCallback(async () => {
    return fetchWithRetry('/groups/leave', { method: 'POST' });
  }, []);

  const deleteGroup = useCallback(async () => {
    return fetchWithRetry('/groups', { method: 'DELETE' });
  }, []);

  const rateUser = useCallback(async (userId, score) => {
    return fetchWithRetry(`/users/${userId}/rate`, { method: 'POST', data: { score } });
  }, []);

  return (
    <ApiContext.Provider value={{
      getProfiles,
      getProfile,
      getGitHubData,
      createProfile,
      getAnalytics,
      loginWithGitHub,
      logout,
      createGroup,
      getMyGroup,
      requestJoinGroup,
      acceptJoinRequest,
      inviteToGroup,
      acceptInvite,
      leaveGroup,
      deleteGroup,
      rateUser,
      loading,
      error,
      user,
      setUser
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;