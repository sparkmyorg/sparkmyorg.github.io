document.addEventListener('DOMContentLoaded', function() {
    /* ---------------- Header Scroll Effect ---------------- */
    const header = document.querySelector('header');

    function resizeHeaderOnScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', resizeHeaderOnScroll);

    /* ---------------- Hamburger Menu Toggle ---------------- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        // Update aria-expanded for accessibility
        const expanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', expanded);
    });

    /* ---------------- Generic Carousel Functionality ---------------- */
    function setupCarousel(carouselSelector, dotsSelector, intervalTime = 4000) {
        const carousel = document.querySelector(${carouselSelector} .carousel-wrapper);
        const slides = document.querySelectorAll(${carouselSelector} .carousel-slide);
        const dots = document.querySelectorAll(${dotsSelector} .carousel-dot);
        const totalSlides = slides.length;
        let currentIndex = 1; // Start from 1 because 0 is the clone of the last slide
        let isTransitioning = false;
        let slideInterval;

        // Initialize carousel position
        carousel.style.transform = translateX(-${currentIndex * 100}%);

        // Update active dot
        function updateDots() {
            const activeIndex = (currentIndex - 1) % (totalSlides - 2);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        }

        // Move to specific slide
        function moveToSlide(index) {
            if (isTransitioning) return;
            isTransitioning = true;
            carousel.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            carousel.style.transform = translateX(-${index * 100}%);
            currentIndex = index;
            updateDots();
        }

        // Handle transition end for infinite looping
        carousel.addEventListener('transitionend', () => {
            isTransitioning = false;
            if (currentIndex === 0) {
                carousel.style.transition = 'none';
                currentIndex = totalSlides - 2;
                carousel.style.transform = translateX(-${currentIndex * 100}%);
                updateDots();
            } else if (currentIndex === totalSlides - 1) {
                carousel.style.transition = 'none';
                currentIndex = 1;
                carousel.style.transform = translateX(-${currentIndex * 100}%);
                updateDots();
            }
        });

        // Next slide
        function nextSlide() {
            if (currentIndex >= totalSlides - 1) return;
            moveToSlide(currentIndex + 1);
        }

        // Previous slide
        function prevSlide() {
            if (currentIndex <= 0) return;
            moveToSlide(currentIndex - 1);
        }

        // Auto slide
        function startSlideShow() {
            slideInterval = setInterval(nextSlide, intervalTime);
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                moveToSlide(index + 1); // +1 because of the cloned first slide
                stopSlideShow();
                startSlideShow();
            });
        });

        // Initialize dots
        updateDots();

        // Start slideshow
        startSlideShow();

        // Pause on hover
        const carouselSection = document.querySelector(carouselSelector);
        carouselSection.addEventListener('mouseenter', stopSlideShow);
        carouselSection.addEventListener('mouseleave', startSlideShow);

        // Touch/Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;

        carouselSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carouselSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        });

        function handleGesture() {
            const swipeDistance = touchStartX - touchEndX;
            if (swipeDistance > 50) { // Swipe left
                nextSlide();
            }
            if (swipeDistance < -50) { // Swipe right
                prevSlide();
            }
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                stopSlideShow();
                startSlideShow();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                stopSlideShow();
                startSlideShow();
            }
        });
    }

    /* ---------------- Initialize Carousels ---------------- */
    // Initialize Home Page Carousel
    const homeCarouselExists = document.querySelector('.carousel');
    if (homeCarouselExists) {
        setupCarousel('.carousel', '.carousel-dots', 4000);
    }

    // Initialize Project Gallery on Compass Page
    const projectGalleryExists = document.querySelector('.project-gallery');
    if (projectGalleryExists) {
        setupCarousel('.project-gallery', '.gallery-dots', 5000);
    }
});