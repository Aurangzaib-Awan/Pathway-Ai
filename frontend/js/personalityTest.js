// personalityTest.js
// Updated to use window.api and global bindings

document.addEventListener('DOMContentLoaded', () => {
  initPersonalityTest();
});

let testQuestions = [];
let userAnswers = {};
let currentQuestionIndex = 0;

async function loadTestQuestions() {
  try {
    const res = await window.api.fetchTestQuestions();
    testQuestions = res.questions;
    document.getElementById('total-questions').textContent = testQuestions.length;
  } catch (err) {
    console.error('Error loading questions:', err);
  }
}

function startTest() {
  document.getElementById('test-intro').classList.remove('active');
  document.getElementById('test-questions').classList.add('active');
  userAnswers = {};
  currentQuestionIndex = 0;
  renderQuestion();
}

function renderQuestion() {
  const q = testQuestions[currentQuestionIndex];
  const container = document.getElementById('question-container');
  container.innerHTML = `
    <h3>${q.text}</h3>
    ${q.options.map(o => `
      <label>
        <input type="radio" name="q${q.id}" value="${o.id}" 
          ${userAnswers[q.id] === o.id ? 'checked' : ''}>
        ${o.text}
      </label>
    `).join('')}
  `;
  document.getElementById('current-question').textContent = currentQuestionIndex + 1;
  document.getElementById('prev-question').disabled = currentQuestionIndex === 0;
  const nextBtn = document.getElementById('next-question');
  nextBtn.textContent = currentQuestionIndex === testQuestions.length - 1 ? 'Submit' : 'Next';
}

function handleNextQuestion() {
  const q = testQuestions[currentQuestionIndex];
  const sel = document.querySelector(`input[name="q${q.id}"]:checked`);
  if (!sel) return alert('Select an option.');
  userAnswers[q.id] = sel.value;
  if (currentQuestionIndex < testQuestions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    submitTest();
  }
}

function showPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
}

async function submitTest() {
  const nextBtn = document.getElementById('next-question');
  nextBtn.disabled = true;
  nextBtn.textContent = 'Processing...';
  try {
    const res = await window.api.submitTestResults(userAnswers);
    localStorage.setItem('personality_test_completed', 'true');
    localStorage.setItem('personality_test_results', JSON.stringify(res.profile));
    showTestResults(res.profile);
  } catch (err) {
    console.error('Submit error:', err);
    nextBtn.disabled = false;
    nextBtn.textContent = 'Submit';
  }
}

function showTestResults(profile) {
  if (!profile) {
    const saved = localStorage.getItem('personality_test_results');
    profile = saved ? JSON.parse(saved) : null;
  }
  document.getElementById('test-questions').classList.remove('active');
  document.getElementById('test-intro').classList.remove('active');
  document.getElementById('test-results').classList.add('active');
  document.getElementById('personality-type-title').textContent = profile.type;
  document.getElementById('personality-type-description').textContent = profile.description;
  const traits = document.getElementById('personality-traits-list');
  traits.innerHTML = profile.traits.map(t => `<li>${t}</li>`).join('');
  const recs = document.getElementById('career-recommendations-list');
  recs.innerHTML = profile.careerRecommendations.map(c => `
    <div class="rec-item" data-id="${c.id}">
      <span class="icon">${c.icon}</span>
      <h4>${c.title}</h4>
      <p>${c.match}</p>
    </div>
  `).join('');
  document.querySelectorAll('.rec-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.id;
      window.location.href = `career-path.html?career=${id}`;
    });
  });
}

document.getElementById('start-test-btn').addEventListener('click', startTest);
document.getElementById('next-question').addEventListener('click', handleNextQuestion);
document.getElementById('prev-question').addEventListener('click', showPreviousQuestion);


// dashboard.js
// Updated to use auth.js getUserData and window.api for careers

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof loadUserProfile === 'function') loadUserProfile();
  if (typeof isAdmin === 'function' && isAdmin()) {
    const adminLink = document.getElementById('admin-link');
    if (adminLink) adminLink.style.display = 'block';
  }
  bindLogout();
  updateProgressIndicators();
  loadRecentActivity();
  loadRecommendations();
});

function bindLogout() {
  const btn = document.getElementById('logout-btn');
  if (btn) btn.addEventListener('click', logout);
}

function updateProgressIndicators() {
  const profileFill = document.querySelector('.progress-item:first-child .progress-fill');
  if (profileFill) profileFill.style.width = '75%';
  const testDone = localStorage.getItem('personality_test_completed') === 'true';
  const label = document.querySelector('.progress-item:nth-child(2) .progress-label span:last-child');
  const fill = document.querySelector('.progress-item:nth-child(2) .progress-fill');
  if (label) label.textContent = testDone ? 'Completed' : 'Not Started';
  if (fill) fill.style.width = testDone ? '100%' : '0%';
}

function loadRecentActivity() {
  const list = document.querySelector('.activity-list');
  if (!list) return;
  list.innerHTML = '';
  const activities = [];
  if (localStorage.getItem('personality_test_completed') === 'true') {
    activities.push({icon:'🧠', title:'Completed Personality Test', time:'Just now'});
  }
  activities.push({icon:'📝', title:'Account Created', time:'Just now'});
  activities.push({icon:'👋', title:'Welcome to Pathway AI', time:'Just now'});
  activities.forEach(a => {
    const li = document.createElement('li');
    li.className = 'activity-item';
    li.innerHTML = `
      <div class="activity-icon">${a.icon}</div>
      <div class="activity-details">
        <p class="activity-title">${a.title}</p>
        <p class="activity-time">${a.time}</p>
      </div>
    `;
    list.appendChild(li);
  });
}

async function loadRecommendations() {
  const container = document.querySelector('.recommendations-list');
  if (!container) return;
  const testDone = localStorage.getItem('personality_test_completed') === 'true';
  container.innerHTML = '';
  const items = [
    { title:'Complete Your Profile', description:'Add details for better suggestions.', action:'Complete Now', url:'#' },
    { title: testDone?'Explore Career Paths':'Take Personality Test',
      description: testDone?'Browse options based on your test.':'Discover your strengths.',
      action: testDone?'Explore':'Take Test',
      url: testDone?'career-path.html':'personality-test.html'
    }
  ];
  items.forEach(r => {
    const div = document.createElement('div');
    div.className = 'recommendation-item';
    div.innerHTML = `
      <h3>${r.title}</h3>
      <p>${r.description}</p>
      <a href="${r.url}" class="btn btn-text">${r.action}</a>
    `;
    container.appendChild(div);
  });
}
