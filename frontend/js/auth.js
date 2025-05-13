/**
 * Updated Authentication Module using real API
 */

const TOKEN_KEY = 'pathway_auth_token';
const USER_KEY = 'pathway_user_data';

/** Check if user is authenticated */
function isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        return Date.now() < exp;
    } catch (err) {
        console.error('Error parsing token:', err);
        return false;
    }
}

/** Check if user is admin */
function isAdmin() {
    const user = getUserData();
    return user && user.role === 'admin';
}

/** Get/set user data */
function getUserData() {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
}

function setUserData(data) {
    localStorage.setItem(USER_KEY, JSON.stringify(data));
}

/** Get/set token */
function setAuthToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

/** Clear all auth info */
function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

/** Login using real API */
function login(email, password) {
    const loginBtn = document.querySelector('#loginForm button[type="submit"]');
    const errorElem = document.getElementById('loginError');
    const originalText = loginBtn.textContent;

    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    errorElem.textContent = '';

    window.api.login(email, password)
        .then(res => {
            if (!res.token || !res.user) throw new Error('Invalid response');
            setAuthToken(res.token);
            setUserData(res.user);
            window.location.href = 'home.html';
        })
        .catch(err => {
            errorElem.textContent = 'Login failed: ' + err.message;
            loginBtn.disabled = false;
            loginBtn.textContent = originalText;
        });
}

/** Signup using real API */
function signup(name, email, password, careerInterest) {
    const signupBtn = document.querySelector('#signupForm button[type="submit"]');
    const errorElem = document.getElementById('signupError');
    const originalText = signupBtn.textContent;

    signupBtn.disabled = true;
    signupBtn.textContent = 'Creating Account...';
    errorElem.textContent = '';

    window.api.signup(name, email, password, careerInterest)
        .then(res => {
            if (!res.token || !res.user) throw new Error('Invalid response');
            setAuthToken(res.token);
            setUserData(res.user);
            window.location.href = 'home.html';
        })
        .catch(err => {
            errorElem.textContent = 'Signup failed: ' + err.message;
            signupBtn.disabled = false;
            signupBtn.textContent = originalText;
        });
}

/** Logout */
function logout() {
    clearAuth();
    window.location.href = 'login.html';
}

/** Load user profile into UI */
function loadUserProfile() {
    const user = getUserData();
    if (!user) return;

    const $ = (id) => document.getElementById(id);
    if ($('user-name')) $('user-name').textContent = user.name;
    if ($('user-email')) $('user-email').textContent = user.email;
    if ($('user-initials')) $('user-initials').textContent =
        user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    if ($('welcome-name')) $('welcome-name').textContent = user.name.split(' ')[0];
}

/** Toggle password visibility */
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.querySelector(`#${inputId} + .password-toggle .eye-icon`);
    if (!input || !icon) return;

    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    icon.textContent = isHidden ? '👁️‍🗨️' : '👁️';
}

// Bind login form
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      // these IDs must match your login.html inputs
      const email    = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });
  }

  // Bind signup form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      // these IDs must match your signup.html inputs
      const name     = document.getElementById('name').value;
      const email    = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const career   = document.getElementById('career').value;
      signup(name, email, password, career);
    });
  }

  // Check authentication status and redirect if necessary
  const pagesThatRequireAuth = ['personality-test.html', 'career-path.html'];
  if (pagesThatRequireAuth.includes(window.location.pathname.split('/').pop())) {
      if (!isAuthenticated()) {
          window.location.href = 'index.html'; // Redirect to login page if not authenticated
      }
  }
});
