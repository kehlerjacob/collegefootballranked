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

    // Initialize all functions when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initSmoothScroll();
        initSmoothScroll();
        // initFormTriggers(); // Handled by SDK
        initScrollAnimations();
        initScrollAnimations();
        initActiveMenuItems();
        initFormValidation();
        initAnalyticsDemoAnimations();
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
