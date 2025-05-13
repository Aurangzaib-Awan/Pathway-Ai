// frontend/js/dashboard.js

console.log('dashboard.js loaded. Token:', localStorage.getItem('pathway_auth_token'));
// frontend/js/dashboard.js

// 1. Quick auth check & initialization
(function() {
  console.log('–– dashboard.js loaded ––');
  const token = localStorage.getItem('pathway_auth_token');
  console.log('Token from storage:', token);

  if (!token) {
    console.log('➡️ No token found — redirecting to login.html');
    return window.location.href = 'login.html';
  }

  console.log('✅ Token exists — calling initDashboard()');
  initDashboard();
})();


// 1. Quick auth check & initialization
(function() {
  const token = localStorage.getItem('pathway_auth_token');
  if (!token) {
    return window.location.href = 'login.html';
  }
  initDashboard();
})();

// 2. Initialize dashboard components and functionality
function initDashboard() {
  loadUserProfile();        // populate name/email
  bindLogoutAndToggle();    // setup logout and sidebar toggle
  updateProgressIndicators();
  loadRecentActivity();
  loadRecommendations();
  checkPersonalityTestStatus();
}

// 3. Load user data from localStorage
function loadUserProfile() {
  const user = JSON.parse(localStorage.getItem('pathway_user_data'));
  if (!user) return;

  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('welcome-name').textContent = user.name.split(' ')[0];
  document.getElementById('user-initials').textContent =
    user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (user.role === 'admin') {
    document.getElementById('admin-link').style.display = 'block';
  }
}

// 4. Bind logout button and sidebar toggle
function bindLogoutAndToggle() {
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('pathway_auth_token');
    localStorage.removeItem('pathway_user_data');
    window.location.href = 'login.html';
  });
  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.querySelector('.dashboard-container')
            .classList.toggle('sidebar-collapsed');
  });
}

// 5. Progress indicators (same as before)
function updateProgressIndicators() {
  let completionPercentage = 75;
  document.querySelectorAll('.progress-item .progress-fill')[0]
          .style.width = `${completionPercentage}%`;

  const testDone = localStorage.getItem('personality_test_completed') === 'true';
  const fill = document.querySelectorAll('.progress-item .progress-fill')[1];
  fill.style.width = testDone ? '100%' : '0%';

  const label = document.querySelector(
    '.progress-item:nth-child(2) .progress-label span:last-child'
  );
  label.textContent = testDone ? 'Completed' : 'Not Started';
}

// 6. Recent activity
function loadRecentActivity() {
  const list = document.querySelector('.activity-list');
  if (!list) return;
  list.innerHTML = '';

  const activities = [
    { icon: '📝', title: 'Account Created', time: 'Just now' },
    { icon: '👋', title: 'Welcome to Pathway AI', time: 'Just now' }
  ];
  if (localStorage.getItem('personality_test_completed') === 'true') {
    activities.unshift({ icon: '🧠', title: 'Completed Personality Test', time: '1 hour ago' });
  }
  activities.forEach(a => {
    const li = document.createElement('li');
    li.className = 'activity-item';
    li.innerHTML = `
      <div class="activity-icon">${a.icon}</div>
      <div class="activity-details">
        <p class="activity-title">${a.title}</p>
        <p class="activity-time">${a.time}</p>
      </div>`;
    list.appendChild(li);
  });
}

// 7. Recommendations
function loadRecommendations() {
  const container = document.querySelector('.recommendations-list');
  if (!container) return;
  container.innerHTML = '';

  const testDone = localStorage.getItem('personality_test_completed') === 'true';
  const items = [
    {
      title: 'Complete Your Profile',
      description: 'Add details for better suggestions.',
      action: 'Complete Now',
      url: '#'
    },
    {
      title: testDone ? 'Explore Career Paths' : 'Take Personality Test',
      description: testDone ? 'Browse options based on your test.' : 'Discover your strengths.',
      action: testDone ? 'Explore' : 'Take Test',
      url: testDone ? 'career-path.html' : 'personality-test.html'
    }
  ];

  items.forEach(r => {
    const div = document.createElement('div');
    div.className = 'recommendation-item';
    div.innerHTML = `
      <h3>${r.title}</h3>
      <p>${r.description}</p>
      <a href="${r.url}" class="btn btn-text">${r.action}</a>`;
    container.appendChild(div);
  });
}

// 8. Personality Test Status
function checkPersonalityTestStatus() {
  const done = localStorage.getItem('personality_test_completed') === 'true';
  const container = document.querySelector('.insights-content');
  if (!container) return;

  container.innerHTML = done
    ? `<div class="personality-summary">
         <h3>Your Personality Type: Analytical Innovator</h3>
         <p>You combine creative thinking with analytical skills.</p>
         <a href="personality-test.html#results" class="btn btn-text">View Full Results</a>
       </div>`
    : `<p>Complete your personality test to unlock personalized career insights.</p>
       <div class="insights-placeholder">
         <div class="placeholder-icon">🔍</div>
         <p>Your career insights will appear here</p>
       </div>`;
}
