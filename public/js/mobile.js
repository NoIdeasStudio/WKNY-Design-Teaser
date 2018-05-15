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
    ssEl.classList.remove("hidden");
}

function stopSlideShow() {
    ssEl.classList.add("hidden");
    if (slideShowInterval) clearInterval(slideShowInterval);
}

function startSlideShow() {

    if (slideShowInterval) clearInterval(slideShowInterval);
    ssQueue = shuffle([...Array(NUM_WORK_IMAGES).keys()]);
    console.log(ssQueue);
    slideShowStep();
    slideShowInterval = setInterval(slideShowStep, 1000);
}

function handleOrientationChange() {
    if (window.innerHeight < window.innerWidth) startSlideShow();
    else stopSlideShow();
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
        handleOrientationChange();
        window.onresize = handleOrientationChange;
    }, 1000);

    document.body.classList.add("mobile");
}

init();
