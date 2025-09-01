import React, { createContext, useState, useCallback } from 'react';
import { toast } from 'sonner';


export const ApiContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}${url}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
      } catch (err) {
        if (attempt === retries) {
          setError(err.message);
          toast.error(err.message || 'Failed to fetch data');
          throw err;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      } finally {
        setLoading(false);
      }
    }
  };

  const getProfiles = useCallback(async ({ page = 1, search = '', skills = '', minStars = 0 }) => {
    const query = new URLSearchParams({ page, search, skills, minStars }).toString();
    return fetchWithRetry(`/profiles?${query}`);
  }, []);

  const getProfile = useCallback(async (username) => {
    return fetchWithRetry(`/profiles/${username}`);
  }, []);

  const getGitHubData = useCallback(async (username) => {
    return fetchWithRetry(`/github/${username}`);
  }, []);

  const createProfile = useCallback(async (profileData) => {
    return fetchWithRetry('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }, []);

  return (
    <ApiContext.Provider value={{ getProfiles, getProfile, getGitHubData, createProfile, loading, error }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;