/**
 * careerPath.js
 * Fetches & displays a single career’s path & resources
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Protect page
  if (!isAuthenticated()) {
    return window.location.href = 'login.html';
  }
  loadUserProfile();
  if (isAdmin()) document.getElementById('admin-link').style.display = 'block';
  document.getElementById('logout-btn').onclick = logout;

  // Read career id from URL
  const params = new URLSearchParams(window.location.search);
  const careerId = params.get('career');
  if (!careerId) return alert('No career specified.');

  // Load & render details
  try {
    const { career } = await window.api.fetchCareerDetails(careerId);
    document.getElementById('career-title').textContent = career.title;
    document.getElementById('career-description').textContent = career.description;

    // Path steps
    const stepsContainer = document.getElementById('career-path-steps');
    stepsContainer.innerHTML = career.path.map((step, i) => `
      <div class="path-step">
        <h4>${i+1}. ${step.title}</h4>
        <p>${step.description}</p>
      </div>
    `).join('');

    // Resources
    const resContainer = document.getElementById('career-resources');
    resContainer.innerHTML = career.resources.map(r => `
      <div class="resource-item">
        <h4>${r.title}</h4>
        <p>${r.provider}</p>
        <a href="${r.url}" target="_blank">View Resource</a>
      </div>
    `).join('');

    // Save button
    document.getElementById('save-career').onclick = async () => {
      try {
        // replace with real API when available
        await window.api.submitSavedCareer(careerId);
        alert('Career path saved!');
      } catch {
        alert('Failed to save.');
      }
    };
  } catch (err) {
    console.error(err);
    alert('Could not load career details.');
  }
});
