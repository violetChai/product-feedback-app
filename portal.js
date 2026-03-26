document.getElementById("portal-form").addEventListener("submit",e=>{

e.preventDefault();

const text = document.getElementById("portal-input").value;

const data = JSON.parse(localStorage.getItem("feedback")) || [];

data.push({
id: Date.now(),
text: text,
priority:"low",
status:"in progress",
votes:0
});

localStorage.setItem("feedback",JSON.stringify(data));

alert("Feedback submitted!");

});
