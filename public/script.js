/* Load posts */

fetch("/posts")

.then(res=>res.json())

.then(posts=>{

posts.forEach(p=>{

document.getElementById("posts")

.innerHTML+=`

<h4>${p.user}</h4>

<p>${p.text}</p>

<img src="/uploads/${p.image}" width="200">

<p>Likes ${p.likes}</p>

<button onclick="like('${p._id}')">Like</button>

<hr>

`;

});

});

/* Create post */

postForm.onsubmit = async (e)=>{

e.preventDefault();

const formData = new FormData();

formData.append("user", user.value);

formData.append("text", text.value);

formData.append("image", image.files[0]);

await fetch("/post",{

method:"POST",

body:formData

});

alert("Posted");

};

/* Like */

function like(id){

fetch("/like",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({id})

});

}