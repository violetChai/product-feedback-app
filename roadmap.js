const data = JSON.parse(localStorage.getItem("feedback")) || [];

const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");

data.forEach(f => {

const item = document.createElement("div");

item.textContent = f.text;
item.draggable = true;
item.className = "roadmap-item";

item.addEventListener("dragstart", dragStart);

todo.appendChild(item);

});

function dragStart(e) {

e.dataTransfer.setData("text", e.target.textContent);

}

document.querySelectorAll(".column").forEach(col => {

col.addEventListener("dragover", e => e.preventDefault());

col.addEventListener("drop", e => {

const text = e.dataTransfer.getData("text");

const item = document.createElement("div");

item.textContent = text;
item.className = "roadmap-item";

col.appendChild(item);

});

});
