function getData(){
return JSON.parse(localStorage.getItem("feedback")) || [];
}

function saveData(data){
localStorage.setItem("feedback",JSON.stringify(data));
}

function render(){

let data=getData();

const filter=document.getElementById("filter").value;

if(filter!=="all"){
data=data.filter(f=>f.status===filter);
}

data.sort((a,b)=>b.votes-a.votes);

const list=document.getElementById("feedback-list");
list.innerHTML="";

data.forEach(item=>{
const card=document.createElement("div");
card.className="card";

card.innerHTML=`
<div class="card-header">
<strong>${item.text}</strong>
<div>
<span class="priority ${item.priority}">${item.priority}</span>
<span class="status ${statusClass(item.status)}">${item.status}</span>
</div>
</div>

<select onchange="changeStatus('${item.id}',this.value)">
<option value="in progress" ${item.status==="in progress"?'selected':''}>In Progress</option>
<option value="review" ${item.status==="review"?'selected':''}>Review</option>
<option value="complete" ${item.status==="complete"?'selected':''}>Complete</option>
</select>

<div class="actions">
<button class="vote" onclick="vote('${item.id}')">👍 ${item.votes}</button>
<button class="delete" onclick="removeItem('${item.id}')">Delete</button>
</div>

<div class="progress">
<div class="bar" style="width:${progress(item.status)}%"></div>
</div>
`;

list.appendChild(card);
});

renderRoadGraphic();
renderChart();
}

function progress(status){
switch(status){
case"in progress":return 30;
case"review":return 60;
case"complete":return 100;
default:return 0;
}
}

function statusClass(status){
switch(status){
case"in progress":return"inprogress";
case"review":return"review";
case"complete":return"complete";
default:return"inprogress";
}
}

document.getElementById("feedback-form").addEventListener("submit",e=>{
e.preventDefault();
const text=document.getElementById("feedback-input").value;
const priority=document.getElementById("priority").value;
const data=getData();
data.push({
id:Date.now(),
text,
priority,
status:"in progress",
votes:0
});
saveData(data);
document.getElementById("feedback-input").value="";
render();
});

function vote(id){
let data=getData();
data=data.map(f=>{ if(f.id==id) f.votes++; return f; });
saveData(data);
render();
}

function removeItem(id){
let data=getData();
data=data.filter(f=>f.id!=id);
saveData(data);
render();
}

function changeStatus(id,status){
let data=getData();
data=data.map(f=>{ if(f.id==id) f.status=status; return f; });
saveData(data);
render();
}

/* ROADMAP */
function renderRoadGraphic(){
const container=document.getElementById("roadmap-milestones");
container.innerHTML="";
const data=getData();
data.forEach(item=>{
const milestone=document.createElement("div");
milestone.className="milestone "+statusClass(item.status);
milestone.innerHTML=`
<div class="milestone-dot"></div>
<div class="milestone-label">${item.text}<br><small>${item.status}</small></div>
`;
container.appendChild(milestone);
});
}

/* ANALYTICS */
function renderChart(){
const canvas=document.getElementById("progressChart");
const ctx=canvas.getContext("2d");
const data=getData();
let complete=0, review=0, progress=0;
data.forEach(f=>{
if(f.status==="complete") complete++;
if(f.status==="review") review++;
if(f.status==="in progress") progress++;
});
const total=complete+review+progress||1;
const width=canvas.width;
const completeWidth=(complete/total)*width;
const reviewWidth=(review/total)*width;
const progressWidth=(progress/total)*width;
ctx.clearRect(0,0,width,300);
let x=0;
ctx.fillStyle="#4caf50";
ctx.fillRect(x,100,completeWidth,50);
x+=completeWidth;
ctx.fillStyle="#ff9800";
ctx.fillRect(x,100,reviewWidth,50);
x+=reviewWidth;
ctx.fillStyle="#2196f3";
ctx.fillRect(x,100,progressWidth,50);
ctx.fillStyle="#000";
ctx.font="14px Arial";
ctx.fillText("Complete: "+complete,20,80);
ctx.fillText("Review: "+review,200,80);
ctx.fillText("In Progress: "+progress,380,80);
}

/* FILTER */
document.getElementById("filter").addEventListener("change",render);

render();
