let feedbackItems = [];

function addFeedback() {

  const input = document.getElementById("feedbackInput");
  const text = input.value;

  if (text === "") return;

  feedbackItems.push(text);

  renderFeedback();

  input.value = "";
}

function renderFeedback() {

  const list = document.getElementById("feedbackList");

  list.innerHTML = "";

  feedbackItems.forEach((item) => {

    const li = document.createElement("li");
    li.textContent = item;

    list.appendChild(li);

  });
}
