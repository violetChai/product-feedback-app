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
<span class="priority ${item.priority}">
${item.priority}
</span>

<span class="status ${statusClass(item.status)}">
${item.status}
</span>
</div>

</div>

<select onchange="changeStatus('${item.id}',this.value)">

<option value="in progress" ${item.status==="in progress"?'selected':''}>In Progress</option>
<option value="review" ${item.status==="review"?'selected':''}>Review</option>
<option value="complete" ${item.status==="complete"?'selected':''}>Complete</option>

</select>

<div class="actions">

<button class="vote" onclick="vote('${item.id}')">
👍 ${item.votes}
</button>

<button class="delete" onclick="removeItem('${item.id}')">
Delete
</button>

</div>

<div class="progress">
<div class="bar" style="width:${progress(item.status)}%"></div>
</div>

`;

list.appendChild(card);

});

renderRoadmap();
renderAnalytics();

}

function progress(status){

switch(status){
case"in progress":return 30;
case"review":return 60;
case"complete":return 100;
}

}

function statusClass(status){

switch(status){
case"in progress":return"inprogress";
case"review":return"review";
case"complete":return"complete";
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

data=data.map(f=>{
if(f.id==id)f.votes++;
return f;
});

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

data=data.map(f=>{
if(f.id==id)f.status=status;
return f;
});

saveData(data);

render();

}

function renderRoadmap(){

const board=document.getElementById("roadmap-board");
board.innerHTML="";

const data=getData();

data.forEach(f=>{

const item=document.createElement("div");
item.className="roadmap-item";

item.innerText=`${f.text} (${f.status})`;

board.appendChild(item);

});

}

function renderAnalytics(){

const container=document.getElementById("analytics-list");
container.innerHTML="";

const data=getData().sort((a,b)=>b.votes-a.votes).slice(0,5);

data.forEach(f=>{

const item=document.createElement("div");

item.innerText=`${f.text} — ${f.votes} votes`;

container.appendChild(item);

});

}

document.getElementById("filter").addEventListener("change",render);

render();
