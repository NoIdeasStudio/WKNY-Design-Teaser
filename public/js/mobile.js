const NUM_WORK_IMAGES = 26;

var workImages = [];

var slideShowInterval;
var ssQueue;

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function slideShowStep() {
    var curImg = workImages[ssQueue.splice(0,1)[0]];
    if (ssQueue.length == 0)
        ssQueue = shuffle([...Array(NUM_WORK_IMAGES).keys()]);

    console.log(curImg);

    var ssEl = document.getElementById("slideShow");
    ssEl.style.backgroundImage = "url(" + curImg.src + ")";

    slideShow.classList.remove("hidden");
    document.body.classList.add("ss");
}

function stopSlideShow() {
    if (slideShowInterval) clearInterval(slideShowInterval);
    slideShow.classList.add("hidden");
    document.body.classList.remove("ss");
}

function startSlideShow() {
    if (slideShowInterval) clearInterval(slideShowInterval);
    ssQueue = shuffle([...Array(NUM_WORK_IMAGES).keys()]);
    console.log(ssQueue);
    slideShowStep();
    slideShowInterval = setInterval(slideShowStep, 1000);
}

function handleOrientationChange() {
    if (screen.orientation.angle == 90 || screen.orientation.angle == 270) {
        startSlideShow();
    }
    else {
        stopSlideShow();
    }
}

function preloadImages() {
    // load work images
    var baseWorkSrc = "img/work/cooper_hewitt/";
    for (var i = 0; i < NUM_WORK_IMAGES; i++) {
        var img = new Image();
        img.onload = function () {
            workImages.push(this);
        }
        img.src = baseWorkSrc + i + ".jpg";
    }
}

function init() {
    preloadImages();
    setTimeout(function () {
        window.addEventListener("orientationchange", handleOrientationChange);
    }, 1000);
}

init();
