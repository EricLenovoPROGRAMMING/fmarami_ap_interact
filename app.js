function $(id) {
 return document.getElementById(id);
}


const fullCanvas = {
 canvas: $("fscanvas"),
 ctx: $("fscanvas").getContext("2d"),
}
window.onerror = () => {
 console.log(arguments);
};
const fetchedStorage = {};
const fetchFile = (_directory, respType) => {
 let _d = _directory.split("./");
 let directory = (`${_d[_d.length - 1]}`).replace(new RegExp("//", "gm"), "/");
 return new Promise((res, rej) => {
  let xhr = new XMLHttpRequest();
  xhr.responseType = "arraybuffer";
  xhr.onreadystatechange = (event) => {
   //console.log(directory, event.target.readyState, event.target.status);
   if (event.target.readyState === 4 && event.target.status === 200) {

    var uint8Array = new Uint8Array(xhr.response);
    var i = uint8Array.length;
    var binaryString = [];
    while (i--) {
     binaryString[i] = String.fromCharCode(uint8Array[i]);
    }
    var data = binaryString.join('');

    var base64 = window.btoa(data);

    fetchedStorage[directory] = base64;
    //console.log(atob(base64))

    let type = {
     text: () => atob(base64),
     blob: () => new Blob([uint8Array]),
     base64: () => base64

    } [respType || "text"];
    //console.log(type())
    res(type());
   };
   if (event.target.readyState === 4 && event.target.status === 404) {

    res("404: EricLenovo System does not find a file: no such file or directory.");
   };
   //console.log(event.target.readyState, event.target.status);

  }
  xhr.open('GET', directory, true);
  xhr.send();
 })
}


function loadWeb() {
 return new Promise(async (res, rej) => {
  for (let b of WORD_BANK) {
   let loaded = await loadImgCanvas(b.src);
   current.elements[b.src] = loaded;
  }
  for (let n of ["correct.png", "wrong.png"]) {
   let mm = await loadImgCanvas(n);
   current.elements[n] = mm;
  }/**/
  res();
 });
}

function loadImgCanvas(b) {
 return new Promise(async (res, rej) => {

  let imgRaw = await fetchFile(`./files/${b}`, "blob");

  let img = new Image();
  try {

   img.src = window.URL.createObjectURL(imgRaw);
   img.onload = () => {
    let canvas = new OffscreenCanvas(img.width, img.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    res(canvas);


   };
  } catch (e) {
   res(new Image());
  }

 });
} /**/
var current = {
 cellsize: 0,
 current: 0,
 width: 0,
 height: 0,
 sorted: [0,1,2,3,4],
 elements: {},
 currentSorted: -17,
 revealed: false,
 denoted: false,
 answer: -1,
 correct: -1,
};

//current.sorted.sort(() => Math.random() - 0.5);

const WORD_BANK = [
 {
  choices: {
   0: "Rape",
   2: "Female Genital Mutilation",
   3: "Incest",
   1: "Cyberbullying"
  },
  correct: 1,
  quote: "Ang mga ito ay halimbawa ng karahasan sa KABABAIHAN maliban sa isa."
 },
 {
  choices: {
   0: "Sexual Harassment",
   2: "Teenage Pregnancy",
   3: "Limited Access to Reproductive Health Care",
   1: "Incest"
  },
  correct: 2,
  quote: "Ayon sa GABRIELA, ito ang ilan sa \"Seven Deadly Sins Against Women\" na binanggsit dito maliban sa isa."
 },
 {
  
  choices: {
   0: "9262",
   2: "11313",
   3: "7877",
   1: "9710"
  },
  correct: 0,
  quote: "Anong bilang sa Saligang Batas ang tinatawag na \"Anti-Violence Against Women And Their Children Act of 2004?\""
 
 },
 {
  choices: {
   3: "R.A. 9710",
   2: "R.A. 7877",
   0: "R.A. 9262",
   1: "R.A. 11313"
  },
  correct: 2,
  quote: "Anong batas ang naglalayong protektahan ang kababaihan mula sa sekswal na pang-aabuso?",
  
 },
 {
  choices: {
   3: "Reform, Integrity, Equality, League",
   2: "Retirement, Instinct, Equilibrium,  Liberty",
   0: "Reaffirmation, Integrity, Education, Livelihood",
   1: "Reform, Integrity, Equality, Leadership"
  },
  correct: 1,
  quote: "Fill in the 4 blanks (in EXACT order): General Assembly Binding women for _____, _____, _____, _____ and Action",

 }

];

function rambol(name) {
 current.name = name;
 let a = WORD_BANK[name];
 
 if (!("choices" in a)) 
 $("question").innerHTML = a.quote;
 $("rambol").style.color = "#fff";
 $("rambol").innerHTML = b; 
 $("answer").value = "";
 let ma = $("answer").value.trim();
 $("btn-ramrev").style.display = ma == "" ? "none" : "flex";
 $("btn-check").style.display = ma == "" ? "none" : "flex";
 canvasPicture.ctx.clearRect(0,0,1280,720);
 current.denoted = false;
 current.revealed = false;
 
 $("question").style.color = current.denoted ? "#ffa": "#fff";
 
 canvasPicture.ctx.drawImage(current.elements[a.src], 0, 0, 1280, 720);
}

function denote() {
 let a = WORD_BANK[current.sorted[current.currentSorted]];
 if (!("hint" in a)) return;
 current.denoted = !current.denoted;
 
 if (current.denoted) {
  
 }
 
 $("question").innerHTML = current.denoted ? a.hint : a.quote;
 $("question").style.color = current.denoted ? "#ffa": "#fff";
}



/*function createRambolLetters(wc, arr, jumArr) {
 current.elements = {};
 let sz = 3;
 let ram = [];
 $("rambol-div").innerHTML = "";
 let count = 0;
 let mcount = -1,
  mword = 0;
  let length = 0;
 for (let n of arr) {
  let m = n;
  let el = n;
  mcount++;
  do {
      let p = false;

   if (mcount + 1>= wc[mword]) {
    mcount = -1;
    mword++;
    //count--;
    p = true;
   }
   if (!p) ram.push(length - mword);
   length++;
   
   if (!p) break;
  } while (false);
  count++;
 }
 for (let qw of jumArr) {
  let temp = g
 }
 count = 0,
  mcount = -1,
  mword = 0;
 let used = 0;
 for (let n of arr) {
  let m = n;
  let restore = n;
  let el = n;
  do {
   let p = false;
   m = restore;
   el = restore;
   if (mcount + 1 >= wc[mword]) {
    mcount = -1;
    mword++;
    m = "$";
    el = "nbsp";
    
    //count-=1;
    p = true;
    console.log("space")
   }

   console.log(mcount, el)
   let a = current.elements;
   a[`letter-${el}${count}`] = document.createElement("leter");
   let h = a[`letter-${el}${count}`];
   h.innerHTML = m;
   h.id = `letter-${el}${count}`;
   h.className = "lettering";
   h.style.position = "absolute";
   h.style.background = "#7353";
   h.style.fontSize = `${sz*current.cellsize}px`;
   h.style.width = current.cellsize * sz + "px";
   h.style.height = current.cellsize * sz + "px";
   h.style.transform = `translateX(${(current.cellsize * (sz / 1.2) * (mword + ram[used])) - (current.cellsize * length * 1.2)}px)`
   $("rambol-div").appendChild(h);
   used++;

   if (!p) break;
  } while (true);
  count++;
  mcount++;
 }
}*/




function reveal() {
 let a = WORD_BANK[current.sorted[current.currentSorted]];
 current.revealed = !current.revealed;
 
  //let b = createRambol(a.wcount, current.revealed ? a.word.split("") : a.rambol);
 //$("rambol").style.color = current.revealed ? "#0f0" :  "#fff";
 //$("rambol").innerHTML = b; 
 for (let g = 0; g < 4; g++) {
  $(`choicetext-${g}`).style.color = g == current.correct && current.revealed? "#0f0" : "#fff";

  $(`choices-${g}`).style.background = g == current.correct && current.revealed? "#0a0" : "#848";
  $(`choices-${g}`).style.border = `2px solid ${g == current.correct && current.revealed ? "#0f0" : "#f6f"}`;
 }
}

function check() {
 let query = current.answer;
 if (query === -1) return;
 let a = WORD_BANK[current.sorted[current.currentSorted]].correct;
 
 
 
 if (a === query) {
  while (!current.revealed) {
   reveal();
  }
  fullCanvas.ctx.drawImage(current.elements["correct.png"], 0, 0, 1280, 720);
  fullCanvas.canvas.style.display = "flex";
  
 } else {
  fullCanvas.ctx.drawImage(current.elements["wrong.png"], 0, 0, 1280, 720);
  fullCanvas.canvas.style.display = "flex";
 }
 console.log(query);
}

function resize() {
 let s = current;
 s.width = window.innerWidth;
 s.height = window.innerHeight;
 let min = Math.min(s.width, s.height);
 let cellSize = min / 40;
 s.cellsize = cellSize;
 document.documentElement.style.fontSize = cellSize + "px";
 $("core").style.width = `${cellSize*40*(16/9)}px`;
 $("core").style.height = `${cellSize*40}px`;
 $("head").style.width = `${cellSize*40*(16/9)}px`;
 $("head").style.height = `${cellSize*2}px`;
 $("content").style.width = `${cellSize*40*(16/9)}px`;
 $("content").style.height = `${cellSize*37}px`;
 
 $("fscanvas").style.width = `${cellSize*40*(16/9)}px`;
 $("fscanvas").style.height = `${cellSize*40}px`;

 $("question-div").style.width = `${cellSize*40*(16/9)}px`;
 $("question-div").style.height = `${cellSize*8}px`;
 $("picture-div").style.width = `${cellSize*40*(16/9)}px`;
 $("picture-div").style.height = `${cellSize*21}px`;
 $("rambol-div").style.width = `${cellSize*40*(16/9)}px`;
 $("rambol-div").style.height = `${cellSize*3}px`;
 $("answer-div").style.width = `${cellSize*40*(16/9)}px`;
 $("answer-div").style.height = `${cellSize*3}px`;
 $("control-div").style.width = `${cellSize*40*(16/9)}px`;
 $("control-div").style.height = `${cellSize*3}px`;

 //$("picture").style.width = `${cellSize*22*(16/9)}px`;
 //$("picture").style.height = `${cellSize*22}px`;
}

for (let j of ["resize", "DOMContentLoaded"]) {
 window.addEventListener(j, () => {
  resize();
 });
}

function pick(answer) {
 let same = current.answer == answer;
 current.answer = !same ? answer : -1;
 current.revealed = false;
 for (let g = 0; g < 4; g++) {
  $(`choicetext-${g}`).style.color = g == current.answer ? "#ff0" : "#fff";

  $(`choices-${g}`).style.background = g == current.answer ? "#aa0" : "#848";
  $(`choices-${g}`).style.border = `2px solid ${g == current.answer ? "#ff0" : "#f6f"}`;
 }
 if (current.answer > 0) {
  
 }
}

function switchPage(u) {
 let uu = current.currentSorted;
 //current.currentSorted = u;
 if (current.currentSorted < -1) {
  current.currentSorted = -1;
 }
 if (current.currentSorted >4) current.currentSorted = 4;
 
 if (current.currentSorted > -1) {
  let a = WORD_BANK[current.sorted[current.currentSorted]];
  $("question").innerHTML = a.quote;
  //$("rambol").style.color = "#fff";
  $("picture-div").innerHTML = "<gggg id=choices-div style='width; 80%; height: 70%; font-size: 300%'></gggg>"; 
 // canvasPicture.ctx.clearRect(0,0,1280,720);
  $("rambol-div").innerHTML = "";
  for (let h in a.choices) {
   let b = a.choices[h];
   $("choices-div").innerHTML += `<jj id="choicetext-${h}">${["A","B",'C',"D"][h]}: ${b}</jj><br>`;
    $("rambol-div").innerHTML += `<hhsh style='width:${current.cellsize * 3}px; height: ${current.cellsize * 3}px; display: flex; justify-content: center; align-items: center; background: #848; border: 2px solid #f6f' id='choices-${h}' onclick='pick(${h})'><mmm style='font-size: 200%'>${["A","B",'C',"D"][h]}</mmm></hhsh>`;
  } 
  current.answer = -1;
  current.correct = a.correct;
 
 $("btn-ramrev").style.display = a == "" ? "none" : "flex";
 $("btn-check").style.display = a == "" ? "none" : "flex";
 current.denoted = false;
 current.revealed = false;
 }
 else {
   $("question").innerHTML = "";
  //$("rambol").style.color = "#fff";
  $("rambol-div").innerHTML = "";

  $("picture-div").innerHTML = "<gggg id=choices-div style='width; 80%; height: 70%; font-size: 300%'></gggg>"; 
 // canvasPicture.ctx.clearRect(0,0,1280,720);
  $("answer-div").innerHTML = "";
$("btn-ramrev").style.display = "none";
 $("btn-check").style.display = "none";
 current.denoted = false;
 current.revealed = false;
  }
 //else rambol(current.sorted[current.currentSorted]);
}

window.addEventListener("DOMContentLoaded", async () => {
 await loadWeb();
 current.currentSorted--;
 if (current.currentSorted < -1) {
  current.currentSorted = -1;
 }

 switchPage(current.currentSorted);
 
})

$("btn-prev").onclick = () => {
 
 current.currentSorted--;
 
 switchPage();
}

$("btn-next").onclick = () => {
 current.currentSorted++;
 
 switchPage();
}

//$("btn-hint").onclick = denote;

$("btn-ramrev").onclick = () => {
 current.answer = -1;
 reveal();
};

$("btn-check").onclick = check;

$("fscanvas").onclick = () => {
  fullCanvas.canvas.style.display = "none";
  
}

