function generateID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function loadFeedback() {
  const data = JSON.parse(localStorage.getItem('feedback')) || [];
  const list = document.getElementById('feedback-list');
  list.innerHTML = '';
  data.forEach(addFeedbackToDOM);
}

function addFeedbackToDOM(feedback) {

  const list = document.getElementById('feedback-list');

  const card = document.createElement('div');
  card.className = 'feedback-card';
  card.id = feedback.id;

  card.innerHTML = `
    <div class="feedback-text">${feedback.text}</div>

    <div class="feedback-actions">
      <select onchange="updateStatus('${feedback.id}', this.value)">
        <option value="in progress" ${feedback.status === 'in progress' ? 'selected' : ''}>In Progress</option>
        <option value="review" ${feedback.status === 'review' ? 'selected' : ''}>Review</option>
        <option value="demo ready" ${feedback.status === 'demo ready' ? 'selected' : ''}>Demo Ready</option>
        <option value="complete" ${feedback.status === 'complete' ? 'selected' : ''}>Complete</option>
      </select>

      <button class="delete-btn" onclick="deleteFeedback('${feedback.id}')">
        Delete
      </button>
    </div>

    <div class="status-text">
      Status: <span id="${feedback.id}-status">${feedback.status}</span>
    </div>

    <div class="progress-container">
      <div class="progress-bar" id="${feedback.id}-progress"></div>
    </div>
  `;

  list.appendChild(card);
  updateProgressBar(feedback.id, feedback.status);
}

document.getElementById('feedback-form').addEventListener('submit', e => {

  e.preventDefault();

  const input = document.getElementById('feedback-input');
  const text = input.value.trim();

  if (!text) return;

  const feedback = {
    id: generateID(),
    text: text,
    status: 'in progress'
  };

  const data = JSON.parse(localStorage.getItem('feedback')) || [];
  data.push(feedback);
  localStorage.setItem('feedback', JSON.stringify(data));

  addFeedbackToDOM(feedback);
  input.value = '';
});

function deleteFeedback(id) {

  const element = document.getElementById(id);
  if (element) element.remove();

  let data = JSON.parse(localStorage.getItem('feedback')) || [];
  data = data.filter(f => f.id !== id);

  localStorage.setItem('feedback', JSON.stringify(data));
}

function updateStatus(id, status) {

  let data = JSON.parse(localStorage.getItem('feedback')) || [];

  data = data.map(f =>
    f.id === id ? { ...f, status } : f
  );

  localStorage.setItem('feedback', JSON.stringify(data));

  document.getElementById(`${id}-status`).innerText = status;

  updateProgressBar(id, status);
}

function updateProgressBar(id, status) {

  const bar = document.getElementById(`${id}-progress`);
  if (!bar) return;

  let percent = 0;
  let color = '#4caf50';

  switch(status) {
    case 'in progress': percent = 25; color = '#2196f3'; break;
    case 'review': percent = 50; color = '#ff9800'; break;
    case 'demo ready': percent = 75; color = '#9c27b0'; break;
    case 'complete': percent = 100; color = '#4caf50'; break;
  }

  bar.style.width = percent + '%';
  bar.style.backgroundColor = color;
}

loadFeedback();
