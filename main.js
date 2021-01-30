
let timer;
let deleteFirstPhotoDelay;

// fetch("https://dog.ceo/api/breeds/list/all").then(function(resp){
//     return resp.json();
// }).then(function(data){
//     console.log(data);
//     console.log(data.message);
// })

async function start(){
    try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await response.json();
        createBreedList(data.message);
    } catch (e) {
        console.log("There was a problem fetching the breed list!!!")
    }
}

function createBreedList(dogs){
    document.getElementById("breed").innerHTML=
    `<select onchange="loadByBreed(this.value)">
        <option>Choose a dog breed</option>
        ${Object.keys(dogs).map(dog=>{
            return `<option>${dog}</option>`
        })}
    <select>`
    // Code below works also
    // var list = document.getElementById('dogSelect');
    // console.log(list);
    // for (let dog in dogs){
    //     var opt = document.createElement('option');
    //     opt.innerHTML=dog;
    //     list.appendChild(opt);
    // };
}

async function loadByBreed(breed){
    console.log("loadByBreed",breed);
    if (breed!="Choose a dog breed"){ 
    const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
    const data = await response.json();
    createSlideShow(data.message);
    }
}

function createSlideShow(images){
    // <div class="slide" style="background-image:url('https://images.dog.ceo/breeds/hound-basset/n02088238_9960.jpg')"></div>
    console.log("displayHound",images);
    let currentPosition=0;
    clearInterval(timer);
    clearTimeout(deleteFirstPhotoDelay);
    if (images.length>1){
        document.getElementById("slideShow").innerHTML=`
        <div class="slide" style="background-image:url('${images[0]}')"></div>
        <div class="slide" style="background-image:url('${images[1]}')"></div>
        `;
        currentPosition+=2;
        if (images.length==2) currentPosition=0;
        timer = setInterval(nextSlide,3000);
    } else {
        document.getElementById("slideShow").innerHTML=`
        <div class="slide" style="background-image:url('${images[0]}')"></div>
        <div class="slide"></div>
        `;
    }
    function nextSlide(){
        document.getElementById("slideShow").insertAdjacentHTML("beforeend",`<div class="slide" style="background-image:url('${images[currentPosition]}')"></div>`)
        deleteFirstPhotoDelay = setTimeout(function(){
            document.querySelector(".slide").remove();      // removes 1st element.
        },1000);
        if (currentPosition+1>=images.length){
            currentPosition=0;
        } else {
            currentPosition++;
        }
    }
    // document.getElementById("dog").innerHTML=
    // `${dogD.map(d=>{
    //     console.log(d);
    //     return `<img src=${d}>`;
    // })}`;
}

start();