const NUM_WORK_IMAGES = 26;
var images = [];

var overlayImgEl;
var showWorkInterval;

function showWorkStep() {
    var curImg = images[chance.integer({min:0,max:images.length-1})];

    var imgHeight;
    var imgWidth;
    var curMult = chance.floating({min: 0.3,max: 0.7});
    if (window.innerWidth > window.innerHeight) {
        imgWidth = Math.floor(curMult * window.innerWidth);
        imgHeight = (curImg.height/curImg.width) * imgWidth;
    }
    else {
        imgHeight = Math.floor(curMult * window.innerHeight);
        imgWidth = (curImg.width/curImg.height) * imgWidth;
    }

    overlayImgEl.style.top  = chance.integer({min: 0,max: window.innerHeight - imgHeight}) + "px";
    overlayImgEl.style.left = chance.integer({min: 0,max: window.innerWidth  - imgWidth})  + "px";

    overlayImgEl.style.height = imgHeight + "px";
    overlayImgEl.style.width  = imgWidth + "px";
    overlayImgEl.src          = curImg.src;

    overlayImgEl.classList.remove("hidden");
}

function stopShowWork() {
    clearInterval(showWorkInterval);
    overlayImgEl.classList.add("hidden");
}

function startShowWork() {
    if (showWorkInterval) clearInterval(showWorkInterval);
    showWorkStep();
    showWorkInterval = setInterval(showWorkStep, 500);
}

function initWork() {
    var workEl = document.getElementById("work");
    workEl.addEventListener("mouseenter",startShowWork);
    workEl.addEventListener("mouseleave",stopShowWork);
}

function initBetter() {

}

function initWorse() {

}

function preloadImages() {
    var baseSrc = "img/work/cooper_hewitt/";
    for (var i = 0; i < NUM_WORK_IMAGES; i++) {
        var img = new Image();
        img.onload = function () {
            images.push(this);
        }
        img.src = baseSrc + i + ".jpg";
    }
    setTimeout(function () {
        console.log(images);
    }, 100);
}

function init() {
    preloadImages();
    overlayImgEl = document.getElementById("overlayImg");
    initWork();
    initBetter();
    initWorse();
}

window.onload = init;
