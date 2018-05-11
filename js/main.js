const NUM_WORK_IMAGES = 26;
const WORK_HANG_AMT = 0;
const WORK_CHANGE_TIMING = 1000; // 1000 == 1 second

// array of image objects
var images = [];

// previously selected random image index
var lastImg;

var overlayImgEl;
var showWorkInterval;

function showWorkStep() {
    var curImg = images[chance.integer({min:0,max:images.length-1})];

    // make sure the same image isn't selected twice in a row
    while (typeof lastImg == "number" && lastImg == curImg)
        curImg = images[chance.integer({min:0,max:images.length-1})];
    lastImg = curImg;

    // decide image dimentions
    var imgHeight;
    var imgWidth;
    var curMult = chance.floating({min: 0.25,max: 0.6});
    if (window.innerWidth < window.innerHeight) {
        imgWidth = Math.floor(curMult * window.innerWidth);
        imgHeight = Math.floor((curImg.height/curImg.width) * imgWidth);
    }
    else {
        imgHeight = Math.floor(curMult * window.innerHeight);
        imgWidth = Math.floor((curImg.width/curImg.height) * imgHeight);
        console.log(imgWidth,imgHeight);
    }

    // constrain image dims to screen size
    if (window.innerWidth < imgWidth) {
        imgWidth = window.innerWidth;
        imgHeight = Math.floor((curImg.height/curImg.width) * imgWidth);
    }
    if (window.innerHeight < imgHeight) {
        imgHeight = window.innerHeight;
        imgWidth = Math.floor((curImg.width/curImg.height) * imgHeight);
    }

    // allow images to hang off-screen
    if (WORK_HANG_AMT > 0) {
        var hHang = imgHeight/WORK_HANG_AMT;
        var wHang = imgWidth/WORK_HANG_AMT;
        overlayImgEl.style.top  = chance.integer({min: -hHang,max: window.innerHeight - imgHeight + hHang}) + "px";
        overlayImgEl.style.left = chance.integer({min: -wHang,max: window.innerWidth  - imgWidth + wHang})  + "px";
    }
    else {
        overlayImgEl.style.top  = chance.integer({min: 0,max: window.innerHeight - imgHeight}) + "px";
        overlayImgEl.style.left = chance.integer({min: 0,max: window.innerWidth  - imgWidth})  + "px";
    }

    // set image dimentions
    overlayImgEl.style.height = imgHeight + "px";
    overlayImgEl.style.width  = imgWidth + "px";
    overlayImgEl.src          = curImg.src;

    // make sure image is shown
    overlayImgEl.classList.remove("hidden");
}

function stopShowWork() {
    clearInterval(showWorkInterval);
    overlayImgEl.classList.add("hidden");
}

function startShowWork() {
    if (showWorkInterval) clearInterval(showWorkInterval);
    showWorkStep();
    showWorkInterval = setInterval(showWorkStep, WORK_CHANGE_TIMING);
}

function initWork() {
    var workEl = document.getElementById("work");
    workEl.addEventListener("mouseenter",startShowWork);
    workEl.addEventListener("mouseleave",stopShowWork);
}

function initBetter() {}
function initWorse() {}

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
