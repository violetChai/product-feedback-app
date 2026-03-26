function generateID(){
return '_' + Math.random().toString(36).substr(2,9);
}

function getData(){
return JSON.parse(localStorage.getItem("feedback"))||[];
}

function saveData(data){
localStorage.setItem("feedback",JSON.stringify(data));
}

/* LOAD DASHBOARD */

function loadFeedback(){

let data=getData();

const filter=document.getElementById("filter-status").value;

if(filter!=="all"){
data=data.filter(f=>f.status===filter);
}

data.sort((a,b)=>b.votes-a.votes);

const list=document.getElementById("feedback-list");
list.innerHTML="";

data.forEach(addFeedbackToDOM);

loadAnalytics();
loadRoadmap();
}

/* CREATE CARD */

function addFeedbackToDOM(f){

const list=document.getElementById("feedback-list");

const card=document.createElement("div");
card.className="feedback-card";

card.innerHTML=`

<strong>${f.text}</strong>

<div class="priority ${f.priority}">
${f.priority.toUpperCase()} PRIORITY
</div>

<div class="feedback-actions">

<select onchange="updateStatus('${f.id}',this.value)">
<option value="in progress" ${f.status==="in progress"?'selected':''}>In Progress</option>
<option value="review" ${f.status==="review"?'selected':''}>Review</option>
<option value="demo ready" ${f.status==="demo ready"?'selected':''}>Demo Ready</option>
<option value="complete" ${f.status==="complete"?'selected':''}>Complete</option>
</select>

<div>

<button class="vote" onclick="upvote('${f.id}')">
👍 ${f.votes}
</button>

<button class="delete-btn" onclick="deleteFeedback('${f.id}')">
Delete
</button>

</div>

</div>

<div class="progress-container">
<div class="progress-bar" id="${f.id}-progress"></div>
</div>

`;

list.appendChild(card);

updateProgressBar(f.id,f.status);
}

/* ADD FEEDBACK */

document.getElementById("feedback-form").addEventListener("submit",e=>{

e.preventDefault();

const text=document.getElementById("feedback-input").value;
const priority=document.getElementById("priority").value;

const data=getData();

data.push({
id:generateID(),
text,
priority,
status:"in progress",
votes:0
});

saveData(data);

document.getElementById("feedback-input").value="";

loadFeedback();

});

/* DELETE */

function deleteFeedback(id){

let data=getData();

data=data.filter(f=>f.id!==id);

saveData(data);

loadFeedback();
}

/* UPVOTE */

function upvote(id){

let data=getData();

data=data.map(f=>{
if(f.id===id){f.votes++}
return f
})

saveData(data);

loadFeedback();
}

/* STATUS */

function updateStatus(id,status){

let data=getData();

data=data.map(f=>{
if(f.id===id){f.status=status}
return f
})

saveData(data);

loadFeedback();
}

/* PROGRESS BAR */

function updateProgressBar(id,status){

const bar=document.getElementById(`${id}-progress`);
if(!bar)return;

let percent=0;

switch(status){
case"in progress":percent=25;break;
case"review":percent=50;break;
case"demo ready":percent=75;break;
case"complete":percent=100;break;
}

bar.style.width=percent+"%";
}

/* ANALYTICS */

function loadAnalytics(){

const data=getData().sort((a,b)=>b.votes-a.votes);

const container=document.getElementById("top-features");

container.innerHTML="";

data.slice(0,5).forEach(f=>{

const div=document.createElement("div");

div.innerHTML=`${f.text} — ${f.votes} votes`;

container.appendChild(div);

});

}

/* ROADMAP */

function loadRoadmap(){

const data=getData();

const todo=document.getElementById("todo");
const progress=document.getElementById("progress");
const done=document.getElementById("done");

todo.innerHTML="<h3>To Do</h3>";
progress.innerHTML="<h3>In Progress</h3>";
done.innerHTML="<h3>Done</h3>";

data.forEach(f=>{

const item=document.createElement("div");
item.className="roadmap-item";
item.textContent=f.text;

if(f.status==="complete") done.appendChild(item)
else if(f.status==="in progress") progress.appendChild(item)
else todo.appendChild(item)

});

}

/* PUBLIC PORTAL */

document.getElementById("portal-form").addEventListener("submit",e=>{

e.preventDefault();

const text=document.getElementById("portal-input").value;

const data=getData();

data.push({
id:generateID(),
text,
priority:"low",
status:"in progress",
votes:0
});

saveData(data);

alert("Feedback submitted");

});

/* FILTER */

document.getElementById("filter-status").addEventListener("change",loadFeedback);

loadFeedback();
