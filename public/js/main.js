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
    setTimeout(function () {
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
    var betterEl = document.getElementsByClassName("better")[0];
    betterEl.addEventListener("mouseenter",startBetter);
    betterEl.addEventListener("mouseleave",stopBetter);
}

/******************************************************************************/
/************************** WORSE *********************************************/
/******************************************************************************/

var numSpans;
var worseEl
var savedBB = false;

function startWorse() {
    document.getElementById("info").classList.add("fixWorse");
    if (savedBB) return;
    savedBB = worseEl.getBoundingClientRect();

    for (var i = 0; i < numSpans; i++) {
        var spanEl = document.getElementById("animSpan_" + i);
        spanEl.style.transform =
            "translate(" + chance.integer({min: -90,max: 90}) + "px, " + chance.integer({min: -90,max: 90}) + "px) " +
            "rotate3d(" + chance.integer({min: 0,max: 1}) + "," + chance.integer({min: 0,max: 1}) + "," + chance.integer({min: 0,max: 1}) + "," + chance.integer({min: 0,max: 90}) + "deg)";
        spanEl.style.webkitTransform =
            "translate(" + chance.integer({min: -90,max: 90}) + "px, " + chance.integer({min: -90,max: 90}) + "px) " +
            "rotate3d(" + chance.integer({min: 0,max: 1}) + "," + chance.integer({min: 0,max: 1}) + "," + chance.integer({min: 0,max: 1}) + "," + chance.integer({min: 0,max: 90}) + "deg)";
    }
    setTimeout(function () {
        document.body.addEventListener("mousemove",stopWorse);
    }, 500);
}

function stopWorse(ev) {
    if (savedBB) {
        var out = (ev.clientX < savedBB.left) || (ev.clientX > savedBB.left + savedBB.width) ||
                  (ev.clientY < savedBB.top) || (ev.clientY > savedBB.top + savedBB.height);
        if (out) {
            for (var i = 0; i < numSpans; i++) {
                var spanEl = document.getElementById("animSpan_" + i);
                spanEl.style.transform = null;
                spanEl.style.webkitTransform = null;
                document.getElementById("info").classList.remove("fixWorse");
                document.body.removeEventListener("mousemove",stopWorse);
            }
            savedBB = false;
        }
    }
}

function initWorse() {
    textNodes = [...document.getElementById("infoText").childNodes];

    numSpans = 0;

    var replaceText = "";

    for (var i = 0; i < textNodes.length; i++) {
        if (!textNodes[i].tagName) {
            var text = textNodes[i].textContent.trim();
            var newText = "";
            var tokens = text.split(/\s+/);
            for (var j = 0; j < tokens.length; j++) {
                var newSpan = document.createElement("span");
                newSpan.id = "animSpan_" + numSpans;
                newSpan.classList.add("animSpan");
                newSpan.innerHTML = tokens[j] + " ";
                newText += elementToString(newSpan);
                numSpans++;
            }
            replaceText += newText;
        }
        else if (textNodes[i].tagName == "SPAN") {
            // uncomment to also change the words with borders
            // textNodes[i].id = "animSpan_" + numSpans;
            // textNodes[i].classList.add("animSpan");
            // numSpans++;
            replaceText += elementToString(textNodes[i]) + " ";
        }
        else replaceText += elementToString(textNodes[i]) + " ";
    }

    document.getElementById("infoText").innerHTML = replaceText;

    worseEl = document.getElementsByClassName("worse")[0];
    worseEl.addEventListener("mouseenter",startWorse);
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
    document.body.classList.add("notMobile");
    preloadImages();
    overlayImgEl = document.getElementById("overlayImg");
    initWorse();
    initWork();
    initBetter();
}

init();
