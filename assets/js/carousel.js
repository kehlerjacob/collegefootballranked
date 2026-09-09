/**
 * Swiper Carousel Initialization
 */
document.addEventListener('DOMContentLoaded', function () {
    const swiperContainer = document.querySelector('.case-study-swiper');

    if (!swiperContainer) {
        console.log('Swiper container not found');
        return;
    }

    let isLooping = false;

    const swiper = new Swiper('.case-study-swiper', {
        // Centered slides - ensures active slide is always centered
        centeredSlides: true,

        // Show multiple slides - 'auto' uses the width defined in CSS
        slidesPerView: 'auto',

        // Space between slides
        spaceBetween: 32,

        // Disable loop mode to maintain centering
        loop: false,

        // Start at the middle slide (slide 4 of 9)
        initialSlide: 4,

        // Autoplay
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Smooth transitions
        speed: 600,

        // Slide effect
        effect: 'slide',

        // Handle infinite loop manually
        on: {
            slideChange: function () {
                if (isLooping) return;

                // When reaching the end, jump to the beginning set
                if (this.activeIndex >= 7) {
                    isLooping = true;
                    setTimeout(() => {
                        this.slideTo(1, 0); // Jump to slide 1 without animation
                        setTimeout(() => {
                            isLooping = false;
                        }, 50);
                    }, 600);
                }
                // When reaching the beginning, jump to the end set
                else if (this.activeIndex <= 1) {
                    isLooping = true;
                    setTimeout(() => {
                        this.slideTo(7, 0); // Jump to slide 7 without animation
                        setTimeout(() => {
                            isLooping = false;
                        }, 50);
                    }, 600);
                }
            }
        },

        // Breakpoints for responsive design
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 'auto',
                spaceBetween: 24
            },
            1024: {
                slidesPerView: 'auto',
                spaceBetween: 32
            }
        }
    });

    console.log('Swiper carousel initialized successfully');
});
