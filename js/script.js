/* ============================ typing animation ============================ */
var typed = new Typed(".typing", {
    strings: ["", "Data Analyst", "Web Developer", "Web Designer"],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
});

/* ============================ Aside ============================ */
const nav = document.querySelector(".nav"),
    navList = nav.querySelectorAll("li"),
    totalNavList = navList.length,
    allSection = document.querySelectorAll(".section"),
    totalSection = allSection.length;

for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector("a");
    a.addEventListener("click", function () {
        removeBackSection();
        for (let j = 0; j < totalNavList; j++) {
            if (navList[j].querySelector("a").classList.contains("active")) {
                addBackSection(j);
            }
            navList[j].querySelector("a").classList.remove("active");
        }
        this.classList.add("active");
        showSection(this);
        if (window.innerWidth < 1200) {
            asideSectionTogglerBtn();
        }
    });
}

function removeBackSection() {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("back-section");
    }
}

function addBackSection(num) {
    allSection[num].classList.add("back-section");
}

function showSection(element) {
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.remove("active");
    }
    const target = element.getAttribute("href").split("#")[1];
    document.querySelector("#" + target).classList.add("active");
}

function updateNav(element) {
    for (let i = 0; i < totalNavList; i++) {
        navList[i].querySelector("a").classList.remove("active");
        const target = element.getAttribute("href").split("#")[1];
        if (target === navList[i].querySelector("a").getAttribute("href").split("#")[1]) {
            navList[i].querySelector("a").classList.add("active");
        }
    }
}

/* ============================ Hire Me button ============================ */
document.querySelector(".hire-me").addEventListener("click", function () {
    const contactLink = document.querySelector(".nav li a[href='#contact']");
    showSection(contactLink);
    updateNav(contactLink);
});

/* ============================ Nav Toggler ============================ */
const navTogglerBtn = document.querySelector(".nav-toggler"),
    aside = document.querySelector(".aside");

navTogglerBtn.addEventListener("click", () => {
    asideSectionTogglerBtn();
});

function asideSectionTogglerBtn() {
    aside.classList.toggle("open");
    navTogglerBtn.classList.toggle("open");
    for (let i = 0; i < totalSection; i++) {
        allSection[i].classList.toggle("open");
    }
}

/* ============================ Color Option Auto Close ============================ */
// Color switcher ke liye auto-close logic
const styleSwitcher = document.querySelector(".style-switcher");
const colorButtons = document.querySelectorAll(".colors span");

colorButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // user ne color select kiya, ab switcher band kar do
        styleSwitcher.classList.remove("open");
    });
});


/* ============================ Certificate Modal ============================ */
// Function to open modal
function openModal(img) {
    var modal = document.getElementById("imgModal");
    var modalImg = document.getElementById("modalImg");
    var caption = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = img.src;
    caption.innerHTML = img.alt;
}

// Function to close modal
function closeModal() {
    document.getElementById("imgModal").style.display = "none";
}