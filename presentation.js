const slides = document.querySelectorAll('.page');
const slideCount = slides.length;
const startingSlideIndex = getCurrentSlideIndex();
let currentSlideIndex = startingSlideIndex;

const options = {
    startWithFirstSlideShown: true,
}

hideSlides(slides);


// setting css properties
// document.documentElement.style.setProperty('--theme-darkness', val);


// ----------------------------

function goToPreviousSlide() {
    console.log('prev');
    hideCurrentSlide();
    decrementCurrentSlideIndex();
    showCurrentSlide();
    updateFragment();
}

function goToNextSlide() {
    console.log('next');
    hideCurrentSlide();
    incrementCurrentSlideIndex();
    showCurrentSlide();
    updateFragment();
}

function updateFragment() {
    window.location.hash = currentSlideIndex;
}

function showCurrentSlide() {
    slides[currentSlideIndex].classList.remove("off");
}

function hideCurrentSlide() {
    slides[currentSlideIndex].classList.add("off");
}

function incrementCurrentSlideIndex() {
    currentSlideIndex = currentSlideIndex == slideCount - 1 ? 0 : currentSlideIndex + 1;
}

function decrementCurrentSlideIndex() {
    currentSlideIndex = currentSlideIndex == 0 ? slideCount - 1 : currentSlideIndex - 1;
}

function hideSlides(slides) {
    for(let i=0; i<slideCount; i++) {
        if (options.startWithFirstSlideShown && startingSlideIndex === i) {
            continue;
        }
        slides[i].classList.toggle("off");

    }
}

function getCurrentSlideIndex() {
    const fragment = parseInt(getFragment());
    if (fragment !== "" && fragment >= 0 && fragment < slideCount) {
        return fragment;
    } else {
        return 0;
    }
}

function getFragment() {
    return window.location.hash.substr(1);
}

document.addEventListener('keyup', function (event) {
    switch (event.key) {
        case "ArrowLeft":
            goToPreviousSlide();
            break;
        case "ArrowRight":
            goToNextSlide();
            break;
        case "ArrowUp":
            break;
        case "ArrowDown":
            break;
    }
});