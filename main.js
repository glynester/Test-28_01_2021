
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

// start();

const problemElement=document.querySelector(".problem");
const gameForm=document.querySelector(".gameForm");
const gameField=document.querySelector(".gameField");
const pointsNeeded=document.querySelector(".points-needed");
const triesAllowed=document.querySelector(".tries-allowed");
const progBar=document.querySelector(".progress-inner");
const endMessage=document.querySelector(".end-message");
const resetButton=document.querySelector(".reset-button");

let state={
    score:0,
    wrongAnswers: 0
}

function updateProblem(){
    state.currentProblem=generateProblem();
    problemElement.innerHTML=`${state.currentProblem.numberOne} ${state.currentProblem.operator} ${state.currentProblem.numberTwo}`;
    gameField.value='';
    gameField.focus();
}

// updateProblem();

function generateNumber(max){
    return Math.floor(Math.random() * (max + 1));
}

function generateProblem(){
    return {
        numberOne: generateNumber(10),
        numberTwo: generateNumber(10),
        operator: ['+', '-', 'x'][generateNumber(2)]
    }
}

gameForm.addEventListener('submit', handleSubmit);

function handleSubmit(event){
    event.preventDefault();
    let correctAnswer, p=state.currentProblem;
    if (p.operator=='+'){ correctAnswer=p.numberOne+p.numberTwo; } 
    if (p.operator=='-') { correctAnswer=p.numberOne-p.numberTwo; } 
    if (p.operator=='x') { correctAnswer=p.numberOne*p.numberTwo; }
    if (parseInt(gameField.value,10)==correctAnswer){
        state.score++;
        pointsNeeded.textContent=10-state.score;
        updateProblem();
        renderProgressBar();
        // alert("Good job!"+ correctAnswer + gameField.value);
    } else {
        state.wrongAnswers++;
        // alert("Wrong Dude!" + correctAnswer + gameField.value);
        triesAllowed.textContent=3-state.wrongAnswers;
        problemElement.classList.add("animate-wrong");
        setTimeout(_=>problemElement.classList.remove("animate-wrong"),500);
    }
    checkLogic();
}

function checkLogic(){
    // you won
    if (state.score==10){
        endMessage.textContent="Congratulations, you won pal!!!";
        document.body.classList.add("overlay-is-open");
        setTimeout(_=>resetButton.focus(),500);
     }
    // you lost
    if (state.wrongAnswers==3){
        endMessage.textContent="Bad luck, you lost matey!!!";
        document.body.classList.add("overlay-is-open");
        setTimeout(_=>resetButton.focus(),500);
    }
}

resetButton.addEventListener("click", resetGame);

function resetGame(){
    document.body.classList.remove("overlay-is-open");
    updateProblem();
    state.score=0;
    state.wrongAnswers=0;
    pointsNeeded.textContent=10;
    triesAllowed.textContent=3;
    renderProgressBar();
}

function renderProgressBar(){
    progBar.style.transform=`scaleX(${state.score/10})`;
}






