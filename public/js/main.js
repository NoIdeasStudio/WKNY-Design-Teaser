/******************************************************************************/
/************************** CONSTANTS *****************************************/
/******************************************************************************/

const NUM_WORK_IMAGES      = 20;
const NUM_WORSE_IMAGES     = 11;

const IMG_OVERLAY_HANG_AMT = 0;

const WORK_CHANGE_TIMING   = 1000; // 1000 == 1 second
const BETTER_CHANGE_TIMING = 150;
const WORSE_CHANGE_TIMING  = 150;

const SKEW_AMT             = 150;

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

function stringToElement(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

function elementToString(element) {
  var div = document.createElement('div');
  div.appendChild(element);
  return div.innerHTML;
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
    var workEl = document.getElementsByClassName("work")[0];
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
    var curRem = document.getElementById("better_" + i);
    if (curRem) curRem.parentNode.removeChild(curRem);
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
    var betterEl = document.getElementsByClassName("better")[0];
    betterEl.addEventListener("mouseenter",startBetter);
    betterEl.addEventListener("mouseleave",stopBetter);
}

/******************************************************************************/
/************************** WORSE *********************************************/
/******************************************************************************/

var worseEl

var worseImagesInterval;

function worseImagesStep() {
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
    overlayImgEl.style.width  = imgWidth  + "px";
    overlayImgEl.src          = curImg.src;

    overlayImgEl.classList.remove("hidden");
}

function startWorse() {
    if (!worseImagesInterval) {
        worseImagesStep();
        worseImagesInterval = setInterval(worseImagesStep, WORSE_CHANGE_TIMING);
    }
}

function stopWorse(ev) {
    clearInterval(worseImagesInterval);
    worseImagesInterval = false;
    overlayImgEl.classList.add("hidden");
}

function initWorse() {
    worseEl = document.getElementsByClassName("worse")[0];
    worseEl.addEventListener("mouseenter",startWorse);
    worseEl.addEventListener("mouseout",stopWorse);
}

/******************************************************************************/
/************************** WET ***********************************************/
/******************************************************************************/

const canvas       = document.getElementById("canvas");
const context      = canvas.getContext("2d");
const colorPallete = ["#010101", "#050505", "#101010", "#151515", "#202020", "#252525"];

var width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    wetSrc = {
        x: width / 2,
        y: height / 2
    },
    circles = [],
    wetEnabled = false,
    wetEl;

window.onresize = function() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    wetSrc.x = width / 2;
    wetSrc.y = height / 2;
}

class Circle {
    constructor() {
        this.x = wetSrc.x;
        this.y = wetSrc.y;
        this.angle = Math.PI * 2 * Math.random();
        var speed = 1.5 + Math.random();
        this.vx = speed * Math.cos(this.angle);
        this.vy = speed * Math.sin(this.angle);

        this.xr = 6 + 10 * Math.random();
        this.yr = 2 + 10 * Math.random();
        this.r  = 6 + 10 * Math.random();

        this.color = colorPallete[Math.floor(Math.random() * colorPallete.length)];
    }

    update() {
        var ctrl = 100;
        this.x += this.vx * (Math.max(ctrl,Math.abs(wetSrc.x - this.x))/ctrl);
        this.y += this.vy * (Math.max(ctrl,Math.abs(wetSrc.y - this.y))/ctrl);

        this.r  -= .01;
    }
}

function removeCircles() {
    for (var i = 0; i < circles.length; i++) {
        var b = circles[i];
        if ( b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 ||  b.y - b.r > height || b.r < 0)
            circles.splice(i, 1);
    }
}

function renderCircles() {
    context.clearRect(0, 0, width, height);

    if (Math.random() > .2 && wetEnabled)
        circles.push(new Circle());

    for (var i = 0; i < circles.length; i++) {
        var b = circles[i];
        context.fillStyle = b.color;
        context.beginPath();

        context.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);

        context.fill();
        b.update();
    }

    removeCircles();
    requestAnimationFrame(renderCircles);
}

function startWet() {
    document.getElementById("canvas").classList.remove("hidden");
    wetEnabled = true;
}

function handleWetMouseMove(ev) {
    wetSrc.x = ev.clientX;
    wetSrc.y = ev.clientY;
}

function stopWet() {
    wetEnabled = false;
    // document.getElementById("canvas").classList.add("hidden");

}

function initWet() {
    wetEl = document.getElementsByClassName("wet")[0];
    wetEl.addEventListener("mouseenter",startWet);
    wetEl.addEventListener("mousemove",handleWetMouseMove);
    wetEl.addEventListener("mouseout",stopWet);
}

renderCircles();

/******************************************************************************/
/************************** INITIALIZATION ************************************/
/******************************************************************************/

var workImages  = [];
var worseImages = [];

function preloadImages() {
    // load work images
    var baseWorkSrc = "img/work/";
    for (var i = 0; i < NUM_WORK_IMAGES; i++) {
        var img = new Image();
        img.onload = function () {workImages.push(this)}
        img.src = baseWorkSrc + i + ".png";
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
    document.body.classList.add("notMobile");
    preloadImages();
    overlayImgEl = document.getElementById("overlayImg");
    initWorse();
    initWork();
    initBetter();
    initWet();
}

init();
