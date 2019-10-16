const slides = document.querySelectorAll('.page');
const slideCount = slides.length;
const startingSlideIndex = getCurrentSlideIndex();
let currentSlideIndex = startingSlideIndex;

let hands = document.getElementsByClassName("hand");

const options = {
    startWithFirstSlideShown: true,
    wrapSlides: false,
    useAnimations: true,
    animations: {
        animationSpeed: '1s',
        randomise: true,
        in: ['in_1', 'in_2'],
        out: ['out_1', 'out_2'],
        fixedIn: 'in_1',
        fixedOut: 'out_2',
        action: 'out_2'
    }
}

hideSlides(slides);
document.documentElement.style.setProperty('--animation-speed', options.animations.animationSpeed);

// ----------------------------

function goToPreviousSlide() {
    if (currentSlideIndex > 0 || options.wrapSlides) {
        hideSlide(slides[currentSlideIndex]);
        decrementCurrentSlideIndex();
        // tweakCurrentSlide(); // TODO
        showSlide(slides[currentSlideIndex]);
        updateFragment();
    }
}

function goToNextSlide() {
    if (currentSlideIndex < slideCount - 1 || options.wrapSlides) {
        hideSlide(slides[currentSlideIndex]);
        incrementCurrentSlideIndex();
        // tweakCurrentSlide(); // TODO
        showSlide(slides[currentSlideIndex]);
        updateFragment();
    }
}

function showSlide(slide) {
    slide.classList.remove('off');
    if (options.useAnimations) {
        let animClass = options.animations.randomise
            ? options.animations.in[getRandomInt(options.animations.in.length)]
            : options.animations.fixedIn;
        slide.classList.add(animClass);
    }
}

function hideSlide(slide) {
    slide.classList.remove('off');
    if (options.useAnimations) {

        slide.appendChild(hands[0]);
        hands[0].classList.add('move-in');

        let animClass = options.animations.randomise
            ? options.animations.out[getRandomInt(options.animations.out.length)]
            : options.animations.fixedOut;
        slide.classList.add(animClass);
    }
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
        slides[i].classList.toggle('off');

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

function updateFragment() {
    window.location.hash = currentSlideIndex;
}

function getFragment() {
    return window.location.hash.substr(1);
}

function action() {
    slides[currentSlideIndex].classList.toggle(options.animations.action);
}

document.addEventListener('keyup', function (event) {
    switch (event.key) {
        case 'ArrowLeft':
            goToPreviousSlide();
            break;
        case 'ArrowRight':
            goToNextSlide();
            break;
        case 'ArrowUp':
            break;
        case 'ArrowDown':
            break;
        case ' ':
            action();
            break;
    }
});

document.addEventListener('animationend', (e) => {
    if (e.animationName.startsWith('out')) {
        e.target.classList.add('off');
        e.target.classList.remove(e.animationName);
        let hand = e.target.getElementsByClassName('hand')[0];
        if(hand) {
            hand.classList.remove('move-in');
        }
    }
    if (e.animationName.startsWith('in')) {
        e.target.classList.remove('off');
        e.target.classList.remove(e.animationName);
    }
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}