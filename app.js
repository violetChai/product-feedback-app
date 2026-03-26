// Utility to generate unique IDs
function generateID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Load feedback from localStorage
function loadFeedback() {
  const feedbackData = JSON.parse(localStorage.getItem('feedback')) || [];
  const feedbackList = document.getElementById('feedback-list');
  feedbackList.innerHTML = '';
  feedbackData.forEach(f => addFeedbackToDOM(f));
}

// Add feedback item to DOM
function addFeedbackToDOM(feedback) {
  const feedbackList = document.getElementById('feedback-list');

  const card = document.createElement('div');
  card.className = 'feedback-card';
  card.id = feedback.id;

  card.innerHTML = `
    <p>${feedback.text}</p>
    <div class="feedback-actions">
      <select onchange="updateStatus('${feedback.id}', this.value)">
        <option value="in progress" ${feedback.status === 'in progress' ? 'selected' : ''}>In Progress</option>
        <option value="review" ${feedback.status === 'review' ? 'selected' : ''}>Review</option>
        <option value="demo ready" ${feedback.status === 'demo ready' ? 'selected' : ''}>Demo Ready</option>
        <option value="complete" ${feedback.status === 'complete' ? 'selected' : ''}>Complete</option>
      </select>
      <button onclick="deleteFeedback('${feedback.id}')">Delete</button>
    </div>
    <small>Status: <span id="${feedback.id}-status">${feedback.status}</span></small>
  `;

  feedbackList.appendChild(card);
}

// Add feedback to localStorage and DOM
document.getElementById('feedback-form').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('feedback-input');
  const text = input.value.trim();
  if (!text) return;

  const feedback = { id: generateID(), text, status: 'in progress' };
  let feedbackData = JSON.parse(localStorage.getItem('feedback')) || [];
  feedbackData.push(feedback);
  localStorage.setItem('feedback', JSON.stringify(feedbackData));

  addFeedbackToDOM(feedback);
  input.value = '';
});

// Delete feedback
function deleteFeedback(id) {
  const item = document.getElementById(id);
  if (item) item.remove();

  let feedbackData = JSON.parse(localStorage.getItem('feedback')) || [];
  feedbackData = feedbackData.filter(f => f.id !== id);
  localStorage.setItem('feedback', JSON.stringify(feedbackData));
}

// Update feedback status
function updateStatus(id, status) {
  let feedbackData = JSON.parse(localStorage.getItem('feedback')) || [];
  feedbackData = feedbackData.map(f => f.id === id ? {...f, status} : f);
  localStorage.setItem('feedback', JSON.stringify(feedbackData));

  document.getElementById(`${id}-status`).innerText = status;
}

// Initialize
loadFeedback();
