<?php
/**
 * Template Name: Home Page
 * 
 * @package Flowtrus
 */

get_header();
?>

<!-- Hero Section -->
<?php
$showcase_enabled = get_option('flowtrus_hero_showcase_enable', '1');
$hero_slides = function_exists('flowtrus_get_hero_slides') ? flowtrus_get_hero_slides() : array();
$showcase_badge = get_option('flowtrus_hero_showcase_badge', '✨ Live Interactive Form Demo');
if (empty($showcase_badge)) {
    $showcase_badge = '✨ Live Interactive Form Demo';
}

if ($showcase_enabled === '1' && !empty($hero_slides)) :
?>
<section class="hero hero-with-showcase">
    <div class="container hero-grid">
        <!-- Left Column: Hero Text Content -->
        <div class="hero-text-col">
            <h1 class="hero-title">
                More Bookings.<br>
                <span style="white-space: nowrap;">Fewer Drop-Offs.</span><br>
                <span style="white-space: nowrap;"><em>Engineered to Convert.</em></span>
            </h1>
            <p class="hero-description">
                Eliminate booking friction and <strong>stop losing up to 70% of potential leads</strong>. Flowtrus powers high-converting, telemetry-backed interactive forms designed for maximum revenue.
            </p>
            <div class="hero-cta">
                <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-accent btn-lg" style="font-weight: 700;">See Live Demo</a>
                <a href="#" class="btn btn-secondary btn-lg flowtrus-trigger" data-form-id="LhOxsSHbmRt0t6SfAeOi" style="font-weight: 700; background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); color: white;">Get Started</a>
            </div>
        </div>

        <!-- Right Column: 3D Coverflow Form Showcase Carousel -->
        <div class="hero-showcase-col">
            <div class="hero-carousel-container" id="heroFormCarousel">
                <!-- 3D Carousel Stage -->
                <div class="hero-carousel-stage">
                    <?php foreach ($hero_slides as $index => $slide) : ?>
                        <div class="hero-carousel-card <?php echo $index === 0 ? 'is-active' : ($index === 1 ? 'is-next' : ($index === count($hero_slides) - 1 ? 'is-prev' : 'is-hidden')); ?>" 
                             data-slide-index="<?php echo $index; ?>"
                             role="group"
                             aria-label="<?php echo esc_attr($slide['title']); ?>">
                            
                            <!-- Embedded Live Form -->
                            <div class="carousel-card-body">
                                <?php echo do_shortcode($slide['shortcode']); ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- Navigation Controls Below Carousel -->
                <div class="hero-carousel-controls">
                    <button type="button" class="carousel-nav-btn carousel-prev-btn" aria-label="Previous form example">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>

                    <!-- Indicators / Dots -->
                    <div class="carousel-dots-nav">
                        <?php foreach ($hero_slides as $index => $slide) : ?>
                            <button type="button" 
                                    class="carousel-dot-btn <?php echo $index === 0 ? 'active' : ''; ?>" 
                                    data-slide-index="<?php echo $index; ?>" 
                                    aria-label="Go to <?php echo esc_attr($slide['title']); ?>"
                                    title="<?php echo esc_attr($slide['title']); ?>">
                            </button>
                        <?php endforeach; ?>
                    </div>

                    <button type="button" class="carousel-nav-btn carousel-next-btn" aria-label="Next form example">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
(function() {
    function initCarousel() {
        var carousel = document.getElementById('heroFormCarousel');
        if (!carousel || carousel.dataset.initialized === 'true') return;
        carousel.dataset.initialized = 'true';

        var cards = Array.from(carousel.querySelectorAll('.hero-carousel-card'));
        var dots = Array.from(carousel.querySelectorAll('.carousel-dot-btn'));
        var prevBtn = carousel.querySelector('.carousel-prev-btn');
        var nextBtn = carousel.querySelector('.carousel-next-btn');

        if (!cards.length) return;

        var currentIndex = 0;
        var total = cards.length;

        function update(targetIndex) {
            currentIndex = ((targetIndex % total) + total) % total;

            cards.forEach(function(card, idx) {
                card.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');

                if (total === 1) {
                    card.classList.add('is-active');
                    return;
                }

                var diff = idx - currentIndex;
                if (diff > total / 2) diff -= total;
                if (diff < -total / 2) diff += total;

                if (diff === 0) {
                    card.classList.add('is-active');
                } else if (diff === -1 || (total === 3 && (diff === 2 || diff === -1))) {
                    card.classList.add('is-prev');
                } else if (diff === 1 || (total === 3 && (diff === -2 || diff === 1))) {
                    card.classList.add('is-next');
                } else {
                    card.classList.add('is-hidden');
                }
            });

            dots.forEach(function(dot, idx) {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Side card clicks
        cards.forEach(function(card) {
            card.addEventListener('click', function(e) {
                if (!this.classList.contains('is-active')) {
                    e.preventDefault();
                    e.stopPropagation();
                    var target = parseInt(this.getAttribute('data-slide-index'), 10);
                    if (!isNaN(target)) update(target);
                }
            });
        });

        // Dot clicks
        dots.forEach(function(dot) {
            dot.addEventListener('click', function(e) {
                e.preventDefault();
                var target = parseInt(this.getAttribute('data-slide-index'), 10);
                if (!isNaN(target)) update(target);
            });
        });

        // Prev & Next clicks
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                update(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                update(currentIndex + 1);
            });
        }

        // Touch Swipe
        var stage = carousel.querySelector('.hero-carousel-stage');
        if (stage) {
            var startX = 0;
            stage.addEventListener('touchstart', function(e) {
                startX = e.changedTouches[0].screenX;
            }, { passive: true });
            stage.addEventListener('touchend', function(e) {
                var endX = e.changedTouches[0].screenX;
                var diff = startX - endX;
                if (Math.abs(diff) > 40) {
                    if (diff > 0) update(currentIndex + 1);
                    else update(currentIndex - 1);
                }
            }, { passive: true });
        }

        update(0);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousel);
    } else {
        initCarousel();
    }
})();
</script>
<?php else : ?>
<section class="hero">
    <div class="container hero-content" style="text-align: center; max-width: 960px; margin: 0 auto;">
        <h1 style="font-size: clamp(40px, 5.5vw, 68px); font-weight: 800; line-height: 1.05; margin-bottom: 24px; letter-spacing: -1px;">
            More Bookings.<br>
            Fewer Drop-Offs.<br>
            <em>Engineered to Convert.</em>
        </h1>
        <p style="font-size: 18px; line-height: 1.65; max-width: 820px; margin: 0 auto 32px auto; color: rgba(255, 255, 255, 0.9);">
            Eliminate booking friction and <strong>stop losing up to 70% of potential leads</strong>. Flowtrus powers high-converting, telemetry-backed interactive forms designed for maximum revenue.
        </p>
        <div class="hero-cta" style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-accent btn-lg" style="font-weight: 700;">See Live Demo</a>
            <a href="#" class="btn btn-secondary btn-lg flowtrus-trigger" data-form-id="LhOxsSHbmRt0t6SfAeOi" style="font-weight: 700; background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); color: white;">Get Started</a>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- Hero Trust Bar Banner -->
<div class="hero-trust-bar">
    <div class="container hero-trust-bar-container">
        <div class="hero-trust-item">
            <div class="hero-trust-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div class="hero-trust-text">
                <span class="hero-trust-title">Sub-100ms Instant Load</span>
            </div>
        </div>
        <div class="hero-trust-item">
            <div class="hero-trust-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div class="hero-trust-text">
                <span class="hero-trust-title">Zero Data Leakage</span>
            </div>
        </div>
        <div class="hero-trust-item">
            <div class="hero-trust-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div class="hero-trust-text">
                <span class="hero-trust-title">+38% Avg Conversion Lift</span>
            </div>
        </div>
    </div>
</div>

<!-- ==============================================
     1. PROBLEM SECTION
     ============================================== -->
<section class="section" id="problem" style="background: #fafafa; border-bottom: 1px solid #edf2f7; padding: 85px 0;">
    <div class="container">
        <div class="text-center mb-12">
            <h2 class="section-header-title">
                Why 70% of Your Potential Bookings Evaporate Before Submitting
            </h2>
            <p class="section-header-subtitle">
                Traditional static forms create invisible friction that frustrates prospects and bleeds high-intent revenue.
            </p>
        </div>

        <div class="problem-grid">
            <!-- Problem 1 -->
            <div class="problem-card">
                <div class="problem-icon-wrap">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <h3 class="problem-title">Cognitive Overload & Form Fatigue</h3>
                <p class="problem-desc">
                    Walls of 10+ mandatory fields overwhelm users, particularly on mobile screens. Visitors experience immediate hesitation and exit before answering a single question.
                </p>
                <div>
                    <span class="problem-stat-pill">68% Mobile Abandonment</span>
                </div>
            </div>

            <!-- Problem 2 -->
            <div class="problem-card">
                <div class="problem-icon-wrap">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </div>
                <h3 class="problem-title">Sub-Field Analytics Blind Spots</h3>
                <p class="problem-desc">
                    Google Analytics only counts visits and final button clicks. You remain completely blind to which question, date-picker hurdle, or validation error caused users to abandon.
                </p>
                <div>
                    <span class="problem-stat-pill">Zero Diagnostic Visibility</span>
                </div>
            </div>

            <!-- Problem 3 -->
            <div class="problem-card">
                <div class="problem-icon-wrap">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                </div>
                <h3 class="problem-title">The "Message Sent" Competitor Leak</h3>
                <p class="problem-desc">
                    Generic confirmation text sparks buyer anxiety. Unsure if anyone received their message, prospects instinctively return to Google and submit quotes with 2–3 competitors.
                </p>
                <div>
                    <span class="problem-stat-pill">Lost to Fastest Responder</span>
                </div>
            </div>
        </div>
    </div>
</section>


<!-- ==============================================
     2. SOLUTION SECTION (Highlights Capabilities)
     ============================================== -->
<section class="section" id="solution" style="background: white; padding: 90px 0;">
    <div class="container">
        <div class="text-center mb-12">
            <span class="section-tag-badge badge-secondary">
                ⚡ CONVERSION-ENGINEERED SOLUTION
            </span>
            <h2 class="section-header-title">
                Intelligent Intake Forms Backed by Real-Time Telemetry
            </h2>
            <p class="section-header-subtitle">
                Flowtrus transforms everyday booking forms into predictable, high-yield revenue engines with 4 proprietary conversion capabilities.
            </p>
        </div>

        <!-- Capability 1 & 2: Field Friction + Funnel Completion -->
        <div class="grid grid-2" style="align-items: center; gap: var(--spacing-12); margin-bottom: 70px;">
            <!-- Field Friction Telemetry Card -->
            <div>
                <div class="analytics-demo">
                    <span class="case-tag-pill" style="margin-bottom: 8px;">CAPABILITY 1</span>
                    <h3 style="margin-bottom: var(--spacing-4); font-size: 24px;">Sub-Field Hesitation & Friction Tracking</h3>
                    <p class="text-gray" style="margin-bottom: 20px;">
                        Millisecond-precision dwell tracking pinpoints exactly which input questions cause hesitation pauses or user drop-off.
                    </p>
                    <div class="field-friction-card"
                        style="background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-lg); overflow: hidden; border: 1px solid var(--color-gray-200);">
                        <div
                            style="background: var(--color-gray-50); padding: var(--spacing-3) var(--spacing-4); border-bottom: 1px solid var(--color-gray-200); display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: var(--font-size-xs); font-weight: 700; color: var(--color-gray-500); text-transform: uppercase;">Field Name</span>
                            <span style="font-size: var(--font-size-xs); font-weight: 700; color: var(--color-gray-500); text-transform: uppercase;">Avg. Dwell Time</span>
                        </div>

                        <!-- Item 1 -->
                        <div style="padding: var(--spacing-4); border-bottom: 1px solid var(--color-gray-100); display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center;">
                                <div style="width: 8px; height: 8px; background: var(--color-success); border-radius: 50%; margin-right: var(--spacing-3);"></div>
                                <span style="font-weight: 500; font-size: var(--font-size-sm);">Full Name</span>
                            </div>
                            <div style="text-align: right;">
                                <span style="font-weight: 600; color: var(--color-gray-700);">2.4s</span>
                                <div style="width: 60px; height: 4px; background: var(--color-gray-200); border-radius: 2px; margin-top: 4px; overflow: hidden;">
                                    <div style="width: 20%; height: 100%; background: var(--color-success);"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Item 2 -->
                        <div style="padding: var(--spacing-4); border-bottom: 1px solid var(--color-gray-100); display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center;">
                                <div style="width: 8px; height: 8px; background: var(--color-success); border-radius: 50%; margin-right: var(--spacing-3);"></div>
                                <span style="font-weight: 500; font-size: var(--font-size-sm);">Email Address</span>
                            </div>
                            <div style="text-align: right;">
                                <span style="font-weight: 600; color: var(--color-gray-700);">3.1s</span>
                                <div style="width: 60px; height: 4px; background: var(--color-gray-200); border-radius: 2px; margin-top: 4px; overflow: hidden;">
                                    <div style="width: 30%; height: 100%; background: var(--color-success);"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Item 3: High Friction Warning -->
                        <div style="padding: var(--spacing-4); background: rgba(239, 68, 68, 0.05); border-left: 3px solid var(--color-error); display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center;">
                                <div style="width: 8px; height: 8px; background: var(--color-error); border-radius: 50%; margin-right: var(--spacing-3);"></div>
                                <div>
                                    <span style="font-weight: 600; font-size: var(--font-size-sm); color: var(--color-gray-900);">Project Budget</span>
                                    <span style="display: block; font-size: 10px; color: var(--color-error); font-weight: 700; margin-top: 2px;">⚠️ FRICTION SPIKE DETECTED</span>
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <span style="font-weight: 700; color: var(--color-error);">14.2s</span>
                                <div style="width: 60px; height: 4px; background: var(--color-gray-200); border-radius: 2px; margin-top: 4px; overflow: hidden;">
                                    <div style="width: 85%; height: 100%; background: var(--color-error);"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Capability 2: Progressive Multi-Step Pacing -->
            <div>
                <span class="case-tag-pill" style="margin-bottom: 8px;">CAPABILITY 2</span>
                <h3 style="font-size: 24px; margin-bottom: 12px;">Dynamic Multi-Step Progression</h3>
                <p class="text-gray" style="margin-bottom: 20px;">
                    Break complex questionnaires into low-friction micro-steps. Progressive disclosure keeps completion motivation high from start to finish.
                </p>

                <div class="card" style="border: 1px solid #e2e8f0; box-shadow: var(--shadow-md);">
                    <h4 style="text-align: center; margin-bottom: var(--spacing-6); font-size: 16px;">Multi-Step Form Progress</h4>
                    <div class="step-tracker">
                        <div class="step completed">
                            <div class="step-circle">1</div>
                            <span style="font-size: var(--font-size-sm); display: block; margin-top: var(--spacing-2);">Basic Info</span>
                            <p style="font-size: var(--font-size-xs); color: var(--color-accent); margin-top: var(--spacing-1);">95% complete</p>
                        </div>
                        <div class="step completed">
                            <div class="step-circle">2</div>
                            <span style="font-size: var(--font-size-sm); display: block; margin-top: var(--spacing-2);">Details</span>
                            <p style="font-size: var(--font-size-xs); color: var(--color-accent); margin-top: var(--spacing-1);">87% complete</p>
                        </div>
                        <div class="step active">
                            <div class="step-circle">3</div>
                            <span style="font-size: var(--font-size-sm); display: block; margin-top: var(--spacing-2);">Preferences</span>
                            <p style="font-size: var(--font-size-xs); color: var(--color-secondary); margin-top: var(--spacing-1);">62% complete</p>
                        </div>
                        <div class="step">
                            <div class="step-circle">4</div>
                            <span style="font-size: var(--font-size-sm); display: block; margin-top: var(--spacing-2);">Submit</span>
                            <p style="font-size: var(--font-size-xs); color: var(--color-gray-500); margin-top: var(--spacing-1);">45% complete</p>
                        </div>
                    </div>
                    <p class="text-gray mt-6" style="text-align: center; font-size: var(--font-size-sm); margin-bottom: 0;">
                        💡 <strong>Insight:</strong> Step 3 shows 25% drop-off - consider simplifying options
                    </p>
                </div>
            </div>
        </div>

        <!-- Capability 3 & 4: Abandoned Recapture + Competitor Lockout Confirmations -->
        <div class="grid grid-2" style="align-items: center; gap: var(--spacing-12);">
            <!-- Capability 3: Lead Recovery -->
            <div>
                <span class="case-tag-pill" style="margin-bottom: 8px;">CAPABILITY 3</span>
                <h3 style="font-size: 24px; margin-bottom: 12px;">Real-Time Abandoned Lead Recapture</h3>
                <p class="text-gray" style="margin-bottom: 20px;">
                    When users leave midway through a form, their partially typed name and contact info are saved securely in real time—allowing immediate 1-click follow-up.
                </p>

                <div class="card recovery-card" style="border-left: 4px solid #f59e0b; padding: 0; overflow: hidden; box-shadow: var(--shadow-md);">
                    <div style="background: #fffbeb; padding: 15px 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #fcd34d;">
                        <h4 style="margin: 0; display: flex; align-items: center; gap: 10px; font-size: 15px; color: #92400e;">
                            <span style="width: 10px; height: 10px; background: #f59e0b; border-radius: 50%; display: inline-block;"></span>
                            Lead Opportunity #842
                        </h4>
                        <span style="background: white; color: #b45309; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; border: 1px solid #fcd34d;">ABANDONED 2m AGO</span>
                    </div>

                    <div style="padding: 22px;">
                        <div class="partial-data-list" style="background: #f8fafc; border-radius: 8px; padding: 14px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px;">
                                <span style="color: #64748b; font-size: 13px;">Name Input:</span>
                                <span style="font-weight: 600; color: var(--color-success); font-size: 13px;">Sarah Jenkins <span style="font-size: 10px; background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px;">SAVED</span></span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px;">
                                <span style="color: #64748b; font-size: 13px;">Email Input:</span>
                                <span style="font-weight: 600; color: var(--color-success); font-size: 13px;">sarah.j@gm... <span style="font-size: 10px; background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px;">SAVED</span></span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span style="color: #64748b; font-size: 13px;">Phone Input:</span>
                                <span style="font-style: italic; color: #94a3b8; font-size: 13px;">(Not entered)</span>
                            </div>
                        </div>

                        <div class="btn btn-primary btn-full-width" style="text-align: center; background: #f59e0b; border: none; width: 100%; font-weight: 700; font-size: 14px; padding: 10px 0;">
                            Recover this Lead (1-Click)
                        </div>
                    </div>
                </div>
            </div>

            <!-- Capability 4: Competitor Lockout Confirmations -->
            <div>
                <span class="case-tag-pill" style="margin-bottom: 8px;">CAPABILITY 4</span>
                <h3 style="font-size: 24px; margin-bottom: 12px;">Competitor-Lockout Confirmation Anchors</h3>
                <p class="text-gray" style="margin-bottom: 20px;">
                    Provide immediate closure by introducing the assigned specialist and setting firm response timers, satisfying prospect urgency so they stop searching competitors.
                </p>

                <div style="background: #f0fdf4; border: 2px solid #86efac; border-radius: 14px; padding: 22px; box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.12);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <span style="font-size: 11px; font-weight: 700; color: #15803d; text-transform: uppercase;">✅ Flowtrus Confidence Anchor</span>
                        <span style="font-size: 11px; font-weight: 700; color: #15803d; background: #dcfce7; padding: 3px 10px; border-radius: 100px;">Search Stopped</span>
                    </div>
                    
                    <div style="background: white; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <div style="width: 34px; height: 34px; background: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                                🎉
                            </div>
                            <div>
                                <div style="font-weight: 700; color: #166534; font-size: 13.5px;">Booking Secured & Assigned!</div>
                                <div style="font-size: 11.5px; color: #64748b;">Ref #FLW-88294 • Instant SMS Dispatched</div>
                            </div>
                        </div>
                        <div style="font-size: 12.5px; color: #334155; line-height: 1.5;">
                            "Hi Sarah, your request is with <strong>Marcus Vance (Specialist)</strong>. Marcus is reviewing your details now and will message you within <strong>14 minutes</strong>."
                        </div>
                    </div>

                    <div style="font-size: 12px; color: #166534; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                        <span>🔒</span> Prospect closes browser and waits exclusively for your call.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>


<!-- ==============================================
     3. REAL RESULTS (Case Studies)
     ============================================== -->
<section class="section" id="results" style="background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 90px 0;">
    <div class="container">
        <div class="text-center mb-12">
            <span class="section-tag-badge badge-success">
                📈 PROVEN REVENUE LIFT
            </span>
            <h2 class="section-header-title">
                Real Results Across High-Intent Industries
            </h2>
            <p class="section-header-subtitle">
                See how data-driven forms turn casual website traffic into booked pipeline.
            </p>
        </div>

        <div class="case-study-showcase-grid">
            <!-- Case Study 1 -->
            <div class="case-study-showcase-card">
                <span class="case-tag-pill">Home Services & Solar</span>
                <h3 class="case-title">Apex Home Solutions Increases Booked Estimates by 48%</h3>
                <p class="text-gray" style="font-size: 14px; line-height: 1.6;">
                    Struggled with high paid ad costs and a 72% drop-off on static multi-field quotes. Switched to Flowtrus 3-step progressive pacing.
                </p>

                <div class="case-stats-row">
                    <div>
                        <span class="case-stat-num">+48%</span>
                        <span class="case-stat-lbl">Booked Jobs</span>
                    </div>
                    <div>
                        <span class="case-stat-num">60%</span>
                        <span class="case-stat-lbl">Less Abandonment</span>
                    </div>
                </div>

                <div class="case-quote-box">
                    "Flowtrus pinpointed the exact pricing question that was freezing homeowners. Fixing it added $140,000 in monthly pipeline."
                </div>
            </div>

            <!-- Case Study 2 -->
            <div class="case-study-showcase-card">
                <span class="case-tag-pill">B2B Consulting & Agency</span>
                <h3 class="case-title">Vanguard Growth Doubles Qualified Sales Pipeline</h3>
                <p class="text-gray" style="font-size: 14px; line-height: 1.6;">
                    Needed a streamlined way to pre-qualify enterprise prospects and capture project scope details before introductory discovery calls.
                </p>

                <div class="case-stats-row">
                    <div>
                        <span class="case-stat-num">2.4x</span>
                        <span class="case-stat-lbl">Qualified Pipeline</span>
                    </div>
                    <div>
                        <span class="case-stat-num">35%</span>
                        <span class="case-stat-lbl">Higher Close Rate</span>
                    </div>
                </div>

                <div class="case-quote-box">
                    "The progressive question pacing filters out tire-kickers while delivering complete project scopes straight into HubSpot."
                </div>
            </div>

            <!-- Case Study 3 -->
            <div class="case-study-showcase-card">
                <span class="case-tag-pill">High-Ticket SaaS Platform</span>
                <h3 class="case-title">PulseTech Onboarding Cuts Mobile Drop-off by 55%</h3>
                <p class="text-gray" style="font-size: 14px; line-height: 1.6;">
                    High-volume trial signup funnel suffered from slow iframe embeds. Implemented Flowtrus sub-100ms instant forms.
                </p>

                <div class="case-stats-row">
                    <div>
                        <span class="case-stat-num">+55%</span>
                        <span class="case-stat-lbl">Mobile Signups</span>
                    </div>
                    <div>
                        <span class="case-stat-num">+$180k</span>
                        <span class="case-stat-lbl">Pipeline Recovered</span>
                    </div>
                </div>

                <div class="case-quote-box">
                    "Our mobile conversion jumped instantly. The as-you-type lead recovery captured over 120 extra qualified accounts in month one."
                </div>
            </div>
        </div>
    </div>
</section>


<!-- ==============================================
     4. HOW IT WORKS SECTION
     ============================================== -->
<section class="section" id="how-it-works" style="background: white; padding: 90px 0;">
    <div class="container">
        <div class="text-center mb-12">
            <span class="section-tag-badge">
                🛠️ WHITE-GLOVE IMPLEMENTATION
            </span>
            <h2 class="section-header-title">
                White-Glove CRO in 3 Simple Steps
            </h2>
            <p class="section-header-subtitle">
                We handle the design, engineering, telemetry, and ongoing optimization—you collect the booked revenue.
            </p>
        </div>

        <div class="how-steps-grid">
            <!-- Step 1 -->
            <div class="how-step-card">
                <span class="how-step-num">01</span>
                <div class="how-step-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                </div>
                <h3 class="how-step-title">1. Diagnose & Architect</h3>
                <p class="how-step-desc">
                    Our CRO team audits your existing booking flow, pinpoints friction drop-offs, and builds custom multi-step forms tailored to your exact brand aesthetics.
                </p>
            </div>

            <!-- Step 2 -->
            <div class="how-step-card">
                <span class="how-step-num">02</span>
                <div class="how-step-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                </div>
                <h3 class="how-step-title">2. Sub-100ms Embed</h3>
                <p class="how-step-desc">
                    Drop our lightweight snippet onto WordPress, Webflow, Shopify, or custom stacks. Shadow DOM architecture guarantees zero CSS collisions and instant load speeds.
                </p>
            </div>

            <!-- Step 3 -->
            <div class="how-step-card">
                <span class="how-step-num">03</span>
                <div class="how-step-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                </div>
                <h3 class="how-step-title">3. Telemetry & Ongoing Lift</h3>
                <p class="how-step-desc">
                    Real-time lead recapture saves lost submissions automatically, while our team continuously runs algorithmic conversion tests to scale your booked revenue.
                </p>
            </div>
        </div>
    </div>
</section>


<!-- ==============================================
     5. HOW IT COMPARES MATRIX
     ============================================== -->
<section class="section" id="how-it-compares" style="background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 90px 0;">
    <div class="container">
        <div class="text-center mb-12">
            <span class="section-tag-badge badge-secondary">
                ⚖️ UNMATCHED CAPABILITIES
            </span>
            <h2 class="section-header-title">
                Why Leading Brands Choose Flowtrus
            </h2>
            <p class="section-header-subtitle">
                See how Flowtrus compares to generic WordPress form plugins, standalone form SaaS, and in-house development.
            </p>
        </div>

        <div class="comparison-table-wrapper">
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th style="width: 32%;">Feature & Capability</th>
                        <th class="flowtrus-col" style="width: 24%;">Flowtrus CRO Platform</th>
                        <th style="width: 22%;">Standard WP Plugins<br><span style="font-weight: 400; font-size: 11px; color: #64748b;">(Gravity / WPForms)</span></th>
                        <th style="width: 22%;">Form SaaS<br><span style="font-weight: 400; font-size: 11px; color: #64748b;">(Typeform / Jotform)</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Industry-Leading Conversion Rates</strong></td>
                        <td class="flowtrus-col"><span class="badge-check">✓ +38% to 50%+ Lift</span></td>
                        <td><span class="badge-cross">✕ Static Baseline (~2.3%)</span></td>
                        <td><span class="badge-partial">⚠️ Average Benchmarks</span></td>
                    </tr>
                    <tr>
                        <td><strong>100% Custom Design to Match Branding</strong></td>
                        <td class="flowtrus-col"><span class="badge-check">✓ Seamless & Tailored</span></td>
                        <td><span class="badge-partial">⚠️ Clunky Default CSS</span></td>
                        <td><span class="badge-partial">⚠️ Generic Hosted Look</span></td>
                    </tr>
                    <tr>
                        <td><strong>Confidence-Building User Experience</strong></td>
                        <td class="flowtrus-col"><span class="badge-check">✓ Anxiety-Free & Reassuring</span></td>
                        <td><span class="badge-cross">✕ High Fatigue & Friction</span></td>
                        <td><span class="badge-partial">⚠️ Rigid Generic Inputs</span></td>
                    </tr>
                    <tr>
                        <td><strong>Real-Time As-You-Type Lead Recapture</strong></td>
                        <td class="flowtrus-col"><span class="badge-check">✓ Included (&lt;40% Lift)</span></td>
                        <td><span class="badge-cross">✕ No (Submits only)</span></td>
                        <td><span class="badge-cross">✕ No</span></td>
                    </tr>
                    <tr>
                        <td><strong>Sub-Field Hesitation & Friction Telemetry</strong></td>
                        <td class="flowtrus-col"><span class="badge-check">✓ Millisecond Precision</span></td>
                        <td><span class="badge-cross">✕ No Telemetry</span></td>
                        <td><span class="badge-partial">⚠️ Basic Funnel Only</span></td>
                    </tr>
                    <tr>
                        <td><strong>Competitor-Lockout Confirmation Anchors</strong></td>
                        <td class="flowtrus-col"><span class="badge-check">✓ Named SLA Routing</span></td>
                        <td><span class="badge-cross">✕ Static Text Message</span></td>
                        <td><span class="badge-partial">⚠️ Generic Redirect</span></td>
                    </tr>
                    <tr>
                        <td><strong>Done-For-You CRO Management & Audits</strong></td>
                        <td class="flowtrus-col"><span class="badge-check">✓ Included in Plans</span></td>
                        <td><span class="badge-cross">✕ 100% DIY</span></td>
                        <td><span class="badge-cross">✕ 100% DIY</span></td>
                    </tr>
                    <tr>
                        <td><strong>Sub-100ms Universal Embed Performance</strong></td>
                        <td class="flowtrus-col"><span class="badge-check">✓ Shadow DOM (&lt;100ms)</span></td>
                        <td><span class="badge-partial">⚠️ Bloated Scripts</span></td>
                        <td><span class="badge-partial">⚠️ Heavy Iframes</span></td>
                    </tr>
                    <tr>
                        <td><strong>Direct CRM & Webhook Automation</strong></td>
                        <td class="flowtrus-col"><span class="badge-check">✓ 2-Way Instant Sync</span></td>
                        <td><span class="badge-partial">⚠️ Expensive Addons</span></td>
                        <td><span class="badge-check">✓ Available</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</section>


<!-- ==============================================
     6. ROI CALCULATOR SECTION
     ============================================== -->
<section class="section section-roi" id="roi-calculator"
    style="background: linear-gradient(135deg, #091726 0%, #133353 50%, #0d2238 100%); color: white; position: relative; overflow: hidden; padding: 90px 0;">
    <!-- Decorative background elements -->
    <div style="position: absolute; top: -100px; right: -100px; width: 400px; height: 400px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; filter: blur(60px);"></div>
    <div style="position: absolute; bottom: -100px; left: -100px; width: 300px; height: 300px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; filter: blur(60px);"></div>

    <div class="container" style="position: relative; z-index: 2;">
        <div class="text-center mb-12">
            <span class="section-tag-badge badge-light">
                💰 PROJECTED VALUE
            </span>
            <h2 style="color: white; font-size: var(--font-size-4xl); margin-bottom: 12px;">Calculate Your Potential Return</h2>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: var(--font-size-lg); max-width: 600px; margin: 0 auto;">
                See how much revenue you could generate by eliminating form friction with Flowtrus.
            </p>
        </div>

        <div class="roi-calculator grid grid-2"
            style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: var(--border-radius-xl); padding: var(--spacing-8); backdrop-filter: blur(10px); gap: var(--spacing-8);">

            <!-- Inputs -->
            <div class="roi-inputs">
                <div class="roi-input-group mb-6">
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-2); align-items: center;">
                        <label style="font-weight: 600;">Monthly Website Visitors</label>
                        <input type="number" id="input-visitors" value="5000" min="500" max="100000" step="500" class="roi-number-input">
                    </div>
                    <input type="range" id="visitors" min="500" max="100000" step="500" value="5000" class="flowtrus-range">
                </div>

                <div class="roi-input-group mb-6">
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-2); align-items: center;">
                        <label style="font-weight: 600;">Current Conversion Rate (%)</label>
                        <input type="number" id="input-conversion" value="2.5" min="0.1" max="10" step="0.1" class="roi-number-input">
                    </div>
                    <input type="range" id="conversion" min="0.1" max="10" step="0.1" value="2.5" class="flowtrus-range">
                </div>

                <div class="roi-input-group mb-6">
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-2); align-items: center;">
                        <label style="font-weight: 600;">Average Deal Value ($)</label>
                        <input type="number" id="input-deal-value" value="1200" min="100" max="50000" step="100" class="roi-number-input">
                    </div>
                    <input type="range" id="deal-value" min="100" max="50000" step="100" value="1200" class="flowtrus-range">
                </div>

                <!-- Industry Benchmarks -->
                <div class="roi-benchmarks"
                    style="margin-top: var(--spacing-6); padding: var(--spacing-5); background: rgba(0,0,0,0.25); border-radius: var(--border-radius-lg);">
                    <h5 style="color: rgba(255,255,255,0.9); margin-bottom: var(--spacing-2); font-size: var(--font-size-xs); text-transform: uppercase; letter-spacing: 0.05em;">
                        📊 Industry Benchmarks
                    </h5>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4);">
                        <div>
                            <span style="display: block; font-size: var(--font-size-xs); color: rgba(255,255,255,0.6);">Avg. Conversion</span>
                            <span style="display: block; font-weight: 600; color: white;">2.35%</span>
                        </div>
                        <div>
                            <span style="display: block; font-size: var(--font-size-xs); color: rgba(255,255,255,0.6);">Top 10% Performers</span>
                            <span style="display: block; font-weight: 600; color: var(--color-accent);">11.45%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results -->
            <div class="roi-results"
                style="display: flex; flex-direction: column; justify-content: center; border-left: 1px solid rgba(255, 255, 255, 0.2); padding-left: var(--spacing-8);">

                <div class="mb-8 text-center sm-text-left">
                    <p style="font-size: var(--font-size-sm); color: rgba(255, 255, 255, 0.8); margin-bottom: var(--spacing-1);">
                        Projected Annual Revenue Increase
                    </p>
                    <div id="result-revenue"
                        style="font-size: 3.5rem; font-weight: 800; color: var(--color-accent); text-shadow: 0 4px 12px rgba(0,0,0,0.2); line-height: 1;">
                        $54,000
                    </div>
                    <p style="font-size: var(--font-size-xs); color: rgba(255, 255, 255, 0.6); margin-top: var(--spacing-2);">
                        Based on conservative 30% lift estimates
                    </p>
                </div>

                <div class="grid grid-2 gap-4">
                    <div style="background: rgba(0, 0, 0, 0.25); padding: var(--spacing-4); border-radius: var(--border-radius-lg);">
                        <span style="display: block; font-size: var(--font-size-xs); color: rgba(255, 255, 255, 0.7);">Extra Annual Leads</span>
                        <span id="result-leads" style="display: block; font-size: var(--font-size-2xl); font-weight: 700; color: white;">+450</span>
                    </div>
                    <div style="background: rgba(0, 0, 0, 0.25); padding: var(--spacing-4); border-radius: var(--border-radius-lg);">
                        <span style="display: block; font-size: var(--font-size-xs); color: rgba(255, 255, 255, 0.7);">Hours Saved / Year</span>
                        <span id="result-time" style="display: block; font-size: var(--font-size-2xl); font-weight: 700; color: white;">260h</span>
                    </div>
                </div>

                <div class="mt-8 text-center">
                    <a href="#audit-cta" class="btn btn-accent btn-wide" style="width: 100%; font-weight: 700;">Request Your Free CRO Audit →</a>
                </div>
            </div>
        </div>
    </div>
</section>


<!-- ==============================================
     7. PRICING SECTION
     ============================================== -->
<section class="section" id="pricing" style="padding: 90px 0; background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);">
    <div class="container">
        <div class="text-center mb-12">
            <span class="section-tag-badge">
                💳 TRANSPARENT PLANS
            </span>
            <h2 class="section-header-title">White-Glove Form Optimization Plans</h2>
            <p class="section-header-subtitle">We design, build, style, and monitor your forms for you—so you can focus on booked revenue.</p>
        </div>

        <div class="grid grid-3" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; align-items: stretch; margin-bottom: 30px;">
            
            <!-- Growth Plan Card -->
            <div class="card" style="background: white; border: 1px solid var(--color-border, #e2e8f0); border-top: 4px solid var(--color-secondary, #2d9b9b); border-radius: 12px; padding: 35px 30px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div>
                    <h3 style="font-family: var(--font-title); font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 10px; font-size: 20px;">Growth Plan</h3>
                    <p class="text-gray" style="color: #64748b; font-size: 13.5px; line-height: 1.4; margin-bottom: 25px;">
                        Ideal for local businesses looking to optimize their primary landing page or intake form.
                    </p>
                    
                    <div style="margin-bottom: 25px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 20px;">
                        <span style="font-size: 38px; font-weight: 800; color: var(--color-primary, #1a4d7c); font-family: var(--font-title);">$499</span>
                        <span class="text-gray" style="color: #64748b; font-size: 13px; font-weight: 500;"> setup fee</span>
                        <div style="font-size: 20px; font-weight: 700; color: var(--color-secondary, #2d9b9b); margin-top: 6px; display: flex; align-items: baseline; gap: 4px;">
                            +$99<span style="font-size: 12px; font-weight: 500; color: #64748b;">/month optimization</span>
                        </div>
                    </div>

                    <ul style="list-style: none; padding: 0; margin: 0 0 30px 0; font-size: 13.5px; line-height: 2.2; color: #334155;">
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ 1 Custom Form Flow</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Full Brand & Color Match</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Submissions Dashboard Access</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Standard Webhook CRM Integrations</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Monthly Telemetry Analytics Report</li>
                        <li style="display: flex; align-items: center; gap: 8px; color: #94a3b8; text-decoration: line-through;">❌ Custom CSS stylesheet overrides</li>
                        <li style="display: flex; align-items: center; gap: 8px; color: #94a3b8; text-decoration: line-through;">❌ Abandoned lead recovery logs</li>
                    </ul>
                </div>
                <button class="btn btn-secondary btn-full-width flowtrus-trigger" data-form-id="service-booking" style="width: 100%; text-align: center; font-weight: 700; border-radius: 6px; padding: 12px 0; cursor: pointer;">Get Started</button>
            </div>

            <!-- Pro Plan Card (Highlighted) -->
            <div class="card" style="background: white; border: 2px solid var(--color-primary, #1a4d7c); border-top: 6px solid var(--color-primary, #1a4d7c); border-radius: 12px; padding: 35px 30px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); transform: scale(1.03); z-index: 10; position: relative;">
                <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background-color: var(--color-primary, #1a4d7c); color: white; padding: 3px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;">Most Popular</div>
                <div>
                    <h3 style="font-family: var(--font-title); font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 10px; font-size: 20px;">Pro Optimize Plan</h3>
                    <p class="text-gray" style="color: #64748b; font-size: 13.5px; line-height: 1.4; margin-bottom: 25px;">
                        Best for growing companies that want multi-step layouts, custom styling, and automated CRM syncs.
                    </p>
                    
                    <div style="margin-bottom: 25px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 20px;">
                        <span style="font-size: 38px; font-weight: 800; color: var(--color-primary, #1a4d7c); font-family: var(--font-title);">$999</span>
                        <span class="text-gray" style="color: #64748b; font-size: 13px; font-weight: 500;"> setup fee</span>
                        <div style="font-size: 20px; font-weight: 700; color: var(--color-secondary, #2d9b9b); margin-top: 6px; display: flex; align-items: baseline; gap: 4px;">
                            +$249<span style="font-size: 12px; font-weight: 500; color: #64748b;">/month optimization</span>
                        </div>
                    </div>

                    <ul style="list-style: none; padding: 0; margin: 0 0 30px 0; font-size: 13.5px; line-height: 2.2; color: #334155;">
                        <li style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--color-primary, #1a4d7c);">✔️ Up to 3 Custom Form Flows</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Lightbox Modals & Inline Embeds</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Advanced Theme Styling & Custom CSS</li>
                        <li style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--color-secondary, #2d9b9b);">✔️ Abandoned Lead Recovery Telemetry</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Automated CRM Sync (HubSpot, Salesforce)</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Priority 24h Turnaround Revisions</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Bi-weekly Analytical CRO Audits</li>
                    </ul>
                </div>
                <button class="btn btn-primary btn-full-width flowtrus-trigger" data-form-id="service-booking" style="width: 100%; text-align: center; font-weight: 700; border-radius: 6px; padding: 12px 0; cursor: pointer;">Get Started</button>
            </div>

            <!-- Enterprise Suite Card -->
            <div class="card" style="background: white; border: 1px solid var(--color-border, #e2e8f0); border-top: 4px solid var(--color-accent, #6bc47d); border-radius: 12px; padding: 35px 30px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div>
                    <h3 style="font-family: var(--font-title); font-weight: 700; color: var(--color-primary, #1a4d7c); margin-bottom: 10px; font-size: 20px;">Enterprise Suite</h3>
                    <p class="text-gray" style="color: #64748b; font-size: 13.5px; line-height: 1.4; margin-bottom: 25px;">
                        For high-volume lead generators, digital marketing agencies, and complex database needs.
                    </p>
                    
                    <div style="margin-bottom: 25px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 20px;">
                        <span style="font-size: 34px; font-weight: 800; color: var(--color-primary, #1a4d7c); font-family: var(--font-title);">Custom</span>
                        <span class="text-gray" style="color: #64748b; font-size: 13px; font-weight: 500;"> quote setup</span>
                        <div style="font-size: 20px; font-weight: 700; color: var(--color-secondary, #2d9b9b); margin-top: 6px; display: flex; align-items: baseline; gap: 4px;">
                            Contact Us
                        </div>
                    </div>

                    <ul style="list-style: none; padding: 0; margin: 0 0 30px 0; font-size: 13.5px; line-height: 2.2; color: #334155;">
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Unlimited Custom Form Flows</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Dedicated Multi-Client Portal Access</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Custom JavaScript Validation Hooks</li>
                        <li style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--color-accent, #6bc47d);">✔️ Slack/SMS Abandoned Lead Alerts</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Dedicated CRO Account Manager</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ SLA Response Guarantees (&lt;4 Hours)</li>
                        <li style="display: flex; align-items: center; gap: 8px;">✔️ Custom Multi-variate Conversion Tests</li>
                    </ul>
                </div>
                <button class="btn btn-secondary btn-full-width flowtrus-trigger" data-form-id="lead-capture" style="width: 100%; text-align: center; font-weight: 700; border-radius: 6px; padding: 12px 0; cursor: pointer;">Get Quote</button>
            </div>

        </div>
    </div>
</section>


<!-- ==============================================
     8. CTA TO REQUEST AN AUDIT SECTION
     ============================================== -->
<section class="audit-cta-section" id="audit-cta">
    <div class="container">
        <div class="audit-cta-box">
            <span class="section-tag-badge badge-light" style="margin-bottom: 20px;">
                🎯 ZERO-RISK DIAGNOSTIC
            </span>
            <h2 class="audit-cta-title">
                Ready to Stop Losing High-Intent Leads?
            </h2>
            <p class="audit-cta-desc">
                Get a <strong>Free 15-Minute Conversion & Telemetry Audit</strong>. We will inspect your current booking forms, calculate your estimated conversion leak, and show you exactly where prospective clients are dropping off.
            </p>
            <div class="audit-cta-buttons">
                <a href="#" class="btn btn-accent btn-lg flowtrus-trigger" data-form-id="LhOxsSHbmRt0t6SfAeOi" style="font-weight: 700; padding: 16px 32px; font-size: 17px;">
                    Request Free CRO Audit →
                </a>
                <a href="<?php echo esc_url(home_url('/demo')); ?>" class="btn btn-secondary btn-lg" style="font-weight: 700; padding: 16px 28px; background: rgba(255,255,255,0.12); color: white; border-color: rgba(255,255,255,0.3);">
                    Explore Live Demo
                </a>
            </div>

            <div class="audit-guarantee-bar">
                <span>🔒 100% Confidential</span>
                <span>⚡ Actionable Findings in 24 Hours</span>
                <span>📈 Zero Obligation</span>
            </div>
        </div>
    </div>
</section>

<?php
get_footer();


