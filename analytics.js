const data = JSON.parse(localStorage.getItem("feedback")) || [];

const sorted = data.sort((a,b)=>b.votes-a.votes);

const container = document.getElementById("top-features");

sorted.slice(0,5).forEach(f => {

const div = document.createElement("div");

div.innerHTML = `
<strong>${f.text}</strong>
<p>Votes: ${f.votes}</p>
`;

container.appendChild(div);

});
