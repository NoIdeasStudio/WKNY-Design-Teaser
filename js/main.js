/******************************************************************************/
/************************** CONSTANTS *****************************************/
/******************************************************************************/

const NUM_WORK_IMAGES      = 26;
const NUM_WORSE_IMAGES     = 11;

const IMG_OVERLAY_HANG_AMT = 0;

const WORK_CHANGE_TIMING   = 1000; // 1000 == 1 second
const BETTER_CHANGE_TIMING = 150;
const WORSE_CHANGE_TIMING  = 150;

/******************************************************************************/
/************************** GLOBALS *******************************************/
/******************************************************************************/

// general use previously selected random image index
var lastImgInd;

/******************************************************************************/
/************************** HELPER FUNCTIONS **********************************/
/******************************************************************************/


function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/******************************************************************************/
/************************** WORK **********************************************/
/******************************************************************************/

var overlayImgEl;
var showWorkInterval;

function showWorkStep() {
    var curImgInd = chance.integer({min:0,max:workImages.length-1});

    // make sure the same image isn't selected twice in a row
    while (typeof lastImgInd == "number" && lastImgInd == curImgInd)
        curImgInd = chance.integer({min:0,max:workImages.length-1});
    lastImgInd = curImgInd;
    var curImg = workImages[curImgInd];

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
    if (IMG_OVERLAY_HANG_AMT > 0) {
        var hHang = imgHeight/IMG_OVERLAY_HANG_AMT;
        var wHang = imgWidth/IMG_OVERLAY_HANG_AMT;
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

/******************************************************************************/
/************************** BETTER ********************************************/
/******************************************************************************/

var betterInterval;
var betterToUse;
var betterNumShown;

function betterStep() {
    if (betterToUse.length == 0)
        betterToUse = shuffle([...Array(NUM_WORK_IMAGES).keys()]);

    var curImg = workImages[betterToUse.splice(0,1)[0]];

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

    var curImgEl = document.createElement("img");
    curImgEl.classList.add("overlayImg");
    curImgEl.id = "better_" + betterNumShown;
    curImgEl.zIndex = 100 + betterNumShown;
    betterNumShown++;

    // allow images to hang off-screen
    if (IMG_OVERLAY_HANG_AMT > 0) {
        var hHang = imgHeight/IMG_OVERLAY_HANG_AMT;
        var wHang = imgWidth/IMG_OVERLAY_HANG_AMT;
        curImgEl.style.top  = chance.integer({min: -hHang,max: window.innerHeight - imgHeight + hHang}) + "px";
        curImgEl.style.left = chance.integer({min: -wHang,max: window.innerWidth  - imgWidth + wHang})  + "px";
    }
    else {
        curImgEl.style.top  = chance.integer({min: 0,max: window.innerHeight - imgHeight}) + "px";
        curImgEl.style.left = chance.integer({min: 0,max: window.innerWidth  - imgWidth})  + "px";
    }

    // set image dimentions
    curImgEl.style.height = imgHeight + "px";
    curImgEl.style.width  = imgWidth + "px";
    curImgEl.src          = curImg.src;
    document.body.appendChild(curImgEl);
}

function betterStopStep(i) {
    setTimeout(function () {
        console.log(i);
        var curRem = document.getElementById("better_" + i);
        if (curRem) curRem.parentNode.removeChild(curRem);
    }, Math.floor(700 / betterNumShown) * (betterNumShown - 1 - i));
}

function stopBetter() {
    clearInterval(betterInterval);
    for (var i = 0; i < betterNumShown; i++) betterStopStep(i);
}

function startBetter() {
    betterNumShown = 0;
    betterToUse = shuffle([...Array(NUM_WORK_IMAGES).keys()]);
    if (betterInterval) clearInterval(betterInterval);
    betterStep();
    betterInterval = setInterval(betterStep, BETTER_CHANGE_TIMING);
}

function initBetter() {
    var betterEl = document.getElementById("better");
    betterEl.addEventListener("mouseenter",startBetter);
    betterEl.addEventListener("mouseleave",stopBetter);
}

/******************************************************************************/
/************************** WORSE *********************************************/
/******************************************************************************/

var worseInterval;

function worseStep() {
    var curImgInd = chance.integer({min:0,max:worseImages.length-1});
    // make sure the same image isn't selected twice in a row
    while (typeof lastImgInd == "number" && lastImgInd == curImgInd)
        curImgInd = chance.integer({min:0,max:worseImages.length-1});
    lastImgInd = curImgInd;
    var curImg = worseImages[curImgInd];

    // decide image dimentions
    var curMult = chance.floating({min: 1.1,max: 1.5});
    var imgHeight;
    var imgWidth;
    if (chance.bool()) {
        imgHeight = window.innerHeight * curMult;
        imgWidth = Math.floor((curImg.width/curImg.height) * imgHeight);
    }
    else {
        imgWidth = window.innerWidth * curMult;
        imgHeight = Math.floor((curImg.height/curImg.width) * imgWidth);
    }

    overlayImgEl.style.top  = (-(imgHeight - window.innerHeight)/2) + "px";
    overlayImgEl.style.left = (-(imgWidth  - window.innerWidth)/2)  + "px";

    // set image dimentions
    overlayImgEl.style.height = imgHeight + "px";
    overlayImgEl.style.width  = imgWidth + "px";
    overlayImgEl.src          = curImg.src;

    overlayImgEl.classList.remove("hidden");
}

function startWorse() {
    if (worseInterval) clearInterval(worseInterval);
    worseStep();
    worseInterval = setInterval(worseStep, WORSE_CHANGE_TIMING);
}

function stopWorse() {
    clearInterval(worseInterval);
    overlayImgEl.classList.add("hidden");
}

function initWorse() {
    var worseEl = document.getElementById("worse");
    worseEl.addEventListener("mouseenter",startWorse);
    worseEl.addEventListener("mouseleave",stopWorse);
}

/******************************************************************************/
/************************** INITIALIZATION ************************************/
/******************************************************************************/

var workImages  = [];
var worseImages = [];

function preloadImages() {
    // load work images
    var baseWorkSrc = "img/work/cooper_hewitt/";
    for (var i = 0; i < NUM_WORK_IMAGES; i++) {
        var img = new Image();
        img.onload = function () {workImages.push(this)}
        img.src = baseWorkSrc + i + ".jpg";
    }

    // load worse images
    var baseWorseSrc = "img/worse/";
    for (var i = 0; i < NUM_WORSE_IMAGES; i++) {
        var img = new Image();
        img.onload = function () {worseImages.push(this)}
        img.src = baseWorseSrc + i + ".png";
    }
}

function init() {
    preloadImages();
    overlayImgEl = document.getElementById("overlayImg");
    initWork();
    initBetter();
    initWorse();
}

window.onload = init;
