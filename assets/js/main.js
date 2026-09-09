/**
 * Flowtrus Theme JavaScript
 * 
 * @package Flowtrus
 */

(function () {
    'use strict';

    // Mobile Menu Toggle
    function initMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.main-navigation ul');

        if (toggle && menu) {
            toggle.addEventListener('click', function () {
                menu.classList.toggle('active');

                // Update aria-expanded
                const isExpanded = menu.classList.contains('active');
                toggle.setAttribute('aria-expanded', isExpanded);
            });

            // Close menu when clicking outside
            document.addEventListener('click', function (e) {
                if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Smooth Scrolling for Anchor Links
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Flowtrus Form Trigger Buttons handled by SDK directly now
    // initFormTriggers removed to prevent double-binding


    // Animate elements on scroll
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe cards and feature items
        const animatedElements = document.querySelectorAll('.card, .feature-item, .case-study-card');

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }

    // Add active class to current menu item
    function initActiveMenuItems() {
        const currentPath = window.location.pathname;
        const menuLinks = document.querySelectorAll('.main-navigation a');

        menuLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;

            if (linkPath === currentPath) {
                link.classList.add('current-menu-item');
            }
        });
    }

    // Form validation enhancement
    function initFormValidation() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

            inputs.forEach(input => {
                input.addEventListener('invalid', function (e) {
                    e.preventDefault();
                    this.classList.add('error');

                    // Add error message if not exists
                    if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('error-message')) {
                        const errorMsg = document.createElement('span');
                        errorMsg.className = 'error-message';
                        errorMsg.style.color = 'var(--color-error)';
                        errorMsg.style.fontSize = 'var(--font-size-sm)';
                        errorMsg.style.marginTop = 'var(--spacing-1)';
                        errorMsg.style.display = 'block';
                        errorMsg.textContent = this.validationMessage;
                        this.parentNode.insertBefore(errorMsg, this.nextSibling);
                    }
                });

                input.addEventListener('input', function () {
                    this.classList.remove('error');
                    const errorMsg = this.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                });
            });
        });
    }

    // Analytics Demo Animations
    function initAnalyticsDemoAnimations() {
        const stepCircles = document.querySelectorAll('.step-circle');

        stepCircles.forEach((circle, index) => {
            circle.style.transition = 'all 0.3s ease-in-out';

            circle.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.1)';
            });

            circle.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1)';
            });
        });
    }

    // Hero Form 3D Coverflow Carousel
    function initHeroFormCarousel() {
        const carousel = document.getElementById('heroFormCarousel');
        if (!carousel) return;

        const cards = carousel.querySelectorAll('.hero-carousel-card');
        const dots = carousel.querySelectorAll('.carousel-dot-btn');
        const prevBtn = carousel.querySelector('.carousel-prev-btn');
        const nextBtn = carousel.querySelector('.carousel-next-btn');

        if (!cards.length) return;

        let currentIndex = 0;
        const totalCards = cards.length;

        function updateCarousel(targetIndex) {
            currentIndex = (targetIndex + totalCards) % totalCards;

            cards.forEach((card, idx) => {
                card.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');

                if (totalCards === 1) {
                    card.classList.add('is-active');
                    return;
                }

                let diff = idx - currentIndex;
                
                // Adjust for circular wrap
                if (diff > totalCards / 2) {
                    diff -= totalCards;
                } else if (diff < -totalCards / 2) {
                    diff += totalCards;
                }

                // Handle special case for 2 items
                if (totalCards === 2) {
                    if (idx === currentIndex) {
                        card.classList.add('is-active');
                    } else {
                        card.classList.add('is-next');
                    }
                    return;
                }

                if (diff === 0) {
                    card.classList.add('is-active');
                } else if (diff === -1 || (totalCards === 3 && (diff === 2 || diff === -1))) {
                    card.classList.add('is-prev');
                } else if (diff === 1 || (totalCards === 3 && (diff === -2 || diff === 1))) {
                    card.classList.add('is-next');
                } else {
                    card.classList.add('is-hidden');
                }
            });

            // Update dot indicators
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        // Click on side cards to bring them into center focus
        cards.forEach((card) => {
            card.addEventListener('click', function (e) {
                // If the card is not active (i.e. is on side), navigate to it
                if (!this.classList.contains('is-active')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const targetIndex = parseInt(this.getAttribute('data-slide-index'), 10);
                    if (!isNaN(targetIndex)) {
                        updateCarousel(targetIndex);
                    }
                }
            });
        });

        // Click on dots
        dots.forEach((dot) => {
            dot.addEventListener('click', function () {
                const targetIndex = parseInt(this.getAttribute('data-slide-index'), 10);
                if (!isNaN(targetIndex)) {
                    updateCarousel(targetIndex);
                }
            });
        });

        // Prev & Next Arrow Buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                updateCarousel(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                updateCarousel(currentIndex + 1);
            });
        }

        // Keyboard Arrow navigation when hovering carousel
        carousel.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                updateCarousel(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                updateCarousel(currentIndex + 1);
            }
        });

        // Touch Swipe gestures for mobile
        const stage = carousel.querySelector('.hero-carousel-stage');
        if (stage) {
            let startX = 0;
            let endX = 0;

            stage.addEventListener('touchstart', function (e) {
                startX = e.changedTouches[0].screenX;
            }, { passive: true });

            stage.addEventListener('touchend', function (e) {
                endX = e.changedTouches[0].screenX;
                const diff = startX - endX;
                if (Math.abs(diff) > 40) {
                    if (diff > 0) {
                        updateCarousel(currentIndex + 1); // Swiped left -> next
                    } else {
                        updateCarousel(currentIndex - 1); // Swiped right -> prev
                    }
                }
            }, { passive: true });
        }

        // Initial setup
        updateCarousel(0);
    }

    // Initialize all functions when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initSmoothScroll();
        // initFormTriggers(); // Handled by SDK
        initScrollAnimations();
        initActiveMenuItems();
        initFormValidation();
        initAnalyticsDemoAnimations();
        initHeroFormCarousel();
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768) {
                const menu = document.querySelector('.main-navigation ul');
                if (menu) {
                    menu.classList.remove('active');
                }
            }
        }, 250);
    });

})();
