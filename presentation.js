const slides = document.querySelectorAll('.page');
const slideCount = slides.length;
const startingSlideIndex = getCurrentSlideIndex();
let currentSlideIndex = startingSlideIndex;

let hands = document.getElementsByClassName('hand');
const wall = document.getElementsByClassName('wall')[0];

const options = {
    startWithFirstSlideShown: true,
    wrapSlides: false,
    useAnimations: true,
    tweaks: {
        contrast: 3,
        anaglyphSize: '2px',
        variants: ['variant_1', 'variant_2', 'variant_3', 'variant_4', 'variant_5', 'variant_6', 'variant_7', 'variant_8', 'variant_9'],
    },
    animations: {
        animationSpeed: '1s',
        randomise: true,
        in: ['in_1', 'in_2', 'in_3', 'in_4', 'in_5'],
        out: ['out_1', 'out_2', 'out_3', 'out_4', 'out_5'],
        rightHand: ['out_2', 'out_3', 'out_4'],
        fixedIn: 'in_5',
        fixedOut: 'out_1',
        action: 'out_2'
    }
}

hideSlides(slides);
document.documentElement.style.setProperty('--animation-speed', options.animations.animationSpeed);
document.documentElement.style.setProperty('--anaglyph-size', options.tweaks.anaglyphSize);
document.documentElement.style.setProperty('--contrast', options.tweaks.contrast);

// ----------------------------

function goToPreviousSlide(skipAnimations) {
    if (currentSlideIndex > 0 || options.wrapSlides) {
        hideSlide(slides[currentSlideIndex], skipAnimations);
        decrementCurrentSlideIndex();
        tweakSlide(slides[currentSlideIndex]);
        window.setTimeout(function () {
            showSlide(slides[currentSlideIndex], skipAnimations);
        }, (options.useAnimations && !skipAnimations) ? getRandomInt(1,500) : 0);
        updateFragment();
    }
}

function goToNextSlide(skipAnimations) {
    if (currentSlideIndex < slideCount - 1 || options.wrapSlides) {
        hideSlide(slides[currentSlideIndex], skipAnimations);
        incrementCurrentSlideIndex();
        tweakSlide(slides[currentSlideIndex]);
        window.setTimeout(function() {
            showSlide(slides[currentSlideIndex], skipAnimations);
        }, (options.useAnimations && !skipAnimations) ? getRandomInt(1,500) : 0);
        updateFragment();
    }
}

function showSlide(slide, skipAnimations) {
    slide.classList.remove('off');
    if (options.useAnimations && !skipAnimations) {
        let animClass = options.animations.randomise
            ? options.animations.in[getRandomInt(0, options.animations.in.length - 1)]
            : options.animations.fixedIn;

        slide.classList.add(animClass);
    }
}

function hideSlide(slide, skipAnimations) {
    if (options.useAnimations && !skipAnimations) {
        let animClass = options.animations.randomise
            ? options.animations.out[getRandomInt(0, options.animations.out.length - 1)]
            : options.animations.fixedOut;

        slide.appendChild(hands[0]);
        hands[0].classList.add('move-in');
        if (options.animations.rightHand.indexOf(animClass) >= 0) {
            hands[0].classList.add('right-hand');
        }

        slide.classList.add(animClass);
    } else {
        slide.classList.add('off');        
    }
}

function tweakSlide(slide) {
    let rotation = getRandomFloat(-2, 2);
    slide.getElementsByClassName('page_wrapper')[0].style.transform = `rotate(${rotation}deg)`;

    for (var i = 0; i < slide.classList.length; i++) { 
        if (slide.classList[i].startsWith('variant')) {
            slide.classList.remove(slide.classList[i]); 
        }
    }

    let variant = options.tweaks.variants[getRandomInt(0, options.tweaks.variants.length - 1)];
    slide.classList.add(variant);
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

function changeBrightness(diff) {
    options.tweaks.contrast = options.tweaks.contrast + diff;
    document.documentElement.style.setProperty('--contrast', options.tweaks.contrast);
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
            goToPreviousSlide(event.ctrlKey);
            break;
        case 'ArrowRight':
            goToNextSlide(event.ctrlKey);
            break;
        case 'ArrowUp':
            changeBrightness(1);
            break;
        case 'ArrowDown':
            changeBrightness(-1);
            break;
        case ' ':
            action();
            break;
    }
    console.log(event);
});

document.addEventListener('animationend', (e) => {
    if (e.animationName.startsWith('out')) {
        e.target.classList.add('off');
        e.target.classList.remove(e.animationName);

        let hand = e.target.getElementsByClassName('hand')[0];
        if(hand) {
            hand.classList.remove('move-in');
            hand.classList.remove('right-hand');
        }
    }
    if (e.animationName.startsWith('in')) {
        e.target.classList.remove('off');
        e.target.classList.remove(e.animationName);
    }
});

function getRandomBool() {
    return Math.random() > 0.5;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(minValue, maxValue, precision) {
    if (typeof (precision) == 'undefined') {
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue).toFixed(precision));
}