'use strict';

///////////////////////////////////////
// Modal window
const nav = document.querySelector('.nav');
const sections = document.querySelectorAll('.section');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(window.pageXOffset, window.pageYOffset);
  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // SCROLLING PLUS SMOOTH TRANSITIONING
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const section = e.target.getAttribute('href');
    document.querySelector(section).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  // if (clicked.classList.contains('operations__tab')) {} // Instead use guard clause
  if (!clicked) return;
  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //  Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate tab content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
  console.log(clicked);
});

// Menu fade animaton
const hover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', hover.bind(0.5));

nav.addEventListener('mouseout', hover.bind(1));

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Lesson 198: Revaeling elements on scroll
// hidding all sections
sections.forEach(sec => sec.classList.add('section--hidden'));

const sectOpacity = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectObserve = new IntersectionObserver(sectOpacity, {
  root: null,
  threshold: 0.2,
});
sections.forEach(sect => {
  // sect.classList.add('section--hidden');
  sectObserve.observe(sect);
});

// Lesson 199: Lazy loading Images
const imgLoading = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgTarget = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver(imgLoading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTarget.forEach(el => imgObserver.observe(el));

// Lesson 200🎊🎊🎊🎊🍾🥂: Building a slider component
const slider = function () {
  const init = function () {
    createDots();
    goToSlide(0);
  };
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotsContainer = document.querySelector('.dots');
  const maxSlide = slides.length - 1;
  let curSlide = 0;

  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDots = function () {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      if (dot.classList.contains('dots__dot--active'))
        dot.classList.remove('dots__dot--active');
      if (+dot.dataset.slide === curSlide)
        dot.classList.add('dots__dot--active');
    });
  };

  const goToSlide = function (slideNum = curSlide) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - slideNum)}%)`;
    });
    activateDots(slideNum);
  };

  const nextSlide = function () {
    curSlide !== maxSlide ? curSlide++ : (curSlide = 0);
    goToSlide();
  };
  const prevSlide = function () {
    curSlide !== 0 ? curSlide-- : (curSlide = maxSlide);
    goToSlide();
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      curSlide = +e.target.dataset.slide;
      goToSlide();
    }
  });
  // Initializing slider component
  init();
};

// Activating slider component
slider();

// Lesson 201: Lifecycle DOM events (events for functions)
// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed DOM tree built', e);
});

// LOADED
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

console.log('SECTION 13: Completed🍾🍾🍾🥂🥂🎃🎃🎃🎅🎅🎖🎖');

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

// Lesson 203: Efficient script loading

// Implementing sticky nav
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// A better way of Implementing A sticky nav( Intersecting Observer API )
// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
//   // console.log(entries[0], observer);
// };
// const obsOption = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallBack, obsOption);
// observer.observe(section1);

// Page navigation
// Lesson 195: Passing arguements to event handlers

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
// console.log(id);
//   });
// });

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = e.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
// console.log(id);
//   });
// });

// Lesson 185: How the DOM really works

// ref: screenshot on pop 4

// Lesson 186: Selecting, Creating and Deleting Elements

// Selecting Ekements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// let header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// console.log(document.getElementById('section--1'));
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);
// const btnClasses = document.getElementsByClassName('btn');
// console.log(btnClasses);

// // Creating and Inserting Elements

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // // message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics <button class="btn btn--close-cookie">Got it!</button>';
// // // header.prepend(message);
// // header.append(message);
// // // CLONING
// // // header.append(message.cloneNode(true));

// // header.after(message);
// // header.before(message.cloneNode(true));

// // Deleting elements

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.parentElement.remove(message);
//     message.remove();
//   });
// console.log(message);

// Lesson 187: Styles, Attributes and Classes
// Styles
// message.style.backgroundColor = '#37383d';
// // message.style.width = '120%';

// console.log(getComputedStyle(message).color);

// message.style.height =
// parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

// CSS custom properties (CSS Variables)
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.id);
// console.log(logo.className);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');
// console.log(logo.getAttribute('designer'));
// console.log(logo.designer);
// we can also set attributes
// logo.alt = 'Beautiful minimalist logo';

// Data attribute
// console.log(logo.dataset.versionNumber);

// CLASSES
// // USE THESE ✔✔✔✔
// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.contains('c');

// Don't Use

// logo.classList = 'jonas'; // ⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠

// Lesson 188: Implementing smooth scrolling

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--3');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect();
// console.log(s1coords);
// console.log(window.pageXOffset, window.pageYOffset);
//   // Scrolling
//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset,
//   //   s1coords.top + window.pageYOffset
//   // );
//   // SCROLLING PLUS SMOOTH TRANSITIONING
//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// Lesson 189: Types of events and events listeners

// const h1 = document.querySelector('h1');

// h1.addEventListener('mouseenter', function () {
//   // alert('Event');
//   h1.style.color = 'red';
// });

// h1.onmouseenter = function () {
//   // alert('Event');
//   h1.style.color = 'red';
// };

// Lesson 190: Events and propagation: Bubbling and capturing

// Lesson 190: Events propagation in practice: (Bubbling)

// const randomInt = (min, max) => {
//   return Math.trunc(Math.random() * (max - min + 1) + min);
// };
// const randomColor = () => {
//   return `rgb(${randomInt(0, 225)}, ${randomInt(0, 225)}, ${randomInt(
//     0,
//     225
//   )})`;
// };

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   e.preventDefault();
// console.log('LINK', e.target, e.currentTarget);
//   this.style.backgroundColor = randomColor();
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// console.log('LINKS', e.target, e.currentTarget);
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
// console.log('CONTAINER', e.target, e.currentTarget);
//   this.style.backgroundColor = randomColor();
// });
// console.log(randomColor());

// Lesson 191: Event Delegation: Implementing Page Navigation

// Lesson 193: DOM traversing

// const h1 = document.querySelector('h1');

// // Going downwards (selecting Children)
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going upwards (selecting parents)

// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// Going sideways (selecting siblings)
