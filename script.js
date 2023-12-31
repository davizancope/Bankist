'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to'); // from where it will scroll
const section1 = document.querySelector('#section--1'); // where it will end scrolling
const nav = document.querySelector();
const tabs = document.querySelectorAll('.ooperations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//     btnsOpenModal[i].addEventListener('click', openModal);

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// Button Scrolling

btnScrollTo.addEventListener('click', function(e) { // adding the click event listener for the button
    // for the first way, we need to get the coordinates of the element that we will scrool to
    const s1coords = section1.getFoudingClientRect(); // returns a DOM rectangle with all the position-related properties

    // Scrolling - OLD SCHOOL WAY
    window.scrollTo({
        left: s1coords.left + window.pageXOffset, // the coordinate of the left part of the page + the current scroll position on the X-axis
        toop: s1coords.top + window.pageYOffset, // the coordinate of the top part of the page + the current scroll position on the Y-axis
        behavior: 'smooth', // the way the scrolling will behave
    })

    section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page Navigation

// "NORMAL" WAY 👇🏻

// document.querySelectorAll('.nav__link').forEach(function(el) { //selecting all the link buttons for the menu navigation
//     el.addEventListener('click', function(e) { // adding event listener for the clicked button
//         e.preventDefault(); // prevents the page from scrolling to the matching section id
//         const id = this.getAttribute('href'); // gets the part from the code, without the absolute URL
//         document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     })
// })

// USING EVENT DELEGATION 👇🏻

// 1. Add the event listener to a common parent element.
// 2. Determine what element originated the event.

document.querySelector('.nav__links').addEventListener('click', function(e) {
    //e.target // determines which element generated the event
    e.preventDefault();

    // Matching Strategy
    if (e.target.classList.contains('nav__link')) { // checks if the element that generated the click has the same class as the specified one
        e.preventDefault(); // prevents the page from scrolling to the matching section id
        const id = e.target.getAttribute('href'); // gets the part from the code, without the absolute URL
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); // implements the smooth scrolling behavior
    }
});

// Tabbed Component
// const tabs = document.querySelectorAll('.ooperations__tab');
// const tabsContainer = document.querySelector('.operations__tab-container');
// const tabsContent = document.querySelectorAll('.operations__content');
//--> all variable declarations were moved up to the beginning of the file

tabsContainer.addEventListener('click', function(e) {
    const clicked = e.target.closest('.operations__tab');

    // Guard Clause
    if(!clicked) return;

    // Remove active classes
    tabs.forEach(t => t.classList.remove('operations__tab--active'))
    tabsContent.forEach(c => c.classList.remove('operatioons__content--active'));

    // Activate Tab
    clicked.classList.add('operations__tab--active');

    // Activate content area
    document.querySelector(`.operations__content--${clicked.dataSet.tab}`).classList.add('.operations__content--active');

});

// Menu fade animation #195
// const nav = document.querySelector(); --> declaration moved up to the beginning of the file

const handleHover = function (e, opacity) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img'); // more robust solution, could work on other solutions too

        siblings.forEach(el => {
            if (el !== link) {
                el.style.opacity = this;
            }
        });
        logo.style.opacity = this;
    }
}

// Passing an 'argument' into a handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Navigation (Bad Way) #196
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function(e) {
//     if (window.scrollY > initialCoords.top) {
//         nav.classList.add('sticky');
//     } else {
//         nav.classList.remove('sticky');
//     }
// })

// Sticky Navigation (Intersectioin Observer API) #197
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; // calculating dynamically the height of the menu

const stickyNav = function(entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) {
        nav.classList.add('sticky');
    } else {
        nav.classList.remove('sticky');
    }
}

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0, // when 0% of the header is visible, smth should happen
    rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal Sections
const allSections = document.querySelectorAll('.section')
const revealSection = function(entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) // if the section is not intersecting, the function will return and do nothing
        return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

allSections.forEach(function(section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting)
        return;

    // Replace the src with the data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('laod', function() {
        entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
    root: null, //entire viewport,
    threshold: 0,
    rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function() {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    // Implementing the dots navigation
    const dotContainer = document.querySelector('.dots');

    let currentSlide = 0;
    const maxSlide = slides.length; // not zero-based

    const slider = document.querySelector('.slider');

    const createDots = function() {
        slides.forEach(function(_, index) {
            dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide=${index}> </button>`)
        });
    };

    const activateDot = function(slide) {
        document.querySelectorAll('dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    };

    const goToSlide = function(slide) {
        slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`))
    }

    // Next slide (changing percentage)
    const nextSlide = function() {
        if (currentSlide === maxSlide - 1){
            currentSlide = 0;
        } else {
            currentSlide++;
        }

        goToSlide(currentSlide);
        activateDot(currentSlide);
    }

    const prevSlide = function() {
        if (currentSlide === 0) {
            currentSlide = maxSlide - 1;
        } else {
            currentSlide--;
        }

        goToSlide(currentSlide);
        activateDot(currentSlide);
    }

    const init = function() {
        goToSlide(0);
        createDots();
        activateDot(0);
    }
    init();

    // Event Handlers
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    // Handling keyboard events
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        }
        e.key === 'ArrowRight' && nextSlide();
    });

    dotContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('dots__dots')) {
            const {slide} = e.target.dataset;
            goToSlide(slide);
            activateDot(slide);
        }
    });
};
slider();
// const header = document.querySelector('header');
// message.innerHTML = 'We use cookies to improve perfomance <button class="btn btn--close-cookie">Got it!</button>';

// header.preprend(message);

// // Deleting Elements
// document.querySelector('.btn--close-cookie')
//     .addEventListener('click', function() {
// 	    message.remove();
//     });
