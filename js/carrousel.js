// Carousel variables
let currentSlide = 0;
const carousel = document.getElementById('carousel');
const slides = document.querySelectorAll('.carousel-item');
let autoSlideInterval;

// Carousel functions
function showSlide(n) {
    if (slides.length === 0) return;
    
    if (n >= slides.length) {
        currentSlide = 0;
    }
    if (n < 0) {
        currentSlide = slides.length - 1;
    }
    
    const translateX = -currentSlide * 100;
    carousel.style.transform = `translateX(${translateX}%)`;
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
    resetAutoSlide();
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
    resetAutoSlide();
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }, 4000); // 4 seconds
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}
