'use strict';

//Make navbar color-change when it is on the top
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;

document.addEventListener('scroll', () => {
    // console.log(window.scrollY);
    // console.log(`navbarHeight: ${navbarHeight}`);
    if(window.scrollY > navbarHeight) {
        navbar.classList.add('navbar--dark');
    } else {
        navbar.classList.remove('navbar--dark');
    }
});

//Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (event) => {
    const target = event.target;
    const link = target.dataset.link;
    if (link == null) {
        return;
    }
    navbarMenu.classList.remove('open');
    // console.log(event.target.dataset.link);
    scrollIntoView(link);
})

//Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector(".navbar__toggle-btn");

navbarToggleBtn.addEventListener("click", () => {
    navbarMenu.classList.toggle('open');
});

// Handle click on "contact me" button on home
const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', () => {
    scrollIntoView('#contact');
})

//Make home slowly fade to transparent as the window scrolls down
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;

document.addEventListener('scroll', () => {
    home.style.opacity = 1 - window.scrollY / homeHeight;
});

// Show "arrow up" button when scrolling down
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
    if(window.scrollY > homeHeight / 2) {
        arrowUp.classList.add('visible');
    } else {
        arrowUp.classList.remove('visible');
    }
})

//Handle click on th "arrow up" button
arrowUp.addEventListener('click', () => {
    scrollIntoView('#home');
})

//Projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project')
workBtnContainer.addEventListener('click', (event) => {
    const filter = event.target.dataset.filter || event.target.parentNode.dataset.filter;
    if(filter == null) {
        return;
    }

    //Remove selection from the previous item and select the new one
const active = document.querySelector('.category__btn.selected');
active.classList.remove('selected');
const target = 
    event.target.nodeName === 'BUTTON' ? event.target : event.target.parentNode;
target.classList.add('selected');


    projectContainer.classList.add('anim-out');
    setTimeout(() => {
        projects.forEach((project) => {
            if(filter == '*' || filter == project.dataset.type) {
                project.classList.remove('invisible');
            } else {
                project.classList.add('invisible');
            }
        });
        projectContainer.classList.remove('anim-out');
    }, 300);

    /* forEach()는 아래 코드와 동일 
    for(let project of project) {
    }
    
    OR

    let project;
    for(let i = 0; i < projects.length ; i++ ) {
        project = projects[i];
    } */
})


// 1. 모든 섹션 요소들을 가지고 온다
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다

const sectionIds = [
    '#home',
    '#about',
    '#skills',
    '#work',
    '#testimonials',
    '#contact',
];

const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) => document.querySelector(`[data-link="${id}"]`));

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
    selectedNavItem.classList.remove('active');
    selectedNavItem = selected;
    selectedNavItem.classList.add('active');
}

function scrollIntoView(selector) {
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({behavior: 'smooth'});
    selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
    root: null, //viewport
    rootMargin: '0px',
    threshold: 0.3, // 0~1 (100%)
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting && entry.intersectionRatio > 0) { // inIntersecting(진입할때) <-> !isIntersection(진입하지않을때)
            const index = sectionIds.indexOf(`#${entry.target.id}`);
            if (entry.boundingClientRect.y < 0) { // 스크롤링이 아래로 되어서 페이지가 올라옴
                selectedNavIndex = index + 1;
            } else {
                selectedNavIndex = index - 1;
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => {observer.observe(section)});

window.addEventListener('wheel', () => {
    if (window.scrollY === 0) {
        selectedNavIndex = 0;
    } else if 
    (window.scrollY + window.innerHeight === document.body.clientHeight) {
        selectedNavIndex = navItems.length - 1;
    }
    selectNavItem(navItems[selectedNavIndex]);
});
