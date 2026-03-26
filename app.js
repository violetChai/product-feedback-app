function generateID(){
return '_' + Math.random().toString(36).substr(2,9);
}

function getData(){
return JSON.parse(localStorage.getItem('feedback')) || [];
}

function saveData(data){
localStorage.setItem('feedback',JSON.stringify(data));
}

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
}

function addFeedbackToDOM(f){

const list=document.getElementById("feedback-list");

const card=document.createElement("div");
card.className="feedback-card";
card.id=f.id;

card.innerHTML=`

<div><strong>${f.text}</strong></div>

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

<div>Status: <span id="${f.id}-status">${f.status}</span></div>

<div class="progress-container">
<div class="progress-bar" id="${f.id}-progress"></div>
</div>

`;

list.appendChild(card);

updateProgressBar(f.id,f.status);

}

document.getElementById("feedback-form").addEventListener("submit",e=>{

e.preventDefault();

const text=document.getElementById("feedback-input").value.trim();
const priority=document.getElementById("priority").value;

if(!text)return;

const feedback={
id:generateID(),
text:text,
status:"in progress",
priority:priority,
votes:0
};

const data=getData();
data.push(feedback);
saveData(data);

document.getElementById("feedback-input").value="";

loadFeedback();

});

function deleteFeedback(id){

let data=getData();

data=data.filter(f=>f.id!==id);

saveData(data);

loadFeedback();
}

function upvote(id){

let data=getData();

data=data.map(f=>{

if(f.id===id){
f.votes+=1;
}

return f;

});

saveData(data);

loadFeedback();
}

function updateStatus(id,status){

let data=getData();

data=data.map(f=>{
if(f.id===id){
f.status=status;
}
return f;
});

saveData(data);

loadFeedback();
}

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

document.getElementById("filter-status").addEventListener("change",loadFeedback);

loadFeedback();
