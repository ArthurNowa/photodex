let currentSlide = 0;
let carousel = null;
let slides = [];
let autoSlideInterval = null;

function initCarousel() {
    carousel = document.getElementById("carousel");

    if (!carousel) {
        console.error("Élément #carousel introuvable.");
        return;
    }

    // On récupère les slides maintenant, après leur création par animal.js
    slides = carousel.querySelectorAll(".carousel-item");
    currentSlide = 0;

    if (slides.length === 0) {
        console.warn("Aucune image trouvée dans le carrousel.");
        clearInterval(autoSlideInterval);
        return;
    }

    showSlide(0);
    resetAutoSlide();
}

function showSlide(index) {
    if (!carousel || slides.length === 0) {
        return;
    }

    // Retour à la première image après la dernière
    if (index >= slides.length) {
        currentSlide = 0;
    }
    // Retour à la dernière image avant la première
    else if (index < 0) {
        currentSlide = slides.length - 1;
    }
    else {
        currentSlide = index;
    }

    carousel.style.transform =
        `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
    resetAutoSlide();
}

function prevSlide() {
    showSlide(currentSlide - 1);
    resetAutoSlide();
}

function startAutoSlide() {
    clearInterval(autoSlideInterval);

    // Inutile de lancer un intervalle s'il n'y a qu'une photo
    if (slides.length <= 1) {
        return;
    }

    autoSlideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 4000);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

/*
 * Les boutons utilisent onclick="prevSlide()" et onclick="nextSlide()".
 * On expose donc explicitement les fonctions dans window.
 */
window.initCarousel = initCarousel;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;

// Fonctionne directement pour le carrousel statique de index.html
document.addEventListener("DOMContentLoaded", initCarousel);