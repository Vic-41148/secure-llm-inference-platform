import axios from 'axios';

/**
 * Smart API URL Detection
 * Automatically uses the correct API URL based on how the app is accessed
 * - localhost -> http://localhost:8000
 * - network IP -> http://[same-ip]:8000
 */
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const port = 8000;

  // If accessed via localhost, use localhost for API
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }

  // If accessed via network IP, use same IP for API
  return `http://${hostname}:${port}`;
};

export const API_BASE_URL = import.meta.env.VITE_API_URL === 'auto'
  ? getApiBaseUrl()
  : (import.meta.env.VITE_API_URL || getApiBaseUrl());

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add request interceptor - attach auth token
api.interceptors.request.use(
  (config) => {
    const credential = sessionStorage.getItem("ns_google_credential");
    if (credential) {
      config.headers.Authorization = `Bearer ${credential}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const sendPrompt = async (prompt, securityEnabled = true) => {
  try {
    const response = await api.post('/api/prompt', {
      prompt,
      security_enabled: securityEnabled,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSystemStats = async () => {
  try {
    const response = await api.get('/api/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLogs = async (limit = 50) => {
  try {
    const response = await api.get(`/api/logs?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAuditLogs = async (limit = 100, skip = 0) => {
  try {
    const response = await api.get(`/api/audit_logs/all?limit=${limit}&skip=${skip}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getThreatIntelFeeds = async () => {
  try {
    const response = await api.get('/api/threat-intel/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const blockThreatIOC = async (ioc, actor = 'Unknown', reason = 'Manual block from Threat Board') => {
  try {
    const response = await api.post('/api/threat-intel/block', { ioc, actor, reason });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAnalyticsSummary = async () => {
  try {
    const response = await api.get('/api/analytics/summary');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsageTimeSeries = async (hours = 24) => {
  try {
    const response = await api.get(`/api/analytics/timeseries/usage?hours=${hours}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSecurityEvents = async (limit = 50) => {
  try {
    const response = await api.get(`/api/analytics/security-events?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProjects = async () => {
  try {
    const response = await api.get('/api/projects/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPromptLibrary = async () => {
  try {
    const response = await api.get('/api/playground/prompts');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendChatMessage = async (prompt) => {
  try {
    const response = await api.post('/chat', {
      prompt,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getApiUrl = () => API_BASE_URL;

// Add properties expected by custom components
api.baseURL = API_BASE_URL;
api.analyzePrompt = sendPrompt;

export { api };
export default api;
