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

<span class="priority ${item.priority}">
${item.priority}
</span>

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

}

function progress(status){

switch(status){
case"in progress":return 30;
case"review":return 60;
case"complete":return 100;
}

}

document.getElementById("feedback-form").addEventListener("submit",e=>{

e.preventDefault();

const text=document.getElementById("feedback-input").value;
const priority=document.getElementById("priority").value;

const data=getData();

data.push({
id:Date.now(),
text:text,
priority:priority,
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

document.getElementById("filter").addEventListener("change",render);

render();
