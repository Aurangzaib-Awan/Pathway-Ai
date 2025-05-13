/* api.js - Frontend API client for Pathway AI */

// Base API URL (served by Express from same origin)
const API_BASE_URL = '/api';

/**
 * Retrieve JWT token from localStorage
 * @returns {string|null}
 */
function getAuthToken() {
  return localStorage.getItem('pathway_auth_token');
}

/**
 * Generic API request wrapper
 * @param {string} endpoint  - API endpoint (e.g. '/auth/login')
 * @param {Object} options   - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Object>} - Parsed JSON response
 */
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/** Auth API */
/** Auth API */
async function login(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  // ✅ Save token and user to localStorage
  localStorage.setItem('pathway_auth_token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user)); // optional

  return data;
}


function signup(name, email, password, career) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, career })
  });
}

/** User Profile */
function getProfile() {
  return apiRequest('/profile', {
    method: 'GET'
  });
}

/** Personality Test */
function fetchTestQuestions() {
  return apiRequest('/personality-test/questions', {
    method: 'GET'
  });
}

function submitTestResults(answers) {
  return apiRequest('/personality-test/results', {
    method: 'POST',
    body: JSON.stringify({ answers })
  });
}

/** Careers */
function fetchCareers() {
  return apiRequest('/careers', {
    method: 'GET'
  });
}

function fetchCareerDetails(careerId) {
  return apiRequest('/careers/details', {
    method: 'POST',
    body: JSON.stringify({ careerId })
  });
}

// Expose functions globally
window.api = {
  login,
  signup,
  getProfile,
  fetchTestQuestions,
  submitTestResults,
  fetchCareers,
  fetchCareerDetails
};
